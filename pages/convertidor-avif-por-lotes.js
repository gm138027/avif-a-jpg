import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import siteConfig from '@/lib/siteConfig';

export default function BatchConverterPage() {
  const { t } = useTranslation('batch-converter');
  const router = useRouter();
  const { buildLocalePath, getLocaleMeta, siteUrl, defaultLocale } = siteConfig;

  const whyItems = t('why.items', { returnObjects: true });
  const tips = t('tips.items', { returnObjects: true });
  const faqItems = t('faq.items', { returnObjects: true });
  const useCases = t('useCases.items', { returnObjects: true });
  const steps = t('steps.items', { returnObjects: true });
  const currentLocale = router.locale || defaultLocale;
  const { inLanguage, ogLocale } = getLocaleMeta(currentLocale);
  const canonicalUrl = buildLocalePath(currentLocale, '/convertidor-avif-por-lotes');
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
          href={buildLocalePath(router.locale || defaultLocale, '/convertidor-avif-por-lotes')}
        />
        <meta property="og:title" content={t('meta.title')} />
        <meta property="og:description" content={t('meta.description')} />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={buildLocalePath(router.locale || defaultLocale, '/convertidor-avif-por-lotes')}
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

      <div className="batch-page">
        <Breadcrumb currentKey="batch_converter" />
        <section className="hero-section">
          <h1>{t('hero.title')}</h1>
          <p>{t('hero.subtitle')}</p>
          <Link href="/" className="cta-btn">
            {t('hero.cta')}
          </Link>
        </section>

        <section className="why-section">
          <h2>{t('why.title')}</h2>
          <div className="steps-container">
            {whyItems.map((item, index) => (
              <div className="step-item" key={`why-${index}`}>
                <div className="step-number">{index + 1}</div>
                <div className="step-content">
                  <h3 className="step-title">{item.title}</h3>
                  <p className="step-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="features-section">
          <h2>{t('features.title')}</h2>
          <div className="feature-item">
            <div className="feature-text">
              <h3>{t('features.upload.title')}</h3>
              <p>{t('features.upload.desc')}</p>
            </div>
            <div className="feature-media">
              <Image
                src="/images/batch-converter/batch-upload-es.jpg"
                alt={t('images.uploadAlt')}
                width={900}
                height={540}
              />
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-text">
              <h3>{t('features.zip.title')}</h3>
              <p>{t('features.zip.desc')}</p>
            </div>
            <div className="feature-media">
              <Image
                src="/images/batch-converter/batch-zip-download-es.jpg"
                alt={t('images.zipAlt')}
                width={900}
                height={540}
              />
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-text">
              <h3>{t('features.formats.title')}</h3>
              <p>{t('features.formats.desc')}</p>
            </div>
            <div className="feature-media">
              <Image
                src="/images/batch-converter/batch-format-toggle-es.jpg"
                alt={t('images.formatAlt')}
                width={900}
                height={540}
              />
            </div>
          </div>

          <div className="feature-simple">
            <h3>{t('features.local.title')}</h3>
            <p>{t('features.local.desc')}</p>
          </div>
          <div className="feature-simple">
            <h3>{t('features.unlimited.title')}</h3>
            <p>{t('features.unlimited.desc')}</p>
          </div>
        </section>

        <section className="steps-section">
          <h2>{t('steps.title')}</h2>
          <div className="steps-container">
            {steps.map((step, index) => (
              <div className="step-item" key={`step-${index}`}>
                <div className="step-number">{index + 1}</div>
                <div className="step-content">
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="faq-section">
          <h2>{t('faq.title')}</h2>
          <div className="faq-list">
            {faqItems.map((item, index) => (
              <div className="faq-item" key={`faq-${index}`}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="tips-section">
          <h2>{t('tips.title')}</h2>
          <div className="advantages-list tips-advantages">
            {tips.map((tip, index) => (
              <div className="advantage-item" key={`tip-${index}`}>
                <div className="advantage-icon">
                  <Image
                    src="/icons/correction.svg"
                    alt=""
                    aria-hidden="true"
                    width={18}
                    height={18}
                  />
                </div>
                <p className="advantage-text">{tip}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="usecases-section">
          <h2>{t('useCases.title')}</h2>
          <div className="cards-grid">
            {useCases.map((uc, index) => (
              <div className="card" key={`usecase-${index}`}>
                <h3>{uc.title}</h3>
                <p>{uc.desc}</p>
              </div>
            ))}
          </div>
          <p className="internal-link">
            {t('relatedPrivacy.text')}{' '}
            <Link href="/convertidor-avif-seguro" className="inline-link">
              {t('relatedPrivacy.cta')}
            </Link>
          </p>
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
        .batch-page {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem 1rem 4rem;
        }
        .hero-section {
          text-align: center;
          margin-bottom: 3rem;
        }
        .hero-section h1 {
          font-size: 2.2rem;
          margin-bottom: 1rem;
        }
        .hero-section p {
          margin-bottom: 1.5rem;
        }
        :global(.cta-btn) {
          display: inline-block;
          background: #6c63ff;
          color: #fff;
          padding: 0.85rem 1.6rem;
          border-radius: 999px;
        }
        h2 {
          margin: 3rem 0 1.5rem;
          font-size: 1.8rem;
        }
        .why-section {
          margin-top: 2rem;
        }
        .steps-section {
          margin-top: 3rem;
        }
        .feature-item {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .batch-page p {
          font-size: 1rem;
          color: #4b5563;
          line-height: 1.6;
          margin: 0 0 0.75rem;
        }
        .feature-media {
          display: flex;
          justify-content: center;
          background: #fff;
          padding: 0.75rem;
          border-radius: 12px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
        }
        .feature-media :global(img) {
          width: 100%;
          height: auto;
          border-radius: 8px;
        }
        .feature-text {
          text-align: left;
        }
        .feature-simple {
          margin-bottom: 1.5rem;
          background: #f5f5ff;
          padding: 1rem;
          border-radius: 10px;
        }
        .faq-list .faq-item {
          margin-bottom: 1.5rem;
        }
        .tips-advantages .advantage-item {
          padding: 16px 0;
        }
        .tips-advantages .advantage-text {
          text-align: left;
          margin: 0;
        }
        .feature-simple p,
        .feature-text p,
        .faq-section p,
        .card p,
        .advantage-text {
          font-size: 1rem;
          color: #4b5563;
          line-height: 1.6;
        }
        .usecases-section .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }
        .usecases-section .card {
          background: #f8f9ff;
          padding: 1.25rem;
          border-radius: 12px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
        }
        .internal-link {
          margin-top: 1.25rem;
          font-size: 1rem;
          color: #4b5563;
        }
        .internal-link :global(.inline-link) {
          color: #6366f1;
          font-weight: 600;
        }
        .cta-section {
          text-align: center;
          margin-top: 4rem;
          background: #f1f0ff;
          padding: 2rem 1rem;
          border-radius: 16px;
        }
        @media (max-width: 768px) {
          .feature-media {
            padding: 0.5rem;
          }
          .cta-btn {
            width: 100%;
            text-align: center;
          }
          .usecases-section .cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'batch-converter']))
    }
  };
}
