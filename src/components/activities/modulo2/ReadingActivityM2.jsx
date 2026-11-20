import React, { useState, useEffect, useRef } from 'react';

export default function ReadingActivityM2({ activityData, onComplete }) {
  // Fases: 'intro', 'activity1' (Problemas/Consecuencias), 'activity2' (Vocabulario), 'activity3' (Pregunta Final), 'results'
  const [step, setStep] = useState('intro'); 
  
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
      finalizeActivity(0);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const startTimer = () => {
    setTimerActive(true);
    setStep('activity1');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- ESTADO DEL TEXTO DE LECTURA (Desplegable) ---
  const [showReadingText, setShowReadingText] = useState(false);

  // ==========================================
  // ACTIVIDAD 1: Problemas y Consecuencias
  // ==========================================
  const problems1 = [
    { id: '1', text: '1. Plastic waste in oceans', correctMatch: 'C' },
    { id: '2', text: '2. Animals eating plastic', correctMatch: 'B' },
    { id: '3', text: '3. Excessive use of plastic bags', correctMatch: 'A' }
  ];

  const consequences1 = [
    { id: 'A', text: 'A. More rubbish in landfills' },
    { id: 'B', text: 'B. Wildlife is affected' },
    { id: 'C', text: 'C. Ocean pollution' }
  ];

  const [userMatches1, setUserMatches1] = useState({ '1': null, '2': null, '3': null });
  const [attempts1, setAttempts1] = useState(2);
  const [errorMsg1, setErrorMsg1] = useState('');
  const [feedback1, setFeedback1] = useState({});
  const [score1, setScore1] = useState(0);

  // ==========================================
  // ACTIVIDAD 3: Vocabulary detective
  // ==========================================
  const words3 = [
    { id: '1', text: '1. Waste', correctMatch: 'B' },      // Materials people throw away
    { id: '2', text: '2. Reusable', correctMatch: 'A' },   // Something that can be used again
    { id: '3', text: '3. Landfill', correctMatch: 'D' },   // A place where rubbish is buried
    { id: '4', text: '4. Sustainable', correctMatch: 'C' },// Something that can be maintained without harming nature
    { id: '5', text: '5. Excessive', correctMatch: 'E' }    // More than necessary
  ];

  const meanings3 = [
    { id: 'A', text: 'A. Something that can be used again' },
    { id: 'B', text: 'B. Materials people throw away' },
    { id: 'C', text: 'C. Something that can be maintained without harming nature' },
    { id: 'D', text: 'D. A place where rubbish is buried' },
    { id: 'E', text: 'E. More than necessary' }
  ];

  const [userMatches3, setUserMatches3] = useState({ '1': null, '2': null, '3': null, '4': null, '5': null });
  const [attempts3, setAttempts3] = useState(2);
  const [errorMsg3, setErrorMsg3] = useState('');
  const [feedback3, setFeedback3] = useState({});
  const [score3, setScore3] = useState(0);

  // ==========================================
  // ACTIVIDAD 4: Final Challenge (Opción C)
  // ==========================================
  const [selectedOption4, setSelectedOption4] = useState('');
  const [score4, setScore4] = useState(0);

  // --- SELECCIÓN GENERAL DE LÍNEAS / CLIC / DRAG & DROP ---
  const [selectedLeftId, setSelectedLeftId] = useState(null);
  const [draggedRightId, setDraggedRightId] = useState(null);
  const boardRef = useRef(null);
  const leftRefs = useRef({});
  const rightRefs = useRef({});
  const [lines, setLines] = useState([]);

  const updateLines = (activeMatches, activeFeedback) => {
    if (!boardRef.current) return;
    const boardRect = boardRef.current.getBoundingClientRect();
    const newLines = [];

    Object.entries(activeMatches).forEach(([leftId, rightId]) => {
      if (!rightId) return;
      const leftEl = leftRefs.current[leftId];
      const rightEl = rightRefs.current[rightId];

      if (leftEl && rightEl) {
        const lRect = leftEl.getBoundingClientRect();
        const rRect = rightEl.getBoundingClientRect();

        newLines.push({
          id: `${leftId}-${rightId}`,
          leftId,
          x1: lRect.right - boardRect.left,
          y1: lRect.top + lRect.height / 2 - boardRect.top,
          x2: rRect.left - boardRect.left,
          y2: rRect.top + rRect.height / 2 - boardRect.top,
          status: activeFeedback[leftId] || 'pending'
        });
      }
    });

    setLines(newLines);
  };

  useEffect(() => {
    if (step === 'activity1') {
      const t = setTimeout(() => updateLines(userMatches1, feedback1), 40);
      return () => clearTimeout(t);
    } else if (step === 'activity2') {
      const t = setTimeout(() => updateLines(userMatches3, feedback3), 40);
      return () => clearTimeout(t);
    }
  }, [userMatches1, feedback1, userMatches3, feedback3, showReadingText, step]);

  // Manejadores de conexión Actividad 1
  const assignMatch1 = (probId, consId) => {
    if (feedback1[probId] === 'correct') return;
    setUserMatches1(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(k => {
        if (next[k] === consId && feedback1[k] !== 'correct') next[k] = null;
      });
      next[probId] = consId;
      return next;
    });
    setSelectedLeftId(null);
  };

  // Manejadores de conexión Actividad 3
  const assignMatch3 = (wordId, meaningId) => {
    if (feedback3[wordId] === 'correct') return;
    setUserMatches3(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(k => {
        if (next[k] === meaningId && feedback3[k] !== 'correct') next[k] = null;
      });
      next[wordId] = meaningId;
      return next;
    });
    setSelectedLeftId(null);
  };

  // Validar Actividad 1
  const handleCheckActivity1 = () => {
    let statusMap = {};
    let correctCount = 0;
    let incorrectIds = [];

    problems1.forEach(p => {
      if (userMatches1[p.id] === p.correctMatch) {
        statusMap[p.id] = 'correct';
        correctCount++;
      } else {
        statusMap[p.id] = 'incorrect';
        incorrectIds.push(p.id);
      }
    });

    setFeedback1(statusMap);

    if (correctCount === 3) {
      setScore1(100);
      setTimeout(() => {
        setStep('activity2');
        setSelectedLeftId(null);
      }, 1100);
    } else {
      if (attempts1 > 1) {
        setAttempts1(prev => prev - 1);
        setErrorMsg1('Some connections are incorrect. 1 opportunity left. Incorrect ones will disconnect.');
        setTimeout(() => {
          setUserMatches1(prev => {
            const next = { ...prev };
            incorrectIds.forEach(id => { next[id] = null; });
            return next;
          });
          setFeedback1(prev => {
            const cleaned = {};
            Object.keys(prev).forEach(k => { if (prev[k] === 'correct') cleaned[k] = 'correct'; });
            return cleaned;
          });
          setErrorMsg1('');
        }, 2000);
      } else {
        setScore1(Math.round((correctCount / 3) * 100));
        setTimeout(() => {
          setStep('activity2');
          setSelectedLeftId(null);
        }, 1500);
      }
    }
  };

  // Validar Actividad 3 (Vocabulary detective)
  const handleCheckActivity3 = () => {
    let statusMap = {};
    let correctCount = 0;
    let incorrectIds = [];

    words3.forEach(w => {
      if (userMatches3[w.id] === w.correctMatch) {
        statusMap[w.id] = 'correct';
        correctCount++;
      } else {
        statusMap[w.id] = 'incorrect';
        incorrectIds.push(w.id);
      }
    });

    setFeedback3(statusMap);

    if (correctCount === 5) {
      setScore3(100);
      setTimeout(() => {
        setStep('activity3');
      }, 1100);
    } else {
      if (attempts3 > 1) {
        setAttempts3(prev => prev - 1);
        setErrorMsg3('Some vocabulary links are incorrect. 1 opportunity left. Incorrect ones will disconnect.');
        setTimeout(() => {
          setUserMatches3(prev => {
            const next = { ...prev };
            incorrectIds.forEach(id => { next[id] = null; });
            return next;
          });
          setFeedback3(prev => {
            const cleaned = {};
            Object.keys(prev).forEach(k => { if (prev[k] === 'correct') cleaned[k] = 'correct'; });
            return cleaned;
          });
          setErrorMsg3('');
        }, 2000);
      } else {
        setScore3(Math.round((correctCount / 5) * 100));
        setTimeout(() => {
          setStep('activity3');
        }, 1500);
      }
    }
  };

  // Validar Actividad 4 (Final Challenge)
  const handleCheckActivity4 = () => {
    const isCorrect = selectedOption4 === 'C';
    const finalS4 = isCorrect ? 100 : 0;
    setScore4(finalS4);

    setTimerActive(false);
    const totalSecondsSpent = 1200 - timeLeft;
    setTimeSpent({
      minutes: Math.floor(totalSecondsSpent / 60),
      seconds: totalSecondsSpent % 60
    });

    // Promedio final de las 3 fases de lectura
    const overallPercentage = Math.round((score1 + score3 + finalS4) / 3);
    setFinalScore({ percentage: overallPercentage });
    setStep('results');
  };

  const [finalScore, setFinalScore] = useState({ percentage: 0 });

  return (
    <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4 p-lg-5 bg-white w-100 position-relative">
      
      {/* Temporizador superior */}
      {step !== 'intro' && step !== 'results' && (
        <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded-4 border">
          <span className="fw-bold text-purple">
            <i className="bi bi-clock-history me-2"></i> Reading Time Remaining:
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
            Module 2 - Reading Mission
          </span>
          <h2 className="fw-bold mb-3" style={{ color: '#1E1248' }}>BECOME AN ECO-DETECTIVE</h2>
          <p className="text-muted fs-5 fst-italic mb-4">The Plastic Problem: Can We Change the Future?</p>

          <div className="p-4 rounded-4 bg-light mb-4 border-start border-4 text-start" style={{ borderColor: '#6C4AB6' }}>
            <h5 className="fw-bold mb-2" style={{ color: '#6C4AB6' }}>
              <i className="bi bi-shield-exclamation me-2"></i> MISSION OBJECTIVE
            </h5>
            <p className="text-dark fs-6 mb-0" style={{ lineHeight: '1.6' }}>
              Complete the interactive reading challenges: find the environmental evidence, solve the vocabulary detective mission, and choose the best solution. You can open or close the report text at any time.
            </p>
          </div>

          <button 
            onClick={startTimer}
            className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-5 fw-bold shadow"
          >
            Start Eco-Detective Mission <i className="bi bi-arrow-right ms-2"></i>
          </button>
        </div>
      )}

      {/* BOTÓN DESPLEGABLE DE LECTURA (COMPÚRTELO EN LAS FASES INTERACTIVAS) */}
      {(step === 'activity1' || step === 'activity2') && (
        <div className="mb-4">
          <button
            onClick={() => setShowReadingText(!showReadingText)}
            className="btn btn-outline-purple rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2 shadow-sm"
            style={{ borderColor: '#6C4AB6', color: '#6C4AB6' }}
          >
            <i className="bi bi-journal-text"></i> 
            {showReadingText ? 'Hide Environmental Report Text ✕' : '📖 Read the Environmental Report (Click to View)'}
          </button>

          {showReadingText && (
            <div className="p-4 rounded-4 bg-light border mt-3 shadow-sm" style={{ borderLeft: '5px solid #6C4AB6' }}>
              <h5 className="fw-bold text-purple mb-3">THE PLASTIC PROBLEM: CAN WE CHANGE THE FUTURE?</h5>
              <p className="text-dark" style={{ lineHeight: '1.7' }}>
                Plastic pollution has become one of the biggest environmental challenges in the world. Every year, millions of tons of plastic waste end up in rivers, oceans and landfills. This situation affects wildlife because many animals accidentally eat plastic or become trapped in it.
              </p>
              <p className="text-dark" style={{ lineHeight: '1.7' }}>
                One important cause of this problem is the excessive use of single-use products, such as plastic bags, bottles and food containers. Although recycling can help, not all plastic materials are recycled correctly.
              </p>
              <p className="text-dark" style={{ lineHeight: '1.7' }}>
                Some communities are now creating sustainable projects to reduce pollution. For example, they encourage people to use reusable bags, separate their rubbish and participate in beach clean-ups.
              </p>
              <p className="text-dark mb-0" style={{ lineHeight: '1.7' }}>
                Experts believe that protecting the environment requires changes in our daily habits. Small actions can have a positive impact if many people participate.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* FASE 1: ACTIVIDAD 1 (Problemas / Consecuencias) */}
      {/* ========================================== */}
      {step === 'activity1' && (
        <div>
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom gap-2">
            <div>
              <span className="badge bg-purple-light text-purple px-3 py-1 rounded-pill fw-bold">
                Activity A – Find the evidence[cite: 8]
              </span>
              <h4 className="fw-bold text-dark mt-2 mb-0">Connect Problems with Consequences</h4>
            </div>
            <span className="badge bg-warning-subtle text-warning-emphasis px-3 py-2 fs-6">
              Opportunities: <strong>{attempts1}</strong>
            </span>
          </div>

          {errorMsg1 && (
            <div className="alert alert-danger fs-6 fw-semibold mb-4 rounded-4 shadow-sm">
              <i className="bi bi-exclamation-triangle-fill me-2"></i> {errorMsg1}
            </div>
          )}

          <div ref={boardRef} className="position-relative py-2 mb-4">
            <svg className="position-absolute top-0 start-0 w-100 h-100 d-none d-md-block" style={{ pointerEvents: 'none', zIndex: 1 }}>
              {lines.map(line => {
                const strokeColor = line.status === 'correct' ? '#10B981' : line.status === 'incorrect' ? '#EF4444' : '#6C4AB6';
                const midX = (line.x1 + line.x2) / 2;
                const pathData = `M ${line.x1} ${line.y1} C ${midX} ${line.y1}, ${midX} ${line.y2}, ${line.x2} ${line.y2}`;
                return (
                  <g key={line.id}>
                    <path d={pathData} fill="none" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
                    <circle cx={line.x1} cy={line.y1} r="6" fill={strokeColor} />
                    <circle cx={line.x2} cy={line.y2} r="6" fill={strokeColor} />
                  </g>
                );
              })}
            </svg>

            <div className="row justify-content-between align-items-center g-4 position-relative" style={{ zIndex: 2 }}>
              <div className="col-md-5 d-flex flex-column gap-3">
                <h6 className="fw-bold text-purple text-uppercase mb-0">Environmental Problem[cite: 8]</h6>
                {problems1.map(p => {
                  const status = feedback1[p.id];
                  const isSelected = selectedLeftId === p.id;
                  const matched = userMatches1[p.id];
                  return (
                    <div
                      key={p.id}
                      ref={el => (leftRefs.current[p.id] = el)}
                      onClick={() => {
                        if (status === 'correct') return;
                        if (matched) {
                          setUserMatches1(prev => ({ ...prev, [p.id]: null }));
                        } else {
                          setSelectedLeftId(prev => (prev === p.id ? null : p.id));
                        }
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const cId = e.dataTransfer.getData('text/plain') || draggedRightId;
                        if (cId) assignMatch1(p.id, cId);
                      }}
                      className="p-3 px-4 rounded-4 shadow-sm d-flex align-items-center justify-content-between"
                      style={{
                        cursor: status === 'correct' ? 'default' : 'pointer',
                        backgroundColor: status === 'correct' ? '#DCFCE7' : status === 'incorrect' ? '#FEE2E2' : isSelected ? '#EDE9FE' : '#FFFFFF',
                        border: status === 'correct' ? '2px solid #10B981' : status === 'incorrect' ? '2px solid #EF4444' : isSelected ? '2px solid #6C4AB6' : '2px solid #E2E8F0'
                      }}
                    >
                      <span className="fw-bold text-dark">{p.text}</span>
                      <div className="d-flex align-items-center gap-2">
                        {matched && <span className="badge bg-purple rounded-pill px-2 py-1">➔ {matched}</span>}
                        <span className="rounded-circle d-inline-block" style={{ width: '14px', height: '14px', backgroundColor: matched ? '#6C4AB6' : '#CBD5E1' }}></span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="col-md-5 d-flex flex-column gap-3">
                <h6 className="fw-bold text-purple text-uppercase mb-0">Consequence[cite: 8]</h6>
                {consequences1.map(c => {
                  const connProb = Object.keys(userMatches1).find(k => userMatches1[k] === c.id);
                  const status = connProb ? feedback1[connProb] : null;
                  return (
                    <div
                      key={c.id}
                      ref={el => (rightRefs.current[c.id] = el)}
                      draggable={status !== 'correct'}
                      onDragStart={(e) => {
                        setDraggedRightId(c.id);
                        e.dataTransfer.setData('text/plain', c.id);
                      }}
                      onClick={() => {
                        if (selectedLeftId) assignMatch1(selectedLeftId, c.id);
                      }}
                      className="p-3 px-4 rounded-4 shadow-sm d-flex align-items-center justify-content-between"
                      style={{
                        cursor: status === 'correct' ? 'default' : 'grab',
                        backgroundColor: status === 'correct' ? '#DCFCE7' : status === 'incorrect' ? '#FEE2E2' : connProb ? '#F3E8FF' : '#FFFFFF',
                        border: status === 'correct' ? '2px solid #10B981' : status === 'incorrect' ? '2px solid #EF4444' : '2px solid #E2E8F0'
                      }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <span className="rounded-circle d-inline-block" style={{ width: '14px', height: '14px', backgroundColor: connProb ? '#6C4AB6' : '#CBD5E1' }}></span>
                        <span className="fw-semibold text-dark">{c.text}</span>
                      </div>
                      <i className="bi bi-grip-vertical text-muted fs-5"></i>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="text-end mt-4">
            <button 
              onClick={handleCheckActivity1}
              disabled={!Object.values(userMatches1).every(Boolean)}
              className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
            >
              Submit Activity 1 & Continue <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* FASE 2: ACTIVIDAD 3 (Vocabulary detective) */}
      {/* ========================================== */}
      {step === 'activity2' && (
        <div>
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom gap-2">
            <div>
              <span className="badge bg-purple-light text-purple px-3 py-1 rounded-pill fw-bold">
                Activity 3 – Vocabulary detective[cite: 10]
              </span>
              <h4 className="fw-bold text-dark mt-2 mb-0">Find the meaning of these words</h4>
            </div>
            <span className="badge bg-warning-subtle text-warning-emphasis px-3 py-2 fs-6">
              Opportunities: <strong>{attempts3}</strong>
            </span>
          </div>

          {errorMsg3 && (
            <div className="alert alert-danger fs-6 fw-semibold mb-4 rounded-4 shadow-sm">
              <i className="bi bi-exclamation-triangle-fill me-2"></i> {errorMsg3}
            </div>
          )}

          <div ref={boardRef} className="position-relative py-2 mb-4">
            <svg className="position-absolute top-0 start-0 w-100 h-100 d-none d-md-block" style={{ pointerEvents: 'none', zIndex: 1 }}>
              {lines.map(line => {
                const strokeColor = line.status === 'correct' ? '#10B981' : line.status === 'incorrect' ? '#EF4444' : '#6C4AB6';
                const midX = (line.x1 + line.x2) / 2;
                const pathData = `M ${line.x1} ${line.y1} C ${midX} ${line.y1}, ${midX} ${line.y2}, ${line.x2} ${line.y2}`;
                return (
                  <g key={line.id}>
                    <path d={pathData} fill="none" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
                    <circle cx={line.x1} cy={line.y1} r="6" fill={strokeColor} />
                    <circle cx={line.x2} cy={line.y2} r="6" fill={strokeColor} />
                  </g>
                );
              })}
            </svg>

            <div className="row justify-content-between align-items-center g-4 position-relative" style={{ zIndex: 2 }}>
              <div className="col-md-5 d-flex flex-column gap-3">
                <h6 className="fw-bold text-purple text-uppercase mb-0">Word[cite: 10]</h6>
                {words3.map(w => {
                  const status = feedback3[w.id];
                  const isSelected = selectedLeftId === w.id;
                  const matched = userMatches3[w.id];
                  return (
                    <div
                      key={w.id}
                      ref={el => (leftRefs.current[w.id] = el)}
                      onClick={() => {
                        if (status === 'correct') return;
                        if (matched) {
                          setUserMatches3(prev => ({ ...prev, [w.id]: null }));
                        } else {
                          setSelectedLeftId(prev => (prev === w.id ? null : w.id));
                        }
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const mId = e.dataTransfer.getData('text/plain') || draggedRightId;
                        if (mId) assignMatch3(w.id, mId);
                      }}
                      className="p-3 px-4 rounded-4 shadow-sm d-flex align-items-center justify-content-between"
                      style={{
                        cursor: status === 'correct' ? 'default' : 'pointer',
                        backgroundColor: status === 'correct' ? '#DCFCE7' : status === 'incorrect' ? '#FEE2E2' : isSelected ? '#EDE9FE' : '#FFFFFF',
                        border: status === 'correct' ? '2px solid #10B981' : status === 'incorrect' ? '2px solid #EF4444' : isSelected ? '2px solid #6C4AB6' : '2px solid #E2E8F0'
                      }}
                    >
                      <span className="fw-bold text-dark">{w.text}</span>
                      <div className="d-flex align-items-center gap-2">
                        {matched && <span className="badge bg-purple rounded-pill px-2 py-1">➔ {matched}</span>}
                        <span className="rounded-circle d-inline-block" style={{ width: '14px', height: '14px', backgroundColor: matched ? '#6C4AB6' : '#CBD5E1' }}></span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="col-md-5 d-flex flex-column gap-3">
                <h6 className="fw-bold text-purple text-uppercase mb-0">Meaning[cite: 10]</h6>
                {meanings3.map(m => {
                  const connWord = Object.keys(userMatches3).find(k => userMatches3[k] === m.id);
                  const status = connWord ? feedback3[connWord] : null;
                  return (
                    <div
                      key={m.id}
                      ref={el => (rightRefs.current[m.id] = el)}
                      draggable={status !== 'correct'}
                      onDragStart={(e) => {
                        setDraggedRightId(m.id);
                        e.dataTransfer.setData('text/plain', m.id);
                      }}
                      onClick={() => {
                        if (selectedLeftId) assignMatch3(selectedLeftId, m.id);
                      }}
                      className="p-3 px-4 rounded-4 shadow-sm d-flex align-items-center justify-content-between"
                      style={{
                        cursor: status === 'correct' ? 'default' : 'grab',
                        backgroundColor: status === 'correct' ? '#DCFCE7' : status === 'incorrect' ? '#FEE2E2' : connWord ? '#F3E8FF' : '#FFFFFF',
                        border: status === 'correct' ? '2px solid #10B981' : status === 'incorrect' ? '2px solid #EF4444' : '2px solid #E2E8F0'
                      }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <span className="rounded-circle d-inline-block" style={{ width: '14px', height: '14px', backgroundColor: connWord ? '#6C4AB6' : '#CBD5E1' }}></span>
                        <span className="fw-semibold text-dark">{m.text}</span>
                      </div>
                      <i className="bi bi-grip-vertical text-muted fs-5"></i>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="text-end mt-4">
            <button 
              onClick={handleCheckActivity3}
              disabled={!Object.values(userMatches3).every(Boolean)}
              className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
            >
              Submit Vocabulary & Continue <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* FASE 3: ACTIVIDAD 4 (Final Challenge - Opción C) */}
      {/* ========================================== */}
      {step === 'activity3' && (
        <div className="mx-auto" style={{ maxWidth: '800px' }}>
          <div className="mb-4 pb-3 border-bottom">
            <span className="badge bg-purple-light text-purple px-3 py-1 rounded-pill fw-bold">
              Activity 4 – Final challenge[cite: 9]
            </span>
            <h4 className="fw-bold text-dark mt-2 mb-0">Choose the best solution</h4>
          </div>

          <p className="text-muted mb-4 fs-6">
            Based on the reading, which action would help reduce plastic pollution?[cite: 9]
          </p>

          <div className="d-flex flex-column gap-3 mb-4">
            {[
              { id: 'A', text: 'A. Using more plastic containers.' },
              { id: 'B', text: 'B. Throwing rubbish into rivers.' },
              { id: 'C', text: 'C. Using reusable bags and recycling correctly.' },
              { id: 'D', text: 'D. Buying more single-use products.' }
            ].map(opt => (
              <div
                key={opt.id}
                onClick={() => setSelectedOption4(opt.id)}
                className="p-4 rounded-4 shadow-sm border transition-all"
                style={{
                  cursor: 'pointer',
                  backgroundColor: selectedOption4 === opt.id ? '#EDE9FE' : '#FFFFFF',
                  borderColor: selectedOption4 === opt.id ? '#6C4AB6' : '#E2E8F0',
                  borderWidth: selectedOption4 === opt.id ? '2px' : '1px'
                }}
              >
                <span className="fw-bold text-dark fs-6">{opt.text}</span>
              </div>
            ))}
          </div>

          <div className="text-end">
            <button 
              onClick={handleCheckActivity4}
              disabled={!selectedOption4}
              className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
            >
              Finish Reading Mission 🏆 <i className="bi bi-check2-all ms-2"></i>
            </button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* PANTALLA FINAL DE RESULTADOS */}
      {/* ========================================== */}
      {step === 'results' && (
        <div className="text-center py-4 mx-auto" style={{ maxWidth: '650px' }}>
          <div className="mb-2">
            <span className="display-2">
              {finalScore.percentage >= 75 ? '😊' : '😕'}
            </span>
          </div>

          <h3 className="fw-bold text-dark mb-3">Module 2 - Reading Completed!</h3>

          <div className={`p-4 rounded-4 mb-4 shadow-sm border ${finalScore.percentage >= 75 ? 'bg-success-subtle border-success text-success-emphasis' : 'bg-warning-subtle border-warning text-warning-emphasis'}`}>
            <p className="fs-5 fw-bold mb-1">
              {finalScore.percentage >= 75 ? 'Outstanding eco-detective work!' : 'Good effort! Review the text to improve your score!'}
            </p>
            <p className="fs-6 mb-0">
              Completed in <strong>{timeSpent.minutes}m {timeSpent.seconds}s</strong> with an overall score of <strong>{finalScore.percentage}%</strong>.
            </p>
          </div>

          <div className="p-4 bg-light rounded-4 mb-4 border text-start">
            <h5 className="fw-bold text-purple mb-3">Reading Evaluation Summary:</h5>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              <li className="d-flex justify-content-between border-bottom pb-2">
                <span>Activity 1: Find the evidence</span>
                <strong>{score1}%</strong>
              </li>
              <li className="d-flex justify-content-between border-bottom pb-2">
                <span>Activity 3: Vocabulary detective</span>
                <strong>{score3}%</strong>
              </li>
              <li className="d-flex justify-content-between pb-1">
                <span>Activity 4: Final challenge (Option C)</span>
                <strong>{score4}%</strong>
              </li>
            </ul>
          </div>

          <button 
            onClick={() => onComplete(finalScore.percentage)}
            className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
          >
            Continue to Next Mission ➔
          </button>
        </div>
      )}
    </div>
  );
}