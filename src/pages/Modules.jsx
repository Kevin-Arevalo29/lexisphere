import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { modulesData } from '../data/modulesData';

export default function Modules() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate(); // <-- 1. Inicializamos el hook de navegación
  const selectedId = searchParams.get('id') || modulesData[0].id;

  const currentModule = modulesData.find(m => m.id === selectedId) || modulesData[0];

  const activityIcons = {
    reading: { icon: 'bi-book-fill', color: '#8B5CF6' },
    listening: { icon: 'bi-headphones', color: '#10B981' },
    speaking: { icon: 'bi-mic-fill', color: '#F59E0B' },
    writing: { icon: 'bi-pencil-fill', color: '#3B82F6' }
  };

  return (
    <div>
      {/* Selector de Módulo */}
      <div className="card border-0 rounded-4 p-4 mb-4 shadow-sm bg-white">
        <div className="row align-items-center">
          <div className="col-md-3 text-center mb-3 mb-md-0">
            <img 
              src={currentModule.image} 
              alt={currentModule.title} 
              className="img-fluid rounded-4 shadow-sm"
              style={{ maxHeight: '120px', objectFit: 'cover', width: '100%' }}
            />
          </div>
          <div className="col-md-9">
            <span className="badge rounded-pill bg-purple-light text-purple px-3 py-2 fw-bold mb-2">
              Module {modulesData.findIndex(m => m.id === currentModule.id) + 1}
            </span>
            <h2 className="fw-bold" style={{ color: '#1E1248' }}>{currentModule.title}</h2>
            <p className="text-muted mb-0">{currentModule.subtitle}</p>
          </div>
        </div>
      </div>

      {currentModule.id === 'economy' ? (
        <div className="text-center py-4">
          <button
            onClick={() => navigate(`/modules/${currentModule.id}/reading`)}
            className="btn btn-purple btn-lg rounded-pill px-5 py-3 fw-semibold shadow-sm"
          >
            Take a final test <i className="bi bi-arrow-right ms-2"></i>
          </button>
        </div>
      ) : (
        <>
          {/* Tarjetas de 4 Actividades */}
          <h4 className="fw-bold text-center mb-4" style={{ color: '#1E1248' }}>Activities</h4>
          <div className="row g-4 mb-4">
            {Object.entries(currentModule.activities).map(([key, act]) => (
              <div className="col-12 col-sm-6 col-md-3" key={key}>
                <div className="card border-0 shadow-sm rounded-4 text-center p-3 h-100 bg-white activity-card">
                  <div className="icon-wrapper mx-auto mb-3" style={{ color: activityIcons[key].color }}>
                    <i className={`bi ${activityIcons[key].icon} fs-1`}></i>
                  </div>
                  <h5 className="fw-bold" style={{ color: '#1E1248' }}>{act.title}</h5>
                  <p className="text-muted small mb-4">{act.desc}</p>
                  <button
                    onClick={() => navigate(`/modules/${currentModule.id}/${key}`)}
                    className="btn btn-purple rounded-pill px-4 mt-auto fw-semibold"
                  >
                    Start <i className="bi bi-arrow-right ms-1"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Banner inferior de navegación a evaluación */}
          <div className="bg-purple-light p-3 rounded-4 text-center d-flex align-items-center justify-content-center gap-2">
            <i className="bi bi-trophy-fill text-warning fs-5"></i>
            <span className="fw-semibold text-purple">Complete all activities and take the final evaluation!</span>
          </div>
        </>
      )}
    </div>
  );
}