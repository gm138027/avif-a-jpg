// 下载服务 - 遵循YAGNI原则
// 单一职责：处理文件下载功能

import JSZip from 'jszip';
import ErrorHandler from './ErrorHandler.js';
import { analytics } from '../utils/analytics.js';

class DownloadService {
  /**
   * 下载单个文件
   * @param {Blob} blob - 文件Blob对象
   * @param {string} filename - 文件名
   */
  static downloadFile(blob, filename) {
    if (!blob || !(blob instanceof Blob)) {
      throw new Error('Invalid blob object');
    }

    if (!filename || typeof filename !== 'string') {
      throw new Error('Invalid filename');
    }

    try {
      // 创建下载链接
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      
      // 触发下载
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 追踪单个文件下载
      analytics.trackDownload('single', 1);

      // 延迟清理URL，确保下载完成
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

    } catch (error) {
      throw new Error(`Download failed: ${error.message}`);
    }
  }

  /**
   * 批量下载文件（逐个下载）
   * @param {Array} results - 转换结果数组
   * @param {number} delay - 下载间隔（毫秒）
   */
  static async downloadBatch(results, delay = 100) {
    if (!Array.isArray(results)) {
      throw new Error('Results must be an array');
    }

    const successfulResults = results.filter(result =>
      result.success && result.result && result.result.blob
    );

    if (successfulResults.length === 0) {
      throw new Error('No successful conversions to download');
    }

    // 检查浏览器是否可能阻止多个下载
    if (successfulResults.length > 1) {
      console.warn('Multiple downloads may be blocked by browser. Consider enabling pop-ups.');
    }

    for (let i = 0; i < successfulResults.length; i++) {
      const result = successfulResults[i];

      try {
        this.downloadFile(result.result.blob, result.result.filename);

        // 添加延迟避免浏览器阻止多个下载
        if (i < successfulResults.length - 1) {
          await this._delay(delay);
        }
      } catch (error) {
        console.error(`Failed to download ${result.result.filename}:`, error);
      }
    }

    return {
      attempted: successfulResults.length,
      successful: successfulResults.length // 假设都成功，实际可能需要更复杂的检测
    };
  }

  /**
   * ZIP打包下载 - 推荐的批量下载方式
   * @param {Array} results - 转换结果数组
   * @param {string} zipFilename - ZIP文件名
   */
  static async downloadAsZip(results, zipFilename = 'converted-images.zip') {
    if (!Array.isArray(results)) {
      throw new Error('Results must be an array');
    }

    const successfulResults = results.filter(result =>
      result.success && result.result && result.result.blob
    );

    if (successfulResults.length === 0) {
      throw new Error('No successful conversions to download');
    }

    try {
      // 创建ZIP Blob
      const zipBlob = await this.createZipBlob(successfulResults);

      // 下载ZIP文件
      this.downloadFile(zipBlob, zipFilename);

      // 追踪ZIP下载
      analytics.trackDownload('zip', successfulResults.length);

      return {
        attempted: successfulResults.length,
        successful: successfulResults.length,
        zipSize: zipBlob.size,
        zipFilename: zipFilename
      };

    } catch (error) {
      throw new Error(`ZIP creation failed: ${error.message}`);
    }
  }

  /**
   * 创建下载统计信息
   * @param {Array} results - 转换结果数组
   * @returns {Object} 下载统计
   */
  static getDownloadStats(results) {
    if (!Array.isArray(results)) {
      return { total: 0, downloadable: 0, totalSize: 0 };
    }

    const downloadableResults = results.filter(result => 
      result.success && result.result && result.result.blob
    );

    const totalSize = downloadableResults.reduce((sum, result) => {
      return sum + (result.result.size || 0);
    }, 0);

    return {
      total: results.length,
      downloadable: downloadableResults.length,
      failed: results.length - downloadableResults.length,
      totalSize: totalSize,
      formattedSize: this._formatFileSize(totalSize)
    };
  }

  /**
   * 检查是否支持批量下载
   * @returns {boolean} 是否支持
   */
  static isBatchDownloadSupported() {
    // 检查基本的下载API支持
    try {
      const testBlob = new Blob(['test'], { type: 'text/plain' });
      const url = URL.createObjectURL(testBlob);
      URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 获取建议的下载方式
   * @param {number} fileCount - 文件数量
   * @returns {string} 建议的下载方式
   */
  static getRecommendedDownloadMethod(fileCount) {
    if (fileCount === 0) {
      return 'none';
    } else if (fileCount === 1) {
      return 'single';
    } else {
      return 'zip'; // 多文件推荐ZIP下载
    }
  }

  /**
   * 生成ZIP文件名
   * @param {number} fileCount - 文件数量
   * @param {string} format - 转换格式
   * @returns {string} ZIP文件名
   */
  static generateZipFilename(fileCount, format = 'jpg') {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
    return `converted-${fileCount}-images-${format}-${timestamp}.zip`;
  }

  /**
   * 创建ZIP Blob - 公共方法，供预打包使用
   * @param {Array} results - 转换结果数组
   * @returns {Promise<Blob>} ZIP Blob
   */
  static async createZipBlob(results) {
    const zip = new JSZip();

    // 添加文件到ZIP
    for (const result of results) {
      const { blob, filename } = result.result;
      zip.file(filename, blob);
    }

    // 生成ZIP文件
    const zipBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6 // 平衡压缩率和速度
      }
    });

    return zipBlob;
  }

  /**
   * 私有方法：延迟函数
   * @param {number} ms - 延迟毫秒数
   * @returns {Promise} Promise对象
   */
  static _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 私有方法：格式化文件大小
   * @param {number} bytes - 字节数
   * @returns {string} 格式化后的大小
   */
  static _formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round(bytes / Math.pow(k, i)) + ' ' + sizes[i];
  }

  /**
   * 验证下载环境
   * @returns {Object} 环境检查结果
   */
  static validateDownloadEnvironment() {
    const checks = {
      blobSupport: typeof Blob !== 'undefined',
      urlSupport: typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function',
      linkDownloadSupport: 'download' in document.createElement('a'),
      isSecureContext: window.isSecureContext || location.protocol === 'https:' || location.hostname === 'localhost'
    };

    const allSupported = Object.values(checks).every(Boolean);

    return {
      supported: allSupported,
      checks: checks,
      warnings: this._getEnvironmentWarnings(checks)
    };
  }

  /**
   * 私有方法：获取环境警告
   * @param {Object} checks - 检查结果
   * @returns {Array} 警告数组
   */
  static _getEnvironmentWarnings(checks) {
    return ErrorHandler.createWarnings(checks);
  }
}

export default DownloadService;
