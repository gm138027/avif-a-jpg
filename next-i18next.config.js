module.exports = {
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'fr'], // 现在支持西班牙语、英语和法语
  },
  // 开发环境下重新加载翻译文件（生产环境禁用以提高性能）
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  // 翻译文件路径（默认值，明确声明便于维护）
  localePath: './public/locales',
  // 命名空间分离，便于维护大型项目
  ns: ['common', 'privacy', 'terms', 'contact'],
  defaultNS: 'common',
  // 严格模式：翻译键不存在时显示键名而非空字符串
  returnEmptyString: false,
  // 调试模式（仅开发环境）
  debug: process.env.NODE_ENV === 'development',
  // 降级语言设置
  fallbackLng: 'es',
  // 插值设置
  interpolation: {
    escapeValue: false, // React 已经处理了 XSS 防护
  },
}
