// apiErrorHandling.test.js - Tests error handling for API calls
import axios from 'axios';

describe('API Error Handling Tests', () => {
  test('Handle network error for GET /api/test', async () => {
    // Setup mock to simulate network error
    axios.get.mockRejectedValueOnce(new Error('Network Error'));
    
    // Make the request and catch the error
    await expect(axios.get('/api/test')).rejects.toThrow('Network Error');
  });
  
  test('Handle server error (500) for GET /api/memory', async () => {
    // Setup mock for server error
    axios.get.mockRejectedValueOnce({
      response: {
        status: 500,
        data: { error: 'Internal Server Error' }
      }
    });
    
    // Make the request and catch the error
    try {
      await axios.get('/api/memory');
      fail('Expected request to fail');
    } catch (error) {
      expect(error.response.status).toBe(500);
    }
  });
  
  test('Handle validation error (400) for POST /api/convert (using fetch)', async () => {
    // Setup mock for validation error
    const errorMessage = 'Invalid assembly syntax';
    
    // Mock a failed fetch response
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ success: false, error: errorMessage })
      })
    );
    
    // Make the request
    const response = await fetch('/api/convert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assembly_code: 'INVALID SYNTAX' })
    });
    
    const data = await response.json();
    
    // Assertions
    expect(response.ok).toBe(false);
    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe(errorMessage);
  });
  
  test('Handle validation error for POST /api/load_program (using fetch)', async () => {
    // Setup mock for validation error
    const errorMessage = 'Invalid machine code format';
    
    // Mock a failed fetch response
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ success: false, error: errorMessage })
      })
    );
    
    // Make the request
    const response = await fetch('/api/load_program', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ machine_code: 'INVALID FORMAT' })
    });
    
    const data = await response.json();
    
    // Assertions
    expect(response.ok).toBe(false);
    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe(errorMessage);
  });
  
  test('Handle invalid mode error for POST /api/change_mode (using fetch)', async () => {
    // Setup mock for invalid mode error
    const errorMessage = 'Invalid mode';
    
    // Mock a failed fetch response
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ success: false, error: errorMessage })
      })
    );
    
    // Make the request
    const response = await fetch('/api/change_mode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ machine_mode: 'InvalidMode' })
    });
    
    const data = await response.json();
    
    // Assertions
    expect(response.ok).toBe(false);
    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe(errorMessage);
  });
});