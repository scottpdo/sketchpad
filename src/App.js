import React, { Component } from 'react';
import Canvas from './components/Canvas';

import './App.css';

class App extends Component {
  render() {

    const container = {
      height: '100vh',
      width: '100vw',
    };

    return (
      <div style={container}>
        <Canvas />
      </div>
    );
  }
}

export default App;
