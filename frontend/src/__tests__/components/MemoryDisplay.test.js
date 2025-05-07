import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MemoryDisplay from '../../components/MemoryDisplay/MemoryDisplay';

describe('MemoryDisplay Component', () => {
  // Test data
  const mockMemory = Array(256).fill(0).map((_, index) => index % 16);
  const mockProgramCounter = 0x10; // Program counter at address 16

  test('renders memory display component with title', () => {
    render(<MemoryDisplay memory={mockMemory} program_counter={mockProgramCounter} />);
    
    // Check that the component title is present
    expect(screen.getByText('Memory')).toBeInTheDocument();
  });

  test('renders in list view by default', () => {
    render(<MemoryDisplay memory={mockMemory} program_counter={mockProgramCounter} />);
    
    // Check that list view is selected by default
    const listViewRadio = screen.getByLabelText('List View');
    expect(listViewRadio).toBeChecked();
    
    // Check for memory addresses in list view
    expect(screen.getByText('0x00')).toBeInTheDocument();
    expect(screen.getByText('0x01')).toBeInTheDocument();
  });

  test('toggles between list and grid view', () => {
    render(<MemoryDisplay memory={mockMemory} program_counter={mockProgramCounter} />);
    
    // Initially in list view
    expect(screen.getByLabelText('List View')).toBeChecked();
    
    // Toggle to grid view
    fireEvent.click(screen.getByLabelText('Grid View'));
    
    // Now should be in grid view
    expect(screen.getByLabelText('Grid View')).toBeChecked();
    
    // Check for grid view table headers
    const headers = screen.getAllByRole('columnheader');
    expect(headers.length).toBeGreaterThan(1); // Should have column headers in grid view
    
    // Toggle back to list view
    fireEvent.click(screen.getByLabelText('List View'));
    
    // Now should be back in list view
    expect(screen.getByLabelText('List View')).toBeChecked();
  });

  test('highlights the current program counter location', () => {
    const { container } = render(
      <MemoryDisplay memory={mockMemory} program_counter={mockProgramCounter} />
    );
    
    // Find the highlighted element (address 0x10)
    const highlightedElements = container.querySelectorAll('.highlight');
    expect(highlightedElements.length).toBe(1);
    
    // In list view, the highlighted cell should contain the program counter value
    const pcValue = mockMemory[mockProgramCounter].toString(16).padStart(2, "0").toUpperCase();
    expect(highlightedElements[0]).toHaveTextContent(pcValue);
  });

  test('displays all memory addresses in list view', () => {
    render(<MemoryDisplay memory={mockMemory} program_counter={mockProgramCounter} />);
    
    // Check for some specific memory addresses
    expect(screen.getByText('0x00')).toBeInTheDocument();
    expect(screen.getByText('0x0F')).toBeInTheDocument();
    expect(screen.getByText('0x10')).toBeInTheDocument(); // Program counter location
    expect(screen.getByText('0xFF')).toBeInTheDocument(); // Last address
  });

  test('displays memory in grid view with row and column headers', () => {
    render(<MemoryDisplay memory={mockMemory} program_counter={mockProgramCounter} />);
    
    // Switch to grid view
    fireEvent.click(screen.getByLabelText('Grid View'));
    
    // Check for row and column headers in grid view
    const headers = screen.getAllByRole('columnheader');
    
    // Should have 17 column headers (1 empty + 16 column indices 0-F)
    expect(headers.length).toBe(33);
    
    // Check for some column headers
    expect(headers[1]).toHaveTextContent('0');
    expect(headers[16]).toHaveTextContent('F');
  });
});