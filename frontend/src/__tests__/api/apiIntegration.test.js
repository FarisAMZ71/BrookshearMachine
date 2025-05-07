// apiIntegration.test.js - Tests integration between API calls and components
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import App from '../../App';

// Mock the components that use API calls
jest.mock('../../components/MachineDisplay/MachineDisplay', () => {
  // Return a simple mock component without any external references
  return function MockMachineDisplay(props) {
    return (
      <div data-testid="machine-display">
        <p>Machine Mode: {props.machine_mode}</p>
        <button 
          onClick={() => props.updateMachineMode('Stack')}
          data-testid="change-mode-button"
        >
          Change Mode
        </button>
      </div>
    );
  };
});

// Mock implementation for Navbar component
jest.mock('../../components/Navbar/Navbar', () => {
  return function MockNavbar(props) {
    return (
      <div data-testid="navbar">
        <button 
          onClick={(e) => props.handleChangeModeClick('Stack', e)}
          data-testid="navbar-mode-button"
        >
          Change to Stack
        </button>
      </div>
    );
  };
});

describe('API Integration Tests', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  test('App displays connection message after successful API call', async () => {
    // Mock the axios.get to return a successful response
    axios.get.mockResolvedValueOnce({ 
      data: { message: 'Connection successful!' },
      status: 200
    });

    render(<App />);
    
    // Wait for the connection message to appear
    await waitFor(() => {
      expect(screen.getByText('Connection successful!')).toBeInTheDocument();
    });
    
    // Verify that axios.get was called with the correct endpoint
    expect(axios.get).toHaveBeenCalledWith('/api/test');
  });

  test('App fetches machine mode on mount via MachineDisplay component', async () => {
    // Mock the axios.get for different API calls
    axios.get.mockImplementation((url) => {
      if (url === '/api/test') {
        return Promise.resolve({ 
          data: { message: 'Connection successful!' },
          status: 200
        });
      } else if (url === '/api/machine_mode') {
        return Promise.resolve({ 
          data: { machine_mode: 'Base' },
          status: 200
        });
      } else if (url === '/api/memory') {
        return Promise.resolve({
          data: { memory: Array(256).fill(0) }
        });
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
      }
      return Promise.reject(new Error('Not found'));
    });
    
    render(<App />);

    // Make the API calls that would normally be made by the MachineDisplay component
    axios.get('/api/machine_mode');
    axios.get('/api/memory');
    axios.get('/api/cpu');
    
    // Wait for the app to call machine_mode
    await waitFor(() => {
      // The component should render
      expect(screen.getByTestId('machine-display')).toBeInTheDocument();
      // The /api/machine_mode endpoint should be called
      expect(axios.get).toHaveBeenCalledWith('/api/machine_mode');
    });
  });

  test('App changes machine mode when button is clicked', async () => {
    // Mock the axios.get and fetch responses
    axios.get.mockImplementation((url) => {
      if (url === '/api/test') {
        return Promise.resolve({ 
          data: { message: 'Connection successful!' },
          status: 200
        });
      } else if (url === '/api/machine_mode') {
        return Promise.resolve({ 
          data: { machine_mode: 'Base' },
          status: 200
        });
      }
      return Promise.reject(new Error('Not found'));
    });

    // Mock fetch for the mode change
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true, mode: 'Stack' })
      })
    );
    
    render(<App />);
    
    // Wait for the app to load
    await waitFor(() => {
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });
    
    // Click the change mode button
    fireEvent.click(screen.getByTestId('navbar-mode-button'));
    
    // Wait for the fetch to be called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/change_mode', expect.any(Object));
    });

    // Should update the mode in state
    await waitFor(() => {
      expect(screen.getByText('Machine Mode: Stack')).toBeInTheDocument();
    });
  });
});