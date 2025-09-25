import React, { useRef } from 'react';
import { useTranslation } from 'next-i18next';
import Button from './ButtonComponent';
import FeatureSwitch from './FeatureSwitch';

// 上传区域组件 - 遵循单一职责原则
// 职责：处理文件上传和格式选择
const UploadArea = React.memo(function UploadArea({
  mode,
  onModeChange,
  images,
  onFileAdd,
  isConverting,
  batchProgress,
  onStartConversion
}) {
  const { t } = useTranslation('common');
  const inputRef = useRef(null);

  // 文件选择处理
  const handleFileClick = () => inputRef.current?.click();

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length) {
      onFileAdd(files);
      e.target.value = '';
    }
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
      onFileAdd(files);
    }
  };

  return (
    <>
      {/* 功能切换 */}
      <FeatureSwitch
        mode={mode}
        onModeChange={onModeChange}
      />

      {/* 拖拽区域 - 传递拖拽事件给父组件 */}
      <div className="upload-controls" onDragOver={handleDragOver} onDrop={handleDrop}>
        {/* 清空按钮已移至MainContainer的stage区域 */}
      </div>

      {/* 隐藏的文件输入框 - 供底部按钮调用 */}
      <input
        ref={inputRef}
        type="file"
        accept="image/avif"
        multiple
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="file-input"
      />
    </>
  );
});

export default UploadArea;
