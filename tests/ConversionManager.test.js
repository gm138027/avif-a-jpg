import { describe, it, expect, beforeEach, vi } from 'vitest';
import ConversionManager from '@/core/ConversionManager.js';
import ImageConverter from '@/core/ImageConverter.js';
import DownloadService from '@/core/DownloadService.js';
import ErrorHandler from '@/core/ErrorHandler.js';
import { analytics } from '@/utils/analytics.js';

vi.mock('@/core/ImageConverter.js', () => ({
  default: {
    convertToFormat: vi.fn(),
    generateOutputFilename: vi.fn((name) => `${name}.out`),
    isAvifFile: vi.fn(() => true)
  }
}));

vi.mock('@/core/DownloadService.js', () => ({
  default: {
    generateZipFilename: vi.fn(() => 'mock.zip'),
    createZipBlob: vi.fn(async () => new Blob(['zip']))
  }
}));

vi.mock('@/utils/analytics.js', () => ({
  analytics: {
    trackConversionStart: vi.fn(),
    trackConversionComplete: vi.fn()
  }
}));

vi.stubGlobal('Blob', class {
  constructor(parts) {
    this.size = (parts?.[0]?.length) || 0;
  }
});

vi.stubGlobal('URL', {
  revokeObjectURL: vi.fn()
});

const createMockFile = (name = 'sample.avif', size = 100) => ({
  name,
  size,
  type: 'image/avif'
});

describe('ConversionManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('processes single conversion successfully and notifies listeners', async () => {
    const manager = new ConversionManager();
    const file = createMockFile();
    const mockBlob = new Blob(['data']);

    ImageConverter.convertToFormat.mockResolvedValue(mockBlob);
    const spy = vi.fn();
    manager.subscribe(spy);

    const result = await manager.startConversion('id1', file, 'jpeg');

    expect(result).toMatchObject({ blob: mockBlob, format: 'jpeg' });

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenNthCalledWith(1, 'taskStarted', expect.objectContaining({ id: 'id1', targetFormat: 'jpeg' }));
    expect(spy).toHaveBeenNthCalledWith(2, 'taskCompleted', expect.objectContaining({ id: 'id1', status: 'completed' }));

    expect(analytics.trackConversionStart).toHaveBeenCalledWith(1, 'jpeg');
    expect(analytics.trackConversionComplete).toHaveBeenCalledWith(1, 'jpeg', true);
  });

  it('marks conversion as failed when converter throws', async () => {
    const manager = new ConversionManager();
    const file = createMockFile();
    const error = new Error('fail');
    const spy = vi.fn();

    ImageConverter.convertToFormat.mockRejectedValue(error);
    manager.subscribe(spy);

    await expect(manager.startConversion('id2', file, 'jpeg')).rejects.toThrow('fail');
    expect(spy).toHaveBeenCalledWith('taskFailed', expect.objectContaining({ id: 'id2', status: 'failed', error: 'fail' }));
    expect(analytics.trackConversionComplete).toHaveBeenCalledWith(1, 'jpeg', false);
  });

  it('runs batch conversion and triggers prepackaging', async () => {
    const manager = new ConversionManager();
    const files = [createMockFile('a.avif'), createMockFile('b.avif')];
    const conversions = files.map((file, index) => ({ id: `img-${index}`, file }));
    const events = [];
    const mockBlob = new Blob(['data']);

    ImageConverter.convertToFormat.mockResolvedValue(mockBlob);

    manager.subscribe((event) => events.push(event));

    await manager.startBatchConversion(conversions, 'jpeg', 0.9);

    expect(events).toContain('batchStarted');
    expect(events).toContain('batchCompleted');
    expect(events).toContain('prepackagingStarted');
    expect(events).toContain('prepackagingCompleted');
    expect(DownloadService.createZipBlob).toHaveBeenCalled();
    const zip = manager.getPrepackagedZip();
    expect(zip).not.toBeNull();
    expect(zip.info.fileCount).toBe(2);
  });
});