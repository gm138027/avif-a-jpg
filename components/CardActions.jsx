import React from 'react';
import { useTranslation } from 'next-i18next';

// 统一的按钮卡片组件 - 提供底部按钮区域的UI容器
// 职责：复用下载页面的按钮卡片样式，只是按钮内容不同
const CardActions = React.memo(function CardActions({ children }) {
  const { t } = useTranslation('common');

  return (
    <div className="unified-card-footer">
      <div className="download-actions">
        {children}
      </div>
    </div>
  );
});

export default CardActions;
