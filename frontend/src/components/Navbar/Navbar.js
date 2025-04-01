import React, { Component } from "react";
import "./Navbar.css"; // We'll define styles in this CSS file

class Navbar extends Component {
  render() {
    const { handleChangeModeClick } = this.props;
    return (
        <header>
            <h1>Brookshear +</h1>
            <nav>
            <a onClick={(e) => handleChangeModeClick("Base", e)}>Home</a>
            <a onClick={(e) => handleChangeModeClick("Stack", e)}>Stack</a>
            <a onClick={(e) => handleChangeModeClick("Mode 2", e)}>Mode 2</a>
            <a onClick={(e) => handleChangeModeClick("Mode 3", e)}>Mode 3</a>
            <a onClick={(e) => handleChangeModeClick("Mode 4", e)}>Mode 4</a>
            <div class="animation start-home"></div>
            </nav>
        </header>
            
    );
  }
}

export default Navbar;
