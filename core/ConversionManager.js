// 转换管理器 - 遵循SOLID原则
// 单一职责：管理转换流程和状态

import ImageConverter from './ImageConverter.js';
import DownloadService from './DownloadService.js';
import ErrorHandler from './ErrorHandler.js';

class ConversionManager {
  constructor() {
    this.tasks = new Map(); // imageId -> ConversionTask
    this.listeners = new Set();
    this.zipCache = null; // 缓存预打包的ZIP
    this.zipCacheInfo = null; // ZIP缓存信息
    this.isPrepackaging = false; // 预打包状态
  }

  /**
   * 开始单个图片转换
   * @param {string} imageId - 图片ID
   * @param {File} file - 原始文件
   * @param {string} targetFormat - 目标格式
   * @param {number} quality - 压缩质量
   * @returns {Promise<Object>} 转换结果
   */
  async startConversion(imageId, file, targetFormat, quality = 0.9) {
    // 验证输入
    if (!imageId || !file) {
      throw ErrorHandler.invalidParameters();
    }

    // 验证AVIF文件
    if (!ImageConverter.isAvifFile(file)) {
      throw ErrorHandler.invalidAvifFile();
    }

    // 创建转换任务
    const task = {
      id: imageId,
      status: 'processing',
      progress: 0,
      result: null,
      error: null,
      startTime: Date.now(),
      file: file,
      targetFormat: targetFormat
    };

    this.tasks.set(imageId, task);
    this._notifyListeners('taskStarted', task);

    try {
      // 执行转换
      const convertedBlob = await ImageConverter.convertToFormat(file, targetFormat, quality);
      const filename = ImageConverter.generateOutputFilename(file.name, targetFormat);

      // 更新任务状态
      task.status = 'completed';
      task.progress = 100;
      task.result = {
        blob: convertedBlob,
        filename: filename,
        size: convertedBlob.size,
        format: targetFormat
      };
      task.completedTime = Date.now();

      this.tasks.set(imageId, task);
      this._notifyListeners('taskCompleted', task);

      return task.result;
    } catch (error) {
      // 更新任务状态为失败
      task.status = 'failed';
      task.error = error.message;
      task.completedTime = Date.now();

      this.tasks.set(imageId, task);
      this._notifyListeners('taskFailed', task);

      throw error;
    }
  }

