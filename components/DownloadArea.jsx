import React from 'react';
import DownloadHeader from './DownloadHeader';
import DownloadActions from './DownloadActions';

// 下载区域组件 - 遵循单一职责原则
// 职责：显示下载页面的标题和操作
const DownloadArea = React.memo(function DownloadArea({
  stats,
  onConvertMore,
  onDownloadAll,
  downloadDisabled,
  downloadCount,
  isPrepackaging,
  zipReady,
  isConverting,
  conversionProgress
}) {
  return (
    <>
      {/* 下载页标题 */}
      <DownloadHeader
        completedCount={stats.completed}
        totalCount={stats.total}
      />

      {/* 下载操作区域 */}
      <DownloadActions
        onConvertMore={onConvertMore}
        onDownloadAll={onDownloadAll}
        downloadDisabled={downloadDisabled}
        downloadCount={downloadCount}
        isPrepackaging={isPrepackaging}
        zipReady={zipReady}
        isConverting={isConverting}
        conversionProgress={conversionProgress}
      />
    </>
  );
});

export default DownloadArea;
