import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Merchants from './pages/Merchants';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <header className="bg-green-700 text-white p-4 shadow">
          <h1 className="text-2xl font-bold text-center">Locall</h1>
          <p className="text-center text-sm mb-4">Descubra Lages-SC, faça check-in nos pontos turísticos e desbloqueie cupons exclusivos!</p>
          <nav className="flex justify-center gap-4">
            <Link to="/" className="text-white hover:text-green-200 font-medium">Home</Link>
            <Link to="/merchants" className="text-white hover:text-green-200 font-medium">Comerciantes</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/merchants" element={<Merchants />} />
          </Routes>
        </main>
        <footer className="text-center text-xs text-gray-500 py-4">&copy; {new Date().getFullYear()} Locall</footer>
      </div>
    </Router>
  );
}

export default App;
