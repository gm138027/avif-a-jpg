import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import siteConfig from '@/lib/siteConfig';

export default function SecureConverterPage() {
  const { t } = useTranslation('secure-converter');

  const reasons = t('reasons.items', { returnObjects: true });
  const steps = t('how.steps', { returnObjects: true });
  const scenarios = t('scenarios.items', { returnObjects: true });
  const tips = t('tips.items', { returnObjects: true });
  const safetyItems = t('safety.items', { returnObjects: true });
  const faqItems = t('faq.items', { returnObjects: true });
  const router = useRouter();
  const { buildLocalePath, getLocaleMeta, siteUrl, defaultLocale } = siteConfig;
  const currentLocale = router.locale || defaultLocale;
  const { inLanguage, ogLocale } = getLocaleMeta(currentLocale);
  const canonicalUrl = buildLocalePath(currentLocale, '/convertidor-avif-seguro');
  const ogImage = `${siteUrl}/og-image.jpg`;
  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${canonicalUrl}#faq`,
    url: canonicalUrl,
    name: t('hero.title'),
    inLanguage,
    isPartOf: {
      '@id': `${siteUrl}#website`
    },
    publisher: {
      '@id': `${siteUrl}#organization`
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${canonicalUrl}#webpage`
    },
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  };

  return (
    <>
      <Head>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
        <link
          rel="canonical"
          href={buildLocalePath(router.locale || defaultLocale, '/convertidor-avif-seguro')}
        />
        <meta property="og:title" content={t('meta.title')} />
        <meta property="og:description" content={t('meta.description')} />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={buildLocalePath(router.locale || defaultLocale, '/convertidor-avif-seguro')}
        />
        <meta property="og:image" content={`${siteUrl}/og-image.jpg`} />
        <meta property="og:locale" content={ogLocale} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('meta.title')} />
        <meta name="twitter:description" content={t('meta.description')} />
        <meta name="twitter:image" content={`${siteUrl}/og-image.jpg`} />
        <meta name="twitter:image:alt" content={t('meta.title')} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqStructuredData)
          }}
        />
      </Head>

      <div className="secure-page">
        <Breadcrumb currentKey="secure_converter" />
        <section className="hero-section">
          <h1>{t('hero.title')}</h1>
          <p>{t('hero.subtitle')}</p>
          <Link href="/" className="cta-btn">
            {t('hero.cta')}
          </Link>
        </section>

        <section className="section">
          <h2>{t('reasons.title')}</h2>
          <div className="card-grid">
            {reasons.map((item, idx) => (
              <div className="card" key={`reason-${idx}`}>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>{t('how.title')}</h2>
          <div className="steps-container">
            {steps.map((step, idx) => (
              <div className="step-item" key={`step-${idx}`}>
                <div className="step-number">{idx + 1}</div>
                <div className="step-content">
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>{t('scenarios.title')}</h2>
          <div className="card-grid">
            {scenarios.map((item, idx) => (
              <div className="card" key={`scenario-${idx}`}>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section internal-link-section">
          <p className="internal-link">
            {t('relatedBatch.text')}{' '}
            <Link href="/convertidor-avif-por-lotes" className="inline-link">
              {t('relatedBatch.cta')}
            </Link>
          </p>
        </section>

        <section className="section">
          <h2>{t('tips.title')}</h2>
          <div className="advantages-list">
            {tips.map((tip, idx) => (
              <div className="advantage-item" key={`tip-${idx}`}>
                <div className="advantage-icon">
                  <Image src="/icons/correction.svg" width={18} height={18} alt="" />
                </div>
                <p className="advantage-text">{tip}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>{t('safety.title')}</h2>
          <div className="card-grid">
            {safetyItems.map((item, idx) => (
              <div className="card" key={`safety-${idx}`}>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>{t('faq.title')}</h2>
          <div className="faq-list">
            {faqItems.map((item, idx) => (
              <div className="faq-item" key={`faq-${idx}`}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="cta-section">
          <h2>{t('cta.title')}</h2>
          <p>{t('cta.desc')}</p>
          <Link href="/" className="cta-btn">
            {t('cta.button')}
          </Link>
        </section>
      </div>

      <style jsx>{`
        .secure-page {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem 1rem 4rem;
        }
        h1 {
          font-size: 2.3rem;
          margin-bottom: 1rem;
        }
        h2 {
          font-size: 1.8rem;
          margin: 3rem 0 1rem;
        }
        h3 {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }
        p {
          color: #4b5563;
          line-height: 1.6;
        }
        .hero-section {
          text-align: center;
        }
        .hero-section p {
          font-size: 1.05rem;
          margin-bottom: 1.5rem;
        }
        :global(.cta-btn) {
          display: inline-block;
          background: #6366f1;
          color: #fff;
          padding: 0.85rem 1.6rem;
          border-radius: 999px;
          font-weight: 600;
        }
        .section {
          margin-top: 2.5rem;
        }
        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
        }
        .card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 1.25rem;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
        }
        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .faq-item {
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 1rem;
        }
        .cta-section {
          text-align: center;
          margin-top: 3rem;
          background: #eef2ff;
          padding: 2rem 1rem;
          border-radius: 16px;
        }
        .internal-link {
          font-size: 1rem;
          color: #4b5563;
          line-height: 1.6;
        }
        .internal-link :global(.inline-link) {
          color: #6366f1;
          font-weight: 600;
        }
        .internal-link-section {
          margin-top: 1.5rem;
        }
        @media (max-width: 600px) {
          .card-grid {
            grid-template-columns: 1fr;
          }
          .steps-list,
          .tips-list {
            margin-left: 1rem;
          }
        }
      `}</style>
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'secure-converter']))
    }
  };
}
