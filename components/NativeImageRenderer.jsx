import React from 'react';
import { useTranslation } from 'next-i18next';
import ImageItem from './ImageItem';

// 图片列表渲染器 - 虚拟滚动卷帘门
function NativeImageRenderer({
  images = [],
  onImageRemove,
  onImageDownload,
  onFileAdd,
  conversionTasks = new Map() // 转换任务状态，用于确定图片状态
}) {
  const { t } = useTranslation('common');
  // 状态：控制是否展开显示所有图片
  const [showAll, setShowAll] = React.useState(false);
  // 容器引用，用于控制滚动
  const containerRef = React.useRef(null);
  // 动画引用，用于取消进行中的动画
  const animationRef = React.useRef(null);
  // 文件输入引用
  const fileInputRef = React.useRef(null);
  const preloadedRef = React.useRef(new Set());

  // 动态高度计算
  const stageStyle = React.useMemo(() => {
    const count = images.length;

    if (count === 0) {
      // 空状态：保持设计的初始高度240px
      return { '--stage-height': '240px', '--list-height': '240px', '--show-scroll': 'none' };
    } else if (count <= 5) {
      const height = 30 + (count * 71);
      return { '--stage-height': `${height}px`, '--list-height': `${height - 30}px`, '--show-scroll': 'none' };
    } else {
      return { '--stage-height': '395px', '--list-height': '360px', '--show-scroll': 'flex' };
    }
  }, [images.length]);

  React.useEffect(() => {
    const preloaded = preloadedRef.current;
    const eagerCount = Math.min(images.length, 5);

    for (let i = 0; i < eagerCount; i += 1) {
      const image = images[i];
      if (!image || preloaded.has(image.id) || !image.url) {
        continue;
      }

      preloaded.add(image.id);

      const eagerImg = new Image();
      eagerImg.src = image.url;
      if (typeof eagerImg.decode === 'function') {
        eagerImg.decode().catch(() => {});
      }
    }

    const remaining = images.slice(eagerCount);
    if (remaining.length === 0) {
      return;
    }

    const chunkSize = 4;
    let index = 0;

    const schedule = (fn) => {
      if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(fn);
      } else {
        setTimeout(fn, 100);
      }
    };

    const loadChunk = () => {
      const nextChunk = remaining.slice(index, index + chunkSize);
      if (nextChunk.length === 0) {
        return;
      }

      nextChunk.forEach((image) => {
        if (!image || preloaded.has(image.id) || !image.url) {
          return;
        }

        preloaded.add(image.id);

        const img = new Image();
        img.src = image.url;
        if (typeof img.decode === 'function') {
          img.decode().catch(() => {});
        }
      });

      index += chunkSize;

      if (index < remaining.length) {
        schedule(loadChunk);
      }
    };

    schedule(loadChunk);
  }, [images]);

  React.useEffect(() => {
    return () => {
      preloadedRef.current.clear();
    };
  }, []);

  // 文件选择处理
  const handleFileSelect = React.useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = React.useCallback((e) => {
    const files = e.target.files;
    if (files && files.length && onFileAdd) {
      onFileAdd(files);
    }
    // 清空input值，允许重复选择同一文件
    e.target.value = '';
  }, [onFileAdd]);

  // 切换显示状态 - 使用精确的平滑滚动动画
  const toggleShowAll = React.useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    // 取消正在进行的动画
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const newShowAll = !showAll;
    setShowAll(newShowAll);

    // 使用 requestAnimationFrame 确保状态更新后再执行动画
    requestAnimationFrame(() => {
      // 动态计算实际的图片项高度，而不是使用固定值
      const firstItem = container.querySelector('.image-list-item');
      const itemHeight = firstItem ? firstItem.offsetHeight + 6 : 70; // 6px是margin-bottom
      const containerHeight = 360; // 图片列表容器高度（360px，包含安全边距）

      // 计算精确的目标滚动位置
      let targetScrollTop = 0;
      if (newShowAll) {
        // 展开：滚动到刚好显示第6张图片的位置
        const totalContentHeight = images.length * itemHeight;
        const maxScrollTop = Math.max(0, totalContentHeight - containerHeight);
        // 滚动到显示第6张图片开始的位置，但不超过最大滚动距离
        targetScrollTop = Math.min(5 * itemHeight, maxScrollTop);
      }

      // 使用自定义动画替代浏览器默认的 scroll-behavior
      const startScrollTop = container.scrollTop;
      const scrollDistance = targetScrollTop - startScrollTop;

      // 如果滚动距离很小，直接设置，避免不必要的动画
      if (Math.abs(scrollDistance) < 5) {
        container.scrollTop = targetScrollTop;
        return;
      }

      const duration = Math.min(500, Math.max(200, Math.abs(scrollDistance) * 2)); // 动态持续时间
      const startTime = performance.now();

      // 使用更自然的缓动函数
      const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

      const animateScroll = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // 应用缓动函数
        const easedProgress = easeOutQuart(progress);
        const currentScrollTop = startScrollTop + (scrollDistance * easedProgress);

        container.scrollTop = currentScrollTop;

        // 继续动画直到完成
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animateScroll);
        } else {
          animationRef.current = null;
        }
      };

      // 启动动画
      animationRef.current = requestAnimationFrame(animateScroll);
    });
  }, [showAll, images.length]);

  // 优化删除函数，避免每次创建新函数
  const handleRemove = React.useCallback((imageId) => {
    onImageRemove(imageId);
  }, [onImageRemove]);

  // 清理函数：组件卸载时取消动画
  React.useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // 如果没有图片，显示空状态
  if (images.length === 0) {
    return (
      <div className="stage__content" style={stageStyle}>
        <div className="stage__empty-state">
          <button
            type="button"
            className="btn btn-primary btn-md"
            onClick={handleFileSelect}
          >
            <img src="/icons/folder.svg" alt="" className="btn-icon btn-icon--folder" />
            {t('ui.buttons.select_file')}
          </button>
          <p>{t('ui.messages.click_to_upload')}</p>
          <p className="stage__empty-subtext">{t('ui.messages.only_avif')}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".avif"
            multiple
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    );
  }

  // 显示所有图片（最多20张）
  const visibleImages = images.slice(0, 20);

  return (
    <div className="stage__content" style={stageStyle}>
      {/* 图片列表区域 - 纯净的350px内容区域 */}
      <div
        ref={containerRef}
        className="image-list image-list--scroll"
      >
        {visibleImages.map((image, index) => {
          // 根据转换任务状态确定显示状态
          const task = conversionTasks.get(image.id);
          let displayStatus = 'prepare';

          if (task) {
            if (task.status === 'processing') {
              displayStatus = 'processing';
            } else if (task.status === 'completed') {
              displayStatus = 'completed';
            } else if (task.status === 'failed') {
              displayStatus = 'prepare'; // 失败时回到准备状态
            }
          }

          return (
            <ImageItem
              key={image.id}
              imageId={image.id}
              imageUrl={image.url}
              imageName={image.name}
              imageSize={image.size}
              status={displayStatus}
              priority={index < 5}
              onRemove={handleRemove}
              onDownload={onImageDownload}
            />
          );
        })}
      </div>

      {/* 滚动控制区域 - 独立的60px按钮区域 */}
      {images.length > 5 && (
        <div className="scroll-control-area">
          <button
            type="button"
            className="icon-toggle-btn"
            onClick={toggleShowAll}
            aria-label={showAll ? t('ui.labels.collapse_list') : t('ui.labels.expand_list')}
          >
            <div className="icon-toggle-container">
              <img
                src="/icons/down-chevron.svg"
                alt=""
                className={`chevron-icon ${showAll ? 'chevron-icon--up' : ''}`}
              />
              <span className="bubble-count">
                {images.length}
              </span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

export default NativeImageRenderer;
