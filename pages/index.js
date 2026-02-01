import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MainContainerSimple from '@/components/MainContainerSimple';
import PageTitle from '@/components/PageTitle';
import SEOContent from '@/components/SEOContent';
import siteConfig from '@/lib/siteConfig';

// 主入口页面 - 只负责页面级别的事情（SEO、布局）
export default function Home() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { buildLocalePath, getLocaleMeta, siteUrl, defaultLocale } = siteConfig;

  const currentLocale = router.locale || defaultLocale;
  const { inLanguage, ogLocale } = getLocaleMeta(currentLocale);
  const currentUrl = buildLocalePath(currentLocale, '/');
  const ogImage = `${siteUrl}/og-image.jpg`;

  return (
    <>
      <Head>
        <title>{t('site.title')}</title>
        <meta name="description" content={t('site.description')} />
        <meta name="keywords" content={t('site.keywords')} />
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
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={t('site.title')} />
        <meta property="og:locale" content={ogLocale} />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('site.title')} />
        <meta name="twitter:description" content={t('site.description')} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content={t('site.title')} />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "@id": `${currentUrl}#faq`,
                "url": currentUrl,
                "name": t('site.title'),
                "inLanguage": inLanguage,
                "isPartOf": {
                  "@id": `${siteUrl}#website`
                },
                "publisher": {
                  "@id": `${siteUrl}#organization`
                },
                "mainEntityOfPage": {
                  "@type": "WebPage",
                  "@id": `${currentUrl}#webpage`
                },
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
                    },
                    {
                      "@type": "Question",
                      "name": t('faq.q6'),
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": t('faq.a6')
                      }
                    },
                    {
                      "@type": "Question",
                      "name": t('faq.q7'),
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": t('faq.a7')
                      }
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

// SEO友好：静态生成时预载翻译
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
