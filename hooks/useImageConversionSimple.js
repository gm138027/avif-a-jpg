// 简化的图片转换Hook - 组合多个专门的Hook
// 职责：提供统一的转换和下载接口，保持向后兼容

import { useCallback } from 'react';
import useConversionState from './useConversionState.js';
import useDownloadManager from './useDownloadManager.js';
import { useCurrentView } from './useAppState.js';

export default function useImageConversionSimple() {
  const [currentView, setCurrentView] = useCurrentView();
  
  // 转换状态管理
  const {
    tasks,
    isConverting,
    batchProgress,
    isPrepackaging,
    zipReady,
    convertImage,
    convertBatch,
    getImageStatus,
    clearTasks,
    clearAllTasks,
    resetState,
    getStats,
    _manager
  } = useConversionState();

  // 下载管理
  const {
    downloadResult,
    downloadAll,
    downloadBatch,
    getDownloadStats,
    checkDownloadEnvironment
  } = useDownloadManager(_manager, tasks, zipReady);

  // 视图操作
  const switchToUpload = useCallback(() => {
    setCurrentView('upload');
  }, [setCurrentView]);

  const switchToDownload = useCallback(() => {
    setCurrentView('download');
  }, [setCurrentView]);

  const resetAndSwitchToUpload = useCallback(() => {
    resetState();
    setCurrentView('upload');
  }, [resetState, setCurrentView]);

  // 检查转换环境
  const checkEnvironment = useCallback(() => {
    return {
      conversion: {
        supported: true, // ImageConverter.isSupported() 在组件中调用
        formats: ['jpeg', 'png']
      },
      download: checkDownloadEnvironment()
    };
  }, [checkDownloadEnvironment]);

  return {
    // 状态
    tasks,
    isConverting,
    batchProgress,
    isPrepackaging,
    zipReady,
    currentView,

    // 核心操作
    convertImage,
    convertBatch,
    downloadResult,
    downloadAll,
    downloadBatch,

    // 管理操作
    clearTasks,
    clearAllTasks,
    getImageStatus,

    // 视图操作
    switchToUpload,
    switchToDownload,
    resetAndSwitchToUpload,

    // 统计和信息
    getStats,
    getDownloadStats,
    checkEnvironment,

    // 便捷属性（保持向后兼容）
    totalTasks: tasks.size,
    completedTasks: Array.from(tasks.values()).filter(t => t.status === 'completed').length,
    failedTasks: Array.from(tasks.values()).filter(t => t.status === 'failed').length,
    hasCompletedTasks: Array.from(tasks.values()).some(t => t.status === 'completed'),
    canDownload: Array.from(tasks.values()).some(t => t.status === 'completed')
  };
}
