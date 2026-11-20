import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm py-3 px-4 rounded-4 mb-4">
      <div className="container-fluid">
        <NavLink className="navbar-brand d-flex align-items-center fw-bold text-primary fs-4" to="/">
          <i className="bi bi-globe2 me-2 fs-3 text-purple"></i>
          <span style={{ color: '#2B1C6D' }}>LexiSphere</span>
        </NavLink>
        
        <div className="d-flex align-items-center gap-3">
          <div className="navbar-nav d-flex flex-row gap-2 bg-light p-1 rounded-pill">
            <NavLink 
              to="/" 
              className={({ isActive }) => `nav-link px-3 rounded-pill fw-semibold ${isActive ? 'active-tab' : 'text-secondary'}`}
              end
            >
              <i className="bi bi-house-door-fill me-1"></i> Home
            </NavLink>
            <NavLink 
              to="/evaluation" 
              className={({ isActive }) => `nav-link px-3 rounded-pill fw-semibold ${isActive ? 'active-tab' : 'text-secondary'}`}
            >
              <i className="bi bi-trophy-fill me-1"></i> Evaluation
            </NavLink>
          </div>
          
          <div className="avatar-circle ms-2">
            <i className="bi bi-person-fill fs-4 text-white"></i>
          </div>
        </div>
      </div>
    </nav>
  );
}