// App.js
import React, { useState, useEffect, Component } from 'react';
import MemoryDisplay from '../MemoryDisplay/MemoryDisplay';
import RegisterDisplay from '../RegisterDisplay/RegisterDisplay';
import AssemblyDisplay from '../AssemblyDisplay/AssemblyDisplay';
import StackDisplay from '../StackDisplay/StackDisplay';
import InstructionDisplay from '../InstructionDisplay/InstructionDisplay';
// import '../MemoryDisplay/MemoryDisplay.css';
// import '../RegisterDisplay/RegisterDisplay.css';
import './MachineDisplay.css';
import axios from 'axios';

class MachineDisplay extends Component {
  constructor(props) {
    super(props);
    // Machine modes: Base, Stack, or ...?
    this.state = {
      program_counter: 0,
      instruction_register: 0,
      stack_pointer: 255,
      link_register: 0,
      registers: Array(16).fill(0), 
      memory: Array(256).fill(0),
      assembly_code: '',
      machine_code: '',
      memory_contents: '' 
    };

    this.setup()
    
    this.handleRunClick = this.handleRunClick.bind(this);
    this.handleStepClick = this.handleStepClick.bind(this);
    this.handleClearMemoryClick = this.handleClearMemoryClick.bind(this);
    this.handleClearCPUClick = this.handleClearCPUClick.bind(this);
    this.handleConvertClick = this.handleConvertClick.bind(this);
    this.handleLoadClick = this.handleLoadClick.bind(this);
    this.setMachineCodeState = this.setMachineCodeState.bind(this);
    this.setAssemblyCodeState = this.setAssemblyCodeState.bind(this);
    this.saveMemoryToFile = this.saveMemoryToFile.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
  }

  setup() {
    this.getMemoryData();
    this.getRegistersData();
    this.getMachineMode();
  }

  getMemoryData() {
    axios.get('/api/memory')
      .then((response) => {
        this.setState({memory: response.data.memory.flat(1)});
      })
      .catch((error) => console.error('Error fetching memory:', error));
  }

  getRegistersData() {
    axios.get('/api/cpu')
      .then((response) => {
        this.setState({
          registers: response.data.cpu.registers,
          program_counter: response.data.cpu.program_counter,
          instruction_register: response.data.cpu.instruction_register
        });    
        if (this.props.machine_mode === 'Stack') {
          this.setState({ stack_pointer: response.data.cpu.stack_pointer });
        }
        if (this.props.machine_mode === 'Branch') {
          this.setState({ link_register: response.data.cpu.link_register });
        }
      })
      .catch((error) => console.error('Error fetching registers:', error));
  }

  getMachineMode() {
    axios.get('/api/machine_mode')
      .then((response) => {
        this.props.updateMachineMode(response.data.machine_mode);
      })
      .catch((error) => console.error('Error fetching machine mode:', error));
  }

