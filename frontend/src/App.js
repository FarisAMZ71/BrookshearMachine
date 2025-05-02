import React, { useState, useEffect, Component } from 'react';
import MachineDisplay from './components/MachineDisplay/MachineDisplay';
import Navbar from './components/Navbar/Navbar';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testCon: null,
      machine_mode: "Base"
    };

    this.handleChangeModeClick = this.handleChangeModeClick.bind(this);
    this.updateMachineMode = this.updateMachineMode.bind(this);
  }

  // Fetch the test connection message when the component mounts
  componentDidMount() {
    axios
      .get("/api/test")
      .then((response) => {
        this.setState({ testCon: response.data.message });
      })
      .catch((error) => console.error("Error fetching data:", error));
  }

    // Function to handle the "Mode" button click on navbar, updates both registers and memory
    handleChangeModeClick(mode, event) {
      event.preventDefault();
      fetch("/api/change_mode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ machine_mode: mode })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(data => {
          this.setState({ machine_mode: mode });
        })
        .catch(error => {
          console.error("There was a problem with the fetch operation:", error);
        });
    }

    updateMachineMode(mode) {
      this.setState({ machine_mode: mode });
    }

  render() {
    const { testCon } = this.state;
    return (
      
      <div className="app-header">
        <Navbar 
          handleChangeModeClick={this.handleChangeModeClick}/>
        <p>{testCon ? testCon : "Loading..."}</p>
        <MachineDisplay
          machine_mode={this.state.machine_mode}
          updateMachineMode={this.updateMachineMode}/>
      </div>
    );
  }
}

export default App;