import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Main from './Main'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Sites Assistant</h1>
        </header>
        <Main />
      </div>
    );
  }
}

export default App;
