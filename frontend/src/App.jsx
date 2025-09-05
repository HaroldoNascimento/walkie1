import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './components/Login';
import WalkTracker from './components/WalkTracker';
import Achievements from './components/Achievements';
import Dogs from './components/Dogs';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Walkie</h1>
          {isAuthenticated && (
            <nav>
              <Link to="/walk">Passeio</Link>
              <Link to="/dogs">Meus Cães</Link>
              <Link to="/achievements">Conquistas</Link>
              <button onClick={handleLogout}>Sair</button>
            </nav>
          )}
        </header>
        <main>
          <Routes>
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            {isAuthenticated ? (
              <>
                <Route path="/walk" element={<WalkTracker />} />
                <Route path="/dogs" element={<Dogs />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="*" element={<Navigate to="/walk" />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/login" />} />
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;


