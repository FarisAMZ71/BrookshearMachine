import React, { useState, useEffect } from 'react';
import MachineDisplay from './components/MachineDisplay/MachineDisplay';
import Navbar from './components/Navbar/Navbar';
import axios from 'axios';

function App() {
  const [testCon, setTestCon] = useState(null);
  // Get test connection message
  useEffect(() => {
    axios.get('/api/test')
      .then((response) => {
        setTestCon(response.data.message);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);


  return (
    <div className="app-header">
      <Navbar/>
      <p>{testCon ? testCon : "Loading..."}</p>
      <MachineDisplay/>
    </div>
    
  );
}

export default App;