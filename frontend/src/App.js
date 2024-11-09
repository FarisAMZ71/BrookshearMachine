import React, { useState, useEffect } from 'react';
import MemoryDisplay from './components/MemoryDisplay/MemoryDisplay';
import RegisterDisplay from './components/RegisterDisplay/RegisterDisplay';
import './components/MemoryDisplay/MemoryDisplay.css';
import './components/RegisterDisplay/RegisterDisplay.css';
import axios from 'axios';

function App() {
  const [data, setData] = useState(null);
  const [memory, setMemory] = useState(Array(256).fill(0));
  const [registers, setRegisters] = useState(Array(16).fill(0));

  useEffect(() => {
    axios.get('/api/test')
      .then((response) => {
        setData(response.data.message);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    axios.get('/api/memory')
      .then((response) => {
        setMemory(response.data.message.flat(1));
      })
      .catch((error) => console.error('Error fetching memory:', error));
  }, []);

  useEffect(() => {
    axios.get('/api/registers')
      .then((response) => {
        console.log('Data fetched:', response.data.message.registers);
        setRegisters(response.data.message.registers);
      })
      .catch((error) => console.error('Error fetching registers:', error));
  } , []);

  return (
    <div className="app-header">
      <h1>Backend connection check</h1>
      <p>{data ? data : "Loading..."}</p>
      <h1>Register Viewer</h1>
      <RegisterDisplay registers={registers} />
      <h1>Memory Viewer</h1>
      <MemoryDisplay memory={memory} />
    </div>
    
  );
}

export default App;