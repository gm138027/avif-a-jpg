import React from 'react';
import { useTranslation } from 'next-i18next';

// 按钮组件 - 负责所有按钮的渲染
const Button = React.memo(function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  onClick,
  className = '',
  ...props
}) {
  const { t } = useTranslation('common');
  const baseClass = `btn btn-${variant} btn-${size}`;
  const disabledClass = disabled ? ' btn-disabled' : '';
  const finalClassName = `${baseClass}${disabledClass} ${className}`;

  return (
    <button
      type="button"
      disabled={disabled}
      className={finalClassName}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;
