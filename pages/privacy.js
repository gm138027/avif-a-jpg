import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Breadcrumb from '@/components/Breadcrumb';

// 隐私政策页面
export default function Privacy() {
  const { t } = useTranslation(['privacy', 'common']);
  const router = useRouter();
  const currentLocale = router.locale || 'es';

  // 动态生成多语言配置
  const getLocaleConfig = (locale) => {
    switch (locale) {
      case 'en':
        return {
          url: 'https://avifajpg.com/en/privacy',
          inLanguage: 'en-US',
          ogLocale: 'en_US',
          dateLocale: 'en-US',
          breadcrumbHome: 'Home'
        };
      case 'fr':
        return {
          url: 'https://avifajpg.com/fr/privacy',
          inLanguage: 'fr-FR',
          ogLocale: 'fr_FR',
          dateLocale: 'fr-FR',
          breadcrumbHome: 'Accueil'
        };
      default: // 'es'
        return {
          url: 'https://avifajpg.com/privacy',
          inLanguage: 'es-ES',
          ogLocale: 'es_ES',
          dateLocale: 'es-ES',
          breadcrumbHome: 'Inicio'
        };
    }
  };

  const localeConfig = getLocaleConfig(currentLocale);
  const { url: canonicalUrl, inLanguage, ogLocale, dateLocale, breadcrumbHome } = localeConfig;

  // 格式化当前日期
  const currentDate = new Date().toLocaleDateString(dateLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      <Head>
        <title>{`${t('privacy:title')} | ${t('common:site.name')}`}</title>
        <meta name="description" content={t('privacy:introduction.content')} />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="AVIF a JPG" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={`${t('privacy:title')} | ${t('common:site.name')}`} />
        <meta property="og:description" content={t('privacy:introduction.content')} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content={t('common:site.name')} />
        <meta property="og:image" content="https://avifajpg.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`${t('privacy:title')} - ${t('common:site.name')}`} />
        <meta property="og:locale" content={ogLocale} />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('privacy:title')} | ${t('common:site.name')}`} />
        <meta name="twitter:description" content={t('privacy:introduction.content')} />
        <meta name="twitter:image" content="https://avifajpg.com/og-image.jpg" />
        <meta name="twitter:image:alt" content={`${t('privacy:title')} - ${t('common:site.name')}`} />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
                "@type": "PrivacyPolicy",
                "@id": `${canonicalUrl}#privacy`,
                "name": t('privacy:title'),
                "description": t('privacy:introduction.content'),
                "url": canonicalUrl,
                "inLanguage": inLanguage,
                "isPartOf": {
                  "@id": "https://avifajpg.com#website"
                },
                "publisher": {
                  "@id": "https://avifajpg.com#organization"
                },
                "mainEntityOfPage": {
                  "@type": "WebPage",
                  "@id": `${canonicalUrl}#webpage`
                },
              "breadcrumb": {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": breadcrumbHome,
                    "item": "https://avifajpg.com"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": t('privacy:title'),
                    "item": canonicalUrl
                  }
                ]
              }
            })
          }}
        />
      </Head>

      <Breadcrumb currentKey="privacy" />

      <div className="privacy-page">
        <div className="privacy-container">
            {/* 页面标题 */}
            <header className="privacy-header">
              <h1 className="privacy-title">{t('privacy:title')}</h1>
              <p className="privacy-updated">
                {t('privacy:lastUpdated', { date: currentDate })}
              </p>
            </header>

            {/* 介绍 */}
            <section className="privacy-section">
              <h2 className="privacy-subtitle">{t('privacy:introduction.title')}</h2>
              <p className="privacy-text">{t('privacy:introduction.content')}</p>
            </section>

            {/* 数据收集 */}
            <section className="privacy-section">
              <h2 className="privacy-subtitle">{t('privacy:dataCollection.title')}</h2>
              
              <h3 className="privacy-subheading">{t('privacy:dataCollection.subtitle1')}</h3>
              <p className="privacy-text">{t('privacy:dataCollection.content1')}</p>
              
              <h3 className="privacy-subheading">{t('privacy:dataCollection.subtitle2')}</h3>
              <p className="privacy-text">{t('privacy:dataCollection.content2')}</p>
              <ul className="privacy-list">
                {t('privacy:dataCollection.list2', { returnObjects: true }).map((item, index) => (
                  <li key={index} className="privacy-list-item">{item}</li>
                ))}
              </ul>
            </section>

            {/* 数据使用 */}
            <section className="privacy-section">
              <h2 className="privacy-subtitle">{t('privacy:dataUsage.title')}</h2>
              <p className="privacy-text">{t('privacy:dataUsage.content')}</p>
              <ul className="privacy-list">
                {t('privacy:dataUsage.list', { returnObjects: true }).map((item, index) => (
                  <li key={index} className="privacy-list-item">{item}</li>
                ))}
              </ul>
            </section>

            {/* 数据保护 */}
            <section className="privacy-section">
              <h2 className="privacy-subtitle">{t('privacy:dataProtection.title')}</h2>
              
              <h3 className="privacy-subheading">{t('privacy:dataProtection.subtitle1')}</h3>
              <p className="privacy-text">{t('privacy:dataProtection.content1')}</p>
              
              <h3 className="privacy-subheading">{t('privacy:dataProtection.subtitle2')}</h3>
              <p className="privacy-text">{t('privacy:dataProtection.content2')}</p>
              
              <h3 className="privacy-subheading">{t('privacy:dataProtection.subtitle3')}</h3>
              <p className="privacy-text">{t('privacy:dataProtection.content3')}</p>
            </section>

            {/* Cookies */}
            <section className="privacy-section">
              <h2 className="privacy-subtitle">{t('privacy:cookies.title')}</h2>
              <p className="privacy-text">{t('privacy:cookies.content')}</p>
              <ul className="privacy-list">
                {t('privacy:cookies.list', { returnObjects: true }).map((item, index) => (
                  <li key={index} className="privacy-list-item">{item}</li>
                ))}
              </ul>
              <p className="privacy-text">{t('privacy:cookies.management')}</p>
            </section>

            {/* 第三方服务 */}
            <section className="privacy-section">
              <h2 className="privacy-subtitle">{t('privacy:thirdParty.title')}</h2>
              <p className="privacy-text">{t('privacy:thirdParty.content')}</p>
              <p className="privacy-note">{t('privacy:thirdParty.note')}</p>
            </section>

            {/* 用户权利 */}
            <section className="privacy-section">
              <h2 className="privacy-subtitle">{t('privacy:userRights.title')}</h2>
              <p className="privacy-text">{t('privacy:userRights.content')}</p>
              <ul className="privacy-list">
                {t('privacy:userRights.list', { returnObjects: true }).map((item, index) => (
                  <li key={index} className="privacy-list-item">{item}</li>
                ))}
              </ul>
              <p className="privacy-text">{t('privacy:userRights.contact')}</p>
            </section>

            {/* 未成年人 */}
            <section className="privacy-section">
              <h2 className="privacy-subtitle">{t('privacy:minors.title')}</h2>
              <p className="privacy-text">{t('privacy:minors.content')}</p>
            </section>

            {/* 政策变更 */}
            <section className="privacy-section">
              <h2 className="privacy-subtitle">{t('privacy:changes.title')}</h2>
              <p className="privacy-text">{t('privacy:changes.content')}</p>
            </section>

            {/* 联系方式 */}
            <section className="privacy-section">
              <h2 className="privacy-subtitle">{t('privacy:contact.title')}</h2>
              <p className="privacy-text">{t('privacy:contact.content')}</p>
              <ul className="privacy-list">
                {t('privacy:contact.methods', { returnObjects: true }).map((item, index) => (
                  <li key={index} className="privacy-list-item">{item}</li>
                ))}
              </ul>
            </section>

            {/* 法律合规 */}
            <section className="privacy-section">
              <h2 className="privacy-subtitle">{t('privacy:compliance.title')}</h2>
              <p className="privacy-text">{t('privacy:compliance.content')}</p>
            </section>
          </div>
        </div>
    </>
  );
}

// 静态生成时预加载翻译
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['privacy', 'common'])),
    },
  };
}
