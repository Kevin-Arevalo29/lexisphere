import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EvaluationModule({ evaluationData, onComplete }) {
  const navigate = useNavigate();

  const defaultModulesSummary = [
    {
      id: 'modulo-1',
      title: 'Module 1 · Social Media & Technology',
      weightPercent: 25,
      gradedScore: 80,
      gradedMax: 100,
      gradedItems: ['Reading (Auto-graded)', 'Listening Sequence (Auto-graded)'],
      pendingItems: ['Speaking / Oral Production (Pending Grading)']
    },
    {
      id: 'modulo-2',
      title: 'Module 2 · The Plastic Problem / Environment',
      weightPercent: 25,
      gradedScore: 90,
      gradedMax: 100,
      gradedItems: ['Reading', 'Listening'],
      pendingItems: ['Speaking & Writing Rubric Review']
    },
    {
      id: 'modulo-3',
      title: 'Module 3 · Building a Fairer Society',
      weightPercent: 25,
      gradedScore: 85,
      gradedMax: 100,
      gradedItems: ['Reading', 'Listening'],
      pendingItems: ['Speaking & Writing Rubric Review']
    },
    {
      id: 'modulo-4',
      title: 'Module 4 · Final Test (100 pts)',
      weightPercent: 25,
      gradedScore: 40,
      gradedMax: 50,
      gradedItems: ['Reading (25 pts)', 'Listening (25 pts)'],
      pendingItems: ['Writing Essay (25 pts · Rubric)', 'Speaking Production (25 pts · Rubric)']
    }
  ];

  const [modulesList, setModulesList] = useState(defaultModulesSummary);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'graded' | 'pending'

  useEffect(() => {
    if (Array.isArray(evaluationData) && evaluationData.length > 0) {
      setModulesList(evaluationData);
      return;
    }

    try {
      const saved = localStorage.getItem('english_course_evaluation');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setModulesList(parsed);
        }
      }
    } catch {
      // Mantiene los valores iniciales si no hay datos en localStorage
    }
  }, [evaluationData]);

  const enrichedModules = modulesList.map((mod) => {
    const safeMax = mod.gradedMax > 0 ? mod.gradedMax : 100;
    const safeScore = typeof mod.gradedScore === 'number' ? mod.gradedScore : 0;
    const moduleAchievementPercent = Math.round((safeScore / safeMax) * 100);
    const weightedPointsEarned = Number(
      ((moduleAchievementPercent / 100) * mod.weightPercent).toFixed(1)
    );

    return {
      ...mod,
      moduleAchievementPercent,
      weightedPointsEarned
    };
  });

  const totalCourseWeight = enrichedModules.reduce((acc, m) => acc + m.weightPercent, 0);
  const totalGradedWeightedPercent = Number(
    enrichedModules.reduce((acc, m) => acc + m.weightedPointsEarned, 0).toFixed(1)
  );
  const totalPendingWeightedPercent = Number(
    Math.max(0, totalCourseWeight - totalGradedWeightedPercent).toFixed(1)
  );
  const totalPendingItemsCount = enrichedModules.reduce(
    (acc, m) => acc + (m.pendingItems ? m.pendingItems.length : 0),
    0
  );
  const totalGradedItemsCount = enrichedModules.reduce(
    (acc, m) => acc + (m.gradedItems ? m.gradedItems.length : 0),
    0
  );

  const filteredModules = enrichedModules.filter((mod) => {
    if (activeFilter === 'graded') return mod.gradedItems && mod.gradedItems.length > 0;
    if (activeFilter === 'pending') return mod.pendingItems && mod.pendingItems.length > 0;
    return true;
  });

  return (
    <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4 p-lg-5 bg-white w-100">
      {/* Encabezado */}
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <span
            className="badge px-3 py-2 rounded-pill fw-bold mb-2 d-inline-block"
            style={{ backgroundColor: '#EDE9FE', color: '#6C4AB6' }}
          >
            Evaluation Module · Percentages & Status
          </span>
          <h2 className="fw-bold mb-1" style={{ color: '#1E1248' }}>
            Evaluation & Scores Summary
          </h2>
          <p className="text-muted small mb-0">
            View each module percentage, already graded results, and items pending grading upon entering.
          </p>
        </div>

        <div className="d-flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className="btn btn-sm rounded-pill px-3 py-2 fw-semibold"
            style={{
              backgroundColor: activeFilter === 'all' ? '#6C4AB6' : '#FFFFFF',
              color: activeFilter === 'all' ? '#FFFFFF' : '#1E1248',
              border: '1px solid #6C4AB6'
            }}
          >
            All ({enrichedModules.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('graded')}
            className="btn btn-sm rounded-pill px-3 py-2 fw-semibold"
            style={{
              backgroundColor: activeFilter === 'graded' ? '#6C4AB6' : '#FFFFFF',
              color: activeFilter === 'graded' ? '#FFFFFF' : '#1E1248',
              border: '1px solid #6C4AB6'
            }}
          >
            Graded ({totalGradedItemsCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('pending')}
            className="btn btn-sm rounded-pill px-3 py-2 fw-semibold"
            style={{
              backgroundColor: activeFilter === 'pending' ? '#6C4AB6' : '#FFFFFF',
              color: activeFilter === 'pending' ? '#FFFFFF' : '#1E1248',
              border: '1px solid #6C4AB6'
            }}
          >
            Pending Grading ({totalPendingItemsCount})
          </button>
        </div>
      </div>

      {/* Tarjetas superiores: Ya calificado vs Pendiente por calificar */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div
            className="p-4 rounded-4 border h-100 shadow-sm"
            style={{ backgroundColor: '#F8F7FC', borderColor: '#DDD6FE' }}
          >
            <span className="small text-muted fw-semibold d-block mb-1">
              Already Graded (%)
            </span>
            <div className="fs-2 fw-bold" style={{ color: '#6C4AB6' }}>
              {totalGradedWeightedPercent}%{' '}
              <span className="fs-6 fw-normal text-muted">/ {totalCourseWeight}%</span>
            </div>
            <span className="badge rounded-pill bg-success-subtle text-success mt-2 px-3 py-1">
              {totalGradedItemsCount} graded results
            </span>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="p-4 rounded-4 border h-100 shadow-sm"
            style={{ backgroundColor: '#F8F7FC', borderColor: '#DDD6FE' }}
          >
            <span className="small text-muted fw-semibold d-block mb-1">
              Pending Grading (%)
            </span>
            <div className="fs-2 fw-bold" style={{ color: '#1E1248' }}>
              {totalPendingWeightedPercent}%
            </div>
            <span className="badge rounded-pill bg-warning text-dark mt-2 px-3 py-1">
              {totalPendingItemsCount} pending items
            </span>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="p-4 rounded-4 border h-100 shadow-sm"
            style={{ backgroundColor: '#F8F7FC', borderColor: '#DDD6FE' }}
          >
            <span className="small text-muted fw-semibold d-block mb-1">
              Module Weights
            </span>
            <div className="fs-2 fw-bold" style={{ color: '#6C4AB6' }}>
              4 × 25%
            </div>
            <span
              className="badge rounded-pill mt-2 px-3 py-1"
              style={{ backgroundColor: '#EDE9FE', color: '#6C4AB6' }}
            >
              Modules 1 – 4
            </span>
          </div>
        </div>
      </div>

      {/* Detalle por módulo */}
      <div className="d-flex flex-column gap-4 mb-4">
        {filteredModules.map((mod) => (
          <div
            key={mod.id}
            className="p-4 rounded-4 border shadow-sm"
            style={{ backgroundColor: '#F8F7FC', borderColor: '#DDD6FE' }}
          >
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
              <div>
                <h5 className="fw-bold mb-1" style={{ color: '#1E1248' }}>
                  {mod.title}
                </h5>
                <span className="small text-muted">
                  Weight: <strong>{mod.weightPercent}%</strong> · Graded score:{' '}
                  <strong>{mod.moduleAchievementPercent}%</strong> ({mod.gradedScore}/{mod.gradedMax} pts)
                </span>
              </div>

              <div className="d-flex align-items-center gap-2">
                <span
                  className="badge rounded-pill px-3 py-2 fw-bold"
                  style={{ backgroundColor: '#EDE9FE', color: '#6C4AB6' }}
                >
                  {mod.weightedPointsEarned}% / {mod.weightPercent}%
                </span>
                {mod.pendingItems && mod.pendingItems.length > 0 && (
                  <span className="badge rounded-pill bg-warning text-dark px-3 py-2 fw-bold">
                    Pending Grading
                  </span>
                )}
              </div>
            </div>

            <div className="progress rounded-pill mb-3" style={{ height: '10px', backgroundColor: '#EDE9FE' }}>
              <div
                className="progress-bar rounded-pill"
                role="progressbar"
                style={{
                  width: `${Math.min(100, Math.round((mod.weightedPointsEarned / mod.weightPercent) * 100))}%`,
                  backgroundColor: '#6C4AB6'
                }}
              />
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <div className="p-3 rounded-3 bg-white border h-100">
                  <div className="fw-bold small mb-2 text-success">
                    <i className="bi bi-check-circle-fill me-1"></i> Already Graded Results
                  </div>
                  {mod.gradedItems && mod.gradedItems.length > 0 ? (
                    <ul className="small text-dark mb-0 ps-3 d-flex flex-column gap-1">
                      {mod.gradedItems.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="small text-muted">No graded items yet.</span>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="p-3 rounded-3 bg-white border h-100">
                  <div className="fw-bold small mb-2 text-warning-emphasis">
                    <i className="bi bi-hourglass-split me-1"></i> Pending Grading
                  </div>
                  {mod.pendingItems && mod.pendingItems.length > 0 ? (
                    <ul className="small text-dark mb-0 ps-3 d-flex flex-column gap-1">
                      {mod.pendingItems.map((pending, idx) => (
                        <li key={idx}>{pending}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="small text-success fw-semibold">All items graded.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navegación */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn btn-outline-secondary rounded-pill px-4 py-2 fw-semibold"
        >
          <i className="bi bi-arrow-left me-1"></i> Back
        </button>

        <button
          type="button"
          onClick={() => (onComplete ? onComplete(totalGradedWeightedPercent) : navigate('/evaluation'))}
          className="btn btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
          style={{ backgroundColor: '#6C4AB6', borderColor: '#6C4AB6', color: '#FFFFFF' }}
        >
          Complete Evaluation View <i className="bi bi-arrow-right ms-2"></i>
        </button>
      </div>
    </div>
  );
}