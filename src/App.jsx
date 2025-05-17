import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Merchants from './pages/Merchants';

function App() {
  return (
    <Router>
      <div className="h-screen w-screen overflow-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/merchants" element={<Merchants />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
