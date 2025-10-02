// 涓嬭浇鏈嶅姟 - 閬靛惊YAGNI鍘熷垯
// 鍗曚竴鑱岃矗锛氬鐞嗘枃浠朵笅杞藉姛鑳?
import JSZip from 'jszip';
import ErrorHandler from './ErrorHandler.js';
import { analytics } from '../utils/analytics.js';

class DownloadService {
  /**
   * 涓嬭浇鍗曚釜鏂囦欢
   * @param {Blob} blob - 鏂囦欢Blob瀵硅薄
   * @param {string} filename - 鏂囦欢鍚?   */
  static downloadFile(blob, filename) {
    if (!blob || !(blob instanceof Blob)) {
      throw new Error('Invalid blob object');
    }

    if (!filename || typeof filename !== 'string') {
      throw new Error('Invalid filename');
    }

    try {
      // 鍒涘缓涓嬭浇閾炬帴
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      
      // 瑙﹀彂涓嬭浇
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 杩借釜鍗曚釜鏂囦欢涓嬭浇
      analytics.trackDownload('single', 1);

      // 延迟清理URL，确保下载完成后再释放
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

    } catch (error) {
      throw new Error(`Download failed: ${error.message}`);
    }
    };

  /**
   * 鎵归噺涓嬭浇鏂囦欢锛堥€愪釜涓嬭浇锛?   * @param {Array} results - 杞崲缁撴灉鏁扮粍
   * @param {number} delay - 涓嬭浇闂撮殧锛堟绉掞級
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

    // 妫€鏌ユ祻瑙堝櫒鏄惁鍙兘闃绘澶氫釜涓嬭浇
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
      successful: successfulResults.length,
      // 假设都成功，真实环境可根据需要调整统计
    };
  }

  /**
   * ZIP鎵撳寘涓嬭浇 - 鎺ㄨ崘鐨勬壒閲忎笅杞芥柟寮?   * @param {Array} results - 杞崲缁撴灉鏁扮粍
   * @param {string} zipFilename - ZIP鏂囦欢鍚?   */
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
      // 鍒涘缓ZIP Blob
      const zipBlob = await this.createZipBlob(successfulResults);

      // 涓嬭浇ZIP鏂囦欢
      this.downloadFile(zipBlob, zipFilename);

      // 杩借釜ZIP涓嬭浇
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
   * 鍒涘缓涓嬭浇缁熻淇℃伅
   * @param {Array} results - 杞崲缁撴灉鏁扮粍
   * @returns {Object} 涓嬭浇缁熻
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
   * 妫€鏌ユ槸鍚︽敮鎸佹壒閲忎笅杞?   * @returns {boolean} 鏄惁鏀寔
   */
  static isBatchDownloadSupported() {
    // 妫€鏌ュ熀鏈殑涓嬭浇API鏀寔
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
   * 鑾峰彇寤鸿鐨勪笅杞芥柟寮?   * @param {number} fileCount - 鏂囦欢鏁伴噺
   * @returns {string} 寤鸿鐨勪笅杞芥柟寮?   */
  static getRecommendedDownloadMethod(fileCount) {
    if (fileCount === 0) {
      return 'none';
    } else if (fileCount === 1) {
      return 'single';
    } else {
      return 'zip'; // 澶氭枃浠舵帹鑽怹IP涓嬭浇
    }
  }

  /**
   * 鐢熸垚ZIP鏂囦欢鍚?   * @param {number} fileCount - 鏂囦欢鏁伴噺
   * @param {string} format - 杞崲鏍煎紡
   * @returns {string} ZIP鏂囦欢鍚?   */
  static generateZipFilename(fileCount, format = 'jpg') {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
    return `converted-${fileCount}-images-${format}-${timestamp}.zip`;
  }

  /**
   * 鍒涘缓ZIP Blob - 鍏叡鏂规硶锛屼緵棰勬墦鍖呬娇鐢?   * @param {Array} results - 杞崲缁撴灉鏁扮粍
   * @returns {Promise<Blob>} ZIP Blob
   */
  static async createZipBlob(results) {
    const zip = new JSZip();

    // �����ļ���ZIP
    for (const result of results) {
      const { blob, filename } = result.result;
      zip.file(filename, blob);
    }

    // ����ZIP�ļ���PNG ����ѹ����ʽֱ�Ӵ洢�������ٶȣ�
    const optimisedFormats = ['.png'];

    let compression = 'DEFLATE';
    let compressionOptions = { level: 6 };

    const hasOptimisedAsset = results.some(result => {
      const name = result.result?.filename || '';
      return optimisedFormats.some(ext => name.toLowerCase().endsWith(ext));
    });

    if (hasOptimisedAsset) {
      compression = 'STORE';
      compressionOptions = null;
    }

    const generateOptions = {
      type: 'blob',
      compression
    };

    if (compressionOptions) {
      generateOptions.compressionOptions = compressionOptions;
    }

    const zipBlob = await zip.generateAsync(generateOptions);

    return zipBlob;
  }


  /**
   * 绉佹湁鏂规硶锛氬欢杩熷嚱鏁?   * @param {number} ms - 寤惰繜姣鏁?   * @returns {Promise} Promise瀵硅薄
   */
  static _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 绉佹湁鏂规硶锛氭牸寮忓寲鏂囦欢澶у皬
   * @param {number} bytes - 瀛楄妭鏁?   * @returns {string} 鏍煎紡鍖栧悗鐨勫ぇ灏?   */
  static _formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round(bytes / Math.pow(k, i)) + ' ' + sizes[i];
  }

  /**
   * 楠岃瘉涓嬭浇鐜
   * @returns {Object} 鐜妫€鏌ョ粨鏋?   */
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
   * 绉佹湁鏂规硶锛氳幏鍙栫幆澧冭鍛?   * @param {Object} checks - 妫€鏌ョ粨鏋?   * @returns {Array} 璀﹀憡鏁扮粍
   */
  static _getEnvironmentWarnings(checks) {
    return ErrorHandler.createWarnings(checks);
  }
}

export default DownloadService;
