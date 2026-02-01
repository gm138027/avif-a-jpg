import { useTranslation } from 'next-i18next';
import Button from './ButtonComponent';
import NativeImageRenderer from './NativeImageRenderer';
import UploadArea from './UploadArea';

import DownloadActions from './DownloadActions';
import CardActions from './CardActions';
import useUploadQueue from '@/hooks/useUploadQueue';
import { useMode, useCurrentView } from '@/hooks/useAppState';
import useImageConversionSimple from '@/hooks/useImageConversionSimple';

// 简化的主容器组件 - 遵循KISS原则
// 职责：协调各个区域组件，管理整体状态
export default function MainContainerSimple() {
  const { t } = useTranslation('common');

  // 状态管理
  const [mode, setMode] = useMode();
  const [currentView, setCurrentView] = useCurrentView();
  const { items: images, addFiles, removeItem, clearAll } = useUploadQueue();

  // 转换功能
  const {
    convertBatch,
    isConverting,
    batchProgress,
    isPrepackaging,
    zipReady,
    downloadResult,
    downloadAll,
    getStats,
    tasks,
    resetAndSwitchToUpload
  } = useImageConversionSimple();

  // 转换处理函数 - 简化逻辑
  const handleConversion = async () => {
    if (images.length === 0) {
      console.warn(t('errors.no_images_to_convert'));
      return;
    }

    try {
      console.log(t('errors.conversion_starting', { format: mode.toUpperCase() }));

      // 立即跳转到下载页面
      setCurrentView('download');

      // 动态延迟：根据图片数量调整
      const delay = images.length > 5 ? 100 : images.length > 2 ? 75 : 50;
      await new Promise(resolve => setTimeout(resolve, delay));

      // 开始转换
      const results = await convertBatch(images, mode === 'jpg' ? 'jpeg' : 'png', 0.9, (progress) => {
        console.log(`Conversion progress: ${progress.progress.toFixed(1)}% (${progress.completed}/${progress.total})`);
      });

      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      console.log(`Conversion completed: ${successful} successful, ${failed} failed`);

    } catch (error) {
      console.error('Conversion failed:', error);
    }
  };

  // 下载处理函数
  const handleDownload = (imageId) => {
    downloadResult(imageId);
  };

  const handleDownloadAll = async () => {
    try {
      const format = mode === 'jpg' ? 'jpg' : 'png';
      const result = await downloadAll(format);
      console.log(`ZIP download completed: ${result.zipFilename}, ${result.successful} files`);
    } catch (error) {
      console.error('ZIP download failed:', error);
    }
  };

  const handleConvertMore = () => {
    clearAll();
    resetAndSwitchToUpload();
  };

  // 拖拽处理
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length) {
      addFiles(files);
    }
  };

  // 获取统计信息
  const stats = getStats();

  return (
    <div className="main-container">
      {/* 功能切换 - 只在上传页显示 */}
      {currentView === 'upload' && (
        <UploadArea
          mode={mode}
          onModeChange={setMode}
          images={images}
          onFileAdd={addFiles}
          isConverting={isConverting}
          batchProgress={batchProgress}
          onStartConversion={handleConversion}
        />
      )}

      {/* 统一卡片容器 - 上传和下载页面都使用统一样式 */}
      <div className="unified-card">
        {/* 顶部清除区域 - 只在有图片时显示 */}
        {images.length > 0 && (
          <div className="clear-list-header">
            <div className="download-stats">
              {currentView === 'download' && stats.total > 0 ? (
                t('ui.messages.files_completed', { completed: stats.completed, total: stats.total })
              ) : (
                '\xa0'
              )}
            </div>
            <button
              type="button"
              className="clear-list-btn"
              onClick={handleConvertMore}
              aria-label={t('ui.labels.clear_queue')}
            >
              <img src="/icons/x-mark.svg" alt="" className="btn-icon" />
              {t('ui.buttons.clear_list')}
            </button>
          </div>
        )}

        {/* 图片列表内容区域 */}
        <div className="unified-card-content">
          <div className="stage" onDragOver={handleDragOver} onDrop={handleDrop}>

            <NativeImageRenderer
              images={images}
              onImageRemove={removeItem}
              onImageDownload={handleDownload}
              onFileAdd={addFiles}
              conversionTasks={tasks}
            />
          </div>
        </div>

        {/* 操作按钮区域 */}
        {currentView === 'download' ? (
          <div className="unified-card-footer">
            <DownloadActions
              onConvertMore={handleConvertMore}
              onDownloadAll={handleDownloadAll}
              downloadDisabled={!stats.hasCompletedTasks && !isConverting}
              downloadCount={stats.total || images.length}
              isPrepackaging={isPrepackaging}
              zipReady={zipReady}
              isConverting={isConverting}
              conversionProgress={batchProgress}
            />
          </div>
        ) : (
          <CardActions>
            <Button
              variant="secondary"
              size="md"
              onClick={() => document.getElementById('file-input')?.click()}
              className="download-actions__convert-more"
            >
              <img src="/icons/file.svg" alt="" className="btn-icon btn-icon--file" />
              {t('ui.buttons.add_file')}
            </Button>
            <Button
              variant="primary"
              size="md"
              disabled={images.length === 0 || isConverting}
              onClick={handleConversion}
              className="download-actions__download-all"
              title={isConverting ? t('conversion.converting', 'Convirtiendo...') : t('conversion.start_conversion', 'Iniciar conversión')}
            >
              {isConverting ? (batchProgress ? `${batchProgress.progress.toFixed(0)}%` : t('conversion.converting', 'Convirtiendo...')) : (
                <>
                  {t('ui.buttons.conversion')}
                  <img src="/icons/next.svg" alt="" className="btn-icon btn-icon--right btn-icon--next" />
                </>
              )}
            </Button>
          </CardActions>
        )}
      </div>
    </div>
  );
}
