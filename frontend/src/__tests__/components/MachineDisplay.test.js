import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import MachineDisplay from '../../components/MachineDisplay/MachineDisplay';

// Mock the axios library
jest.mock('axios');

// Mock child components to simplify testing
jest.mock('../../components/MemoryDisplay/MemoryDisplay', () => ({ memory, program_counter }) => (
  <div data-testid="memory-display">
    <span data-testid="memory-pc">{program_counter}</span>
    <span data-testid="memory-length">{memory.length}</span>
  </div>
));

jest.mock('../../components/RegisterDisplay/RegisterDisplay', () => (props) => (
  <div data-testid="register-display">
    <span data-testid="register-ir">{props.instruction_register}</span>
    <span data-testid="register-pc">{props.program_counter}</span>
    <button data-testid="run-button" onClick={props.onRunClick}>Run</button>
    <button data-testid="step-button" onClick={props.onStepClick}>Step</button>
    <button data-testid="clear-memory-button" onClick={props.onClearMemoryClick}>Clear Memory</button>
    <button data-testid="clear-cpu-button" onClick={props.onClearCPUClick}>Clear CPU</button>
  </div>
));

jest.mock('../../components/AssemblyDisplay/AssemblyDisplay', () => (props) => (
  <div data-testid="assembly-display">
    <textarea 
      data-testid="assembly-code-input" 
      value={props.assembly_code} 
      onChange={props.onassembly_codeGenerated}
    />
    <div data-testid="machine-code">{props.machine_code}</div>
    <button data-testid="convert-button" onClick={props.onConvertClick}>Convert</button>
    <button data-testid="load-button" onClick={props.onLoadClick}>Load</button>
  </div>
));

jest.mock('../../components/StackDisplay/StackDisplay', () => (props) => (
  <div data-testid="stack-display" className={props.machine_mode}>
    <span data-testid="stack-pointer">{props.stackPointer}</span>
    <span data-testid="link-register">{props.linkRegister}</span>
  </div>
));

jest.mock('../../components/InstructionDisplay/InstructionDisplay', () => () => (
  <div data-testid="instruction-display">
    Instruction Help
  </div>
));

