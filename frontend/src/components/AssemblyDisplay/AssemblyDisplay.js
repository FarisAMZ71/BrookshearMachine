import React, { Component } from 'react';
import './AssemblyDisplay.css'; 
import ConvertButton from '../Buttons/ConvertButton';
import LoadButton from '../Buttons/LoadButton';

class AssemblyDisplay extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { assemblyCode, machineCode, onAssemblyCodeGenerated, onConvertClick, onLoadClick } = this.props;

    return (
      <div className="assembler-container">
        <h2>Assembler</h2>
        <textarea
          className="assembly-input"
          value={assemblyCode} 
          placeholder="Enter assembly code here..."
          onChange={onAssemblyCodeGenerated}
        />
        <div className="button-container">
          <ConvertButton onClick={onConvertClick}/>
          <LoadButton onClick={onLoadClick}/>
        </div>
        <div className="machine-code-display">
          <h3>Machine Code</h3>
          <pre>{machineCode || 'No output yet'}</pre>
        </div>
      </div>
    );
  }
}

export default AssemblyDisplay;
