// Download service - handles single, batch, and ZIP downloads.
// Single responsibility: manage download flows and related helpers.
import JSZip from 'jszip';
import ErrorHandler from './ErrorHandler.js';
import { analytics } from '../utils/analytics.js';

class DownloadService {
  /**
   * Download a single file.
   * @param {Blob} blob - File blob
   * @param {string} filename - File name
   */
  static downloadFile(blob, filename) {
    if (!blob || !(blob instanceof Blob)) {
      throw new Error('Invalid blob object');
    }

    if (!filename || typeof filename !== 'string') {
      throw new Error('Invalid filename');
    }

    try {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = filename;
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      analytics.trackDownload('single', 1);

      // Delay cleanup to ensure the download has started.
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
    } catch (error) {
      throw new Error(`Download failed: ${error.message}`);
    }
  }

  /**
   * Download results one by one.
   * @param {Array} results - Conversion results
   * @param {number} delay - Delay between downloads (ms)
   */
  static async downloadBatch(results, delay = 100) {
    if (!Array.isArray(results)) {
      throw new Error('Results must be an array');
    }

    const successfulResults = results.filter(
      (result) => result.success && result.result && result.result.blob
    );

    if (successfulResults.length === 0) {
      throw new Error('No successful conversions to download');
    }

    if (successfulResults.length > 1) {
      console.warn('Multiple downloads may be blocked by browser. Consider enabling pop-ups.');
    }

    for (let i = 0; i < successfulResults.length; i += 1) {
      const result = successfulResults[i];

      try {
        this.downloadFile(result.result.blob, result.result.filename);

        if (i < successfulResults.length - 1) {
          await this._delay(delay);
        }
      } catch (error) {
        console.error(`Failed to download ${result.result.filename}:`, error);
      }
    }

    return {
      attempted: successfulResults.length,
      successful: successfulResults.length
    };
  }

  /**
   * Download results as a ZIP file.
   * @param {Array} results - Conversion results
   * @param {string} zipFilename - ZIP file name
   */
  static async downloadAsZip(results, zipFilename = 'converted-images.zip') {
    if (!Array.isArray(results)) {
      throw new Error('Results must be an array');
    }

    const successfulResults = results.filter(
      (result) => result.success && result.result && result.result.blob
    );

    if (successfulResults.length === 0) {
      throw new Error('No successful conversions to download');
    }

    try {
      const zipBlob = await this.createZipBlob(successfulResults);

      this.downloadFile(zipBlob, zipFilename);

      analytics.trackDownload('zip', successfulResults.length);

      return {
        attempted: successfulResults.length,
        successful: successfulResults.length,
        zipSize: zipBlob.size,
        zipFilename
      };
    } catch (error) {
      throw new Error(`ZIP creation failed: ${error.message}`);
    }
  }

  /**
   * Build download stats.
   * @param {Array} results - Conversion results
   * @returns {Object} Stats
   */
  static getDownloadStats(results) {
    if (!Array.isArray(results)) {
      return { total: 0, downloadable: 0, totalSize: 0 };
    }

    const downloadableResults = results.filter(
      (result) => result.success && result.result && result.result.blob
    );

    const totalSize = downloadableResults.reduce(
      (sum, result) => sum + (result.result.size || 0),
      0
    );

    return {
      total: results.length,
      downloadable: downloadableResults.length,
      failed: results.length - downloadableResults.length,
      totalSize,
      formattedSize: this._formatFileSize(totalSize)
    };
  }

  /**
   * Check if the environment supports batch downloads.
   * @returns {boolean}
   */
  static isBatchDownloadSupported() {
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
   * Get a recommended download method based on file count.
   * @param {number} fileCount
   * @returns {string}
   */
  static getRecommendedDownloadMethod(fileCount) {
    if (fileCount === 0) {
      return 'none';
    }
    if (fileCount === 1) {
      return 'single';
    }
    return 'zip';
  }

  /**
   * Generate a ZIP file name.
   * @param {number} fileCount
   * @param {string} format
   * @returns {string}
   */
  static generateZipFilename(fileCount, format = 'jpg') {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
    return `converted-${fileCount}-images-${format}-${timestamp}.zip`;
  }

  /**
   * Create a ZIP blob from conversion results.
   * @param {Array} results
   * @returns {Promise<Blob>}
   */
  static async createZipBlob(results) {
    const zip = new JSZip();

    for (const result of results) {
      const { blob, filename } = result.result;
      zip.file(filename, blob);
    }

    const optimisedFormats = ['.png'];

    let compression = 'DEFLATE';
    let compressionOptions = { level: 6 };

    const hasOptimisedAsset = results.some((result) => {
      const name = result.result?.filename || '';
      return optimisedFormats.some((ext) => name.toLowerCase().endsWith(ext));
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

    return zip.generateAsync(generateOptions);
  }

  /**
   * Delay helper.
   * @param {number} ms
   * @returns {Promise<void>}
   */
  static _delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Format byte size into human readable string.
   * @param {number} bytes
   * @returns {string}
   */
  static _formatFileSize(bytes) {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i)) + ' ' + sizes[i];
  }

  /**
   * Validate download environment.
   * @returns {Object}
   */
  static validateDownloadEnvironment() {
    const checks = {
      blobSupport: typeof Blob !== 'undefined',
      urlSupport: typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function',
      linkDownloadSupport: 'download' in document.createElement('a'),
      isSecureContext:
        window.isSecureContext || location.protocol === 'https:' || location.hostname === 'localhost'
    };

    const allSupported = Object.values(checks).every(Boolean);

    return {
      supported: allSupported,
      checks,
      warnings: this._getEnvironmentWarnings(checks)
    };
  }

  /**
   * Build warnings from environment checks.
   * @param {Object} checks
   * @returns {Array}
   */
  static _getEnvironmentWarnings(checks) {
    return ErrorHandler.createWarnings(checks);
  }
}

export default DownloadService;
