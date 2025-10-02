import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import DownloadService from '@/core/DownloadService.js';
import { analytics } from '@/utils/analytics.js';
import ErrorHandler from '@/core/ErrorHandler.js';

vi.mock('jszip', () => {
  return {
    default: class MockZip {
      constructor() {
        this.entries = [];
      }
      file(name, blob) {
        this.entries.push({ name, blob });
      }
      async generateAsync() {
        return new Blob(['zip']);
      }
    }
  };
});

vi.mock('@/utils/analytics.js', () => ({
  analytics: {
    trackDownload: vi.fn()
  }
}));

describe('DownloadService', () => {
  let createObjectURLSpy;
  let revokeObjectURLSpy;
  let originalCreateElement;

  beforeEach(() => {
    vi.useFakeTimers();
    originalCreateElement = document.createElement.bind(document);

    createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock');
    revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    document.createElement = originalCreateElement;
  });

  it('downloads single file and schedules cleanup', () => {
    const blob = new Blob(['data']);
    const clickSpy = vi.fn();

    document.createElement = vi.fn((tag) => {
      const element = originalCreateElement(tag);
      if (tag === 'a') {
        element.click = clickSpy;
      }
      return element;
    });

    DownloadService.downloadFile(blob, 'file.jpg');

    expect(createObjectURLSpy).toHaveBeenCalledWith(blob);
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(clickSpy).toHaveBeenCalled();
    expect(analytics.trackDownload).toHaveBeenCalledWith('single', 1);

    vi.runAllTimers();
    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock');
  });

  it('throws error when blob is invalid', () => {
    expect(() => DownloadService.downloadFile(null, 'file.jpg')).toThrow('Invalid blob object');
  });

  it('downloads batch results using downloadFile per item', async () => {
    const downloadSpy = vi.spyOn(DownloadService, 'downloadFile').mockImplementation(() => {});

    const results = [
      { success: true, result: { blob: new Blob(['a']), filename: 'a.jpg' } },
      { success: true, result: { blob: new Blob(['b']), filename: 'b.jpg' } }
    ];

    const promise = DownloadService.downloadBatch(results, 10);
    await vi.runAllTimersAsync();
    const response = await promise;

    expect(downloadSpy).toHaveBeenCalledTimes(2);
    expect(response).toEqual({ attempted: 2, successful: 2 });
  });

  it('creates zip download and tracks analytics', async () => {
    const results = [
      { success: true, result: { blob: new Blob(['a']), filename: 'a.jpg' } }
    ];

    const downloadSpy = vi.spyOn(DownloadService, 'downloadFile').mockImplementation(() => {});

    const response = await DownloadService.downloadAsZip(results, 'bundle.zip');

    expect(downloadSpy).toHaveBeenCalledWith(expect.any(Blob), 'bundle.zip');
    expect(analytics.trackDownload).toHaveBeenCalledWith('zip', 1);
    expect(response).toMatchObject({ attempted: 1, successful: 1, zipFilename: 'bundle.zip' });
  });

  it('validates download environment and collects warnings', () => {
    const warning = [{ key: 'test' }];
    const warningSpy = vi.spyOn(ErrorHandler, 'createWarnings').mockReturnValue(warning);

    const result = DownloadService.validateDownloadEnvironment();

    expect(result.supported).toBe(true);
    expect(result.warnings).toBe(warning);
    expect(warningSpy).toHaveBeenCalled();
  });
});