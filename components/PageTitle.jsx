import { useTranslation } from 'next-i18next';

// 页面H1标题组件
export default function PageTitle() {
  const { t } = useTranslation('common');

  return (
    <div className="page-title-section">
      <h1 className="seo-h1">{t('seo.h1')}</h1>
    </div>
  );
}
