import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

// SEO内容组件 - 显示优化的SEO文本内容
export default function SEOContent() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const currentLocale = router.locale || 'es';
  const relatedResources = t('related.items', { returnObjects: true });

  return (
    <div className="seo-content">
      {/* H2-1: 转换AVIF到JPG */}
      <section className="seo-section">
        <h2 className="seo-h2">{t('seo.h2_convert_jpg')}</h2>
        <p className="seo-text">{t('seo.jpg_text')}</p>
      </section>

      {/* H2-2: 转换AVIF到PNG */}
      <section className="seo-section">
        <h2 className="seo-h2">{t('seo.h2_convert_png')}</h2>
        <p className="seo-text">{t('seo.png_text')}</p>
      </section>

      {/* H2-3: 为什么转换 */}
      <section className="seo-section">
        <h2 className="seo-h2">{t('seo.h2_why_convert')}</h2>
        <p className="seo-text">{t('seo.why_convert_text')}</p>
      </section>

      {/* H2-4: 如何转换 */}
      <section id="how-to-use" className="seo-section">
        <h2 className="seo-h2">{t('seo.h2_how_to_convert')}</h2>
        <p className="seo-text">{t('seo.how_to_text')}</p>

        {/* 3步骤流程 */}
        <div className="steps-container">
          <div className="step-item">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3 className="step-title">{t('seo.step_1')}</h3>
              <p className="step-desc">{t('seo.step_1_desc')}</p>
            </div>
          </div>

          <div className="step-item">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3 className="step-title">{t('seo.step_2')}</h3>
              <p className="step-desc">{t('seo.step_2_desc')}</p>
            </div>
          </div>

          <div className="step-item">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3 className="step-title">{t('seo.step_3')}</h3>
              <p className="step-desc">{t('seo.step_3_desc')}</p>
            </div>
          </div>
        </div>

        {/* 主要特点 */}
        <h3 className="features-subtitle">{t('seo.features_title')}</h3>
        <div className="features-grid">
          <div className="feature-item">
            <h4 className="feature-title">{t('seo.feature_batch_title')}</h4>
            <p className="feature-desc">{t('seo.feature_batch_desc')}</p>
          </div>

          <div className="feature-item">
            <h4 className="feature-title">{t('seo.feature_online_title')}</h4>
            <p className="feature-desc">{t('seo.feature_online_desc')}</p>
          </div>

          <div className="feature-item">
            <h4 className="feature-title">{t('seo.feature_free_title')}</h4>
            <p className="feature-desc">{t('seo.feature_free_desc')}</p>
          </div>

          <div className="feature-item">
            <h4 className="feature-title">{t('seo.feature_devices_title')}</h4>
            <p className="feature-desc">{t('seo.feature_devices_desc')}</p>
          </div>

          <div className="feature-item">
            <h4 className="feature-title">{t('seo.feature_speed_title')}</h4>
            <p className="feature-desc">{t('seo.feature_speed_desc')}</p>
          </div>

          <div className="feature-item">
            <h4 className="feature-title">{t('seo.feature_quality_title')}</h4>
            <p className="feature-desc">{t('seo.feature_quality_desc')}</p>
          </div>
        </div>
      </section>

      {/* H2-5: 优势 */}
      <section className="seo-section">
        <h2 className="seo-h2">{t('seo.h2_advantages')}</h2>
        <div className="advantages-list">
          <div className="advantage-item">
            <div className="advantage-icon">
              <img src="/icons/correction.svg" alt="✓" />
            </div>
            <p className="advantage-text">{t('seo.advantage_1')}</p>
          </div>

          <div className="advantage-item">
            <div className="advantage-icon">
              <img src="/icons/correction.svg" alt="✓" />
            </div>
            <p className="advantage-text">{t('seo.advantage_2')}</p>
          </div>

          <div className="advantage-item">
            <div className="advantage-icon">
              <img src="/icons/correction.svg" alt="✓" />
            </div>
            <p className="advantage-text">{t('seo.advantage_3')}</p>
          </div>

          <div className="advantage-item">
            <div className="advantage-icon">
              <img src="/icons/correction.svg" alt="✓" />
            </div>
            <p className="advantage-text">{t('seo.advantage_4')}</p>
          </div>

          <div className="advantage-item">
            <div className="advantage-icon">
              <img src="/icons/correction.svg" alt="✓" />
            </div>
            <p className="advantage-text">{t('seo.advantage_5')}</p>
          </div>

          <div className="advantage-item">
            <div className="advantage-icon">
              <img src="/icons/correction.svg" alt="✓" />
            </div>
            <p className="advantage-text">{t('seo.advantage_6')}</p>
          </div>
        </div>
      </section>

      {/* FAQ部分 */}
      <section id="faq" className="seo-faq">
        <h2 className="seo-h2">{t('faq.title')}</h2>
        
        <div className="faq-item">
          <h3 className="faq-question">{t('faq.q1')}</h3>
          <p className="faq-answer">{t('faq.a1')}</p>
        </div>

        <div className="faq-item">
          <h3 className="faq-question">{t('faq.q2')}</h3>
          <p className="faq-answer">{t('faq.a2')}</p>
        </div>

        <div className="faq-item">
          <h3 className="faq-question">{t('faq.q3')}</h3>
          <p className="faq-answer">{t('faq.a3')}</p>
        </div>

        <div className="faq-item">
          <h3 className="faq-question">{t('faq.q4')}</h3>
          <p className="faq-answer">{t('faq.a4')}</p>
        </div>

        <div className="faq-item">
          <h3 className="faq-question">{t('faq.q5')}</h3>
          <p className="faq-answer">{t('faq.a5')}</p>
        </div>

        <div className="faq-item">
          <h3 className="faq-question">{t('faq.q6')}</h3>
          <p className="faq-answer">{t('faq.a6')}</p>
        </div>

        <div className="faq-item">
          <h3 className="faq-question">{t('faq.q7')}</h3>
          <p className="faq-answer">{t('faq.a7')}</p>
        </div>
      </section>

      <section className="seo-section related-section">
        <h2 className="seo-h2">{t('related.title')}</h2>
        <p className="seo-text">{t('related.subtitle')}</p>
        <div className="related-grid">
          {relatedResources.map((item, index) => (
            <Link
              href={item.href}
              locale={currentLocale}
              className="related-card"
              key={`related-${index}`}
            >
              <h3 className="related-card__title">{item.title}</h3>
              <p className="related-card__desc">{item.desc}</p>
              <span className="related-card__cta">{item.cta}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
