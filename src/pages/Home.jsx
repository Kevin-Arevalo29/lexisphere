import React from 'react';
import { useNavigate } from 'react-router-dom';
import { modulesData } from '../data/modulesData';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Banner Hero */}
      <div className="card border-0 rounded-4 p-4 p-md-5 mb-5 hero-banner position-relative overflow-hidden">
        <div className="row align-items-center">
          <div className="col-md-7 z-1">
            <h1 className="display-4 fw-bold mb-2" style={{ color: '#1E1248' }}>LexiSphere</h1>
            <h4 className="fw-bold mb-3" style={{ color: '#5f34ba' }}>Learn. Practice. Communicate.</h4>
            <p className="text-muted fs-5 mb-4 max-w-400">
              Expand your English vocabulary with interactive activities and real-life topics.
            </p>
            <button 
              onClick={() => navigate('/modules')}
              className="btn btn-purple btn-lg rounded-pill px-4 py-2 fw-semibold"
            >
              Start Learning <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
          <div className="col-md-5 text-center position-relative mt-4 mt-md-0">
            <div className="globe-illustration mx-auto">
              <i className="bi bi-globe-americas display-1 text-primary"></i>
              <div className="speech-bubble shadow-sm">
                <span>Let's learn together!</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección Our Modules */}
      <div className="mb-4">
        <h3 className="fw-bold mb-4" style={{ color: '#1E1248' }}>Our Modules</h3>
        <div className="row g-4">
          {modulesData.map((module) => (
            <div className="col-12 col-sm-6 col-lg-3" key={module.id}>
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden module-card">
                <img 
                  src={module.image} 
                  className="card-img-top module-img" 
                  alt={module.title} 
                />
                <div className="card-body d-flex flex-column justify-content-between text-center p-3">
                  <h6 className="card-title fw-bold my-2" style={{ color: '#1E1248', minHeight: '40px' }}>
                    {module.title}
                  </h6>
                  <button 
                    onClick={() => navigate(`/modules?id=${module.id}`)}
                    className="btn btn-purple-outline rounded-pill w-100 fw-semibold mt-2"
                  >
                    Explore <i className="bi bi-arrow-right ms-1"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}