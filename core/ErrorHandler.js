/**
 * 错误处理工具类 - 提供国际化的错误消息
 * 职责：统一管理Core层的错误消息，支持国际化
 */
class ErrorHandler {
  /**
   * 创建国际化错误
   * @param {string} key - 翻译键
   * @param {Object} params - 插值参数
   * @param {string} fallback - 降级文本
   * @returns {Error} 错误对象
   */
  static createError(key, params = {}, fallback = '') {
    // 在Core层，我们无法直接使用useTranslation
    // 所以我们创建一个特殊的错误对象，包含翻译信息
    const error = new Error(fallback || key);
    error.translationKey = key;
    error.translationParams = params;
    error.isI18nError = true;
    return error;
  }

  /**
   * 浏览器不支持错误
   */
  static browserNotSupported() {
    return this.createError(
      'errors.browser_not_supported',
      {},
      'Browser does not support image conversion'
    );
  }

  /**
   * 无效文件输入错误
   */
  static invalidFileInput() {
    return this.createError(
      'errors.invalid_file_input',
      {},
      'Invalid file input'
    );
  }

  /**
   * 不支持的格式错误
   */
  static unsupportedFormat() {
    return this.createError(
      'errors.unsupported_format',
      {},
      'Unsupported target format. Use "jpeg" or "png"'
    );
  }

  /**
   * 无效质量参数错误
   */
  static invalidQuality() {
    return this.createError(
      'errors.invalid_quality',
      {},
      'Quality must be between 0 and 1'
    );
  }

  /**
   * 转换失败 - Blob创建错误
   */
  static conversionFailedBlob() {
    return this.createError(
      'errors.conversion_failed_blob',
      {},
      'Conversion failed: Unable to create blob'
    );
  }

  /**
   * 转换失败 - 通用错误
   */
  static conversionFailedGeneric(message) {
    return this.createError(
      'errors.conversion_failed_generic',
      { message },
      `Conversion failed: ${message}`
    );
  }

  /**
   * 图片加载失败错误
   */
  static imageLoadFailed() {
    return this.createError(
      'errors.image_load_failed',
      {},
      'Failed to load image for conversion'
    );
  }

  /**
   * 无效参数错误
   */
  static invalidParameters() {
    return this.createError(
      'errors.invalid_parameters',
      {},
      'Invalid parameters: imageId and file are required'
    );
  }

  /**
   * 无效AVIF文件错误
   */
  static invalidAvifFile() {
    return this.createError(
      'errors.invalid_avif_file',
      {},
      'File is not a valid AVIF image'
    );
  }

  /**
   * 无效图片数组错误
   */
  static invalidImagesArray() {
    return this.createError(
      'errors.invalid_images_array',
      {},
      'Invalid images array'
    );
  }

  /**
   * 监听器不是函数错误
   */
  static listenerNotFunction() {
    return this.createError(
      'errors.listener_not_function',
      {},
      'Listener must be a function'
    );
  }

  /**
   * 创建警告消息数组
   * @param {Object} checks - 检查结果
   * @returns {Array} 警告消息数组
   */
  static createWarnings(checks) {
    const warnings = [];

    if (!checks.blobSupport) {
      warnings.push({
        key: 'warnings.blob_not_supported',
        fallback: 'Blob API not supported'
      });
    }
    if (!checks.urlSupport) {
      warnings.push({
        key: 'warnings.url_not_supported',
        fallback: 'URL.createObjectURL not supported'
      });
    }
    if (!checks.linkDownloadSupport) {
      warnings.push({
        key: 'warnings.download_not_supported',
        fallback: 'Download attribute not supported'
      });
    }
    if (!checks.isSecureContext) {
      warnings.push({
        key: 'warnings.insecure_context',
        fallback: 'Insecure context may limit functionality'
      });
    }

    return warnings;
  }
}

export default ErrorHandler;
