import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StackDisplay from '../../components/StackDisplay/StackDisplay';

describe('StackDisplay Component', () => {
  // Test data
  const mockStack = Array(10).fill(0).map((_, i) => i);
  const mockStackPointer = 0xF0;
  const mockLinkRegister = 0x20;

  test('renders stack display component with title', () => {
    render(
      <StackDisplay 
        stack={mockStack}
        stackPointer={mockStackPointer}
        linkRegister={mockLinkRegister}
        machine_mode="Stack"
      />
    );
    
    expect(screen.getByText('Stack')).toBeInTheDocument();
  });

  test('displays stack pointer in Stack mode', () => {
    render(
      <StackDisplay 
        stack={mockStack}
        stackPointer={mockStackPointer}
        linkRegister={mockLinkRegister}
        machine_mode="Stack"
      />
    );
    
    // Stack pointer should be visible in Stack mode
    expect(screen.getByText('SP')).toBeInTheDocument();
    expect(screen.getByText('F0')).toBeInTheDocument(); // Stack pointer value in hex
    
    // Stack values should be displayed
    for (let i = 0; i < mockStack.length; i++) {
      const hexValue = i.toString(16).padStart(2, '0').toUpperCase();
      expect(screen.getByText(hexValue)).toBeInTheDocument();
    }
    
    // Link register should not be visible in Stack mode
    const linkRegisterCell = document.querySelector('.link-register-cell');
    expect(linkRegisterCell).toHaveClass('hidden');
  });

  test('displays link register in Branch mode', () => {
    render(
      <StackDisplay 
        stack={mockStack}
        stackPointer={mockStackPointer}
        linkRegister={mockLinkRegister}
        machine_mode="Branch"
      />
    );
    
    // Both stack pointer and link register should be visible in Branch mode
    expect(screen.getByText('SP')).toBeInTheDocument();
    expect(screen.getByText('F0')).toBeInTheDocument(); // Stack pointer value in hex
    
    expect(screen.getByText('LR')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument(); // Link register value in hex
    
    // Link register cell should be visible in Branch mode
    const linkRegisterCell = document.querySelector('.link-register-cell');
    expect(linkRegisterCell).toHaveClass('show');
  });

  test('hides in Base mode', () => {
    const { container } = render(
      <StackDisplay 
        stack={mockStack}
        stackPointer={mockStackPointer}
        linkRegister={mockLinkRegister}
        machine_mode="Base"
      />
    );
    
    // Component should have the 'hidden' class in Base mode
    const stackDisplay = container.querySelector('.stack-display');
    expect(stackDisplay).toHaveClass('hidden');
  });

  test('displays stack values correctly', () => {
    render(
      <StackDisplay 
        stack={mockStack}
        stackPointer={mockStackPointer}
        linkRegister={mockLinkRegister}
        machine_mode="Stack"
      />
    );
    
    // All stack values should be visible
    mockStack.forEach((_, index) => {
      const value = index.toString(16).padStart(2, '0').toUpperCase();
      expect(screen.getByText(value)).toBeInTheDocument();
    });
  });
});