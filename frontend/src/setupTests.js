// src/setupTests.js
import '@testing-library/jest-dom';

// Mock axios
jest.mock('axios', () => {
  return {
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
    create: jest.fn().mockReturnThis(),
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
  };
});

// Mock fetch globally
global.fetch = jest.fn();

// Helper to mock fetch responses
global.mockFetchResponse = (body) => {
  global.fetch.mockImplementationOnce(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(body)
    })
  );
};

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});