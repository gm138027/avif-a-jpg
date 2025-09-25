// 转换状态管理Hook - 遵循单一职责原则
// 职责：管理图片转换的状态和进度

import { useState, useEffect, useRef, useCallback } from 'react';
import ConversionManager from '../core/ConversionManager.js';

export default function useConversionState() {
  const [tasks, setTasks] = useState(new Map());
  const [isConverting, setIsConverting] = useState(false);
  const [batchProgress, setBatchProgress] = useState(null);
  const [isPrepackaging, setIsPrepackaging] = useState(false);
  const [zipReady, setZipReady] = useState(false);
  const managerRef = useRef(null);

  // 初始化转换管理器
  useEffect(() => {
    const manager = new ConversionManager();
    managerRef.current = manager;

    // 订阅状态变化
    const unsubscribe = manager.subscribe((event, data) => {
      switch (event) {
        case 'taskStarted':
        case 'taskCompleted':
        case 'taskFailed':
          setTasks(manager.getAllTasks());
          break;
          
        case 'batchStarted':
          setIsConverting(true);
          setBatchProgress({ completed: 0, total: data.total, progress: 0, stage: 'converting' });
          break;

        case 'batchCompleted':
          setIsConverting(false);
          setBatchProgress(prev => ({
            ...prev,
            stage: 'converting_completed'
          }));
          break;

        case 'prepackagingStarted':
          setIsPrepackaging(true);
          setZipReady(false);
          setBatchProgress(prev => ({
            ...prev,
            stage: 'packing'
          }));
          break;

        case 'prepackagingProgress':
          setBatchProgress(prev => ({
            ...prev,
            progress: data.progress,
            stage: data.stage
          }));
          break;

        case 'prepackagingCompleted':
          setIsPrepackaging(false);
          setZipReady(true);
          setBatchProgress(prev => ({
            ...prev,
            progress: 100,
            stage: 'completed'
          }));
          break;

        case 'prepackagingFailed':
          setIsPrepackaging(false);
          setZipReady(false);
          break;
          
        case 'tasksCleared':
        case 'allTasksCleared':
          setTasks(new Map());
          break;
      }
    });

    return () => {
      unsubscribe();
      manager.destroy();
    };
  }, []);

  // 转换单个图片
  const convertImage = useCallback(async (imageId, file, targetFormat, quality = 0.9) => {
    if (!managerRef.current) {
      throw new Error('Conversion manager not initialized');
    }

    try {
      setIsConverting(true);
      const result = await managerRef.current.startConversion(imageId, file, targetFormat, quality);
      return result;
    } catch (error) {
      console.error('Image conversion failed:', error);
      throw error;
    } finally {
      setIsConverting(false);
    }
  }, []);

  // 批量转换
  const convertBatch = useCallback(async (images, targetFormat, quality = 0.9, onProgress) => {
    if (!managerRef.current) {
      throw new Error('Conversion manager not initialized');
    }

    if (!Array.isArray(images) || images.length === 0) {
      throw new Error('Invalid images array');
    }

    try {
      const results = await managerRef.current.startBatchConversion(
        images,
        targetFormat,
        quality,
        (progress) => {
          setBatchProgress({
            completed: progress.completed,
            total: progress.total,
            progress: progress.progress,
            current: progress.current,
            stage: progress.stage
          });

          if (onProgress) {
            onProgress(progress);
          }
        }
      );

      return results;
    } catch (error) {
      console.error('Batch conversion failed:', error);
      throw error;
    }
  }, []);

  // 获取图片的转换状态
  const getImageStatus = useCallback((imageId) => {
    return tasks.get(imageId) || null;
  }, [tasks]);

  // 获取统计信息
  const getStats = useCallback(() => {
    const taskArray = Array.from(tasks.values());
    
    return {
      total: taskArray.length,
      processing: taskArray.filter(t => t.status === 'processing').length,
      completed: taskArray.filter(t => t.status === 'completed').length,
      failed: taskArray.filter(t => t.status === 'failed').length,
      hasCompletedTasks: taskArray.some(t => t.status === 'completed')
    };
  }, [tasks]);

  // 清理任务
  const clearTasks = useCallback(() => {
    if (managerRef.current) {
      managerRef.current.clearCompletedTasks();
    }
  }, []);

  const clearAllTasks = useCallback(() => {
    if (managerRef.current) {
      managerRef.current.clearAllTasks();
    }
  }, []);

  // 重置状态
  const resetState = useCallback(() => {
    if (managerRef.current) {
      managerRef.current.clearAllTasks();
    }
    setIsPrepackaging(false);
    setZipReady(false);
    setBatchProgress(null);
    setIsConverting(false);
  }, []);

  return {
    // 状态
    tasks,
    isConverting,
    batchProgress,
    isPrepackaging,
    zipReady,

    // 操作
    convertImage,
    convertBatch,
    getImageStatus,
    clearTasks,
    clearAllTasks,
    resetState,

    // 统计
    getStats,

    // 内部管理器引用（供其他Hook使用）
    _manager: managerRef.current
  };
}
