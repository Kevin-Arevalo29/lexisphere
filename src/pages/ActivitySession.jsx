import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { modulesData } from '../data/modulesData';

// Importaciones Módulo 1 (Social Media & Technology)
import ReadingM1 from '../components/activities/modulo1/ReadingActivity';
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

export default function ActivitySession() {
  const { moduleId, activityType } = useParams();
  const navigate = useNavigate();

  const module = modulesData.find(m => m.id === moduleId) || modulesData[0];
  const activity = module.activities[activityType] || module.activities.reading;

  const steps = ['reading', 'listening', 'speaking', 'writing'];
  const currentStepIndex = steps.indexOf(activityType);

  const [completed, setCompleted] = useState(false);

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

  const isModule3 = modIdStr.includes('3') || modIdStr.includes('society') || modTitleStr.includes('society') || modTitleStr.includes('fairer');
  const isModule2 = modIdStr.includes('2') || modIdStr.includes('env') || modTitleStr.includes('environment') || modTitleStr.includes('plastic');

  return (
    <div>
      {!completed ? (
        <div>
          {/* --- MÓDULO 3 (BUILDING A FAIRER SOCIETY) --- */}
          {isModule3 ? (
            <>
              {activityType === 'reading' && (
                <ReadingActivityM3 
                  activityData={activity} 
                  onComplete={(score) => setCompleted(true)} 
                />
              )}

              {activityType === 'listening' && (
                <ListeningActivityM3 
                  activityData={activity} 
                  onComplete={(score) => setCompleted(true)} 
                />
              )}

              {activityType === 'speaking' && (
                <SpeakingActivityM3 
                  activityData={activity} 
                  onComplete={(score) => setCompleted(true)} 
                />
              )}
               {activityType === 'writing' && (
                <WritingActivityM3 
                  activityData={activity} 
                  onComplete={(score) => setCompleted(true)} 
                />
              )}
              {/* Si luego agregas listening, speaking o writing para el Módulo 3, van aquí */}
              {activityType !== 'reading' && (
                <div className="card border-0 shadow-sm rounded-4 p-5 bg-white text-center">
                  <h3 className="fw-bold text-dark">{activity.title}</h3>
                  <p className="text-muted">{activity.desc}</p>
                  <button 
                    onClick={() => setCompleted(true)}
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
                  onComplete={(score) => setCompleted(true)} 
                />
              )}

              {activityType === 'listening' && (
                <ListeningActivityM2 
                  activityData={activity} 
                  onComplete={(score) => setCompleted(true)} 
                />
              )}

              {activityType === 'speaking' && (
                <SpeakingActivityM2 
                  activityData={activity} 
                  onComplete={(score) => setCompleted(true)} 
                />
              )}

              {activityType === 'writing' && (
                <WritingActivityM2 
                  activityData={activity} 
                  onComplete={(score) => setCompleted(true)} 
                />
              )}
            </>
          ) : (
            /* --- MÓDULO 1 (SOCIAL MEDIA & TECHNOLOGY) --- */
            <>
              {activityType === 'reading' && (
                <ReadingM1 
                  activityData={activity} 
                  onComplete={(score) => setCompleted(true)} 
                />
              )}

              {activityType === 'speaking' && (
                <SpeakingM1 
                  activityData={activity} 
                  onComplete={(score) => setCompleted(true)} 
                />
              )}

              {activityType === 'writing' && (
                <WritingM1 
                  activityData={activity} 
                  onComplete={(score) => setCompleted(true)} 
                />
              )}

              {activityType === 'listening' && (
                <div className="card border-0 shadow-sm rounded-4 p-5 bg-white text-center">
                  <h3 className="fw-bold text-dark">{activity.title}</h3>
                  <p className="text-muted">{activity.desc}</p>
                  <button 
                    onClick={() => setCompleted(true)}
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
          <p className="text-muted mb-4">Your score has been saved.</p>
          <button 
            onClick={handleNextActivity}
            className="btn btn-purple btn-lg rounded-pill px-5 fw-semibold"
          >
            {currentStepIndex < steps.length - 1 ? 'Next Activity ➔' : 'View Final Evaluation 🏆'}
          </button>
        </div>
      )}
    </div>
  );
}