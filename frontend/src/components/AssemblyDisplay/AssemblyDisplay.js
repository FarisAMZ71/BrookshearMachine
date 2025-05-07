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

    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // Insert 2 spaces at the cursor position
      const updatedValue = 
        textarea.value.substring(0, start) + 
        '  ' + 
        textarea.value.substring(end);

      textarea.value = updatedValue;

      // Move the cursor to the right of the inserted spaces
      textarea.selectionStart = textarea.selectionEnd = start + 2;

      // Trigger the onChange event to update the state
      onassembly_codeGenerated({
        target: { value: updatedValue }
      });
      }
    };

    return (
      <div className="assembler-container">
      <h2>Assembler</h2>
      <textarea
        className="assembly-input"
        value={assembly_code} 
        placeholder="Enter assembly code here..."
        onChange={onassembly_codeGenerated}
        onKeyDown={handleKeyDown}
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
