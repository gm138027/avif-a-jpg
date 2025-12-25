import Head from 'next/head';
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import siteConfig from '@/lib/siteConfig';

const { siteUrl, buildLocalePath, getLocaleMeta, defaultLocale } = siteConfig;
const DEFAULT_LOGO = `${siteUrl}/logo/android-chrome-512x512.png`;

export default function SiteStructuredData() {
  const { locale = defaultLocale } = useRouter();
  const { t } = useTranslation('common');

  const structuredData = useMemo(() => {
    const { inLanguage } = getLocaleMeta(locale);
    const siteName = t('site.name');
    const siteDescription = t('site.description');
    const localeUrl = buildLocalePath(locale, '/');

    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': `${siteUrl}#organization`,
          name: siteName,
          url: siteUrl,
          logo: {
            '@type': 'ImageObject',
            url: DEFAULT_LOGO,
            width: 512,
            height: 512
          },
          contactPoint: [
            {
              '@type': 'ContactPoint',
              email: 'guom0900@gmail.com',
              contactType: 'customer service',
              availableLanguage: ['es', 'en', 'fr']
            }
          ],
          areaServed: 'Worldwide'
        },
        {
          '@type': 'WebSite',
          '@id': `${siteUrl}#website`,
          url: localeUrl,
          name: siteName,
          description: siteDescription,
          inLanguage,
          publisher: {
            '@id': `${siteUrl}#organization`
          }
        }
      ]
    };
  }, [locale, t]);

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
    </Head>
  );
}
