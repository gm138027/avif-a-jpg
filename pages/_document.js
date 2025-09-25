import { Html, Head, Main, NextScript } from "next/document";

export default function Document({ __NEXT_DATA__ }) {
  const locale = __NEXT_DATA__.locale || 'es';

  return (
    <Html lang={locale}>
      <Head>
        {/* Favicon 和各种设备图标 */}
        <link rel="icon" href="/logo/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/logo/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/logo/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/logo/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/logo/android-chrome-512x512.png" />

        {/* Web App Manifest - 静态文件，避免查询参数 */}
        <link rel="manifest" href="/logo/site.webmanifest" />

        {/* 主题颜色 */}
        <meta name="theme-color" content="#6366f1" />
        <meta name="msapplication-TileColor" content="#6366f1" />

        {/* hreflang标签现在由MultilingualSEO组件动态生成 */}

        {/* DNS预解析和预连接 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />

        {/* 预加载关键资源 */}
        <link rel="preload" href="/logo/android-chrome-192x192.png" as="image" />

        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-4GDFBNVZWK"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-4GDFBNVZWK');
            `,
          }}
        />

        {/* 基本SEO优化 */}
        <meta name="generator" content="Next.js" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AVIF a JPG" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
