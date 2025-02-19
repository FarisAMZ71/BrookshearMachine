// App.js
import React, { useState, useEffect, Component } from 'react';
import MemoryDisplay from '../MemoryDisplay/MemoryDisplay';
import RegisterDisplay from '../RegisterDisplay/RegisterDisplay';
import AssemblyDisplay from '../AssemblyDisplay/AssemblyDisplay';
// import '../MemoryDisplay/MemoryDisplay.css';
// import '../RegisterDisplay/RegisterDisplay.css';
import './MachineDisplay.css';
import axios from 'axios';

class MachineDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      program_counter: 0,
      instruction_register: 0,
      registers: Array(16).fill(0), 
      memory: Array(256).fill(0),   
    };

    this.getMemoryData();
    this.getRegistersData();
    
    this.handleRunClick = this.handleRunClick.bind(this);
    this.handleClearMemoryClick = this.handleClearMemoryClick.bind(this);
    this.handleClearCPUClick = this.handleClearCPUClick.bind(this);
    this.handleLoadClick = this.handleLoadClick.bind(this);
    this.handleMachineCode = this.handleMachineCode.bind(this);
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
        console.log(response.data.cpu);
        this.setState({
          registers: response.data.cpu.registers,
          program_counter: response.data.cpu.program_counter,
          instruction_register: response.data.cpu.instruction_register
        });        
      })
      .catch((error) => console.error('Error fetching registers:', error));
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
        this.setState({
          memory: data.memory.flat(1) || this.state.memory,           
          registers: data.cpu.registers || this.state.registers ,
          program_counter: data.cpu.program_counter || this.state.program_counter,
          instruction_register: data.cpu.instruction_register || this.state.instruction_register
        });
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
  handleMachineCode(machineCode) {
    this.setState({ machineCode });
  }

  // Function to handle the "Load" button click, updates both registers and memory
  handleLoadClick() {
    fetch("/api/load_program", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ machineCode: this.state.machineCode })
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
              onClearMemoryClick={this.handleClearMemoryClick}
              onClearCPUClick={this.handleClearCPUClick}
            />
            <AssemblyDisplay 
              onMachineCodeGenerated={this.handleMachineCode}
              onLoadClick={this.handleLoadClick}/>
          </div>
          <MemoryDisplay memory={memory} />
        </div>
      </div>
    );
  }
}

export default MachineDisplay;
