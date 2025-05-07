// axiosMock.js - Mock implementation for axios in tests
const axiosMock = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(),
  create: jest.fn(() => axiosMock),
  defaults: {
    baseURL: '',
    headers: {
      common: {},
      get: {},
      post: {},
    },
  },
  interceptors: {
    request: {
      use: jest.fn(),
      eject: jest.fn(),
    },
    response: {
      use: jest.fn(),
      eject: jest.fn(),
    },
  },
  // Helper method to reset all mocks
  reset: function() {
    this.get.mockReset();
    this.post.mockReset();
    this.put.mockReset();
    this.delete.mockReset();
    this.patch.mockReset();
  },
};

export default axiosMock;

// This file is just a placeholder to avoid Jest errors
// The real implementation is in src/mocks/axiosMock.js

describe('Mock file', () => {
  test('This is a placeholder test to satisfy Jest requirements', () => {
    expect(true).toBe(true);
  });
});