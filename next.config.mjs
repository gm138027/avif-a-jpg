/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'fr'], // 现在支持西班牙语、英语和法语
    domains: [
      {
        domain: 'avifajpg.com',
        defaultLocale: 'es',
      },
    ],
  },

  // URL尾部不带斜杠
  trailingSlash: false,

  // 图片优化 - 支持现代格式
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // 压缩配置
  compress: true,

  // 完善的安全头部
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
