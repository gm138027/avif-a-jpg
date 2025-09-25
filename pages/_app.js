import { appWithTranslation } from 'next-i18next';
import Layout from '@/components/Layout';
import MultilingualSEO from '@/components/MultilingualSEO';
import "@/styles/globals.css";
import "@/styles/components.css";

function App({ Component, pageProps }) {
  return (
    <>
      <MultilingualSEO />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default appWithTranslation(App);
