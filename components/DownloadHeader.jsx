import React from 'react';
import { useTranslation } from 'next-i18next';

// 下载页标题组件 - 遵循单一职责原则
// 职责：显示转换结果的统计信息
const DownloadHeader = React.memo(function DownloadHeader({
  completedCount = 0,
  totalCount = 0
}) {
  const { t } = useTranslation('common');
  return (
    <div className="download-header">
      <h2 className="download-header__title">
        {t('ui.headers.conversion_result')}
      </h2>
      <p className="download-header__stats">
        {t('ui.messages.files_completed', { completed: completedCount, total: totalCount })}
      </p>
    </div>
  );
});

export default DownloadHeader;
