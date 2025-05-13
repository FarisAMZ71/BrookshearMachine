import React, { Component } from "react";
import "./Navbar.css"; // We'll define styles in this CSS file

class Navbar extends Component {
  render() {
    const { handleChangeModeClick, updateShowHelp } = this.props;
    return (
        <header>
            <h1>Brookshear +</h1>
            <nav>
            <a onClick={(e) => handleChangeModeClick("Base", e)}>Home</a>
            <a onClick={(e) => handleChangeModeClick("Stack", e)}>Stack</a>
            <a onClick={(e) => handleChangeModeClick("Branch", e)}>Branch</a>
            <div className="animation start-home"></div>
            </nav>
            <a className="menu-btn" onClick={(e) => updateShowHelp()}>
              Help
            </a>
        </header>
            
    );
  }
}

export default Navbar;
