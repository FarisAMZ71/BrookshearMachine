import React from 'react';

const MemoryDisplay = ({ memory }) => {
    return (
        <div className="memory-display">
            <h2>Memory</h2>
            <div className="memory-grid">
                {memory.map((value, address) => (
                    <div key={address} className="memory-cell">
                        <span className="memory-address"> 0x{address.toString(16).padStart(2, '0').toUpperCase()}</span>
                        <span className="memory-value"> {value.toString(16).padStart(2, '0').toUpperCase()}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MemoryDisplay;