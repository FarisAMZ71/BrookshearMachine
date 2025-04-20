import React, { useState, useEffect, Component } from 'react';
import RunButton from '../Buttons/RunButton';
import ClearMemoryButton from '../Buttons/ClearMemoryButton';
import ClearCPUButton from '../Buttons/ClearCPUButton';
import LoadButton from '../Buttons/LoadButton';
import StepButton from '../Buttons/StepButton';


class RegisterDisplay extends Component {

  render() {
    const { instruction_register, program_counter, registers, onRunClick, onStepClick, onClearMemoryClick, onClearCPUClick } = this.props;
    
    return (
      <div className="register-display">
        <h2>Registers</h2>
        <div className="register-grid">
          <div className="register-cell">
            <span className="register-address">IR</span>
            <span className="register-value">{instruction_register.toString(16).padStart(2, '0').toUpperCase()}</span>
          </div>
          <div className="register-cell highlight">
            <span className="register-address">PC</span>
            <span className="register-value">{program_counter.toString(16).padStart(2, '0').toUpperCase()}</span>
          </div>
          {registers.map((value, address) => (
            <div key={address} className="register-cell">
              <span className="register-address">0x{address.toString(16).padStart(1, '0').toUpperCase()}</span>
              <span className="register-value"> {value.toString(16).padStart(2, '0').toUpperCase()}</span>
            </div>
          ))}
        </div>
        <div className="button-container">
          <RunButton onClick={onRunClick} />
          <StepButton onClick={onStepClick} />
          <ClearMemoryButton onClick={onClearMemoryClick} />
          <ClearCPUButton onClick={onClearCPUClick} />
        </div>
      </div>
    );
  }
}

export default RegisterDisplay;
