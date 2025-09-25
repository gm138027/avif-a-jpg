import React from 'react';
import { useTranslation } from 'next-i18next';
import Button from './ButtonComponent';

// 功能切换组件 - 负责JPG/PNG切换
const FeatureSwitch = React.memo(function FeatureSwitch({
  mode,
  onModeChange
}) {
  const { t } = useTranslation('common');

  return (
    <div className="feature-switch">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onModeChange('jpg')}
        className={mode === 'jpg' ? 'feature-switch__btn--active' : ''}
        aria-pressed={mode === 'jpg'}
      >
        {t('ui.buttons.avif_to_jpg')}
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onModeChange('png')}
        className={mode === 'png' ? 'feature-switch__btn--active' : ''}
        aria-pressed={mode === 'png'}
      >
        {t('ui.buttons.avif_to_png')}
      </Button>
    </div>
  );
});

export default FeatureSwitch;
