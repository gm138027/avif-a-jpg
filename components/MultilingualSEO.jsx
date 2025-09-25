import Head from 'next/head';
import { useRouter } from 'next/router';

// 简单的多语言SEO组件 - 全局hreflang配置
export default function MultilingualSEO() {
  const router = useRouter();
  const currentPath = router.pathname; // 修复：使用pathname避免查询参数
  const baseUrl = 'https://avifajpg.com';

  // 支持的语言（西班牙语、英语和法语）
  const locales = ['es', 'en', 'fr'];

  // 生成hreflang URLs - 不带尾部斜杠
  const generateHreflangUrls = () => {
    const urls = [];
    
    locales.forEach(locale => {
      let url;
      if (locale === 'es') {
        // 默认语言使用根域名
        url = currentPath === '/' ? baseUrl : `${baseUrl}${currentPath}`;
      } else {
        // 其他语言使用 /locale 前缀
        url = currentPath === '/' ? `${baseUrl}/${locale}` : `${baseUrl}/${locale}${currentPath}`;
      }
      
      urls.push({
        hreflang: locale,
        href: url
      });
    });

    // x-default 指向默认语言
    const defaultUrl = currentPath === '/' ? baseUrl : `${baseUrl}${currentPath}`;
    urls.push({
      hreflang: 'x-default',
      href: defaultUrl
    });

    return urls;
  };

  return (
    <Head>
      {/* 动态生成hreflang标签 */}
      {generateHreflangUrls().map(({ hreflang, href }) => (
        <link
          key={hreflang}
          rel="alternate"
          hrefLang={hreflang}
          href={href}
        />
      ))}
    </Head>
  );
}
