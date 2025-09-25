import { useTranslation } from 'next-i18next';

// 简化的面包屑导航组件
export default function Breadcrumb({ currentKey }) {
  const { t } = useTranslation('common');

  // 如果没有提供currentKey，不显示面包屑
  if (!currentKey) {
    return null;
  }

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <a href="/" className="breadcrumb__link">
        {t('breadcrumb.home')}
      </a>
      <span className="breadcrumb__separator" aria-hidden="true"> / </span>
      <span className="breadcrumb__current" aria-current="page">
        {t(`breadcrumb.${currentKey}`)}
      </span>
    </nav>
  );
}
