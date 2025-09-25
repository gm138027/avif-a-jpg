// 下载管理Hook - 遵循单一职责原则
// 职责：管理文件下载功能

import { useCallback } from 'react';
import DownloadService from '../core/DownloadService.js';

export default function useDownloadManager(conversionManager, tasks, zipReady) {
  // 下载单个转换结果
  const downloadResult = useCallback((imageId) => {
    const task = tasks.get(imageId);
    
    if (!task) {
      console.warn(`Task not found for image ID: ${imageId}`);
      return false;
    }

    if (task.status !== 'completed' || !task.result) {
      console.warn(`Task not completed or no result available for image ID: ${imageId}`);
      return false;
    }

    try {
      DownloadService.downloadFile(task.result.blob, task.result.filename);
      return true;
    } catch (error) {
      console.error('Download failed:', error);
      return false;
    }
  }, [tasks]);

  // 批量下载所有完成的转换（优先使用预打包的ZIP）
  const downloadAll = useCallback(async (format = 'jpg') => {
    if (!conversionManager) {
      throw new Error('Conversion manager not available');
    }

    try {
      // 优先使用预打包的ZIP（0延迟）
      const prepackagedZip = conversionManager.getPrepackagedZip();

      if (prepackagedZip && zipReady) {
        // 使用预打包的ZIP，0延迟下载
        DownloadService.downloadFile(prepackagedZip.blob, prepackagedZip.info.filename);

        console.log(`预打包ZIP下载完成: ${prepackagedZip.info.filename} (${prepackagedZip.info.size} bytes)`);

        return {
          attempted: prepackagedZip.info.fileCount,
          successful: prepackagedZip.info.fileCount,
          zipSize: prepackagedZip.info.size,
          zipFilename: prepackagedZip.info.filename,
          prepackaged: true
        };
      }

      // 降级方案：实时打包（有延迟）
      console.warn('预打包ZIP不可用，使用实时打包');

      const completedTasks = Array.from(tasks.values())
        .filter(task => task.status === 'completed' && task.result)
        .map(task => ({ success: true, result: task.result }));

      if (completedTasks.length === 0) {
        console.warn('No completed conversions to download');
        return { attempted: 0, successful: 0 };
      }

      // 生成ZIP文件名
      const zipFilename = DownloadService.generateZipFilename(completedTasks.length, format);

      // 使用实时ZIP打包下载
      const result = await DownloadService.downloadAsZip(completedTasks, zipFilename);

      console.log(`实时ZIP下载完成: ${result.zipFilename} (${result.zipSize} bytes)`);
      return { ...result, prepackaged: false };

    } catch (error) {
      console.error('ZIP download failed:', error);
      throw error;
    }
  }, [conversionManager, tasks, zipReady]);

  // 逐个下载（备用方法）
  const downloadBatch = useCallback(async () => {
    const completedTasks = Array.from(tasks.values())
      .filter(task => task.status === 'completed' && task.result)
      .map(task => ({ success: true, result: task.result }));

    if (completedTasks.length === 0) {
      console.warn('No completed conversions to download');
      return { attempted: 0, successful: 0 };
    }

    try {
      const result = await DownloadService.downloadBatch(completedTasks);
      return result;
    } catch (error) {
      console.error('Batch download failed:', error);
      throw error;
    }
  }, [tasks]);

  // 获取下载统计
  const getDownloadStats = useCallback(() => {
    const completedTasks = Array.from(tasks.values())
      .filter(task => task.status === 'completed')
      .map(task => ({ success: true, result: task.result }));

    return DownloadService.getDownloadStats(completedTasks);
  }, [tasks]);

  // 检查下载环境
  const checkDownloadEnvironment = useCallback(() => {
    return DownloadService.validateDownloadEnvironment();
  }, []);

  return {
    // 核心下载操作
    downloadResult,
    downloadAll,
    downloadBatch,

    // 统计和检查
    getDownloadStats,
    checkDownloadEnvironment
  };
}
