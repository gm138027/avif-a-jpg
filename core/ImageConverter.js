// 图片转换器 - 纯转换逻辑，遵循KISS原则
// 单一职责：AVIF到JPG/PNG的格式转换

import ErrorHandler from './ErrorHandler.js';

class ImageConverter {
  /**
   * 转换图片格式 - 纯函数，无副作用
   * @param {File} file - 原始AVIF文件
   * @param {string} targetFormat - 目标格式 ('jpeg' 或 'png')
   * @param {number} quality - 压缩质量 (0-1)
   * @returns {Promise<Blob>} 转换后的图片Blob
   */
  static async convertToFormat(file, targetFormat, quality = 0.9) {
    // 检查浏览器支持
    if (!this.isSupported()) {
      throw ErrorHandler.browserNotSupported();
    }

    // 验证输入参数
    if (!file || !(file instanceof File)) {
      throw ErrorHandler.invalidFileInput();
    }

    if (!['jpeg', 'png'].includes(targetFormat)) {
      throw ErrorHandler.unsupportedFormat();
    }

    if (quality < 0 || quality > 1) {
      throw ErrorHandler.invalidQuality();
    }

    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        // 使用setTimeout让出主线程，避免阻塞UI
        setTimeout(() => {
          try {
            // 创建Canvas进行转换
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // 设置Canvas尺寸为图片原始尺寸
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;

            // 绘制图片到Canvas
            ctx.drawImage(img, 0, 0);

            // 转换为目标格式
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolve(blob);
                } else {
                  reject(ErrorHandler.conversionFailedBlob());
                }
              },
              `image/${targetFormat}`,
              targetFormat === 'jpeg' ? quality : undefined // PNG不支持质量参数
            );
          } catch (error) {
            reject(ErrorHandler.conversionFailedGeneric(error.message));
          } finally {
            // 清理资源
            URL.revokeObjectURL(img.src);
          }
        }, 0);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(ErrorHandler.imageLoadFailed());
      };
      
      // 开始加载图片
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * 检查浏览器是否支持图片转换 - 纯函数
   * @returns {boolean} 是否支持
   */
  static isSupported() {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      return !!(ctx && canvas.toBlob);
    } catch (error) {
      return false;
    }
  }

  /**
   * 生成输出文件名 - 纯函数
   * @param {string} originalName - 原始文件名
   * @param {string} targetFormat - 目标格式
   * @returns {string} 新文件名
   */
  static generateOutputFilename(originalName, targetFormat) {
    if (!originalName || typeof originalName !== 'string') {
      return `converted.${targetFormat === 'jpeg' ? 'jpg' : targetFormat}`;
    }

    // 移除原始扩展名
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    const extension = targetFormat === 'jpeg' ? 'jpg' : targetFormat;
    
    return `${nameWithoutExt}.${extension}`;
  }

  /**
   * 获取支持的输出格式 - 纯函数
   * @returns {string[]} 支持的格式列表
   */
  static getSupportedFormats() {
    return ['jpeg', 'png'];
  }

  /**
   * 验证文件是否为AVIF格式 - 纯函数
   * @param {File} file - 要验证的文件
   * @returns {boolean} 是否为AVIF格式
   */
  static isAvifFile(file) {
    if (!file || !(file instanceof File)) {
      return false;
    }

    // 检查MIME类型
    if (file.type === 'image/avif') {
      return true;
    }

    // 检查文件扩展名（备用方案）
    const fileName = file.name || '';
    return fileName.toLowerCase().endsWith('.avif');
  }
}

export default ImageConverter;
