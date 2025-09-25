// 应用状态管理器 - 遵循单一职责原则
class AppState {
  constructor(initialState = {}) {
    this.state = {
      mode: 'jpg', // 默认模式
      currentView: 'upload', // 默认视图：'upload' | 'download'
      ...initialState
    };
    this.listeners = new Map(); // key -> Set<listener>
  }

  // 获取状态值
  get(key) {
    return this.state[key];
  }

  // 设置状态值 - 支持批量更新
  set(key, value) {
    if (typeof key === 'object') {
      // 批量更新：set({ mode: 'png', other: 'value' })
      this._batchUpdate(key);
    } else {
      // 单个更新：set('mode', 'png')
      this._singleUpdate(key, value);
    }
  }

  // 订阅状态变化
  subscribe(key, listener) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    
    this.listeners.get(key).add(listener);
    
    // 返回取消订阅函数
    return () => {
      const keyListeners = this.listeners.get(key);
      if (keyListeners) {
        keyListeners.delete(listener);
        if (keyListeners.size === 0) {
          this.listeners.delete(key);
        }
      }
    };
  }

  // 订阅所有状态变化
  subscribeAll(listener) {
    const unsubscribers = [];
    
    // 为当前所有状态键订阅
    Object.keys(this.state).forEach(key => {
      unsubscribers.push(this.subscribe(key, listener));
    });
    
    // 返回统一的取消订阅函数
    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }

  // 获取所有状态 - 只读副本
  getAll() {
    return { ...this.state };
  }

  // 重置状态
  reset(newState = {}) {
    const oldState = { ...this.state };
    this.state = {
      mode: 'jpg',
      currentView: 'upload',
      ...newState
    };
    
    // 通知所有相关监听器
    Object.keys({ ...oldState, ...this.state }).forEach(key => {
      if (oldState[key] !== this.state[key]) {
        this._notifyListeners(key, this.state[key], oldState[key]);
      }
    });
  }

  // 私有方法：单个更新
  _singleUpdate(key, value) {
    const oldValue = this.state[key];
    if (oldValue === value) return; // 值未变化，不触发更新
    
    this.state[key] = value;
    this._notifyListeners(key, value, oldValue);
  }

  // 私有方法：批量更新
  _batchUpdate(updates) {
    const changes = [];
    
    // 收集所有变化
    Object.entries(updates).forEach(([key, value]) => {
      const oldValue = this.state[key];
      if (oldValue !== value) {
        changes.push({ key, value, oldValue });
        this.state[key] = value;
      }
    });
    
    // 批量通知变化
    changes.forEach(({ key, value, oldValue }) => {
      this._notifyListeners(key, value, oldValue);
    });
  }

  // 私有方法：通知监听器
  _notifyListeners(key, newValue, oldValue) {
    const keyListeners = this.listeners.get(key);
    if (!keyListeners) return;
    
    keyListeners.forEach(listener => {
      try {
        listener(newValue, oldValue, key);
      } catch (error) {
        console.error(`AppState listener error for key "${key}":`, error);
      }
    });
  }

  // 销毁状态管理器
  destroy() {
    this.listeners.clear();
    this.state = {};
  }
}

export default AppState;
