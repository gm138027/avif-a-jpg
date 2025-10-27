import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

// 页面底部组件 - 简洁的信息结构
export default function Footer() {
  const { t } = useTranslation('common');
  const { locale } = useRouter();

  return (
    <footer className="footer">
      <div className="footer__container">
        {/* 快速链接 - 居中显示 */}
        <div className="footer__links">
          <Link href="/privacy" locale={locale} className="footer__link">
            {t('footer.privacy')}
          </Link>
          <Link href="/terms" locale={locale} className="footer__link">
            {t('footer.terms')}
          </Link>
          <Link href="/contact" locale={locale} className="footer__link">
            {t('footer.help')}
          </Link>
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

