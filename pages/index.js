import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MainContainerSimple from '@/components/MainContainerSimple';
import PageTitle from '@/components/PageTitle';
import SEOContent from '@/components/SEOContent';

// 主入口页面 - 只负责页面级别的事情（SEO、布局）
export default function Home() {
  const { t } = useTranslation('common');
  const router = useRouter();

  // 获取当前语言和URL
  const currentLocale = router.locale || 'es';

  // 动态生成多语言URL和语言标识
  const getLocaleConfig = (locale) => {
    switch (locale) {
      case 'en':
        return {
          url: 'https://avifajpg.com/en',
          inLanguage: 'en-US',
          ogLocale: 'en_US',
          keywords: 'convert avif to jpg, avif to jpg converter, avif to jpg online, .avif to jpg, convert avif to jpg free, avif to jpg online free'
        };
      case 'fr':
        return {
          url: 'https://avifajpg.com/fr',
          inLanguage: 'fr-FR',
          ogLocale: 'fr_FR',
          keywords: 'convertir avif en jpg, convertisseur avif en jpg, avif en jpg, convertir avif en jpg gratuit, conversion avif en jpg, .avif en jpg'
        };
      default: // 'es'
        return {
          url: 'https://avifajpg.com',
          inLanguage: 'es-ES',
          ogLocale: 'es_ES',
          keywords: 'convertir avif a jpg, convertidor avif a jpg, de avif a jpg, pasar de avif a jpg, .avif a jpg, convertir avif a jpg gratis, avif a jpg online'
        };
    }
  };

  const localeConfig = getLocaleConfig(currentLocale);
  const { url: currentUrl, inLanguage, ogLocale, keywords } = localeConfig;

  return (
    <>
      <Head>
        <title>{t('site.title')}</title>
        <meta name="description" content={t('site.description')} />
        <meta name="keywords" content={keywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo/favicon.ico" />
        <link rel="canonical" href={currentUrl} />

        {/* PWA 支持 */}
        <link rel="manifest" href="/logo/site.webmanifest" />
        <meta name="theme-color" content="#6366f1" />

        {/* Open Graph */}
        <meta property="og:title" content={t('site.title')} />
        <meta property="og:description" content={t('site.description')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:site_name" content={t('site.name')} />
        <meta property="og:image" content="https://avifajpg.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={t('site.title')} />
        <meta property="og:locale" content={ogLocale} />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('site.title')} />
        <meta name="twitter:description" content={t('site.description')} />
        <meta name="twitter:image" content="https://avifajpg.com/og-image.jpg" />
        <meta name="twitter:image:alt" content={t('site.title')} />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebApplication",
                  "name": t('site.name'),
                  "description": t('site.description'),
                  "url": currentUrl,
                  "inLanguage": inLanguage,
                  "applicationCategory": "MultimediaApplication",
                  "operatingSystem": "Web Browser",
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                  }
                },
                {
                  "@type": "FAQPage",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": t('faq.q1'),
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": t('faq.a1')
                      }
                    },
                    {
                      "@type": "Question",
                      "name": t('faq.q2'),
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": t('faq.a2')
                      }
                    },
                    {
                      "@type": "Question",
                      "name": t('faq.q3'),
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": t('faq.a3')
                      }
                    },
                    {
                      "@type": "Question",
                      "name": t('faq.q4'),
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": t('faq.a4')
                      }
                    },
                    {
                      "@type": "Question",
                      "name": t('faq.q5'),
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": t('faq.a5')
                      }
                    }
                  ]
                }
              ]
            })
          }}
        />
      </Head>

      <PageTitle />
      <MainContainerSimple />
      <SEOContent />
    </>
  );
}

// SEO友好：静态生成时预加载翻译
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
