import React from 'react';
import './App.css';
import Header from './Header.js';
import Form from './Form.js';

function App() {
  return (
    <div className="App">
      <div className="container align-items-center">
        <Header/>
        <Form/>
      </div>
    </div>
  );
}

export default App;
