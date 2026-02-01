import Head from 'next/head';
import { useRouter } from 'next/router';
import siteConfig from '@/lib/siteConfig';
import { useMemo } from 'react';
import { parse } from 'url';

const { locales, defaultLocale, buildLocalePath } = siteConfig;

export default function MultilingualSEO() {
  const router = useRouter();

  const normalizedPath = useMemo(() => {
    const asPath = router.asPath || '/';
    const parsed = parse(asPath);
    let path = parsed.pathname || '/';
    const localePrefix = locales.find(
      (loc) => loc !== defaultLocale && (path === `/${loc}` || path.startsWith(`/${loc}/`))
    );
    if (localePrefix) {
      path = path.replace(`/${localePrefix}`, '') || '/';
    }
    return path;
  }, [router.asPath]);

  const hreflangUrls = [
    ...locales.map(locale => ({
      hreflang: locale,
      href: buildLocalePath(locale, normalizedPath)
    })),
    {
      hreflang: 'x-default',
      href: buildLocalePath(defaultLocale, normalizedPath)
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
