import React, { useState, useEffect } from 'react';
import {
  loadCourseProgress,
  buildEvaluationModules,
  resetCourseProgress
} from '../utils/evaluationStorage';

export default function Evaluation() {
  const [modulesEvaluated, setModulesEvaluated] = useState(() =>
    buildEvaluationModules(loadCourseProgress())
  );

  useEffect(() => {
    const syncProgress = () => {
      setModulesEvaluated(buildEvaluationModules(loadCourseProgress()));
    };

    syncProgress();
    window.addEventListener('storage', syncProgress);
    window.addEventListener('focus', syncProgress);

    return () => {
      window.removeEventListener('storage', syncProgress);
      window.removeEventListener('focus', syncProgress);
    };
  }, []);

  const averageScore = Math.round(
    modulesEvaluated.reduce((acc, curr) => acc + (Number(curr.score) || 0), 0) /
      Math.max(1, modulesEvaluated.length)
  );

  const allPendingTests = modulesEvaluated.flatMap((mod) =>
    (mod.tests || [])
      .filter((t) => t.pending)
      .map((t) => `${mod.title}: ${t.name}`)
  );

  const handleReset = () => {
    resetCourseProgress();
    setModulesEvaluated(buildEvaluationModules({}));
  };

  return (
    <div className="text-center">
      <div className="mb-4">
        <i className="bi bi-trophy-fill display-4 text-warning mb-2 d-inline-block"></i>
        <h2 className="fw-bold" style={{ color: '#1E1248' }}>General Evaluation</h2>
        <p className="text-muted">Check your performance in each module</p>
      </div>

      {/* Tarjetas de Desempeño por Módulo */}
      <div className="row g-4 mb-5">
        {modulesEvaluated.map((module) => {
          const scoreVal = Number(module.score) || 0;
          const pendingCount = (module.tests || []).filter((t) => t.pending).length;

          return (
            <div className="col-12 col-sm-6 col-md-3" key={module.id}>
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100 d-flex flex-column align-items-center justify-content-between">
                <h6 className="fw-bold text-center mb-3" style={{ color: '#1E1248', minHeight: '38px' }}>
                  {module.title}
                </h6>

                {/* Gráfico circular */}
                <div
                  className="progress-circle my-2"
                  style={{
                    background: `conic-gradient(${
                      module.status === 'Passed' ? '#10B981' : '#F59E0B'
                    } ${scoreVal * 3.6}deg, #E5E7EB 0deg)`
                  }}
                >
                  <div className="inner-circle fw-bold fs-4 text-dark">
                    {scoreVal}%
                  </div>
                </div>

                {/* Barra de porcentaje dinámica del módulo */}
                <div className="w-100 mt-2">
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Progress</span>
                    <span className="fw-semibold">{scoreVal}%</span>
                  </div>
                  <div className="progress rounded-pill" style={{ height: '8px', backgroundColor: '#EDE9FE' }}>
                    <div
                      className="progress-bar rounded-pill"
                      role="progressbar"
                      style={{
                        width: `${Math.min(100, Math.max(0, scoreVal))}%`,
                        backgroundColor: module.status === 'Passed' ? '#10B981' : '#6C4AB6',
                        transition: 'width 0.35s ease'
                      }}
                    />
                  </div>
                </div>

                <span
                  className={`badge rounded-pill mt-3 px-3 py-2 ${
                    module.status === 'Passed'
                      ? 'bg-success-subtle text-success'
                      : 'bg-warning-subtle text-warning-emphasis'
                  }`}
                >
                  <i
                    className={`bi ${
                      module.status === 'Passed' ? 'bi-check-circle-fill' : 'bi-clock-fill'
                    } me-1`}
                  ></i>
                  {module.status}
                </span>

                {/* Porcentajes de cada prueba y lo que falta por calificar */}
                <div className="w-100 border-top mt-3 pt-3 text-start">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="small fw-bold text-secondary">Tests & Percentages</span>
                    {pendingCount > 0 && (
                      <span className="badge rounded-pill bg-warning text-dark">
                        {pendingCount} pending
                      </span>
                    )}
                  </div>

                  <div className="d-flex flex-column gap-1">
                    {(module.tests || []).map((test, idx) => (
                      <div
                        key={idx}
                        className="d-flex justify-content-between align-items-center small px-2 py-1 rounded-2"
                        style={{
                          backgroundColor: test.pending ? '#FFFBEB' : '#F8F7FC'
                        }}
                      >
                        <span className="text-dark text-truncate me-2">{test.name}</span>
                        {test.pending ? (
                          <span className="badge bg-warning text-dark">Pending</span>
                        ) : (
                          <span
                            className={`fw-bold ${
                              test.completed ? 'text-success' : 'text-muted'
                            }`}
                          >
                            {test.percentage}%
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Score Final + Pendientes por calificar */}
      <div className="final-score-card bg-purple text-white p-4 rounded-4 d-flex flex-column flex-lg-row align-items-center justify-content-between gap-3 shadow-lg">
        <div className="d-flex align-items-center gap-3">
          <i className="bi bi-star-fill display-5 text-warning"></i>
          <div className="text-start">
            <h3 className="fw-bold mb-0">Your Final Score: {averageScore}%</h3>
            <p className="mb-0 text-white-50">Great job! Keep learning! 🎉</p>
          </div>
        </div>

        <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-3 w-100" style={{ maxWidth: '580px' }}>
          <div
            className="p-3 rounded-3 text-start flex-grow-1"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <div className="small fw-bold text-warning mb-1">
              <i className="bi bi-hourglass-split me-1"></i>
              Pending Grading ({allPendingTests.length})
            </div>
            {allPendingTests.length > 0 ? (
              <div className="d-flex flex-wrap gap-1">
                {allPendingTests.map((item, idx) => (
                  <span key={idx} className="badge bg-warning text-dark">
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <span className="small text-light">No pending tests to grade.</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="btn btn-sm btn-outline-light rounded-pill px-3 py-2 align-self-center"
          >
            Reset 0%
          </button>
        </div>
      </div>
    </div>
  );
}