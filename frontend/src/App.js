import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('/api/data')
      .then((response) => {
        setData(response.data.message);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="app-header">
      <h1>React + Flask Integration</h1>
      <p>{data ? data : "Loading..."}</p>
    </div>
  );
}

export default App;