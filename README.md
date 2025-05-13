# Brookshear Machine Simulator

This project is a web-based implementation of the Brookshear Machine, a simplified computer architecture model described in "Computer Science: An Overview" by Glenn Brookshear. The simulator provides a visual and interactive way to understand fundamental computing concepts like assembly language, memory management, and CPU operations.
## Link to GitHub Repository
https://github.com/FarisAMZ71/BrookshearMachine.git
## Features

- **Multiple Machine Modes**:
  - Base Brookshear Machine
  - Stack-based extension
  - Branch-based extension with function calls
  
- **Interactive Interface**:
  - Real-time memory viewing
  - Register state visualization
  - Step-by-step execution
  
- **Assembler**:
  - Convert assembly language to machine code
  - Support for all standard Brookshear Machine instructions
  - Additional extended instruction set for each mode

- **Sample Programs**:
  - Basic operations
  - Sorting algorithms (Bubble Sort)
  - Mathematical sequences (Fibonacci)
  - LFSR (Linear Feedback Shift Register)

## System Architecture

The project follows a client-server architecture:

- **Frontend**: React-based web application
- **Backend**: Flask API server
- **Core Modules**:
  - CPU implementation
  - Memory management
  - Assembler for code translation

## Prerequisites

- **Windows**:
  - PowerShell with Administrator privileges
  - Internet connection for setup process
  
- **Linux/macOS**:
  - Python 3.10+
  - Node.js LTS (v18+)
  - npm

## Setup Instructions

### Windows (Automated Setup)

1. Open PowerShell as Administrator
2. Navigate to the project root directory
3. If you encounter execution policy restrictions, run:
   ```powershell
   Set-ExecutionPolicy Bypass -Scope Process -Force
   ```
4. Run the setup script:
   ```powershell
   .\setup.ps1
   ```
   
   This script will:
   - Install Chocolatey (if not present)
   - Install/upgrade Node.js LTS and Python 3
   - Set up npm dependencies
   - Create a Python virtual environment
   - Install required Python packages

4. Activate the Python virtual environment:
   ```powershell
   .\venv\Scripts\Activate
   ```

### Manual Setup (All Platforms)

1. **Backend Setup**:
   ```bash
   # Create and activate virtual environment
   python -m venv venv
   # On Windows
   .\venv\Scripts\activate
   # On Linux/macOS
   source venv/bin/activate
   
   # Install dependencies
   pip install -r backend/requirements.txt
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm ci
   ```

## Running the Application

### Combined Frontend and Backend

From the project root with activated virtual environment:
```bash
# Navigate to frontend directory
cd frontend
# Run both frontend and backend concurrently
npm run dev
```

### Separately

**Backend**:
```bash
# With activated virtual environment
cd backend
python -m flask run --port 5000
```

**Frontend**:
```bash
cd frontend
npm start
```

The application will be available at http://localhost:3000

## Instruction Set

The Brookshear Machine supports the following instructions:

| Code | Instruction | Description |
|------|-------------|-------------|
| 1    | LEA Rr, xy  | Load effective address from memory location xy into register Rr |
| 2    | LDR Rr, xy  | Load register Rr with the bit pattern xy |
| 3    | STR Rr, xy  | Store to memory location xy the contents of register Rr |
| 4    | MOV Rr, Rs  | Move value from register Rs to register Rr |
| 5    | ADT Rr, Rs, Rt | Add 2's complement the contents of registers Rs and Rt and store in Rr |
| 6    | ADF Rr, Rs, Rt | Add floating point the contents of registers Rs and Rt and store in Rr |
| 7    | ORR Rr, xy  | OR register Rr with the bit pattern xy |
| 8    | AND Rr, xy  | AND register Rr with the bit pattern xy |
| 9    | XOR Rr, xy  | XOR register Rr with the bit pattern xy |
| A    | ROT Rr, 0y  | Rotate register Rr by y bits |
| B    | JMP Rr, xy  | Compare register Rr with R0 and jump to address xy if equal |
| C    | HLT 0, 00   | Halt execution |

### Extended Instructions (Stack Mode)

| Code | Instruction | Description |
|------|-------------|-------------|
| D    | PSH R0, R1, ... | Push to stack from registers R0, R1, ... |
| E    | POP R0, R1, ... | Pop from stack to registers R0, R1, ... |

### Extended Instructions (Branch Mode)

| Code | Instruction | Description |
|------|-------------|-------------|
| F    | CAL 0, xy   | Call function at address xy and store return address in link register |
| E    | POP PC      | Pop the link register into the program counter (return from function) |

## Running Tests

The project includes comprehensive unit tests for all components:

```bash
# Navigate to the backend directory
cd backend

# Run all tests
python -m pytest

# Run specific test files
python -m pytest tests/CPU_test.py
python -m pytest tests/Memory_test.py
python -m pytest tests/Assembler_test.py
```

## Project Structure

- `backend/`: Flask server and core machine implementation
  - `models/`: Core modules (CPU, Memory, Assembler)
    - `Base_Brookshear/`: Standard machine implementation
    - `Mode1_Stack/`: Stack-based machine extension
    - `Mode2_Branch/`: Branch-based machine extension
  - `services/`: Utility functions
  - `static/`: Sample programs
  - `tests/`: Unit tests

- `frontend/`: React-based user interface
  - `src/`: Source code
    - `components/`: React components
  - `public/`: Static assets

## License

This project is part of a COM3610 Dissertation Project at the University of Sheffield.

## Acknowledgments

- Glenn Brookshear for the original machine design in "Computer Science: An Overview"
- University of Sheffield, COM3610 Dissertation Project
- Project supervisor: [Dr. James Mapp](https://www.sheffield.ac.uk/cs/people/academic/james-mapp)
