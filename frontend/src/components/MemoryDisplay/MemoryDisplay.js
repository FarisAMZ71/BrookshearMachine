import React, { useState } from "react";
import "./MemoryDisplay.css";

const MemoryDisplay = ({ memory, program_counter }) => {
  const [viewMode, setViewMode] = useState("list"); // Toggle between List and Grid View

  const handleViewChange = (event) => {
    setViewMode(event.target.value);
  };

  const renderListView = () => {
    return memory.map((value, address) => {
        const isRightColumn = address % 2 === 1; // Identifies 2nd column
        console.log("Address: ", address);
        console.log("Program Counter: ", program_counter);
        return (
            <div key={address} className={`memory-cell ${address === program_counter? "highlight" : ""}`}>
                {!isRightColumn && ( // First Column: Address on Left, Value on Right
                    <span className="memory-address">
                        0x{address.toString(16).padStart(2, "0").toUpperCase()}
                    </span>
                )}
                <span className="memory-value">
                    {value.toString(16).padStart(2, "0").toUpperCase()}
                </span>
                {isRightColumn && ( // Second Column: Value in Middle, Address on Right
                    <span className="memory-address">
                        0x{address.toString(16).padStart(2, "0").toUpperCase()}
                    </span>
                )}
            </div>
        );
    });
};


  // Generates the Grid View (16x16 memory layout)
  const renderGridView = () => {
    let grid = [];
    for (let row = 0; row < 16; row++) {
      let rowCells = [];
      for (let col = 0; col < 16; col++) {
        const address = row * 16 + col;
        rowCells.push(
          <td key={address} className={`memory-grid-cell ${address === program_counter ? "highlight" : ""}`}>
            {memory[address].toString(16).padStart(2, "0").toUpperCase()}
          </td>
        );
      }
      grid.push(
        <tr key={row}>
          <th>{row.toString(16).toUpperCase()}</th> {/* Row Header */}
          {rowCells}
        </tr>
      );
    }

    return (
      <table className="memory-grid">
        <thead>
          <tr>
            <th></th>
            {Array.from({ length: 16 }, (_, i) => (
              <th key={i}>{i.toString(16).toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody>{grid}</tbody>
      </table>
    );
  };

  return (
    <div className={`memory-display ${viewMode === "list" ? "list-mode" : "grid-mode"}`}>
        <h2>Memory</h2>
        <div className="view-toggle">
            <label>
                <input
                    type="radio"
                    value="list"
                    checked={viewMode === "list"}
                    onChange={handleViewChange}
                />
                List View
            </label>
            <label>
                <input
                    type="radio"
                    value="grid"
                    checked={viewMode === "grid"}
                    onChange={handleViewChange}
                />
                Grid View
            </label>
        </div>
        <div className="memory-container">
            {viewMode === "list" ? (
                <div className="memory-list">{renderListView()}</div>
            ) : (
                <div className="memory-grid-container">{renderGridView()}</div>
            )}
        </div>
    </div>
);
};


export default MemoryDisplay;
