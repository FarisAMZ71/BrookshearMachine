import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegisterDisplay from '../../components/RegisterDisplay/RegisterDisplay';

// Mock the button components to focus on testing RegisterDisplay
jest.mock('../../components/Buttons/RunButton', () => props => (
  <button data-testid="run-button" onClick={props.onClick}>Run</button>
));
jest.mock('../../components/Buttons/StepButton', () => props => (
  <button data-testid="step-button" onClick={props.onClick}>Step</button>
));
jest.mock('../../components/Buttons/ClearMemoryButton', () => props => (
  <button data-testid="clear-memory-button" onClick={props.onClick}>Clear Memory</button>
));
jest.mock('../../components/Buttons/ClearCPUButton', () => props => (
  <button data-testid="clear-cpu-button" onClick={props.onClick}>Clear CPU</button>
));

describe('RegisterDisplay Component', () => {
  // Test data
  const mockRegisters = Array(16).fill(0).map((_, i) => i);
  const mockInstructionRegister = 0xA5;
  const mockProgramCounter = 0x10;
  
  // Mock handlers
  const mockRunClick = jest.fn();
  const mockStepClick = jest.fn();
  const mockClearMemoryClick = jest.fn();
  const mockClearCPUClick = jest.fn();

  beforeEach(() => {
    // Reset mocks between tests
    jest.clearAllMocks();
  });

  test('renders register display component with title', () => {
    render(
      <RegisterDisplay 
        instruction_register={mockInstructionRegister}
        program_counter={mockProgramCounter}
        registers={mockRegisters}
        onRunClick={mockRunClick}
        onStepClick={mockStepClick}
        onClearMemoryClick={mockClearMemoryClick}
        onClearCPUClick={mockClearCPUClick}
      />
    );
    
    expect(screen.getByText('Registers')).toBeInTheDocument();
  });

  test('displays instruction register and program counter correctly', () => {
    render(
      <RegisterDisplay 
        instruction_register={mockInstructionRegister}
        program_counter={mockProgramCounter}
        registers={mockRegisters}
        onRunClick={mockRunClick}
        onStepClick={mockStepClick}
        onClearMemoryClick={mockClearMemoryClick}
        onClearCPUClick={mockClearCPUClick}
      />
    );
    
    // Check for IR and PC labels
    expect(screen.getByText('IR')).toBeInTheDocument();
    expect(screen.getByText('PC')).toBeInTheDocument();
    
    // Check IR and PC values (in hexadecimal format)
    expect(screen.getByText('A5')).toBeInTheDocument(); // IR value
    expect(screen.getByText('10')).toBeInTheDocument(); // PC value
  });

  test('displays all registers with their values', () => {
    render(
      <RegisterDisplay 
        instruction_register={mockInstructionRegister}
        program_counter={mockProgramCounter}
        registers={mockRegisters}
        onRunClick={mockRunClick}
        onStepClick={mockStepClick}
        onClearMemoryClick={mockClearMemoryClick}
        onClearCPUClick={mockClearCPUClick}
      />
    );
    
    // Check for some register addresses and values
    expect(screen.getByText('0x0')).toBeInTheDocument();
    expect(screen.getByText('0xF')).toBeInTheDocument();
    
    // Check for specific register values (in hex format)
    for (let i = 0; i < 16; i++) {
      const hexValue = i.toString(16).padStart(2, '0').toUpperCase();
      expect(screen.getByText(hexValue)).toBeInTheDocument();
    }
  });

  test('handles button clicks correctly', () => {
    render(
      <RegisterDisplay 
        instruction_register={mockInstructionRegister}
        program_counter={mockProgramCounter}
        registers={mockRegisters}
        onRunClick={mockRunClick}
        onStepClick={mockStepClick}
        onClearMemoryClick={mockClearMemoryClick}
        onClearCPUClick={mockClearCPUClick}
      />
    );
    
    // Click all buttons and check if handlers were called
    fireEvent.click(screen.getByTestId('run-button'));
    expect(mockRunClick).toHaveBeenCalledTimes(1);
    
    fireEvent.click(screen.getByTestId('step-button'));
    expect(mockStepClick).toHaveBeenCalledTimes(1);
    
    fireEvent.click(screen.getByTestId('clear-memory-button'));
    expect(mockClearMemoryClick).toHaveBeenCalledTimes(1);
    
    fireEvent.click(screen.getByTestId('clear-cpu-button'));
    expect(mockClearCPUClick).toHaveBeenCalledTimes(1);
  });

  test('highlights the program counter register', () => {
    const { container } = render(
      <RegisterDisplay 
        instruction_register={mockInstructionRegister}
        program_counter={mockProgramCounter}
        registers={mockRegisters}
        onRunClick={mockRunClick}
        onStepClick={mockStepClick}
        onClearMemoryClick={mockClearMemoryClick}
        onClearCPUClick={mockClearCPUClick}
      />
    );
    
    // PC should be highlighted
    const highlightedElement = container.querySelector('.highlight');
    expect(highlightedElement).toBeInTheDocument();
    expect(highlightedElement).toHaveTextContent('PC');
  });
});