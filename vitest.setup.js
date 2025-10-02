import { beforeAll } from 'vitest';

beforeAll(() => {
  if (!global.URL.createObjectURL) {
    global.URL.createObjectURL = () => 'mock-url://';
  }
  if (!global.URL.revokeObjectURL) {
    global.URL.revokeObjectURL = () => {};
  }
});