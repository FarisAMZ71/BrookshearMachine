import React, { Component } from "react";
import "./Navbar.css"; // We'll define styles in this CSS file

class Navbar extends Component {
  render() {
    return (
        <header>
            <h1>Brookshear +</h1>
            <nav>
            <a href="#">Home</a>
            <a href="#">Mode 1</a>
            <a href="#">Mode 2</a>
            <a href="#">Mode 3</a>
            <a href="#">Mode 4</a>
            <div class="animation start-home"></div>
            </nav>
        </header>
            
    );
  }
}

export default Navbar;
