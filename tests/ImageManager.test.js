import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import ImageManager from '@/core/ImageManager.js';

describe('ImageManager', () => {
  beforeEach(() => {
    vi.spyOn(global.URL, 'createObjectURL').mockImplementation((file) => `blob:${file.name}`);
    vi.spyOn(global.URL, 'revokeObjectURL').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('adds only valid AVIF files to the queue', () => {
    const manager = new ImageManager();

    const files = [
      { name: 'valid.avif', type: 'image/avif', size: 100 },
      { name: 'invalid.txt', type: 'text/plain', size: 50 }
    ];

    manager.addFiles(files);

    const items = manager.getItems();
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ name: 'valid.avif', size: 100 });
  });

  it('removes an item and releases its object URL', () => {
    const manager = new ImageManager();
    const file = { name: 'photo.avif', type: 'image/avif', size: 200 };

    manager.addFiles([file]);
    const [item] = manager.getItems();

    manager.removeItem(item.id);

    expect(manager.getItems()).toHaveLength(0);
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:photo.avif');
  });

  it('clears all items and eventually revokes each object URL', () => {
    vi.useFakeTimers();

    const manager = new ImageManager();
    const files = [
      { name: 'a.avif', type: 'image/avif', size: 10 },
      { name: 'b.avif', type: 'image/avif', size: 20 }
    ];

    manager.addFiles(files);
    manager.clearAll();

    expect(manager.getItems()).toHaveLength(0);

    vi.runAllTimers();
    expect(global.URL.revokeObjectURL).toHaveBeenCalledTimes(2);
  });
});