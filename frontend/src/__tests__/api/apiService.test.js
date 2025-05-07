// apiService.test.js - Tests all API calls made to the backend
import axios from 'axios';

// Import the helper to create standard response formats
const createDefaultResponse = (data) => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {}
});

describe('API Connection Tests', () => {
  test('GET /api/test returns connection message', async () => {
    // Setup mock response
    const mockResponse = { message: 'Connection successful!' };
    axios.get.mockResolvedValueOnce(createDefaultResponse(mockResponse));
    
    // Make the request
    const response = await axios.get('/api/test');
    
    // Assertions
    expect(response.status).toBe(200);
    expect(response.data).toEqual(mockResponse);
  });
  
  test('GET /api/machine_mode returns current machine mode', async () => {
    // Setup mock response
    const mockResponse = { machine_mode: 'Base' };
    axios.get.mockResolvedValueOnce(createDefaultResponse(mockResponse));
    
    // Make the request
    const response = await axios.get('/api/machine_mode');
    
    // Assertions
    expect(response.status).toBe(200);
    expect(response.data).toEqual(mockResponse);
  });
});

describe('Memory API Tests', () => {
  test('GET /api/memory returns memory data', async () => {
    // Setup mock response with an array of 256 zeros
    const memoryData = { memory: Array(256).fill(0) };
    axios.get.mockResolvedValueOnce(createDefaultResponse(memoryData));
    
    // Make the request
    const response = await axios.get('/api/memory');
    
    // Assertions
    expect(response.status).toBe(200);
    expect(response.data).toEqual(memoryData);
    expect(response.data.memory.length).toBe(256);
  });
  
  test('POST /api/clear_memory clears memory (using fetch)', async () => {
    // Setup mock response
    const clearedMemory = { memory: Array(256).fill(0) };
    global.mockFetchResponse(clearedMemory);
    
    // Make the request
    const response = await fetch('/api/clear_memory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "Clear command initiated" })
    });
    
    const data = await response.json();
    
    // Assertions
    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
    expect(data).toEqual(clearedMemory);
  });

  test('POST /api/load_program loads program into memory (using fetch)', async () => {
    // Example machine code
    const machineCode = '01234567';
    
    // Setup mock response with the program loaded in memory
    const updatedMemory = { 
      memory: Array(256).fill(0) 
    };
    
    global.mockFetchResponse(updatedMemory);
    
    // Make the request
    const response = await fetch('/api/load_program', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ machine_code: machineCode })
    });
    
    const data = await response.json();
    
    // Assertions
    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
    expect(data).toEqual(updatedMemory);
  });

  test('POST /api/upload_program uploads and assembles a program (using fetch)', async () => {
    // Example assembly code
    const program = 'LOAD A 5\nSTORE B';
    
    // Setup mock response
    const mockResponse = { 
      memory: Array(256).fill(0),
      assembly_code: program
    };
    
    global.mockFetchResponse(mockResponse);
    
    // Make the request
    const response = await fetch('/api/upload_program', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ program })
    });
    
    const data = await response.json();
    
    // Assertions
    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
    expect(data).toEqual(mockResponse);
    expect(data.assembly_code).toBe(program);
  });

  test('POST /api/convert converts assembly to machine code (using fetch)', async () => {
    // Example assembly code
    const assemblyCode = 'LOAD A 5\nSTORE B';
    
    // Mock machine code result
    const machineCode = '1A050B00';
    
    // Setup mock response
    const mockResponse = { 
      success: true, 
      machine_code: machineCode 
    };
    
    global.mockFetchResponse(mockResponse);
    
    // Make the request
    const response = await fetch('/api/convert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assembly_code: assemblyCode })
    });
    
    const data = await response.json();
    
    // Assertions
    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.machine_code).toBe(machineCode);
  });
});

describe('CPU API Tests', () => {
  test('GET /api/cpu returns CPU state', async () => {
    // Setup mock response
    const cpuData = { 
      cpu: {
        registers: Array(16).fill(0),
        instruction_register: 0,
        program_counter: 0
      }
    };
    
    axios.get.mockResolvedValueOnce(createDefaultResponse(cpuData));
    
    // Make the request
    const response = await axios.get('/api/cpu');
    
    // Assertions
    expect(response.status).toBe(200);
    expect(response.data).toEqual(cpuData);
    expect(response.data.cpu.registers.length).toBe(16);
  });
  
  test('POST /api/clear_cpu clears CPU state (using fetch)', async () => {
    // Setup mock response
    const clearedCPU = { 
      cpu: {
        registers: Array(16).fill(0),
        instruction_register: 0,
        program_counter: 0
      }
    };
    
    global.mockFetchResponse(clearedCPU);
    
    // Make the request
    const response = await fetch('/api/clear_cpu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "Clear command initiated" })
    });
    
    const data = await response.json();
    
    // Assertions
    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
    expect(data).toEqual(clearedCPU);
  });

  test('POST /api/run executes the loaded program (using fetch)', async () => {
    // Mock response for a single execution
    const mockRunResponse = {
      memory: Array(256).fill(0),
      cpu: {
        registers: Array(16).fill(0),
        instruction_register: 0,
        program_counter: 1  // Program counter incremented after execution
      }
    };
    
    global.mockFetchResponse(mockRunResponse);
    
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
    expect(data).toEqual(mockRunResponse);
    expect(data.cpu.program_counter).toBe(1);  // Program counter should increment
  });

  test('POST /api/step executes a single instruction (using fetch)', async () => {
    // Mock response for a single step
    const mockStepResponse = {
      memory: Array(256).fill(0),
      cpu: {
        registers: Array(16).fill(0),
        instruction_register: 0,
        program_counter: 1  // Program counter incremented after step
      }
    };
    
    global.mockFetchResponse(mockStepResponse);
    
    // Make the request
    const response = await fetch('/api/step', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "Step command initiated" })
    });
    
    const data = await response.json();
    
    // Assertions
    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
    expect(data).toEqual(mockStepResponse);
    expect(data.cpu.program_counter).toBe(1);  // Program counter should increment
  });
});

describe('Machine Mode API Tests', () => {
  test('POST /api/change_mode changes the machine mode (using fetch)', async () => {
    // Test changing to Stack mode
    const mode = 'Stack';
    
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