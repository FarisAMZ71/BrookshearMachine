// App.js
import React, { useState, useEffect, Component } from 'react';
import MemoryDisplay from '../MemoryDisplay/MemoryDisplay';
import RegisterDisplay from '../RegisterDisplay/RegisterDisplay';
import '../MemoryDisplay/MemoryDisplay.css';
import '../RegisterDisplay/RegisterDisplay.css';
import axios from 'axios';

class MachineDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      registers: Array(16).fill(0), 
      memory: Array(256).fill(0),   
    };

    this.getMemoryData();
    this.getRegistersData();
    
    this.handleRunClick = this.handleRunClick.bind(this);
    this.handleClearMemoryClick = this.handleClearMemoryClick.bind(this);
  }

  getMemoryData() {
    axios.get('/api/memory')
      .then((response) => {
        console.log('Data fetched:', response.data.memory.flat(1));
        this.setState({memory: response.data.memory.flat(1)});
      })
      .catch((error) => console.error('Error fetching memory:', error));
  }

    getRegistersData() {
    axios.get('/api/registers')
      .then((response) => {
        console.log('Data fetched:', response.data.cpu.registers);
        this.setState({registers: response.data.cpu.registers});
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
        // Assuming the server returns updated registers and memory
        this.setState({
          memory: data.memory.flat(1) || this.state.memory,           // Update memory
          registers: data.cpu.registers || this.state.registers // Update registers
        });
      })
      .catch(error => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }

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
        // Assuming the server returns updated registers and memory
        this.setState({
          memory: data.memory.flat(1) || this.state.memory
        });
      })
      .catch(error => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }

  render() {
    const { registers, memory } = this.state;
    
    return (
      <div className="machine-display">
        <h1>Register and Memory Display</h1>
        <RegisterDisplay registers={registers} onRunClick={this.handleRunClick} onClearMemoryClick={this.handleClearMemoryClick}/>
        <MemoryDisplay memory={memory} />
      </div>
    );
  }
}

export default MachineDisplay;
