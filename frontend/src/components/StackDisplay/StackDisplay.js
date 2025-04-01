import { Component } from 'react';
import './StackDisplay.css';

class StackDisplay extends Component {
  render() {
    const { stack, stackPointer, machine_mode } = this.props;
    // console.log("StackPointer: ", stackPointer);
    return (
      <div className={`stack-display ${machine_mode === "Stack" ? "show" : "hidden"}`}>
        <h2>Stack</h2>
        <div className="stack-grid">
            <div className="stack-pointer-cell">
                <span className="stack-pointer">SP</span>
                <span className="stack-pointer-value"> {stackPointer.toString(16).padStart(2, '0').toUpperCase()}</span>
            </div>
          {stack.map((value, address) => (
            <div key={address} className="stack-cell">
              <span className="stack-value"> {value.toString(16).padStart(2, '0').toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default StackDisplay;