  /**
   * 批量转换图片
   * @param {Array} images - 图片数组 [{id, file, ...}, ...]
   * @param {string} targetFormat - 目标格式
   * @param {number} quality - 压缩质量
   * @param {Function} onProgress - 进度回调
   * @returns {Promise<Array>} 转换结果数组
   */
  async startBatchConversion(images, targetFormat, quality = 0.9, onProgress) {
    if (!Array.isArray(images) || images.length === 0) {
      throw ErrorHandler.invalidImagesArray();
    }

    const results = [];
    const total = images.length;
    let completed = 0;

    // 通知批量转换开始
    this._notifyListeners('batchStarted', { total, targetFormat });

    for (let i = 0; i < images.length; i++) {
      const image = images[i];

      try {
        // 转换单个图片
        const result = await this.startConversion(image.id, image.file, targetFormat, quality);
        results.push({
          imageId: image.id,
          success: true,
          result: result
        });

        completed++;

        // 调用进度回调 - 转换阶段占总进度的80%
        if (onProgress) {
          onProgress({
            completed,
            total,
            current: image,
            progress: (completed / total) * 80, // 转换阶段：0-80%
            stage: 'converting',
            results: results
          });
        }

        // 让出主线程控制权，避免长时间阻塞
        if (i < images.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 10));
        }

      } catch (error) {
        results.push({
          imageId: image.id,
          success: false,
          error: error.message
        });
        completed++;

        // 即使失败也要更新进度 - 转换阶段占总进度的80%
        if (onProgress) {
          onProgress({
            completed,
            total,
            current: image,
            progress: (completed / total) * 80, // 转换阶段：0-80%
            stage: 'converting',
            results: results
          });
        }

        // 错误情况下也让出控制权
        if (i < images.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 10));
        }
      }
    }

    // 通知批量转换完成
    const batchResult = {
      total,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    };

    this._notifyListeners('batchCompleted', batchResult);

    // 如果有成功的转换，立即开始预打包
    if (batchResult.successful > 0) {
      this._startPrepackaging(targetFormat);
    }

    return results;
  }

  /**
   * 获取任务状态
   * @param {string} imageId - 图片ID
   * @returns {Object|null} 任务状态
   */
  getTaskStatus(imageId) {
    return this.tasks.get(imageId) || null;
  }

  /**
   * 获取所有任务状态
   * @returns {Map} 所有任务的Map
   */
  getAllTasks() {
    return new Map(this.tasks);
  }

  /**
   * 清理已完成的任务
   */
  clearCompletedTasks() {
    const clearedTasks = [];
    
    for (const [id, task] of this.tasks) {
      if (task.status === 'completed' || task.status === 'failed') {
        // 清理Blob URL
        if (task.result && task.result.blob) {
          URL.revokeObjectURL(task.result.blob);
        }
        
        clearedTasks.push(task);
        this.tasks.delete(id);
      }
    }

    if (clearedTasks.length > 0) {
      this._notifyListeners('tasksCleared', clearedTasks);
    }
  }

  /**
   * 清理所有任务
   */
  clearAllTasks() {
    const allTasks = Array.from(this.tasks.values());
    
    // 清理所有Blob URL
    allTasks.forEach(task => {
      if (task.result && task.result.blob) {
        URL.revokeObjectURL(task.result.blob);
      }
    });

    this.tasks.clear();
    this._notifyListeners('allTasksCleared', allTasks);
  }

  /**
   * 订阅状态变化
   * @param {Function} listener - 监听器函数
   * @returns {Function} 取消订阅函数
   */
  subscribe(listener) {
    if (typeof listener !== 'function') {
      throw ErrorHandler.listenerNotFunction();
    }

    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * 获取统计信息
   * @returns {Object} 统计信息
   */
  getStats() {
    const tasks = Array.from(this.tasks.values());
    
    return {
      total: tasks.length,
      processing: tasks.filter(t => t.status === 'processing').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      failed: tasks.filter(t => t.status === 'failed').length
    };
  }

  /**
   * 私有方法：通知监听器
   * @param {string} event - 事件类型
   * @param {*} data - 事件数据
   */
  _notifyListeners(event, data) {
    this.listeners.forEach(listener => {
      try {
        listener(event, data);
      } catch (error) {
        console.error('ConversionManager listener error:', error);
      }
    });
  }

  /**
   * 开始预打包 - 后台异步生成ZIP，并更新打包阶段进度
   * @param {string} targetFormat - 目标格式
   */
  async _startPrepackaging(targetFormat) {
    if (this.isPrepackaging) {
      return; // 避免重复打包
    }

    this.isPrepackaging = true;

    // 通知打包开始
    this._notifyListeners('prepackagingStarted', {
      format: targetFormat,
      stage: 'packing'
    });

    try {
      // 获取所有完成的任务
      const completedTasks = Array.from(this.tasks.values())
        .filter(task => task.status === 'completed' && task.result)
        .map(task => ({ success: true, result: task.result }));

      if (completedTasks.length === 0) {
        this.isPrepackaging = false;
        return;
      }

      // 生成ZIP文件名
      const zipFilename = DownloadService.generateZipFilename(completedTasks.length, targetFormat);

      // 开始模拟打包进度：80% → 100%
      const progressInterval = this._startPackingProgressSimulation();

      // 异步生成ZIP（这是耗时操作）
      const zipBlob = await DownloadService.createZipBlob(completedTasks);

      // 停止进度模拟
      if (progressInterval) {
        clearInterval(progressInterval);
      }

      // 缓存ZIP
      this.zipCache = zipBlob;
      this.zipCacheInfo = {
        filename: zipFilename,
        fileCount: completedTasks.length,
        size: zipBlob.size,
        format: targetFormat,
        createdAt: Date.now()
      };

      this.isPrepackaging = false;

      // 通知打包完成 - 进度到100%
      this._notifyListeners('prepackagingCompleted', {
        ...this.zipCacheInfo,
        progress: 100,
        stage: 'completed'
      });

    } catch (error) {
      this.isPrepackaging = false;
      this._notifyListeners('prepackagingFailed', { error: error.message });
      console.error('Prepackaging failed:', error);
    }
  }

  /**
   * 获取预打包的ZIP（0延迟下载）
   * @returns {Object|null} ZIP信息和Blob
   */
  getPrepackagedZip() {
    if (!this.zipCache || !this.zipCacheInfo) {
      return null;
    }

    return {
      blob: this.zipCache,
      info: this.zipCacheInfo
    };
  }

  /**
   * 开始打包进度模拟：从80%平滑过渡到95%
   * @returns {number} 定时器ID
   */
  _startPackingProgressSimulation() {
    let currentProgress = 80;
    const targetProgress = 95;
    const step = 1; // 每次增加1%
    const interval = 200; // 每200ms更新一次

    const progressInterval = setInterval(() => {
      if (currentProgress < targetProgress) {
        currentProgress += step;
        this._notifyListeners('prepackagingProgress', {
          progress: currentProgress,
          stage: 'packing'
        });
      }
    }, interval);

    return progressInterval;
  }

  /**
   * 清理ZIP缓存
   */
  clearZipCache() {
    if (this.zipCache) {
      // 清理Blob URL（如果有的话）
      if (this.zipCache instanceof Blob) {
        // Blob本身不需要特殊清理，但我们可以清除引用
        this.zipCache = null;
      }
    }
    this.zipCacheInfo = null;
    this._notifyListeners('zipCacheCleared', null);
  }

  /**
   * 销毁管理器
   */
  destroy() {
    this.clearZipCache();
    this.clearAllTasks();
    this.listeners.clear();
  }
}

export default ConversionManager;
