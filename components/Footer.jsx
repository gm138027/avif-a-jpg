import React from 'react';
import { useTranslation } from 'next-i18next';

// 页面底部组件 - 简洁的信息结构
export default function Footer() {
  const { t } = useTranslation('common');

  return (
    <footer className="footer">
      <div className="footer__container">
        {/* 快速链接 - 居中显示 */}
        <div className="footer__links">
          <a href="/privacy" className="footer__link">
            {t('footer.privacy')}
          </a>
          <a href="/terms" className="footer__link">
            {t('footer.terms')}
          </a>
          <a href="/contact" className="footer__link">
            {t('footer.help')}
          </a>
        </div>

        {/* 版权信息 */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            {t('footer.copyright', {
              year: new Date().getFullYear(),
              siteName: t('site.name'),
              rights: t('footer.rights')
            })}
          </p>
        </div>
      </div>
    </footer>
  );
}
