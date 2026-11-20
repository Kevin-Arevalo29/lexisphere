import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Modules from './pages/Modules';
import Evaluation from './pages/Evaluation';
import ActivitySession from './pages/ActivitySession';

export default function App() {
  return (
    <Router>
      <div className="container-fluid px-3 px-md-4 px-lg-5 py-4" style={{ maxWidth: '1500px' }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/modules" element={<Modules />} />
          <Route path="/modules/:moduleId/:activityType" element={<ActivitySession />} />
          <Route path="/evaluation" element={<Evaluation />} />
        </Routes>
      </div>
    </Router>
  );
}