describe('MachineDisplay Component', () => {
  const mockUpdateMachineMode = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock API responses
    axios.get.mockImplementation((url) => {
      if (url === '/api/memory') {
        return Promise.resolve({ data: { memory: Array(256).fill(0) } });
      } else if (url === '/api/cpu') {
        return Promise.resolve({ 
          data: { 
            cpu: {
              registers: Array(16).fill(0),
              instruction_register: 0,
              program_counter: 0
            }
          }
        });
      } else if (url === '/api/machine_mode') {
        return Promise.resolve({ data: { machine_mode: 'Base' } });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    // Mock fetch API
    global.fetch = jest.fn().mockImplementation((url) => {
      let responseData = {};
      
      if (url === '/api/run' || url === '/api/step') {
        responseData = {
          memory: Array(256).fill(1),
          cpu: {
            registers: Array(16).fill(2),
            instruction_register: 0xAB,
            program_counter: 0x10,
            stack_pointer: 0xF0,
            link_register: 0x20
          }
        };
      } else if (url === '/api/clear_memory') {
        responseData = { memory: Array(256).fill(0) };
      } else if (url === '/api/clear_cpu') {
        responseData = {
          cpu: {
            registers: Array(16).fill(0),
            instruction_register: 0,
            program_counter: 0
          }
        };
      } else if (url === '/api/load_program') {
        responseData = { memory: Array(256).fill(3) };
      } else if (url === '/api/convert') {
        responseData = { success: true, machine_code: '123456789ABCDEF' };
      } else if (url === '/api/upload_program') {
        responseData = { memory: Array(256).fill(4) };
      }
      
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(responseData)
      });
    });
  });

  test('renders machine display component with title', async () => {
    render(<MachineDisplay machine_mode="Base" updateMachineMode={mockUpdateMachineMode} />);
    
    // Check that the component title is present
    expect(screen.getByText('Register and Memory Display')).toBeInTheDocument();
    
    // Check that all child components are rendered
    expect(screen.getByTestId('register-display')).toBeInTheDocument();
    expect(screen.getByTestId('memory-display')).toBeInTheDocument();
    expect(screen.getByTestId('stack-display')).toBeInTheDocument();
    expect(screen.getByTestId('assembly-display')).toBeInTheDocument();
    expect(screen.getByTestId('instruction-display')).toBeInTheDocument();
    
    // Verify that API calls were made to initialize the component
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('/api/memory');
      expect(axios.get).toHaveBeenCalledWith('/api/cpu');
      expect(axios.get).toHaveBeenCalledWith('/api/machine_mode');
    });
  });

  test('handles run button click correctly', async () => {
    render(<MachineDisplay machine_mode="Base" updateMachineMode={mockUpdateMachineMode} />);
    
    // Wait for initial loading to complete
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(3);
    });
    
    // Click the run button
    fireEvent.click(screen.getByTestId('run-button'));
    
    // Verify that the fetch API was called with the correct parameters
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/run', 
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );
    });
    
    // Check that the state was updated after the API call
    await waitFor(() => {
      // The PC and IR values should be updated based on our mock response
      expect(screen.getByTestId('register-pc').textContent).toBe('16'); // 0x10 in decimal
      expect(screen.getByTestId('register-ir').textContent).toBe('171'); // 0xAB in decimal
    });
  });

  test('handles step button click correctly', async () => {
    render(<MachineDisplay machine_mode="Base" updateMachineMode={mockUpdateMachineMode} />);
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(3);
    });
    
    // Click the step button
    fireEvent.click(screen.getByTestId('step-button'));
    
    // Verify that the fetch API was called with the correct parameters
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/step', 
        expect.objectContaining({
          method: 'POST'
        })
      );
    });
    
    // Check that the state was updated after the API call
    await waitFor(() => {
      expect(screen.getByTestId('register-pc').textContent).toBe('16'); // 0x10 in decimal
      expect(screen.getByTestId('register-ir').textContent).toBe('171'); // 0xAB in decimal
    });
  });

  test('handles clear memory button click correctly', async () => {
    render(<MachineDisplay machine_mode="Base" updateMachineMode={mockUpdateMachineMode} />);
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(3);
    });
    
    // Click the clear memory button
    fireEvent.click(screen.getByTestId('clear-memory-button'));
    
    // Verify that the fetch API was called with the correct parameters
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/clear_memory', 
        expect.objectContaining({
          method: 'POST'
        })
      );
    });
  });

  test('handles clear CPU button click correctly', async () => {
    render(<MachineDisplay machine_mode="Base" updateMachineMode={mockUpdateMachineMode} />);
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(3);
    });
    
    // Click the clear CPU button
    fireEvent.click(screen.getByTestId('clear-cpu-button'));
    
    // Verify that the fetch API was called with the correct parameters
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/clear_cpu', 
        expect.objectContaining({
          method: 'POST'
        })
      );
    });
  });

  test('handles assembly code input and conversion correctly', async () => {
    render(<MachineDisplay machine_mode="Base" updateMachineMode={mockUpdateMachineMode} />);
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(3);
    });
    
    // Enter some assembly code
    const input = screen.getByTestId('assembly-code-input');
    fireEvent.change(input, { target: { value: 'LOAD R1, 0x10' } });
    
    // Click the convert button
    fireEvent.click(screen.getByTestId('convert-button'));
    
    // Verify that the fetch API was called with the correct parameters
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/convert', 
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ assembly_code: 'LOAD R1, 0x10' })
        })
      );
    });
    
    // Check that the machine code was updated after the API call
    await waitFor(() => {
      expect(screen.getByTestId('machine-code').textContent).toBe('123456789ABCDEF');
    });
  });

  test('handles load button click correctly', async () => {
    render(<MachineDisplay machine_mode="Base" updateMachineMode={mockUpdateMachineMode} />);
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(3);
    });
    
    // Set some machine code first
    const input = screen.getByTestId('assembly-code-input');
    fireEvent.change(input, { target: { value: 'LOAD R1, 0x10' } });
    
    // Convert it to machine code
    fireEvent.click(screen.getByTestId('convert-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('machine-code').textContent).toBe('123456789ABCDEF');
    });
    
    // Click the load button
    fireEvent.click(screen.getByTestId('load-button'));
    
    // Verify that the fetch API was called with the correct parameters
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/load_program', 
        expect.objectContaining({
          method: 'POST'
        })
      );
    });
  });

  test('renders stack pointer in Stack mode', async () => {
    // Update the mock to return Stack mode
    axios.get.mockImplementation((url) => {
      if (url === '/api/memory') {
        return Promise.resolve({ data: { memory: Array(256).fill(0) } });
      } else if (url === '/api/cpu') {
        return Promise.resolve({ 
          data: { 
            cpu: {
              registers: Array(16).fill(0),
              instruction_register: 0,
              program_counter: 0,
              stack_pointer: 0xF0
            }
          }
        });
      } else if (url === '/api/machine_mode') {
        return Promise.resolve({ data: { machine_mode: 'Stack' } });
      }
      return Promise.reject(new Error('Unknown URL'));
    });
    
    render(<MachineDisplay machine_mode="Stack" updateMachineMode={mockUpdateMachineMode} />);
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(3);
    });
    
    // Check that the stack display has the correct mode
    expect(screen.getByTestId('stack-display')).toHaveClass('Stack');
    
    // Check that the stack pointer is displayed
    expect(screen.getByTestId('stack-pointer').textContent).toBe('240'); // 0xF0 in decimal
  });

  test('renders link register in Branch mode', async () => {
    // Update the mock to return Branch mode
    axios.get.mockImplementation((url) => {
      if (url === '/api/memory') {
        return Promise.resolve({ data: { memory: Array(256).fill(0) } });
      } else if (url === '/api/cpu') {
        return Promise.resolve({ 
          data: { 
            cpu: {
              registers: Array(16).fill(0),
              instruction_register: 0,
              program_counter: 0,
              link_register: 0x20
            }
          }
        });
      } else if (url === '/api/machine_mode') {
        return Promise.resolve({ data: { machine_mode: 'Branch' } });
      }
      return Promise.reject(new Error('Unknown URL'));
    });
    
    render(<MachineDisplay machine_mode="Branch" updateMachineMode={mockUpdateMachineMode} />);
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(3);
    });
    
    // Check that the stack display has the correct mode
    expect(screen.getByTestId('stack-display')).toHaveClass('Branch');
    
    // Check that the link register is displayed
    expect(screen.getByTestId('link-register').textContent).toBe('32'); // 0x20 in decimal
  });
});