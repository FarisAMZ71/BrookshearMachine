// apiUtils.js - Utility functions for API testing
/**
 * Creates mock response data for memory tests
 * @param {number} size - Size of memory array (default 256)
 * @param {Array} initialValues - Initial values to set in memory
 * @returns {Object} Mock memory object
 */
export const createMockMemory = (size = 256, initialValues = []) => {
  const memory = Array(size).fill(0);
  
  // Set any initial values
  if (initialValues && initialValues.length > 0) {
    initialValues.forEach((value, index) => {
      if (index < size) {
        memory[index] = value;
      }
    });
  }
  
  return { memory };
};

/**
 * Creates mock response data for CPU tests
 * @param {Object} options - CPU configuration options
 * @returns {Object} Mock CPU object
 */
export const createMockCPU = (options = {}) => {
  const defaultCPU = {
    registers: Array(16).fill(0),
    instruction_register: 0,
    program_counter: 0
  };
  
  // Apply any provided options
  return {
    cpu: {
      ...defaultCPU,
      ...options
    }
  };
};

/**
 * Creates mock data for a specific machine mode
 * @param {string} mode - Machine mode (Base, Stack, Branch)
 * @returns {Object} Mock mode-specific data
 */
export const createMockModeData = (mode) => {
  // Base data structure
  const data = {
    memory: createMockMemory(),
    cpu: createMockCPU().cpu
  };
  
  // Add mode-specific fields
  if (mode === 'Stack') {
    data.cpu.stack_pointer = 255;
  } else if (mode === 'Branch') {
    data.cpu.link_register = 0;
  }
  
  return data;
};

/**
 * Parses machine code string into memory array
 * @param {string} machineCode - Hexadecimal machine code string
 * @returns {Array} Array of values for memory
 */
export const parseHexToMemory = (machineCode) => {
  return machineCode.split('').map(char => parseInt(char, 16));
};

// Add placeholder test to satisfy Jest requirements
describe('API Utils', () => {
  test('Placeholder test to satisfy Jest requirements', () => {
    expect(true).toBe(true);
  });
});