import { useState, useEffect, useRef } from 'react';
import AppState from '../core/AppState.js';

// 全局应用状态实例 - 改进的单例模式，支持测试
let globalAppState = null;

function getGlobalAppState() {
  if (!globalAppState) {
    globalAppState = new AppState();
  }
  return globalAppState;
}

// 测试友好：允许重置全局状态
export function resetGlobalAppState() {
  if (globalAppState) {
    globalAppState.destroy();
    globalAppState = null;
  }
}

// 测试友好：允许注入自定义状态实例
export function setGlobalAppState(customState) {
  if (globalAppState) {
    globalAppState.destroy();
  }
  globalAppState = customState;
}

// React适配器Hook - 将AppState适配到React
export default function useAppState(key = null) {
  const appState = getGlobalAppState();
  const [value, setValue] = useState(() => 
    key ? appState.get(key) : appState.getAll()
  );

  useEffect(() => {
    if (key) {
      // 订阅单个状态
      const unsubscribe = appState.subscribe(key, (newValue) => {
        setValue(newValue);
      });
      return unsubscribe;
    } else {
      // 订阅所有状态
      const unsubscribe = appState.subscribeAll(() => {
        setValue(appState.getAll());
      });
      return unsubscribe;
    }
  }, [key, appState]);

  // 返回值和设置函数
  if (key) {
    return [value, (newValue) => appState.set(key, newValue)];
  } else {
    return [value, (updates) => appState.set(updates)];
  }
}

// 便捷Hook：获取模式状态
export function useMode() {
  return useAppState('mode');
}

// 便捷Hook：获取视图状态
export function useCurrentView() {
  return useAppState('currentView');
}

// 便捷Hook：批量状态管理
export function useBatchState() {
  const [state, setState] = useAppState();
  return { state, setState };
}
