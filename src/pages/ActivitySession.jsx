import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { modulesData } from '../data/modulesData';
import { saveActivityProgress } from '../utils/evaluationStorage';

// Importaciones Módulo 1 (Social Media & Technology)
import ReadingM1 from '../components/activities/modulo1/ReadingActivity';
import ListeningM1 from '../components/activities/modulo1/ListeningActivity';
import SpeakingM1 from '../components/activities/modulo1/SpeakingActivity';
import WritingM1 from '../components/activities/modulo1/WritingActivity';

// Importaciones Módulo 2 (The Plastic Problem / Environment)
import ReadingActivityM2 from '../components/activities/modulo2/ReadingActivityM2';
import ListeningActivityM2 from '../components/activities/modulo2/ListeningActivityM2';
import SpeakingActivityM2 from '../components/activities/modulo2/SpeakingActivityM2';
import WritingActivityM2 from '../components/activities/modulo2/WritingActivityM2';

// Importaciones Módulo 3 (Building a Fairer Society)
import ReadingActivityM3 from '../components/activities/modulo3/ReadingActivityM3';
import ListeningActivityM3 from '../components/activities/modulo3/ListeningActivityM3';
import SpeakingActivityM3 from '../components/activities/modulo3/SpeakingActivityM3';
import WritingActivityM3 from '../components/activities/modulo3/WritingActivityM3';

// Importaciones de Modulo 4 (Final Evaluation / Final Test)
import FinalTest from '../components/activities/modulo4/FinalTest';
import EvaluationModule from '../components/activities/modulo4/EvaluationModule';

