import React, { Component } from 'react';
import './App.css';
import main from './main';

class App extends Component {
  render() {

    return (
      <div className="App">
        <h1> Form with hook "useStatefulForm" </h1>
        <header className="App-header">
           <main.Form />
        </header>
      </div>
    );
  }
}

export default App;
