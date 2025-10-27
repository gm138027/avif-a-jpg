import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Breadcrumb from '@/components/Breadcrumb';

// 服务条款页面
export default function Terms() {
  const { t } = useTranslation(['terms', 'common']);
  const router = useRouter();
  const currentLocale = router.locale || 'es';

  // 动态生成多语言配置
  const getLocaleConfig = (locale) => {
    switch (locale) {
      case 'en':
        return {
          url: 'https://avifajpg.com/en/terms',
          inLanguage: 'en-US',
          ogLocale: 'en_US',
          dateLocale: 'en-US',
          breadcrumbHome: 'Home'
        };
      case 'fr':
        return {
          url: 'https://avifajpg.com/fr/terms',
          inLanguage: 'fr-FR',
          ogLocale: 'fr_FR',
          dateLocale: 'fr-FR',
          breadcrumbHome: 'Accueil'
        };
      default: // 'es'
        return {
          url: 'https://avifajpg.com/terms',
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
        <title>{`${t('terms:title')} | ${t('common:site.name')}`}</title>
        <meta name="description" content={t('terms:introduction.content')} />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="AVIF a JPG" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={`${t('terms:title')} | ${t('common:site.name')}`} />
        <meta property="og:description" content={t('terms:introduction.content')} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content={t('common:site.name')} />
        <meta property="og:image" content="https://avifajpg.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`${t('terms:title')} - ${t('common:site.name')}`} />
        <meta property="og:locale" content={ogLocale} />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('terms:title')} | ${t('common:site.name')}`} />
        <meta name="twitter:description" content={t('terms:introduction.content')} />
        <meta name="twitter:image" content="https://avifajpg.com/og-image.jpg" />
        <meta name="twitter:image:alt" content={`${t('terms:title')} - ${t('common:site.name')}`} />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
                "@type": "TermsOfService",
                "@id": `${canonicalUrl}#terms`,
                "name": t('terms:title'),
                "description": t('terms:introduction.content'),
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
                    "name": t('terms:title'),
                    "item": canonicalUrl
                  }
                ]
              }
            })
          }}
        />
      </Head>

      <Breadcrumb currentKey="terms" />

      <div className="terms-page">
        <div className="terms-container">
          {/* 页面标题 */}
          <header className="terms-header">
            <h1 className="terms-title">{t('terms:title')}</h1>
            <p className="terms-updated">
              {t('terms:lastUpdated', { date: currentDate })}
            </p>
          </header>

          {/* 介绍 */}
          <section className="terms-section">
            <h2 className="terms-subtitle">{t('terms:introduction.title')}</h2>
            <p className="terms-text">{t('terms:introduction.content')}</p>
          </section>

          {/* 服务描述 */}
          <section className="terms-section">
            <h2 className="terms-subtitle">{t('terms:serviceDescription.title')}</h2>
            <p className="terms-text">{t('terms:serviceDescription.content')}</p>
            <ul className="terms-list">
              {t('terms:serviceDescription.features', { returnObjects: true }).map((item, index) => (
                <li key={index} className="terms-list-item">{item}</li>
              ))}
            </ul>
          </section>

          {/* 用户责任 */}
          <section className="terms-section">
            <h2 className="terms-subtitle">{t('terms:userResponsibilities.title')}</h2>
            <p className="terms-text">{t('terms:userResponsibilities.content')}</p>
            <ul className="terms-list">
              {t('terms:userResponsibilities.list', { returnObjects: true }).map((item, index) => (
                <li key={index} className="terms-list-item">{item}</li>
              ))}
            </ul>
          </section>

          {/* 服务可用性 */}
          <section className="terms-section">
            <h2 className="terms-subtitle">{t('terms:serviceAvailability.title')}</h2>
            <p className="terms-text">{t('terms:serviceAvailability.content')}</p>
            <ul className="terms-list">
              {t('terms:serviceAvailability.limitations', { returnObjects: true }).map((item, index) => (
                <li key={index} className="terms-list-item">{item}</li>
              ))}
            </ul>
          </section>

          {/* 知识产权 */}
          <section className="terms-section">
            <h2 className="terms-subtitle">{t('terms:intellectualProperty.title')}</h2>
            <p className="terms-text">{t('terms:intellectualProperty.content')}</p>
            <p className="terms-text">{t('terms:intellectualProperty.userContent')}</p>
            <p className="terms-text">{t('terms:intellectualProperty.serviceRights')}</p>
          </section>

          {/* 数据处理 */}
          <section className="terms-section">
            <h2 className="terms-subtitle">{t('terms:dataProcessing.title')}</h2>
            <p className="terms-text">{t('terms:dataProcessing.content')}</p>
            <ul className="terms-list">
              {t('terms:dataProcessing.principles', { returnObjects: true }).map((item, index) => (
                <li key={index} className="terms-list-item">{item}</li>
              ))}
            </ul>
          </section>

          {/* 免责声明 */}
          <section className="terms-section">
            <h2 className="terms-subtitle">{t('terms:disclaimers.title')}</h2>
            <p className="terms-text">{t('terms:disclaimers.content')}</p>
            <ul className="terms-list">
              {t('terms:disclaimers.warranties', { returnObjects: true }).map((item, index) => (
                <li key={index} className="terms-list-item">{item}</li>
              ))}
            </ul>
          </section>

          {/* 责任限制 */}
          <section className="terms-section">
            <h2 className="terms-subtitle">{t('terms:limitations.title')}</h2>
            <p className="terms-text">{t('terms:limitations.content')}</p>
            <ul className="terms-list">
              {t('terms:limitations.exclusions', { returnObjects: true }).map((item, index) => (
                <li key={index} className="terms-list-item">{item}</li>
              ))}
            </ul>
          </section>

          {/* 禁止用途 */}
          <section className="terms-section">
            <h2 className="terms-subtitle">{t('terms:prohibited.title')}</h2>
            <p className="terms-text">{t('terms:prohibited.content')}</p>
            <ul className="terms-list">
              {t('terms:prohibited.list', { returnObjects: true }).map((item, index) => (
                <li key={index} className="terms-list-item">{item}</li>
              ))}
            </ul>
          </section>

          {/* 终止 */}
          <section className="terms-section">
            <h2 className="terms-subtitle">{t('terms:termination.title')}</h2>
            <p className="terms-text">{t('terms:termination.content')}</p>
            <p className="terms-text">{t('terms:termination.userRights')}</p>
          </section>

          {/* 条款修改 */}
          <section className="terms-section">
            <h2 className="terms-subtitle">{t('terms:modifications.title')}</h2>
            <p className="terms-text">{t('terms:modifications.content')}</p>
            <p className="terms-text">{t('terms:modifications.notification')}</p>
            <p className="terms-text">{t('terms:modifications.acceptance')}</p>
          </section>

          {/* 适用法律 */}
          <section className="terms-section">
            <h2 className="terms-subtitle">{t('terms:governingLaw.title')}</h2>
            <p className="terms-text">{t('terms:governingLaw.content')}</p>
            <p className="terms-text">{t('terms:governingLaw.disputes')}</p>
          </section>

          {/* 联系方式 */}
          <section className="terms-section">
            <h2 className="terms-subtitle">{t('terms:contact.title')}</h2>
            <p className="terms-text">{t('terms:contact.content')}</p>
            <ul className="terms-list">
              {t('terms:contact.methods', { returnObjects: true }).map((item, index) => (
                <li key={index} className="terms-list-item">{item}</li>
              ))}
            </ul>
          </section>

          {/* 可分割性 */}
          <section className="terms-section">
            <h2 className="terms-subtitle">{t('terms:severability.title')}</h2>
            <p className="terms-text">{t('terms:severability.content')}</p>
          </section>

          {/* 完整协议 */}
          <section className="terms-section">
            <h2 className="terms-subtitle">{t('terms:entireAgreement.title')}</h2>
            <p className="terms-text">{t('terms:entireAgreement.content')}</p>
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
      ...(await serverSideTranslations(locale, ['terms', 'common'])),
    },
  };
}
