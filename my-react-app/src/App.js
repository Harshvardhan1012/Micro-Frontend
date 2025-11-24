import './App.css';
import HelloComponent from './heelo.jsx';
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useAppContext } from './context/AppContext';

function Home() {
  const { value, setValue } = useAppContext();
  return (
    <div>
      <h2>Home</h2>
      <p>Context value: {value}</p>
      <button onClick={() => setValue('updated from Home')}>Update Context</button>
      <HelloComponent text={'dsf'} />
    </div>
  );
}

function About() {
  const { value } = useAppContext();
  return (
    <div>
      <h2>About</h2>
      <p>Context value: {value}</p>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <nav style={{ marginBottom: 12 }}>
          <Link to="/">Home</Link> | <Link to="/about">About</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
