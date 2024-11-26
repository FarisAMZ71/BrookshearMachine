import React, { Component } from 'react';
import './AssemblyDisplay.css'; 
import ConvertButton from '../Buttons/ConvertButton';
import LoadButton from '../Buttons/LoadButton';

class AssemblyDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assemblyCode: '', // State to hold user input
      machineCode: '' // State to hold the converted machine code
    };

    // Bind event handlers
    this.handleConvert = this.handleConvert.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  // Handler to convert assembly code to machine code
  handleConvert() {
    // Make a POST request to the server
    fetch('/api/convert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ assemblyCode: this.state.assemblyCode })
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
        this.setState({ machineCode: data.machineCode });
        this.props.onMachineCodeGenerated(data.machineCode);
      })
      .catch(error => {
        console.error(error.message);
        this.setState({ machineCode: 'Error converting code: ' + error.message });
      });
  }

  // Handler to update state with user input
  handleInputChange(event) {
    this.setState({ assemblyCode: event.target.value });
  }

  render() {
    const { machineCode} = this.state;
    const { onLoadClick } = this.props;

    return (
      <div className="assembler-container">
        <h2>Assembler</h2>
        <textarea
          className="assembly-input"
          placeholder="Enter assembly code here..."
          onChange={this.handleInputChange}
        />
        <div className="button-container">
          <ConvertButton onClick={this.handleConvert}/>
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
