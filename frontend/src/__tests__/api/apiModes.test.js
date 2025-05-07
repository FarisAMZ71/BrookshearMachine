// apiModes.test.js - Tests for Stack and Branch mode-specific API functionality
import axios from 'axios';

// Helper to create standard response formats
const createDefaultResponse = (data) => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {}
});

describe('Stack Mode API Tests', () => {
  test('GET /api/cpu returns stack pointer in Stack mode', async () => {
    // Setup mock response for Stack mode CPU with stack pointer
    const cpuData = { 
      cpu: {
        registers: Array(16).fill(0),
        instruction_register: 0,
        program_counter: 0,
        stack_pointer: 255
      }
    };
    
    axios.get.mockResolvedValueOnce(createDefaultResponse(cpuData));
    
    // Make the request
    const response = await axios.get('/api/cpu');
    
    // Assertions
    expect(response.status).toBe(200);
    expect(response.data).toEqual(cpuData);
    expect(response.data.cpu.stack_pointer).toBe(255);
  });

  test('POST /api/run updates stack pointer in Stack mode (using fetch)', async () => {
    // Mock response for Stack mode execution
    const mockResponse = {
      memory: Array(256).fill(0),
      cpu: {
        registers: Array(16).fill(0),
        instruction_register: 0,
        program_counter: 1,
        stack_pointer: 254  // Stack pointer decremented after pushing value
      }
    };
    
    global.mockFetchResponse(mockResponse);
    
    // Make the request
    const response = await fetch('/api/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "Run command initiated" })
    });
    
    const data = await response.json();
    
    // Assertions
    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
    expect(data).toEqual(mockResponse);
    expect(data.cpu.stack_pointer).toBe(254); // Updated stack pointer
  });
});

describe('Branch Mode API Tests', () => {
  test('GET /api/cpu returns link register in Branch mode', async () => {
    // Setup mock response for Branch mode CPU with link register
    const cpuData = { 
      cpu: {
        registers: Array(16).fill(0),
        instruction_register: 0,
        program_counter: 0,
        link_register: 0
      }
    };
    
    axios.get.mockResolvedValueOnce(createDefaultResponse(cpuData));
    
    // Make the request
    const response = await axios.get('/api/cpu');
    
    // Assertions
    expect(response.status).toBe(200);
    expect(response.data).toEqual(cpuData);
    expect(response.data.cpu.link_register).toBe(0);
  });

  test('POST /api/run updates link register in Branch mode for jump instruction (using fetch)', async () => {
    // Mock response for Branch mode execution with jump instruction
    const mockResponse = {
      memory: Array(256).fill(0),
      cpu: {
        registers: Array(16).fill(0),
        instruction_register: 0, 
        program_counter: 10,  // Jumped to address 10
        link_register: 1      // Link register updated with return address
      }
    };
    
    global.mockFetchResponse(mockResponse);
    
    // Make the request
    const response = await fetch('/api/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "Run command initiated" })
    });
    
    const data = await response.json();
    
    // Assertions
    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
    expect(data).toEqual(mockResponse);
    expect(data.cpu.link_register).toBe(1); // Updated link register
    expect(data.cpu.program_counter).toBe(10); // Updated program counter after jump
  });

  test('POST /api/change_mode changes to Branch mode (using fetch)', async () => {
    // Test changing to Branch mode
    const mode = 'Branch';
    
    // Setup mock response
    const mockResponse = { 
      success: true, 
      mode: mode 
    };
    
    global.mockFetchResponse(mockResponse);
    
    // Make the request
    const response = await fetch('/api/change_mode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ machine_mode: mode })
    });
    
    const data = await response.json();
    
    // Assertions
    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.mode).toBe(mode);
  });
});