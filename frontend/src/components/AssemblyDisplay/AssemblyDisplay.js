import React, { Component } from 'react';
import './AssemblyDisplay.css'; 
import ConvertButton from '../Buttons/ConvertButton';
import LoadButton from '../Buttons/LoadButton';

class AssemblyDisplay extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { assembly_code, machine_code, onassembly_codeGenerated, onConvertClick, onLoadClick } = this.props;

    return (
      <div className="assembler-container">
        <h2>Assembler</h2>
        <textarea
          className="assembly-input"
          value={assembly_code} 
          placeholder="Enter assembly code here..."
          onChange={onassembly_codeGenerated}
        />
        <div className="button-container">
          <ConvertButton onClick={onConvertClick}/>
          <LoadButton onClick={onLoadClick}/>
        </div>
        <div className="machine-code-display">
          <h3>Machine Code</h3>
          <pre>{machine_code || 'No output yet'}</pre>
        </div>
      </div>
    );
  }
}

export default AssemblyDisplay;
