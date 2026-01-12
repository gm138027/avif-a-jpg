import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function ServerErrorPage() {
  const { t } = useTranslation('common');

  return (
    <div className="error-page">
      <Head>
        <title>{`500 | ${t('site.name')}`}</title>
        <meta name="robots" content="noindex" />
      </Head>
      <h1>500</h1>
      <p>{t('conversion.conversion_completed')}</p>
      <Link href="/" className="cta-btn">
        {t('home.title')}
      </Link>
      <style jsx>{`
        .error-page {
          min-height: 60vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          text-align: center;
          padding: 2rem 1rem;
        }
        h1 {
          font-size: 3rem;
          margin-bottom: 0.5rem;
        }
        :global(.cta-btn) {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          background: #6366f1;
          color: #fff;
          border-radius: 999px;
        }
      `}</style>
    </div>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common']))
    }
  };
}
