// 图片数据管理器 - 遵循单一职责原则
class ImageManager {
  constructor() {
    this.items = [];
    this.listeners = new Set();
    this.urlCache = new Map(); // id -> objectURL
  }

  // 添加文件 - KISS原则：简单直接
  addFiles(fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    const newItems = [];
    for (const file of files) {
      if (!this._isValidFile(file)) continue;
      
      const item = this._createImageItem(file);
      newItems.push(item);
      this.items.push(item);
    }

    if (newItems.length > 0) {
      this._notifyListeners('itemsAdded', newItems);
    }
  }

  // 删除图片 - 包含内存清理
  removeItem(id) {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return;

    const item = this.items[index];
    this.items.splice(index, 1);

    // 清理内存
    this._cleanupItem(item);
    this._notifyListeners('itemRemoved', { id, index });
  }

  // 清空所有图片
  clearAll() {
    const oldItems = [...this.items];
    this.items = [];

    // 立即通知UI更新，给用户即时反馈
    this._notifyListeners('allCleared', []);

    // 异步清理内存，避免阻塞UI
    setTimeout(() => {
      oldItems.forEach(item => this._cleanupItem(item));
    }, 0);
  }

  // 获取图片列表 - 只读访问
  getItems() {
    return [...this.items]; // 返回副本，防止外部修改
  }

  // 订阅数据变化
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener); // 返回取消订阅函数
  }

  // 私有方法：文件验证
  _isValidFile(file) {
    return file.type === 'image/avif' || 
           (file.name || '').toLowerCase().endsWith('.avif');
  }

  // 私有方法：创建图片项
  _createImageItem(file) {
    const id = this._generateId();
    const url = URL.createObjectURL(file);
    
    this.urlCache.set(id, url);
    
    return {
      id,
      file,
      name: file.name,
      size: file.size,
      url
    };
  }

  // 私有方法：清理资源
  _cleanupItem(item) {
    const url = this.urlCache.get(item.id);
    if (url) {
      URL.revokeObjectURL(url);
      this.urlCache.delete(item.id);
    }
  }

  // 私有方法：通知监听器
  _notifyListeners(event, data) {
    this.listeners.forEach(listener => {
      try {
        listener(event, data);
      } catch (error) {
        console.error('ImageManager listener error:', error);
      }
    });
  }

  // 私有方法：生成ID
  _generateId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'img_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  // 销毁管理器
  destroy() {
    this.clearAll();
    this.listeners.clear();
  }
}

export default ImageManager;
