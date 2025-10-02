import { describe, it, expect, vi } from 'vitest';
import AppState from '@/core/AppState.js';

describe('AppState', () => {
  it('provides default values for mode and currentView', () => {
    const state = new AppState();
    expect(state.get('mode')).toBe('jpg');
    expect(state.get('currentView')).toBe('upload');
  });

  it('updates single key and notifies listeners', () => {
    const state = new AppState();
    const listener = vi.fn();

    state.subscribe('mode', listener);
    state.set('mode', 'png');

    expect(state.get('mode')).toBe('png');
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith('png', 'jpg', 'mode');
  });

  it('supports batch updates via object payload', () => {
    const state = new AppState();
    const modeListener = vi.fn();
    const viewListener = vi.fn();

    state.subscribe('mode', modeListener);
    state.subscribe('currentView', viewListener);

    state.set({ mode: 'png', currentView: 'download' });

    expect(state.get('mode')).toBe('png');
    expect(state.get('currentView')).toBe('download');
    expect(modeListener).toHaveBeenCalledWith('png', 'jpg', 'mode');
    expect(viewListener).toHaveBeenCalledWith('download', 'upload', 'currentView');
  });

  it('resets state back to defaults and notifies listeners when values change', () => {
    const state = new AppState();
    state.set('mode', 'png');
    const listener = vi.fn();

    state.subscribe('mode', listener);
    state.reset();

    expect(state.get('mode')).toBe('jpg');
    expect(state.get('currentView')).toBe('upload');
    expect(listener).toHaveBeenCalledWith('jpg', 'png', 'mode');
  });
});