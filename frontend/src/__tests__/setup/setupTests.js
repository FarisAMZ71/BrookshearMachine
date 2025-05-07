// setupTests.js
import '@testing-library/jest-dom';

// Create mock for axios
jest.mock('axios', () => {
  const mockAxios = {
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
    create: jest.fn(function() { return mockAxios; }),
    defaults: {
      adapter: jest.fn()
    }
  };
  return mockAxios;
});

// Mock fetch globally for tests
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
  })
);

// Add a placeholder test to satisfy Jest requirements
describe('Setup Tests', () => {
  test('Placeholder test to satisfy Jest requirements', () => {
    expect(true).toBe(true);
  });
});