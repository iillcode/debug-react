import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';

import Home from './components/Home';
import AuthSection from './components/AuthSection';
import DatabaseSection from './components/DatabaseSection';
import StorageSection from './components/StorageSection';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/auth">Authentication</Link></li>
            <li><Link to="/database">Database</Link></li>
            <li><Link to="/storage">Storage</Link></li>
          </ul>
        </nav>

        <hr />

        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthSection />} />
            <Route path="/database" element={<DatabaseSection />} />
            <Route path="/storage" element={<StorageSection />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
