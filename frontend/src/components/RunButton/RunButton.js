import React from 'react';

const RunButton = () => {
  const handleClick = () => {
    fetch("/api/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: "Run command initiated" }) 
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        console.log("Server response:", data);
      })
      .catch(error => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  return (
    <button onClick={handleClick}>Run</button> 
  );
};

export default RunButton;