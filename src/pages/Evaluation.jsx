import React from 'react';
import { modulesData } from '../data/modulesData';

export default function Evaluation() {
  const averageScore = Math.round(
    modulesData.reduce((acc, curr) => acc + curr.score, 0) / modulesData.length
  );

  return (
    <div className="text-center">
      <div className="mb-4">
        <i className="bi bi-trophy-fill display-4 text-warning mb-2 d-inline-block"></i>
        <h2 className="fw-bold" style={{ color: '#1E1248' }}>General Evaluation</h2>
        <p className="text-muted">Check your performance in each module</p>
      </div>

      {/* Tarjetas de Desempeño por Módulo */}
      <div className="row g-4 mb-5">
        {modulesData.map((module) => (
          <div className="col-12 col-sm-6 col-md-3" key={module.id}>
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100 d-flex flex-column align-items-center justify-content-between">
              <h6 className="fw-bold text-center mb-3" style={{ color: '#1E1248', minHeight: '38px' }}>
                {module.title}
              </h6>
              
              {/* Gráfico circular simple */}
              <div className="progress-circle my-2" style={{
                background: `conic-gradient(${module.status === 'Passed' ? '#10B981' : '#F59E0B'} ${module.score * 3.6}deg, #E5E7EB 0deg)`
              }}>
                <div className="inner-circle fw-bold fs-4 text-dark">
                  {module.score}%
                </div>
              </div>

              <span className={`badge rounded-pill mt-3 px-3 py-2 ${
                module.status === 'Passed' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning-emphasis'
              }`}>
                <i className={`bi ${module.status === 'Passed' ? 'bi-check-circle-fill' : 'bi-clock-fill'} me-1`}></i>
                {module.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Score Final */}
      <div className="final-score-card bg-purple text-white p-4 rounded-4 d-flex align-items-center justify-content-center gap-3 shadow-lg">
        <i className="bi bi-star-fill display-5 text-warning"></i>
        <div className="text-start">
          <h3 className="fw-bold mb-0">Your Final Score: {averageScore}%</h3>
          <p className="mb-0 text-white-50">Great job! Keep learning! 🎉</p>
        </div>
      </div>
    </div>
  );
}