import React, { useState, useEffect } from 'react';

export default function ListeningActivityM2({ activityData, onComplete }) {
  const [step, setStep] = useState('intro'); // 'intro', 'part1', 'part2', 'results'
  
  // --- TEMPORIZADOR (20 minutos = 1200 segundos) ---
  const [timeLeft, setTimeLeft] = useState(1200);
  const [timerActive, setTimerActive] = useState(false);
  const [timeSpent, setTimeSpent] = useState({ minutes: 0, seconds: 0 });

  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      handleFinishAll(0, 0);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const startTimer = () => {
    setTimerActive(true);
    setStep('part1');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- PARTE 1: Preguntas de completar espacios ---
  const questionsPart1 = [
    {
      id: 1,
      text: '1. Climate change causes higher _____.',
      options: ['temperatures', 'forests', 'recycling'],
      correct: 'temperatures'
    },
    {
      id: 2,
      text: '2. Deforestation destroys natural _____.',
      options: ['habitats', 'bottles', 'transportation'],
      correct: 'habitats'
    },
    {
      id: 3,
      text: '3. Renewable energy can help reduce _____.',
      options: ['pollution', 'wildlife', 'farmland'],
      correct: 'pollution'
    },
    {
      id: 4,
      text: '4. People should use public _____ instead of private cars.',
      options: ['transportation', 'consumption', 'deforestation'],
      correct: 'transportation'
    }
  ];

  const [answersPart1, setAnswersPart1] = useState({ 1: '', 2: '', 3: '', 4: '' });
  const [scorePart1, setScorePart1] = useState(0);

  const handleOptionSelectPart1 = (qId, option) => {
    setAnswersPart1(prev => ({ ...prev, [qId]: option }));
  };

  const handleSubmitPart1 = () => {
    let correctCount = 0;
    questionsPart1.forEach(q => {
      if (answersPart1[q.id] === q.correct) correctCount++;
    });
    const p1Score = Math.round((correctCount / questionsPart1.length) * 100);
    setScorePart1(p1Score);
    setStep('part2');
  };

  // --- PARTE 2: Identificar las 3 soluciones (Listening challenge) ---
  const optionsPart2 = [
    { id: 'opt1', text: 'Using renewable energy', correct: true },
    { id: 'opt2', text: 'Throwing rubbish into rivers', correct: false },
    { id: 'opt3', text: 'Saving water', correct: true },
    { id: 'opt4', text: 'Reducing plastic consumption', correct: true },
    { id: 'opt5', text: 'Cutting down more trees', correct: false }
  ];

  const [selectedOptPart2, setSelectedOptPart2] = useState([]);
  const [scorePart2, setScorePart2] = useState(0);

  const handleCheckboxToggle = (optId) => {
    setSelectedOptPart2(prev => {
      if (prev.includes(optId)) {
        return prev.filter(id => id !== optId);
      } else {
        return [...prev, optId];
      }
    });
  };

  const handleSubmitPart2 = () => {
    let correctSelected = 0;
    let penalty = 0;

    selectedOptPart2.forEach(id => {
      const item = optionsPart2.find(o => o.id === id);
      if (item && item.correct) {
        correctSelected++;
      } else {
        penalty++;
      }
    });

    let finalP2 = Math.round(((correctSelected - penalty) / 3) * 100);
    if (finalP2 < 0) finalP2 = 0;
    setScorePart2(finalP2);

    handleFinishAll(scorePart1, finalP2);
  };

  const [finalOverallScore, setFinalOverallScore] = useState(0);

  const handleFinishAll = (s1, s2) => {
    setTimerActive(false);
    const totalSecondsSpent = 1200 - timeLeft;
    setTimeSpent({
      minutes: Math.floor(totalSecondsSpent / 60),
      seconds: totalSecondsSpent % 60
    });

    const overall = Math.round((s1 + s2) / 2);
    setFinalOverallScore(overall);
    setStep('results');
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4 p-lg-5 bg-white w-100 position-relative">
      
      {/* Temporizador superior */}
      {step !== 'intro' && step !== 'results' && (
        <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded-4 border">
          <span className="fw-bold text-purple">
            <i className="bi bi-clock-history me-2"></i> Listening Time Remaining:
          </span>
          <span className={`badge px-3 py-2 fs-5 ${timeLeft < 300 ? 'bg-danger animate-pulse' : 'bg-purple'}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      )}

      {/* 1. INTRODUCCIÓN */}
      {step === 'intro' && (
        <div className="mx-auto text-center" style={{ maxWidth: '900px' }}>
          <span className="badge bg-purple-light text-purple px-3 py-2 rounded-pill fw-bold mb-2">
            Module 2 - Listening Mission
          </span>
          <h2 className="fw-bold mb-3" style={{ color: '#1E1248' }}>THE ENVIRONMENTAL PODCAST</h2>
          <p className="text-muted fs-5 fst-italic mb-4">Complete the Missing Information & Identify Solutions</p>

          <div className="p-4 rounded-4 bg-light mb-4 border-start border-4 text-start" style={{ borderColor: '#6C4AB6' }}>
            <h5 className="fw-bold mb-2" style={{ color: '#6C4AB6' }}>
              <i className="bi bi-headphones me-2"></i> LISTENING INSTRUCTIONS
            </h5>
            <p className="text-dark fs-6 mb-0" style={{ lineHeight: '1.6' }}>
              Listen to the environmental podcast and complete the sentences with the missing words. Then, identify the three correct sustainable actions mentioned by the guest[cite: 12, 13].
            </p>
          </div>

          <button 
            onClick={startTimer}
            className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-5 fw-bold shadow"
          >
            Start Listening Mission <i className="bi bi-arrow-right ms-2"></i>
          </button>
        </div>
      )}

      {/* REPRODUCTOR DE AUDIO FIJO */}
      {step !== 'intro' && step !== 'results' && (
        <div className="p-4 rounded-4 bg-light border mb-4 shadow-sm text-center">
          <h5 className="fw-bold text-purple mb-3">
            <i className="bi bi-headphones me-2"></i> The Environmental Podcast Audio
          </h5>
          <audio controls className="w-100" style={{ maxWidth: '500px' }}>
            <source src="../../../../public/audio/AUDIO 2 - ENVIRONMENT LISTENING.ogg" type="audio/ogg" />
            Your browser does not support the audio element.
          </audio>
          <small className="text-muted d-block mt-2">You can replay the audio as many times as you need.</small>
        </div>
      )}

      {/* ========================================== */}
      {/* PARTE 1: COMPLETAR ORACIONES */}
      {/* ========================================== */}
      {step === 'part1' && (
        <div>
          <div className="mb-4 pb-3 border-bottom">
            <span className="badge bg-purple-light text-purple px-3 py-1 rounded-pill fw-bold">
              1. While listening – Complete the missing information
            </span>
            <h4 className="fw-bold text-dark mt-2 mb-0">Complete the sentences</h4>
          </div>

          <div className="d-flex flex-column gap-4 mb-5">
            {questionsPart1.map(q => (
              <div key={q.id} className="p-4 rounded-4 bg-light border shadow-sm">
                <h5 className="fw-bold text-dark mb-3">{q.text}</h5>
                <div className="d-flex flex-column gap-2">
                  {q.options.map((opt, idx) => (
                    <div 
                      key={idx}
                      onClick={() => handleOptionSelectPart1(q.id, opt)}
                      className="p-3 rounded-pill bg-white border d-flex align-items-center gap-3 transition-all"
                      style={{ cursor: 'pointer', borderColor: answersPart1[q.id] === opt ? '#6C4AB6' : '#E2E8F0', borderWidth: answersPart1[q.id] === opt ? '2px' : '1px' }}
                    >
                      <input 
                        type="radio" 
                        name={`qpart1-${q.id}`} 
                        checked={answersPart1[q.id] === opt}
                        onChange={() => handleOptionSelectPart1(q.id, opt)}
                        className="form-check-input m-0"
                      />
                      <span className="fw-semibold text-dark">{opt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-end">
            <button 
              onClick={handleSubmitPart1}
              disabled={!Object.values(answersPart1).every(Boolean)}
              className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
            >
              Continue to Challenge 2 <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* PARTE 2: IDENTIFY THE SOLUTION */}
      {/* ========================================== */}
      {step === 'part2' && (
        <div>
          <div className="mb-4 pb-3 border-bottom">
            <span className="badge bg-purple-light text-purple px-3 py-1 rounded-pill fw-bold">
              3. Listening challenge – Identify the solution[cite: 12, 13]
            </span>
            <h4 className="fw-bold text-dark mt-2 mb-0">Select the three correct options[cite: 12, 13]:</h4>
          </div>

          <div className="d-flex flex-column gap-3 mb-5">
            {optionsPart2.map(opt => {
              const isChecked = selectedOptPart2.includes(opt.id);
              return (
                <div
                  key={opt.id}
                  onClick={() => handleCheckboxToggle(opt.id)}
                  className="p-4 rounded-4 shadow-sm border d-flex align-items-center gap-3 transition-all"
                  style={{
                    cursor: 'pointer',
                    backgroundColor: isChecked ? '#EDE9FE' : '#FFFFFF',
                    borderColor: isChecked ? '#6C4AB6' : '#E2E8F0',
                    borderWidth: isChecked ? '2px' : '1px'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleCheckboxToggle(opt.id)}
                    className="form-check-input m-0"
                    style={{ width: '20px', height: '20px' }}
                  />
                  <span className="fw-semibold text-dark fs-6">{opt.text}</span>
                </div>
              );
            })}
          </div>

          <div className="text-end">
            <button 
              onClick={handleSubmitPart2}
              disabled={selectedOptPart2.length === 0}
              className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
            >
              Check selection & Finish Listening <i className="bi bi-check2-all ms-2"></i>
            </button>
          </div>
        </div>
      )}

      {/* 3. PANTALLA FINAL DE RESULTADOS */}
      {step === 'results' && (
        <div className="text-center py-4 mx-auto" style={{ maxWidth: '650px' }}>
          <div className="mb-2">
            <span className="display-2">
              {finalOverallScore >= 75 ? '😊' : '😕'}
            </span>
          </div>

          <h3 className="fw-bold text-dark mb-3">Listening Mission Completed!</h3>

          <div className={`p-4 rounded-4 mb-4 shadow-sm border ${finalOverallScore >= 75 ? 'bg-success-subtle border-success text-success-emphasis' : 'bg-warning-subtle border-warning text-warning-emphasis'}`}>
            <p className="fs-5 fw-bold mb-1">
              {finalOverallScore >= 75 ? 'Great listening comprehension!' : 'Good effort! Listen to the podcast audio again to improve.'}
            </p>
            <p className="fs-6 mb-0">
              Completed in <strong>{timeSpent.minutes}m {timeSpent.seconds}s</strong> with an overall score of <strong>{finalOverallScore}%</strong>.
            </p>
          </div>

          <div className="p-4 bg-light rounded-4 mb-4 border text-start">
            <h5 className="fw-bold text-purple mb-3">Listening Evaluation Summary:</h5>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0 small">
              <li>Part 1 Score (Sentence Completion): <strong>{scorePart1}%</strong></li>
              <li>Part 2 Score (Identify the Solutions): <strong>{scorePart2}%</strong></li>
            </ul>
          </div>

          <button 
            onClick={() => onComplete(finalOverallScore)}
            className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
          >
            Continue to Next Mission ➔
          </button>
        </div>
      )}
    </div>
  );
}