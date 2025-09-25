import { useState, useEffect, useRef } from 'react';
import ImageManager from '../core/ImageManager.js';

// React适配器Hook - 将核心逻辑适配到React
export default function useUploadQueue() {
  const [items, setItems] = useState([]);
  const managerRef = useRef(null);

  // 初始化ImageManager
  useEffect(() => {
    const manager = new ImageManager();
    managerRef.current = manager;

    // 订阅数据变化
    const unsubscribe = manager.subscribe((event, data) => {
      switch (event) {
        case 'itemsAdded':
        case 'itemRemoved':
        case 'allCleared':
          // 同步更新React状态
          setItems(manager.getItems());
          break;
      }
    });

    // 清理函数
    return () => {
      unsubscribe();
      manager.destroy();
    };
  }, []);

  // 返回稳定的API
  return {
    items,
    addFiles: (files) => managerRef.current?.addFiles(files),
    removeItem: (id) => managerRef.current?.removeItem(id),
    clearAll: () => managerRef.current?.clearAll(),
    hasItems: items.length > 0
  };
}

