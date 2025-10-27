import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

// 简化的面包屑导航组件
export default function Breadcrumb({ currentKey }) {
  const { t } = useTranslation('common');
  const { locale } = useRouter();

  if (!currentKey) {
    return null;
  }

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link href="/" locale={locale} className="breadcrumb__link">
        {t('breadcrumb.home')}
      </Link>
      <span className="breadcrumb__separator" aria-hidden="true">
        {' '}
/{' '}
      </span>
      <span className="breadcrumb__current" aria-current="page">
        {t(`breadcrumb.${currentKey}`)}
      </span>
    </nav>
  );
}

