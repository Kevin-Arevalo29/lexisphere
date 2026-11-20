import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initialEvaluationModules } from '../../../data/evaluationData';

export default function FinalEvaluation({ evaluationData }) {
  const navigate = useNavigate();
  const [modulesList, setModulesList] = useState(initialEvaluationModules);

  useEffect(() => {
    if (Array.isArray(evaluationData) && evaluationData.length > 0) {
      setModulesList(evaluationData);
      return;
    }

    try {
      const saved = localStorage.getItem('lexisphere_evaluation_modules');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setModulesList(parsed);
        }
      }
    } catch {
      // Usa los datos iniciales si no hay registros guardados
    }
  }, [evaluationData]);

  const finalScore = Math.round(
    modulesList.reduce((acc, mod) => acc + (Number(mod.percentage) || 0), 0) /
      Math.max(1, modulesList.length)
  );

  const pendingTestsList = modulesList.flatMap((mod) =>
    (mod.tests || [])
      .filter((t) => !t.graded)
      .map((t) => `${mod.title}: ${t.name}`)
  );

  const getRingStyle = (pct, color) => {
    const safePct = Math.max(0, Math.min(100, Number(pct) || 0));
    return {
      width: '108px',
      height: '108px',
      borderRadius: '50%',
      background: `conic-gradient(${color} ${safePct * 3.6}deg, #E5E7EB 0deg)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto'
    };
  };

  return (
    <div
      className="min-vh-100 py-4 px-3 px-md-5"
      style={{ backgroundColor: '#F6F5FB' }}
    >
      <div className="mx-auto" style={{ maxWidth: '1240px' }}>
        {/* Barra superior estilo LexiSphere */}
        <div className="bg-white rounded-4 px-4 py-3 shadow-sm d-flex flex-wrap justify-content-between align-items-center gap-3 mb-5">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-globe2 fs-4" style={{ color: '#5B21B6' }}></i>
            <span className="fw-bold fs-4" style={{ color: '#1E1248' }}>
              LexiSphere
            </span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-light rounded-pill px-4 py-2 fw-semibold text-secondary"
            >
              <i className="bi bi-house-door-fill me-1"></i> Home
            </button>

            <button
              type="button"
              className="btn rounded-pill px-4 py-2 fw-semibold text-white shadow-sm"
              style={{ backgroundColor: '#5B21B6', borderColor: '#5B21B6' }}
            >
              <i className="bi bi-trophy-fill me-1"></i> Evaluation
            </button>

            <div
              className="rounded-circle d-flex align-items-center justify-content-center text-white ms-1"
              style={{ width: '38px', height: '38px', backgroundColor: '#1E1B4B' }}
            >
              <i className="bi bi-person-fill"></i>
            </div>
          </div>
        </div>

        {/* Título central con trofeo */}
        <div className="text-center mb-5">
          <div className="fs-1 mb-2">🏆</div>
          <h1 className="fw-bold mb-1" style={{ color: '#111827', fontSize: '2.1rem' }}>
            General Evaluation
          </h1>
          <p className="text-muted mb-0">
            Check your performance in each module
          </p>
        </div>

        {/* 4 Tarjetas de Módulos con porcentajes de pruebas y pendientes */}
        <div className="row g-4 mb-5">
          {modulesList.map((mod) => {
            const pendingCount = (mod.tests || []).filter((t) => !t.graded).length;
            const isPassed = mod.statusVariant === 'passed';

            return (
              <div key={mod.id} className="col-12 col-sm-6 col-xl-3">
                <div className="bg-white rounded-4 p-4 shadow-sm h-100 d-flex flex-column justify-content-between">
                  <div>
                    <h6
                      className="fw-bold text-center mb-4"
                      style={{ color: '#111827', minHeight: '38px' }}
                    >
                      {mod.title}
                    </h6>

                    {/* Círculo de porcentaje */}
                    <div className="mb-3" style={getRingStyle(mod.percentage, mod.ringColor)}>
                      <div
                        className="bg-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
                        style={{ width: '84px', height: '84px', color: '#111827', fontSize: '1.35rem' }}
                      >
                        {mod.percentage}%
                      </div>
                    </div>

                    {/* Estado del módulo */}
                    <div className="text-center mb-4">
                      <span
                        className="badge rounded-pill px-3 py-2 fw-semibold"
                        style={{
                          backgroundColor: isPassed ? '#DCFCE7' : '#FEF3C7',
                          color: isPassed ? '#15803D' : '#B45309'
                        }}
                      >
                        {isPassed ? '✓ Passed' : '◔ In Progress'}
                      </span>
                    </div>

                    {/* Desglose de cada prueba y su porcentaje / pendiente */}
                    <div className="border-top pt-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="small fw-bold text-secondary">Tests Breakdown</span>
                        {pendingCount > 0 && (
                          <span className="badge rounded-pill bg-warning-subtle text-warning-emphasis">
                            {pendingCount} pending
                          </span>
                        )}
                      </div>

                      <div className="d-flex flex-column gap-2">
                        {(mod.tests || []).map((test, idx) => (
                          <div
                            key={idx}
                            className="d-flex justify-content-between align-items-center small px-2 py-1 rounded-2"
                            style={{
                              backgroundColor: test.graded ? '#F8F7FC' : '#FFFBEB'
                            }}
                          >
                            <span className="text-dark fw-medium">{test.name}</span>
                            {test.graded ? (
                              <span className="fw-bold text-success">{test.score}</span>
                            ) : (
                              <span className="badge bg-warning text-dark">Pending</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Banner inferior morado oscuro con puntaje final y pendientes por calificar */}
        <div
          className="rounded-4 p-4 p-md-5 text-white shadow"
          style={{ backgroundColor: '#240A6B' }}
        >
          <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between gap-4">
            <div className="d-flex align-items-center gap-3 text-center text-lg-start">
              <div className="fs-1">⭐</div>
              <div>
                <h2 className="fw-bold mb-1" style={{ fontSize: '1.85rem' }}>
                  Your Final Score: {finalScore}%
                </h2>
                <p className="mb-0 text-white-50">
                  Great job! Keep learning! 🎉
                </p>
              </div>
            </div>

            {/* Bloque de lo que falta por calificar */}
            <div
              className="p-3 rounded-3 w-100"
              style={{
                maxWidth: '540px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <div className="small fw-bold text-warning mb-1">
                <i className="bi bi-hourglass-split me-1"></i>
                Pending to Grade ({pendingTestsList.length})
              </div>
              {pendingTestsList.length > 0 ? (
                <div className="d-flex flex-wrap gap-1">
                  {pendingTestsList.map((item, idx) => (
                    <span
                      key={idx}
                      className="badge bg-warning text-dark fw-semibold"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="small text-light">All tests have been graded.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}