import Head from 'next/head';
import { useRouter } from 'next/router';
import siteConfig from '@/lib/siteConfig';

const { locales, defaultLocale, buildLocalePath } = siteConfig;

export default function MultilingualSEO() {
  const router = useRouter();
  const currentPath = router.pathname || '/';

  const hreflangUrls = [
    ...locales.map(locale => ({
      hreflang: locale,
      href: buildLocalePath(locale, currentPath)
    })),
    {
      hreflang: 'x-default',
      href: buildLocalePath(defaultLocale, currentPath)
    }
  ];

  return (
    <Head>
      {hreflangUrls.map(({ hreflang, href }) => (
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