  // Function to handle the "Run" button click, updates both registers and memory
  handleRunClick() {
    fetch("/api/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: "Run command initiated" })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        this.setState({
          memory: data.memory.flat(1) || this.state.memory,           
          registers: data.cpu.registers || this.state.registers ,
          program_counter: data.cpu.program_counter || this.state.program_counter,
          instruction_register: data.cpu.instruction_register || this.state.instruction_register
        });
        if (this.props.machine_mode === 'Stack') {
          this.setState({ stack_pointer: data.cpu.stack_pointer });
        }
        if (this.props.machine_mode === 'Branch') {
          this.setState({ link_register: data.cpu.link_register });
        }
      })
      .catch(error => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }

  // Function to handle the "Step" button click, updates both registers and memory
  handleStepClick() {
    fetch("/api/step", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: "Step command initiated" })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        this.setState({
          memory: data.memory.flat(1) || this.state.memory,
          registers: data.cpu.registers || this.state.registers,
          program_counter: data.cpu.program_counter || this.state.program_counter,
          instruction_register: data.cpu.instruction_register || this.state.instruction_register
        });
        if (this.props.machine_mode === 'Stack') {
          this.setState({ stack_pointer: data.cpu.stack_pointer });
        }
        if (this.props.machine_mode === 'Branch') {
          this.setState({ link_register: data.cpu.link_register });
        }
      })
      .catch(error => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }

  // Function to handle the "Clear Memory" button click, updates memory
  handleClearMemoryClick() {
    fetch("/api/clear_memory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: "Clear command initiated" })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        this.setState({
          memory: data.memory.flat(1) || this.state.memory
        });
      })
      .catch(error => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }

  // Function to handle the "Clear CPU" button click, updates registers
  handleClearCPUClick() {
    fetch("/api/clear_cpu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: "Clear command initiated" })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        
        this.setState({
          registers: data.cpu.registers || this.state.registers,
          program_counter: data.cpu.program_counter,
          instruction_register: data.cpu.instruction_register || this.state.instruction_register
        });
      })
      .catch(error => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }

  // Function to handle the "Load" button click, updates machine code
  setMachineCodeState(machine_code) {
    this.setState({ machine_code });
  }

  // Function to update assembly code in class state
  setAssemblyCodeState(event) {
    const assembly_code = event.target.value;
    this.setState({ assembly_code });
  }

  // Function to save memory contents to a file
  saveMemoryToFile() {
    const element = document.createElement('a');
    this.state.memory_contents = this.state.assembly_code;
    const file = new Blob([this.state.memory_contents], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'program.txt';
    document.body.appendChild(element); 
    element.click();
    document.body.removeChild(element);
  }

  // Function to handle the "Load" button click, updates both registers and memory
  handleLoadClick() {
    fetch("/api/load_program", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ machine_code: this.state.machine_code })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        this.setState({
          memory: data.memory.flat(1) || this.state.memory
        });
      })
      .catch(error => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }

    // Function to handle file upload
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const fileContents = e.target.result;
          this.setState({ memory: fileContents.split(' ') });
          this.setState({ assembly_code: fileContents });
  
          // Send POST request to load the program into memory
          fetch('/api/upload_program', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ program: fileContents })
          })
            .then(response => response.json())
            .then(data => {
              this.setState({ memory: data.memory.flat(1) || this.state.memory });
            })
            .catch(error => {
              console.error("There was a problem with the fetch operation:", error);
            });
        };
        reader.readAsText(file);
      }
    }

      // Function to convert assembly code to machine code
  handleConvertClick(event) {
    // Make a POST request to the server
    fetch('/api/convert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ assembly_code: this.state.assembly_code })
    })
      .then(async response => {
        if (!response.ok) {
          const error = await response.json();
          console.log(error);
          throw new Error(error.error || 'Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        this.setState({ machine_code: data.machine_code });
      })
      .catch(error => {
        console.error(error.message);
        this.setState({ machine_code: 'Error converting code: ' + error.message });
      });
  }

  render() {
    const { instruction_register, program_counter, registers, memory } = this.state;
    return (
      <div className="machine-display">
        <h1>Register and Memory Display</h1>
        <div className="machine-display-header">
          <div className="register-container">
            <RegisterDisplay
              instruction_register={instruction_register}
              program_counter={program_counter}
              registers={registers}
              onRunClick={this.handleRunClick}
              onStepClick={this.handleStepClick}
              onClearMemoryClick={this.handleClearMemoryClick}
              onClearCPUClick={this.handleClearCPUClick}
            />
            <div className="button-container">
              <button onClick={this.saveMemoryToFile}>Save Program</button>
              <input type="file" id="file-upload" accept=".txt" onChange={this.handleFileUpload} style={{ display: 'none' }} />
              <label htmlFor="file-upload" className="custom-file-upload">
                Upload Program
              </label>
            </div>
            <AssemblyDisplay 
              assembly_code={this.state.assembly_code}
              machine_code={this.state.machine_code}
              onassembly_codeGenerated={this.setAssemblyCodeState}
              onConvertClick={this.handleConvertClick}
              onLoadClick={this.handleLoadClick}/>
          </div>
          <div className="memory-container">
            <StackDisplay 
            stack={memory.slice(this.state.stack_pointer)} 
            stackPointer={this.state.stack_pointer} 
            linkRegister={this.state.link_register}
            machine_mode={this.props.machine_mode}/>
            <MemoryDisplay 
            memory={memory}
            program_counter={this.state.program_counter} />
          </div>
          <div className="help-container">
        <InstructionDisplay/>
        </div>
        </div>
      </div>
    );
  }
}

export default MachineDisplay;