export default function ActivitySession() {
  const { moduleId, activityType } = useParams();
  const navigate = useNavigate();

  const module = modulesData.find(m => m.id === moduleId) || modulesData[0];
  const activity = module.activities[activityType] || module.activities.reading;

  const steps = ['reading', 'listening', 'speaking', 'writing'];
  const currentStepIndex = steps.indexOf(activityType);

  const [completed, setCompleted] = useState(false);
  const [lastScore, setLastScore] = useState(null);

  const recordCompletion = (score) => {
    const isPending = score === null || score === undefined;
    saveActivityProgress({
      moduleId: moduleId || module?.id,
      activityType,
      score: isPending ? null : score,
      pending: isPending
    });
  };

  const handleActivityComplete = (score) => {
    recordCompletion(score);
    setLastScore(score);
    setCompleted(true);
  };

  const handleNextActivity = () => {
    if (currentStepIndex < steps.length - 1) {
      navigate(`/modules/${moduleId}/${steps[currentStepIndex + 1]}`);
      setCompleted(false);
    } else {
      navigate('/evaluation');
    }
  };

  // Identificar automáticamente el Módulo actual
  const modIdStr = String(moduleId).toLowerCase();
  const modTitleStr = String(module?.title).toLowerCase();

  const isModule4 =
    modIdStr.includes('4') ||
    modIdStr.includes('economy') ||
    modIdStr.includes('final') ||
    modTitleStr.includes('4') ||
    modTitleStr.includes('economy') ||
    modTitleStr.includes('final');
  const isModule3 = modIdStr.includes('3') || modIdStr.includes('society') || modTitleStr.includes('society') || modTitleStr.includes('fairer');
  const isModule2 = modIdStr.includes('2') || modIdStr.includes('env') || modTitleStr.includes('environment') || modTitleStr.includes('plastic');

  const isEvaluationSection =
    activityType === 'evaluation' ||
    modIdStr.includes('evaluation') ||
    modTitleStr.includes('evaluation');

  return (
    <div>
      {!completed ? (
        <div>
          {/* --- MÓDULO 4 (FINAL TEST / FINAL EVALUATION) --- */}
          {isModule4 ? (
            isEvaluationSection ? (
              <EvaluationModule
                activityData={activity}
                onComplete={handleActivityComplete}
              />
            ) : (
              <FinalTest
                activityData={activity}
                onComplete={(score) => {
                  const normalizedScore =
                    typeof score === 'number' ? Math.min(100, Math.round(score * 2)) : 0;
                  handleActivityComplete(normalizedScore);
                }}
              />
            )
          ) : isModule3 ? (
            /* --- MÓDULO 3 (BUILDING A FAIRER SOCIETY) --- */
            <>
              {activityType === 'reading' && (
                <ReadingActivityM3 
                  activityData={activity} 
                  onComplete={(score) => {
                    recordCompletion(score ?? 100);
                    setCompleted(true);
                  }} 
                />
              )}

              {activityType === 'listening' && (
                <ListeningActivityM3 
                  activityData={activity} 
                  onComplete={(score) => {
                    recordCompletion(score ?? 100);
                    setCompleted(true);
                  }} 
                />
              )}

              {activityType === 'speaking' && (
                <SpeakingActivityM3 
                  activityData={activity} 
                  onComplete={(score) => {
                    recordCompletion(score ?? null);
                    setCompleted(true);
                  }} 
                />
              )}
               {activityType === 'writing' && (
                <WritingActivityM3 
                  activityData={activity} 
                  onComplete={(score) => {
                    recordCompletion(score ?? null);
                    setCompleted(true);
                  }} 
                />
              )}
              {/* Si luego agregas listening, speaking o writing para el Módulo 3, van aquí */}
              {activityType !== 'reading' && (
                <div className="card border-0 shadow-sm rounded-4 p-5 bg-white text-center">
                  <h3 className="fw-bold text-dark">{activity.title}</h3>
                  <p className="text-muted">{activity.desc}</p>
                  <button 
                    onClick={() => {
                      recordCompletion(100);
                      setCompleted(true);
                    }}
                    className="btn btn-purple rounded-pill px-4 py-2 mt-3 fw-semibold mx-auto"
                  >
                    Complete Activity <i className="bi bi-check2 ms-1"></i>
                  </button>
                </div>
              )}
            </>
          ) : isModule2 ? (
            /* --- MÓDULO 2 (ENVIRONMENT) --- */
            <>
              {activityType === 'reading' && (
                <ReadingActivityM2 
                  activityData={activity} 
                  onComplete={(score) => {
                    recordCompletion(score ?? 100);
                    setCompleted(true);
                  }} 
                />
              )}

              {activityType === 'listening' && (
                <ListeningActivityM2 
                  activityData={activity} 
                  onComplete={(score) => {
                    recordCompletion(score ?? 100);
                    setCompleted(true);
                  }} 
                />
              )}

              {activityType === 'speaking' && (
                <SpeakingActivityM2 
                  activityData={activity} 
                  onComplete={(score) => {
                    recordCompletion(score ?? null);
                    setCompleted(true);
                  }} 
                />
              )}

              {activityType === 'writing' && (
                <WritingActivityM2 
                  activityData={activity} 
                  onComplete={(score) => {
                    recordCompletion(score ?? null);
                    setCompleted(true);
                  }} 
                />
              )}
            </>
          ) : (
            /* --- MÓDULO 1 (SOCIAL MEDIA & TECHNOLOGY) --- */
            <>
              {activityType === 'reading' && (
                <ReadingM1 
                  activityData={activity} 
                  onComplete={(score) => {
                    recordCompletion(score ?? 100);
                    setCompleted(true);
                  }} 
                />
              )}
              {activityType === 'listening' && (
                <ListeningM1
                  activityData={activity}
                  onComplete={(score) => {
                    recordCompletion(score ?? 100);
                    setCompleted(true);
                  }}
                /> 
              )}

              {activityType === 'speaking' && (
                <SpeakingM1 
                  activityData={activity} 
                  onComplete={(score) => {
                    recordCompletion(score ?? null);
                    setCompleted(true);
                  }} 
                />
              )}

              {activityType === 'writing' && (
                <WritingM1 
                  activityData={activity} 
                  onComplete={(score) => {
                    recordCompletion(score ?? null);
                    setCompleted(true);
                  }} 
                />
              )}

              {activityType === 'listening' && (
                <div className="card border-0 shadow-sm rounded-4 p-5 bg-white text-center">
                  <h3 className="fw-bold text-dark">{activity.title}</h3>
                  <p className="text-muted">{activity.desc}</p>
                  <button 
                    onClick={() => {
                      recordCompletion(100);
                      setCompleted(true);
                    }}
                    className="btn btn-purple rounded-pill px-4 py-2 mt-3 fw-semibold mx-auto"
                  >
                    Complete Activity <i className="bi bi-check2 ms-1"></i>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 p-5 bg-white text-center py-5">
          <div className="display-3 text-success mb-3">
            <i className="bi bi-check-circle-fill"></i>
          </div>
          <h3 className="fw-bold text-dark">Activity Completed Successfully!</h3>
          <p className="text-muted mb-2">
            Your score has been saved.
          </p>
          {typeof lastScore === 'number' && (
            <div className="display-6 fw-bold mb-4" style={{ color: '#6C4AB6' }}>
              Score: {lastScore}%
            </div>
          )}
          <button 
            onClick={() => (isModule4 ? navigate('/evaluation') : handleNextActivity())}
            className="btn btn-purple btn-lg rounded-pill px-5 fw-semibold"
          >
            {isModule4
              ? 'View General Evaluation 🏆'
              : currentStepIndex < steps.length - 1
              ? 'Next Activity ➔'
              : 'View Final Evaluation 🏆'}
          </button>
        </div>
      )}
    </div>
  );
}