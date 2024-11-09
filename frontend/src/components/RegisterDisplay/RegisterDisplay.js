import React, { useState, useEffect, Component } from 'react';
import RunButton from '../RunButton/RunButton';

class RegisterDisplay extends Component {
  constructor(props) {
    super(props);

    // Initialize state with registers, you can replace initial values as needed
    this.state = {
      registers: Array(16).fill(0), // Example with 16 registers, all initialized to 0
    };

    // Bind the handleRunClick method to `this` context
    this.handleRunClick = this.handleRunClick.bind(this);
  }

  // Method to handle updates to registers when Run is clicked
  handleRunClick() {
    fetch("/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: "Run command initiated" }) // Optional payload
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        useEffect(() => {
            axios.get('/api/registers')
              .then((response) => {
                console.log('Data fetched:', response.data.message.registers);
                setRegisters(response.data.message.registers);
              })
              .catch((error) => console.error('Error fetching registers:', error));
          } , []);
      })
      .catch(error => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }

  render() {
    const { registers } = this.state;

    return (
      <div className="register-display">
        <h2>Registers</h2>
        <div className="register-grid">
          {registers.map((value, address) => (
            <div key={address} className="register-cell">
              <span className="register-address">0x{address.toString(16).padStart(1, '0').toUpperCase()}</span>
              <span className="register-value"> {value.toString(16).padStart(2, '0').toUpperCase()}</span>
            </div>
          ))}
        </div>
        
        {/* Pass handleRunClick to RunButton as an onClick handler */}
        <RunButton onClick={this.handleRunClick} />
      </div>
    );
  }
}

export default RegisterDisplay;
