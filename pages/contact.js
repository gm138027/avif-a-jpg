import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import Breadcrumb from '@/components/Breadcrumb';

// 联系我们页面
export default function Contact() {
  const { t } = useTranslation(['contact', 'common']);
  const router = useRouter();
  const currentLocale = router.locale || 'es';

  // 动态生成多语言配置
  const getLocaleConfig = (locale) => {
    switch (locale) {
      case 'en':
        return {
          url: 'https://avifajpg.com/en/contact',
          inLanguage: 'en-US',
          ogLocale: 'en_US',
          breadcrumbHome: 'Home'
        };
      case 'fr':
        return {
          url: 'https://avifajpg.com/fr/contact',
          inLanguage: 'fr-FR',
          ogLocale: 'fr_FR',
          breadcrumbHome: 'Accueil'
        };
      default: // 'es'
        return {
          url: 'https://avifajpg.com/contact',
          inLanguage: 'es-ES',
          ogLocale: 'es_ES',
          breadcrumbHome: 'Inicio'
        };
    }
  };

  const localeConfig = getLocaleConfig(currentLocale);
  const { url: canonicalUrl, inLanguage, ogLocale, breadcrumbHome } = localeConfig;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 处理表单提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // 创建邮件链接
      const subject = encodeURIComponent(`[AVIF Converter] ${formData.subject}`);
      const body = encodeURIComponent(
        `Nombre: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Asunto: ${formData.subject}\n\n` +
        `Mensaje:\n${formData.message}`
      );
      
      const mailtoLink = `mailto:guom0900@gmail.com?subject=${subject}&body=${body}`;
      
      // 打开邮件客户端
      window.location.href = mailtoLink;
      
      // 显示成功消息
      setSubmitStatus('success');
      
      // 清空表单
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>{t('contact:title')} | {t('common:site.name')}</title>
        <meta name="description" content={t('contact:description')} />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="AVIF a JPG" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={`${t('contact:title')} | ${t('common:site.name')}`} />
        <meta property="og:description" content={t('contact:description')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content={t('common:site.name')} />
        <meta property="og:image" content="https://avifajpg.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`${t('contact:title')} - ${t('common:site.name')}`} />
        <meta property="og:locale" content={ogLocale} />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('contact:title')} | ${t('common:site.name')}`} />
        <meta name="twitter:description" content={t('contact:description')} />
        <meta name="twitter:image" content="https://avifajpg.com/og-image.jpg" />
        <meta name="twitter:image:alt" content={`${t('contact:title')} - ${t('common:site.name')}`} />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ContactPage",
              "name": t('contact:title'),
              "description": t('contact:description'),
              "url": canonicalUrl,
              "inLanguage": inLanguage,
              "isPartOf": {
                "@type": "WebSite",
                "name": t('common:site.name'),
                "url": "https://avifajpg.com"
              },
              "mainEntity": {
                "@type": "Organization",
                "name": t('common:site.name'),
                "url": "https://avifajpg.com",
                "email": "guom0900@gmail.com",
                "contactPoint": {
                  "@type": "ContactPoint",
                  "email": "guom0900@gmail.com",
                  "contactType": "customer service",
                  "availableLanguage": ["Spanish", "English", "French"]
                }
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
                    "name": t('contact:title'),
                    "item": canonicalUrl
                  }
                ]
              }
            })
          }}
        />
      </Head>

      <Breadcrumb currentKey="contact" />

      <div className="contact-page">
        <div className="contact-container">
          {/* 页面标题 */}
          <header className="contact-header">
            <h1 className="contact-title">{t('contact:title')}</h1>
            <p className="contact-subtitle">{t('contact:subtitle')}</p>
            <p className="contact-description">{t('contact:description')}</p>
          </header>

          <div className="contact-content">
            {/* 左侧：联系信息 */}
            <div className="contact-info">
              {/* 邮箱信息 */}
              <section className="contact-section">
                <h2 className="contact-section-title">{t('contact:email.title')}</h2>
                <div className="contact-email">
                  <a href="mailto:guom0900@gmail.com" className="contact-email-link">
                    {t('contact:email.address')}
                  </a>
                </div>
                <p className="contact-text">{t('contact:email.description')}</p>
                
                <div className="contact-subjects">
                  <h3 className="contact-subheading">{t('contact:email.subjects.title')}</h3>
                  <ul className="contact-list">
                    {t('contact:email.subjects.list', { returnObjects: true }).map((item, index) => (
                      <li key={index} className="contact-list-item">{item}</li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* 响应时间 */}
              <section className="contact-section">
                <h2 className="contact-section-title">{t('contact:response.title')}</h2>
                <p className="contact-text">{t('contact:response.description')}</p>
                <ul className="contact-list">
                  {t('contact:response.details', { returnObjects: true }).map((item, index) => (
                    <li key={index} className="contact-list-item">{item}</li>
                  ))}
                </ul>
              </section>

              {/* 技术支持 */}
              <section className="contact-section">
                <h2 className="contact-section-title">{t('contact:support.title')}</h2>
                <p className="contact-text">{t('contact:support.description')}</p>
                <ul className="contact-list">
                  {t('contact:support.info', { returnObjects: true }).map((item, index) => (
                    <li key={index} className="contact-list-item">{item}</li>
                  ))}
                </ul>
              </section>
            </div>

            {/* 右侧：联系表单 */}
            <div className="contact-form-container">
              <section className="contact-section">
                <h2 className="contact-section-title">{t('contact:form.title')}</h2>
                
                {submitStatus === 'success' && (
                  <div className="contact-message contact-message--success">
                    {t('contact:form.success')}
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="contact-message contact-message--error">
                    {t('contact:form.error')}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="contact-form-group">
                    <label htmlFor="name" className="contact-form-label">
                      {t('contact:form.name.label')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={t('contact:form.name.placeholder')}
                      className="contact-form-input"
                      required
                    />
                  </div>

                  <div className="contact-form-group">
                    <label htmlFor="email" className="contact-form-label">
                      {t('contact:form.email.label')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={t('contact:form.email.placeholder')}
                      className="contact-form-input"
                      required
                    />
                  </div>

                  <div className="contact-form-group">
                    <label htmlFor="subject" className="contact-form-label">
                      {t('contact:form.subject.label')}
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="contact-form-select"
                      required
                    >
                      <option value="">{t('contact:form.subject.placeholder')}</option>
                      {t('contact:form.subject.options', { returnObjects: true }).map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div className="contact-form-group">
                    <label htmlFor="message" className="contact-form-label">
                      {t('contact:form.message.label')}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={t('contact:form.message.placeholder')}
                      className="contact-form-textarea"
                      rows="6"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="contact-form-submit"
                  >
                    {isSubmitting ? t('contact:form.sending') : t('contact:form.submit')}
                  </button>
                </form>
              </section>

              {/* FAQ链接 */}
              <section className="contact-section">
                <h2 className="contact-section-title">{t('contact:faq.title')}</h2>
                <p className="contact-text">{t('contact:faq.description')}</p>
                <Link href="/#faq" className="contact-faq-link">
                  {t('contact:faq.link')}
                </Link>
              </section>
            </div>
          </div>

          {/* 底部信息 */}
          <div className="contact-footer">
            {/* 隐私说明 */}
            <section className="contact-section">
              <h2 className="contact-section-title">{t('contact:privacy.title')}</h2>
              <p className="contact-text">{t('contact:privacy.description')}</p>
            </section>

            {/* 替代方法 */}
            <section className="contact-section">
              <h2 className="contact-section-title">{t('contact:alternative.title')}</h2>
              <p className="contact-text">{t('contact:alternative.description')}</p>
              <ul className="contact-list">
                {t('contact:alternative.methods', { returnObjects: true }).map((item, index) => (
                  <li key={index} className="contact-list-item">{item}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

// 静态生成时预加载翻译
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['contact', 'common'])),
    },
  };
}
