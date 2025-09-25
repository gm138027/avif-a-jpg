// 简单的Google Analytics追踪工具
// 使用方法: import { trackEvent } from '@/utils/analytics';

// 检查gtag是否可用
const isGtagAvailable = () => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

// 通用事件追踪函数
export const trackEvent = (action, category = 'User Interaction', label = '', value = 0) => {
  if (!isGtagAvailable()) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// 具体的用户行为追踪函数
export const analytics = {
  // 语言切换追踪
  trackLanguageSwitch: (fromLang, toLang) => {
    trackEvent('language_switch', 'Navigation', `${fromLang}_to_${toLang}`);
  },

  // 文件上传追踪
  trackFileUpload: (fileCount = 1, fileSize = 0) => {
    trackEvent('file_upload', 'Conversion', `${fileCount}_files`, fileSize);
  },

  // 转换开始追踪
  trackConversionStart: (fileCount = 1, targetFormat = 'jpg') => {
    trackEvent('conversion_start', 'Conversion', `to_${targetFormat}`, fileCount);
  },

  // 转换完成追踪
  trackConversionComplete: (fileCount = 1, targetFormat = 'jpg', success = true) => {
    const status = success ? 'success' : 'failed';
    trackEvent('conversion_complete', 'Conversion', `${status}_${targetFormat}`, fileCount);
  },

  // 文件下载追踪
  trackDownload: (downloadType = 'single', fileCount = 1) => {
    trackEvent('file_download', 'Conversion', downloadType, fileCount);
  },

  // 页面浏览追踪 (可选)
  trackPageView: (pageName) => {
    if (!isGtagAvailable()) return;
    window.gtag('config', 'G-4GDFBNVZWK', {
      page_title: pageName,
      page_location: window.location.href,
    });
  },
};

export default analytics;
