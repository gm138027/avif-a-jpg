import { appWithTranslation } from 'next-i18next';
import Script from 'next/script';
import Layout from '@/components/Layout';
import MultilingualSEO from '@/components/MultilingualSEO';
import SiteStructuredData from '@/components/SiteStructuredData';
import "@/styles/globals.css";
import "@/styles/components.css";

function App({ Component, pageProps }) {
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-4GDFBNVZWK"
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-4GDFBNVZWK');
        `}
      </Script>
      <MultilingualSEO />
      <SiteStructuredData />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default appWithTranslation(App);
