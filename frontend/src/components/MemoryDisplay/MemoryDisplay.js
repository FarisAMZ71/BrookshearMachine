import React, { Component } from 'react';
import './MemoryDisplay.css';

class MemoryDisplay extends Component {
    // Function to create memory cells
    createMemoryCells = (memory) => {
        return memory.map((value, address) => {
            const isRightColumn = address % 2 === 1;
            const cellClass = isRightColumn ? 'memory-cell right-column' : 'memory-cell';

            return (
                <div key={address} className={cellClass}>
                    <span className="memory-address">
                        0x{address.toString(16).padStart(2, '0').toUpperCase()}
                    </span>
                    <span className="memory-value">
                        {value.toString(16).padStart(2, '0').toUpperCase()}
                    </span>
                </div>
            );
        });
    };

    render() {
        const { memory } = this.props;

        return (
            <div className="memory-display">
                <h2>Memory</h2>
                <div className="memory-grid">
                    {this.createMemoryCells(memory)} 
                </div>
            </div>
        );
    }
}

export default MemoryDisplay;
