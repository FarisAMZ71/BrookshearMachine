import React, { useState, useEffect, Component } from 'react';
import RunButton from '../Buttons/RunButton';
import ClearButton from '../Buttons/ClearButton';

class RegisterDisplay extends Component {

  render() {
    const { registers, onRunClick, onClearMemoryClick } = this.props;

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
        <div className="button-container">
          <RunButton onClick={onRunClick} />
          <ClearButton onClick={onClearMemoryClick} />
        </div>
      </div>
    );
  }
}

export default RegisterDisplay;
