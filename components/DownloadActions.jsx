import React from 'react';
import { useTranslation } from 'next-i18next';
import Button from './ButtonComponent';

// 下载操作卡片组件 - 遵循KISS原则
// 职责：提供"转换更多"和"全部下载"操作
const DownloadActions = React.memo(function DownloadActions({
  onConvertMore,
  onDownloadAll,
  downloadDisabled = false,
  downloadCount = 0,
  isPrepackaging = false, // 新增：是否正在预打包
  zipReady = false, // 新增：ZIP是否准备就绪
  isConverting = false, // 新增：是否正在转换
  conversionProgress = null // 新增：转换进度信息
}) {
  const { t } = useTranslation('common');
  // 计算按钮状态和文本
  const getDownloadButtonState = () => {
    if (downloadDisabled || downloadCount === 0) {
      return {
        disabled: true,
        text: t('ui.buttons.download_all'),
        title: t('ui.messages.no_files_to_download')
      };
    }

    if (isConverting || isPrepackaging) {
      // 转换或打包进行中，显示统一进度
      const progress = Math.round(conversionProgress?.progress || 0);
      const stage = conversionProgress?.stage;

      let title = '';
      if (stage === 'converting') {
        title = t('conversion.conversion_progress', {
          progress: progress,
          completed: conversionProgress.completed,
          total: conversionProgress.total
        });
      } else if (stage === 'packing') {
        title = t('ui.status.creating_zip');
      } else {
        title = t('ui.status.processing_general');
      }

      return {
        disabled: progress < 100,
        text: `${progress}%`,
        title: title
      };
    }

    if (zipReady) {
      // 全部完成，可以下载
      return {
        disabled: false,
        text: (
          <>
            {t('ui.buttons.download_all')}
            <img src="/icons/download.svg" alt="" className="btn-icon btn-icon--right btn-icon--download" />
          </>
        ),
        title: t('ui.messages.download_files_zip', { count: downloadCount })
      };
    }

    // 默认状态：准备开始转换（避免闪现）
    return {
      disabled: true,
      text: t('ui.status.preparing'),
      title: t('ui.messages.preparing_conversion')
    };
  };

  const buttonState = getDownloadButtonState();

  // 检查是否显示百分比
  const isShowingProgress = typeof buttonState.text === 'string' && buttonState.text.includes('%');

  return (
    <div className="download-actions">
      <Button
        variant="secondary"
        size="md"
        onClick={onConvertMore}
        className="download-actions__convert-more"
      >
        <img src="/icons/file.svg" alt="" className="btn-icon btn-icon--file" />
        {t('ui.buttons.convert_more')}
      </Button>

      <Button
        variant={buttonState.disabled ? "secondary" : "primary"}
        size="md"
        onClick={onDownloadAll}
        disabled={buttonState.disabled}
        className={`download-actions__download-all ${isShowingProgress ? 'download-actions__download-all--progress' : ''}`}
        title={buttonState.title}
      >
        {buttonState.text}
      </Button>
    </div>
  );
});

export default DownloadActions;
