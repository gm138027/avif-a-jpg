import Head from 'next/head';
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const BASE_URL = 'https://avifajpg.com';
const DEFAULT_LOGO = `${BASE_URL}/logo/android-chrome-512x512.png`;

const localeToLanguage = {
  es: 'es-ES',
  en: 'en-US',
  fr: 'fr-FR'
};

export default function SiteStructuredData() {
  const { locale = 'es' } = useRouter();
  const { t } = useTranslation('common');

  const structuredData = useMemo(() => {
    const languageCode = localeToLanguage[locale] || 'es-ES';
    const siteName = t('site.name');
    const siteDescription = t('site.description');

    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': `${BASE_URL}#organization`,
          'name': siteName,
          'url': BASE_URL,
          'logo': {
            '@type': 'ImageObject',
            'url': DEFAULT_LOGO,
            'width': 512,
            'height': 512
          },
          'contactPoint': [
            {
              '@type': 'ContactPoint',
              'email': 'guom0900@gmail.com',
              'contactType': 'customer service',
              'availableLanguage': ['es', 'en', 'fr']
            }
          ],
          'areaServed': 'Worldwide'
        },
        {
          '@type': 'WebSite',
          '@id': `${BASE_URL}#website`,
          'url': BASE_URL,
          'name': siteName,
          'description': siteDescription,
          'inLanguage': languageCode,
          'publisher': {
            '@id': `${BASE_URL}#organization`
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

