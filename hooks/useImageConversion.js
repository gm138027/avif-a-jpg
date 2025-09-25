// React转换Hook - 遵循依赖倒置原则
// 单一职责：将转换功能适配到React

import { useState, useEffect, useRef, useCallback } from 'react';
import ConversionManager from '../core/ConversionManager.js';
import DownloadService from '../core/DownloadService.js';
import { useCurrentView } from './useAppState.js';

export default function useImageConversion() {
  const [tasks, setTasks] = useState(new Map());
  const [isConverting, setIsConverting] = useState(false);
  const [batchProgress, setBatchProgress] = useState(null);
  const [isPrepackaging, setIsPrepackaging] = useState(false); // 新增：预打包状态
  const [zipReady, setZipReady] = useState(false); // 新增：ZIP是否准备就绪
  const managerRef = useRef(null);
  const [currentView, setCurrentView] = useCurrentView(); // 新增：视图状态管理

  // 初始化转换管理器
  useEffect(() => {
    const manager = new ConversionManager();
    managerRef.current = manager;

    // 订阅状态变化
    const unsubscribe = manager.subscribe((event, data) => {
      switch (event) {
        case 'taskStarted':
        case 'taskCompleted':
        case 'taskFailed':
          // 更新任务状态
          setTasks(manager.getAllTasks());
          break;
          
        case 'batchStarted':
          setIsConverting(true);
          setBatchProgress({ completed: 0, total: data.total, progress: 0, stage: 'converting' });
          break;

        case 'batchCompleted':
          setIsConverting(false);
          // 保持进度状态，不重置，为打包阶段做准备
          setBatchProgress(prev => ({
            ...prev,
            stage: 'converting_completed'
          }));
          // 注意：不再自动切换视图，由MainContainer手动控制跳转时机
          break;

        case 'prepackagingStarted':
          setIsPrepackaging(true);
          setZipReady(false);
          // 保持当前进度，切换到打包阶段
          setBatchProgress(prev => ({
            ...prev,
            stage: 'packing'
          }));
          break;

        case 'prepackagingProgress':
          // 更新打包进度
          setBatchProgress(prev => ({
            ...prev,
            progress: data.progress,
            stage: data.stage
          }));
          break;

        case 'prepackagingCompleted':
          setIsPrepackaging(false);
          setZipReady(true);
          // 进度到100%
          setBatchProgress(prev => ({
            ...prev,
            progress: 100,
            stage: 'completed'
          }));
          console.log(`ZIP prepackaging completed: ${data.filename} (${data.size} bytes)`);
          break;

        case 'prepackagingFailed':
          setIsPrepackaging(false);
          setZipReady(false);
          console.error('ZIP prepackaging failed:', data.error);
          break;
          
        case 'tasksCleared':
        case 'allTasksCleared':
          setTasks(new Map());
          break;
          
        default:
          break;
      }
    });

    return () => {
      unsubscribe();
      manager.destroy();
    };
  }, []);

  // 转换单个图片
  const convertImage = useCallback(async (imageId, file, targetFormat, quality = 0.9) => {
    if (!managerRef.current) {
      throw new Error('Conversion manager not initialized');
    }

    try {
      setIsConverting(true);
      const result = await managerRef.current.startConversion(imageId, file, targetFormat, quality);
      return result;
    } catch (error) {
      console.error('Image conversion failed:', error);
      throw error;
    } finally {
      setIsConverting(false);
    }
  }, []);

  // 批量转换
  const convertBatch = useCallback(async (images, targetFormat, quality = 0.9, onProgress) => {
    if (!managerRef.current) {
      throw new Error('Conversion manager not initialized');
    }

    if (!Array.isArray(images) || images.length === 0) {
      throw new Error('Invalid images array');
    }

    try {
      const results = await managerRef.current.startBatchConversion(
        images,
        targetFormat,
        quality,
        (progress) => {
          // 更新批量进度状态
          setBatchProgress({
            completed: progress.completed,
            total: progress.total,
            progress: progress.progress,
            current: progress.current,
            stage: progress.stage
          });

          // 调用外部进度回调
          if (onProgress) {
            onProgress(progress);
          }
        }
      );

      return results;
    } catch (error) {
      console.error('Batch conversion failed:', error);
      throw error;
    }
  }, []);

  // 下载转换结果
  const downloadResult = useCallback((imageId) => {
    const task = tasks.get(imageId);
    
    if (!task) {
      console.warn(`Task not found for image ID: ${imageId}`);
      return false;
    }

    if (task.status !== 'completed' || !task.result) {
      console.warn(`Task not completed or no result available for image ID: ${imageId}`);
      return false;
    }

    try {
      DownloadService.downloadFile(task.result.blob, task.result.filename);
      return true;
    } catch (error) {
      console.error('Download failed:', error);
      return false;
    }
  }, [tasks]);

  // 批量下载所有完成的转换（优先使用预打包的ZIP）
  const downloadAll = useCallback(async (format = 'jpg') => {
    if (!managerRef.current) {
      throw new Error('Conversion manager not initialized');
    }

    try {
      // 优先使用预打包的ZIP（0延迟）
      const prepackagedZip = managerRef.current.getPrepackagedZip();

      if (prepackagedZip && zipReady) {
        // 使用预打包的ZIP，0延迟下载
        DownloadService.downloadFile(prepackagedZip.blob, prepackagedZip.info.filename);

        console.log(`Prepackaged ZIP download completed: ${prepackagedZip.info.filename} (${prepackagedZip.info.size} bytes)`);

        return {
          attempted: prepackagedZip.info.fileCount,
          successful: prepackagedZip.info.fileCount,
          zipSize: prepackagedZip.info.size,
          zipFilename: prepackagedZip.info.filename,
          prepackaged: true
        };
      }

      // 降级方案：实时打包（有延迟）
      console.warn('Prepackaged ZIP unavailable, using real-time packaging');

      const completedTasks = Array.from(tasks.values())
        .filter(task => task.status === 'completed' && task.result)
        .map(task => ({ success: true, result: task.result }));

      if (completedTasks.length === 0) {
        console.warn('No completed conversions to download');
        return { attempted: 0, successful: 0 };
      }

      // 生成ZIP文件名
      const zipFilename = DownloadService.generateZipFilename(completedTasks.length, format);

      // 使用实时ZIP打包下载
      const result = await DownloadService.downloadAsZip(completedTasks, zipFilename);

      console.log(`Real-time ZIP download completed: ${result.zipFilename} (${result.zipSize} bytes)`);
      return { ...result, prepackaged: false };

    } catch (error) {
      console.error('ZIP download failed:', error);
      throw error;
    }
  }, [tasks, zipReady]);

  // 逐个下载（备用方法）
  const downloadBatch = useCallback(async () => {
    const completedTasks = Array.from(tasks.values())
      .filter(task => task.status === 'completed' && task.result)
      .map(task => ({ success: true, result: task.result }));

    if (completedTasks.length === 0) {
      console.warn('No completed conversions to download');
      return { attempted: 0, successful: 0 };
    }

    try {
      const result = await DownloadService.downloadBatch(completedTasks);
      return result;
    } catch (error) {
      console.error('Batch download failed:', error);
      throw error;
    }
  }, [tasks]);

  // 清理已完成的任务
  const clearTasks = useCallback(() => {
    if (managerRef.current) {
      managerRef.current.clearCompletedTasks();
    }
  }, []);

  // 清理所有任务
  const clearAllTasks = useCallback(() => {
    if (managerRef.current) {
      managerRef.current.clearAllTasks();
    }
  }, []);

  // 获取图片的转换状态
  const getImageStatus = useCallback((imageId) => {
    return tasks.get(imageId) || null;
  }, [tasks]);

  // 获取统计信息
  const getStats = useCallback(() => {
    const taskArray = Array.from(tasks.values());
    
    return {
      total: taskArray.length,
      processing: taskArray.filter(t => t.status === 'processing').length,
      completed: taskArray.filter(t => t.status === 'completed').length,
      failed: taskArray.filter(t => t.status === 'failed').length,
      hasCompletedTasks: taskArray.some(t => t.status === 'completed')
    };
  }, [tasks]);

  // 获取下载统计
  const getDownloadStats = useCallback(() => {
    const completedTasks = Array.from(tasks.values())
      .filter(task => task.status === 'completed')
      .map(task => ({ success: true, result: task.result }));

    return DownloadService.getDownloadStats(completedTasks);
  }, [tasks]);

  // 检查转换环境
  const checkEnvironment = useCallback(() => {
    return {
      conversion: {
        supported: true, // ImageConverter.isSupported() 在组件中调用
        formats: ['jpeg', 'png']
      },
      download: DownloadService.validateDownloadEnvironment()
    };
  }, []);

  return {
    // 状态
    tasks,
    isConverting,
    batchProgress,
    isPrepackaging, // 新增：预打包状态
    zipReady, // 新增：ZIP是否准备就绪
    currentView, // 新增：当前视图状态

    // 核心操作
    convertImage,
    convertBatch,
    downloadResult,
    downloadAll, // ZIP打包下载
    downloadBatch, // 逐个下载（备用）

    // 管理操作
    clearTasks,
    clearAllTasks,
    getImageStatus,

    // 视图操作
    switchToUpload: () => setCurrentView('upload'), // 新增：切换到上传页
    switchToDownload: () => setCurrentView('download'), // 新增：切换到下载页
    resetAndSwitchToUpload: useCallback(() => {
      // 清空所有转换任务和ZIP缓存
      if (managerRef.current) {
        managerRef.current.clearAllTasks();
      }
      // 重置所有状态
      setIsPrepackaging(false);
      setZipReady(false);
      setBatchProgress(null); // 只在重置时清空进度
      setIsConverting(false);
      // 切换到上传页
      setCurrentView('upload');
    }, [setCurrentView]), // 新增：重置并切换到上传页

    // 统计和信息
    getStats,
    getDownloadStats,
    checkEnvironment,

    // 便捷属性
    totalTasks: tasks.size,
    completedTasks: Array.from(tasks.values()).filter(t => t.status === 'completed').length,
    failedTasks: Array.from(tasks.values()).filter(t => t.status === 'failed').length,
    hasCompletedTasks: Array.from(tasks.values()).some(t => t.status === 'completed'),
    canDownload: Array.from(tasks.values()).some(t => t.status === 'completed')
  };
}
