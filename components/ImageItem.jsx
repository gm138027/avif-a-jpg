import React from 'react';
import { useTranslation } from 'next-i18next';
import Button from './ButtonComponent';

// 图片列表项组件 - 纯静态内容渲染，根据状态显示按钮
const ImageItem = React.memo(function ImageItem({
  imageId,
  imageUrl,
  imageName,
  imageSize,
  status = 'prepare', // 状态: 'prepare', 'processing', 'completed'
  onRemove,
  onDownload
}) {
  const { t } = useTranslation('common');
  // 格式化文件大小
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i)) + ' ' + sizes[i];
  };

  // 获取状态显示文本和样式（带降级处理）
  const getStatusConfig = (status) => {
    switch (status) {
      case 'processing':
        return { text: t('ui.status.processing'), className: 'status-indicator--processing' };
      case 'completed':
        return { text: t('ui.status.completed'), className: 'status-indicator--completed' };
      default:
        return { text: t('ui.status.prepare'), className: '' };
    }
  };

  const statusConfig = getStatusConfig(status);

  return (
    <div className="image-list-item">
      {/* 缩略图容器 */}
      <div className="image-list-item__thumbnail">
        <img
          src={imageUrl}
          alt={imageName}
          className="thumbnail"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* 文件信息 */}
      <div className="image-list-item__info">
        <div className="image-list-item__name">{imageName}</div>
        <div className="image-list-item__size">{formatSize(imageSize)}</div>
      </div>

      {/* 操作区域 */}
      <div className="image-list-item__actions">
        {/* 状态指示器 */}
        <span className={`status-indicator ${statusConfig.className}`}>
          {statusConfig.text}
        </span>

        {/* 操作按钮 - 根据转换状态条件渲染 */}
        {(status === 'prepare' || status === 'processing') && (
          <Button
            variant="delete"
            size="sm"
            onClick={() => onRemove && onRemove(imageId)}
            className="delete-btn"
            aria-label={t('ui.labels.delete_image')}
          >
            <img src="/icons/remove.svg" alt="" className="btn-icon btn-icon--remove" />
          </Button>
        )}

        {status === 'completed' && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onDownload && onDownload(imageId)}
            className="download-btn"
            aria-label={t('ui.labels.download_file')}
          >
            {t('ui.buttons.download')}
          </Button>
        )}
      </div>
    </div>
  );
});

export default ImageItem;
