import React, { useState, useEffect } from 'react';

export default function ReadingActivity({ activityData, onComplete }) {
  const [step, setStep] = useState('intro'); // 'intro', 'challenge', 'vocabulary', 'headline', 'results'
  
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
      // Si se acaba el tiempo, forzar finalización
      finalizeActivity();
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const startTimer = () => {
    setTimerActive(true);
    setStep('challenge');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateTimeSpent = () => {
    const totalSecondsSpent = 1200 - timeLeft;
    const mins = Math.floor(totalSecondsSpent / 60);
    const secs = totalSecondsSpent % 60;
    setTimeSpent({ minutes: mins, seconds: secs });
  };

  const finalizeActivity = () => {
    setTimerActive(false);
    calculateTimeSpent();

    const totalCorrect = phase1Score + phase2Score + (selectedHeadline === 'A' ? 2 : 0);
    const finalPercentage = Math.round((totalCorrect / 20) * 100);

    setFinalMetrics({ totalScore: totalCorrect, percentage: finalPercentage });
    setStep('results');
  };

  // --- FASE 1: RECONSTRUCCIÓN DE ORACIONES ---
  const correctMapping = {
    p1: ['B', 'E', 'I', 'D'],
    p2: ['G', 'A', 'K', 'F'],
    p3: ['J', 'C', 'L', 'H']
  };

  const initialSentences = [
    { id: 'A', text: 'Over time, this pattern can create an echo chamber, in which familiar opinions are reinforced while conflicting views become less visible.' },
    { id: 'B', text: 'At first glance, recommendation systems seem to make online life more convenient.' },
    { id: 'C', text: 'Platforms could explain why a post appears and allow users to reset or diversify their feeds.' },
    { id: 'D', text: 'Yet the same process can gradually narrow the range of perspectives users encounter.' },
    { id: 'E', text: 'By analysing clicks, pauses, searches and shares, platforms predict which posts are most likely to hold our attention.' },
    { id: 'F', text: 'Nevertheless, users may mistake this curated selection for a balanced picture of reality.' },
    { id: 'G', text: 'When a user repeatedly interacts with one type of content, the algorithm may prioritise similar material.' },
    { id: 'H', text: 'Ultimately, a healthier online environment requires responsibility from both technology companies and users.' },
    { id: 'I', text: 'This is because engagement, rather than accuracy or diversity, often becomes the main measure of success.' },
    { id: 'J', text: 'One possible response is to strengthen transparency and give people meaningful control over recommendation settings.' },
    { id: 'K', text: 'The effect is not always deliberate: small design choices and personal habits can combine to shape a highly personalised feed.' },
    { id: 'L', text: 'However, digital literacy also matters, since no setting can replace the ability to evaluate sources and recognise manipulation.' }
  ];

  const [userParagraphs, setUserParagraphs] = useState({
    p1: [null, null, null, null],
    p2: [null, null, null, null],
    p3: [null, null, null, null]
  });

  const [selectedCardId, setSelectedCardId] = useState(null);
  const [attempts, setAttempts] = useState(2);
  const [errorMessage, setErrorMessage] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState({});
  const [phase1Score, setPhase1Score] = useState(0);

  // --- FASE 2: VOCABULARY DETECTIVE ---
  const vocabTerms = [
    { key: 'v1', term: 'Engagement' },
    { key: 'v2', term: 'Echo chamber' },
    { key: 'v3', term: 'Curated' },
    { key: 'v4', term: 'Transparency' },
    { key: 'v5', term: 'Diversify' },
    { key: 'v6', term: 'Digital literacy' }
  ];

  const vocabMeanings = [
    { id: 'A', text: 'Ability to evaluate and understand digital information.' },
    { id: 'B', text: 'Level of interaction with online content.' },
    { id: 'C', text: 'To increase variety.' },
    { id: 'D', text: 'Environment where similar opinions are reinforced.' },
    { id: 'E', text: 'Carefully selected and organised.' },
    { id: 'F', text: 'Openness and clarity.' }
  ];

  const vocabCorrectMapping = {
    v1: 'B', v2: 'D', v3: 'E', v4: 'F', v5: 'C', v6: 'A'
  };

  const [userVocabSlots, setUserVocabSlots] = useState({
    v1: null, v2: null, v3: null, v4: null, v5: null, v6: null
  });

  const [selectedVocabCard, setSelectedVocabCard] = useState(null);
  const [vocabAttempts, setVocabAttempts] = useState(2);
  const [vocabErrorMessage, setVocabErrorMessage] = useState('');
  const [vocabFeedback, setVocabFeedback] = useState({});
  const [phase2Score, setPhase2Score] = useState(0);

  // --- FASE 3: HEADLINE CHALLENGE ---
  const [selectedHeadline, setSelectedHeadline] = useState(null);
  const [phase3Score, setPhase3Score] = useState(0);

  // --- PUNTAJE FINAL ---
  const [finalMetrics, setFinalMetrics] = useState({ totalScore: 0, percentage: 0 });

  const getSentenceById = (id) => initialSentences.find(s => s.id === id);
  const placedIds = Object.values(userParagraphs).flat().filter(Boolean);
  const availableSentences = initialSentences.filter(s => !placedIds.includes(s.id));

  const getMeaningById = (id) => vocabMeanings.find(m => m.id === id);
  const placedVocabIds = Object.values(userVocabSlots).filter(Boolean);
  const availableMeanings = vocabMeanings.filter(m => !placedVocabIds.includes(m.id));

  // Acciones Fase 1
  const handlePlaceCard = (pKey, index) => {
    if (!selectedCardId) return;
    setUserParagraphs(prev => {
      const nextP = { ...prev };
      nextP[pKey] = [...nextP[pKey]];
      nextP[pKey][index] = selectedCardId;
      return nextP;
    });
    setSelectedCardId(null);
  };

  const handleReturnCard = (pKey, index) => {
    if (feedbackStatus[`${pKey}-${index}`] === 'correct') return;
    setUserParagraphs(prev => {
      const nextP = { ...prev };
      nextP[pKey] = [...nextP[pKey]];
      nextP[pKey][index] = null;
      return nextP;
    });
  };

  const handleCheckPhase1 = () => {
    let incorrectItems = [];
    let statusMap = {};
    let correctCount = 0;

    ['p1', 'p2', 'p3'].forEach(pKey => {
      userParagraphs[pKey].forEach((id, idx) => {
        const keyId = `${pKey}-${idx}`;
        if (id === correctMapping[pKey][idx]) {
          statusMap[keyId] = 'correct';
          correctCount++;
        } else {
          statusMap[keyId] = 'incorrect';
          if (id) incorrectItems.push({ pKey, idx, id });
        }
      });
    });

    setFeedbackStatus(statusMap);

    if (correctCount === 12) {
      setPhase1Score(12);
      setTimeout(() => setStep('vocabulary'), 1000);
    } else {
      if (attempts > 1) {
        setAttempts(prev => prev - 1);
        setErrorMessage('Some positions are incorrect. 1 opportunity left. Incorrect sentences returned to the list.');
        setTimeout(() => {
          setUserParagraphs(prev => {
            const nextP = { ...prev };
            nextP.p1 = [...nextP.p1];
            nextP.p2 = [...nextP.p2];
            nextP.p3 = [...nextP.p3];
            incorrectItems.forEach(item => {
              nextP[item.pKey][item.idx] = null;
            });
            return nextP;
          });
          setFeedbackStatus(prev => {
            const cleaned = {};
            Object.keys(prev).forEach(k => {
              if (prev[k] === 'correct') cleaned[k] = 'correct';
            });
            return cleaned;
          });
        }, 2000);
      } else {
        setPhase1Score(correctCount);
        setErrorMessage('Attempts exhausted. Moving to Vocabulary Challenge.');
        setTimeout(() => setStep('vocabulary'), 2000);
      }
    }
  };

  // Acciones Fase 2
  const handlePlaceVocabCard = (vKey) => {
    if (!selectedVocabCard) return;
    setUserVocabSlots(prev => ({ ...prev, [vKey]: selectedVocabCard }));
    setSelectedVocabCard(null);
  };

  const handleReturnVocabCard = (vKey) => {
    if (vocabFeedback[vKey] === 'correct') return;
    setUserVocabSlots(prev => ({ ...prev, [vKey]: null }));
  };

  const handleCheckPhase2 = () => {
    let incorrectVocab = [];
    let statusMap = {};
    let correctCount = 0;

    vocabTerms.forEach(item => {
      const assignedId = userVocabSlots[item.key];
      if (assignedId === vocabCorrectMapping[item.key]) {
        statusMap[item.key] = 'correct';
        correctCount++;
      } else {
        statusMap[item.key] = 'incorrect';
        if (assignedId) incorrectVocab.push(item.key);
      }
    });

    setVocabFeedback(statusMap);

    if (correctCount === 6) {
      setPhase2Score(6);
      setTimeout(() => setStep('headline'), 1000);
    } else {
      if (vocabAttempts > 1) {
        setVocabAttempts(prev => prev - 1);
        setVocabErrorMessage('Some definitions are incorrect. 1 opportunity left. Incorrect meanings returned to the list.');
        setTimeout(() => {
          setUserVocabSlots(prev => {
            const nextV = { ...prev };
            incorrectVocab.forEach(k => { nextV[k] = null; });
            return nextV;
          });
          setVocabFeedback(prev => {
            const cleaned = {};
            Object.keys(prev).forEach(k => {
              if (prev[k] === 'correct') cleaned[k] = 'correct';
            });
            return cleaned;
          });
        }, 2000);
      } else {
        setPhase2Score(correctCount);
        setVocabErrorMessage('Attempts exhausted. Moving to Final Challenge.');
        setTimeout(() => setStep('headline'), 2000);
      }
    }
  };

  // Acciones Fase 3 & Final
  const handleCheckPhase3 = () => {
    let headlineCorrect = selectedHeadline === 'A' ? 2 : 0;
    setPhase3Score(headlineCorrect);
    finalizeActivity();
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4 p-lg-5 bg-white w-100">
      
      {/* Barra de Temporizador superior en fases activas */}
      {step !== 'intro' && step !== 'results' && (
        <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded-4 border">
          <span className="fw-bold text-purple">
            <i className="bi bi-clock-history me-2"></i> Time Remaining:
          </span>
          <span className={`badge px-3 py-2 fs-5 ${timeLeft < 300 ? 'bg-danger animate-pulse' : 'bg-purple'}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      )}

      {/* 1. INTRODUCCIÓN */}
      {step === 'intro' && (
        <div className="mx-auto" style={{ maxWidth: '900px' }}>
          <div className="text-center mb-4">
            <span className="badge bg-purple-light text-purple px-3 py-2 rounded-pill fw-bold mb-2">
              B2 Reading Challenge
            </span>
            <h2 className="fw-bold" style={{ color: '#1E1248' }}>THE ALGORITHM FILES</h2>
            <p className="text-muted fs-5 fst-italic">Complete all reading missions within 20 minutes!</p>
          </div>

          <div className="p-4 rounded-4 bg-light mb-4 border-start border-4" style={{ borderColor: '#6C4AB6' }}>
            <h5 className="fw-bold mb-2" style={{ color: '#6C4AB6' }}>
              <i className="bi bi-shield-exclamation me-2"></i> YOUR MISSION
            </h5>
            <p className="text-dark fs-6 mb-0" style={{ lineHeight: '1.6' }}>
              Investigate how social media algorithms influence the content we consume. You have a <strong>20-minute countdown</strong> timer to complete all tasks.
            </p>
          </div>

          <div className="text-center">
            <button 
              onClick={startTimer}
              className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-5 fw-bold shadow"
            >
              GO <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      )}

      {/* 2. FASE 1: RECONSTRUCCIÓN */}
      {step === 'challenge' && (
        <div>
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom gap-2">
            <div>
              <span className="badge bg-purple-light text-purple px-3 py-1 rounded-pill fw-bold">
                Phase 1 of 3: Article Reconstruction
              </span>
              <h4 className="fw-bold text-dark mt-2 mb-0">Build the Digital Story</h4>
            </div>
            <div className="d-flex align-items-center gap-3">
              <span className="badge bg-light text-dark border px-3 py-2 fs-6">
                Placed: <strong>{placedIds.length} / 12</strong>
              </span>
              <span className="badge bg-warning-subtle text-warning-emphasis px-3 py-2 fs-6">
                Opportunities: <strong>{attempts}</strong>
              </span>
            </div>
          </div>

          {errorMessage && (
            <div className="alert alert-danger fs-6 fw-semibold mb-4 rounded-4 shadow-sm">
              <i className="bi bi-exclamation-triangle-fill me-2"></i> {errorMessage}
            </div>
          )}

          <div className="row g-4">
            <div className="col-lg-5">
              <div className="sticky-top" style={{ top: '20px' }}>
                <h6 className="fw-bold text-purple mb-1 fs-6">
                  <i className="bi bi-hand-index-thumb me-1"></i> AVAILABLE SENTENCES ({availableSentences.length})
                </h6>
                <p className="text-muted small mb-3">Click a card to select it, then click an empty slot on the right:</p>

                <div className="d-flex flex-column gap-2 overflow-auto pe-2" style={{ maxHeight: '70vh' }}>
                  {availableSentences.length === 0 ? (
                    <div className="p-4 text-center rounded-4 border bg-light">
                      <i className="bi bi-check2-circle display-5 text-success"></i>
                      <p className="fs-6 fw-semibold text-dark mt-2 mb-0">All sentences placed!</p>
                      <small className="text-muted">Click "Submit & Check Order" below.</small>
                    </div>
                  ) : (
                    availableSentences.map(s => {
                      const isSelected = selectedCardId === s.id;
                      return (
                        <div
                          key={s.id}
                          onClick={() => setSelectedCardId(isSelected ? null : s.id)}
                          className="p-2 px-3 rounded-3 shadow-sm d-flex align-items-start gap-2 transition-all"
                          style={{
                            cursor: 'pointer',
                            backgroundColor: isSelected ? '#EDE9FE' : '#FFFFFF',
                            border: isSelected ? '2px solid #6C4AB6' : '1.5px solid #CBD5E1',
                            userSelect: 'none'
                          }}
                        >
                          <span className={`badge px-2 py-1 mt-1 ${isSelected ? 'bg-purple' : 'btn-purple'}`} style={{ fontSize: '0.85rem' }}>
                            {s.id}
                          </span>
                          <span className="text-dark" style={{ fontSize: '0.95rem', lineHeight: '1.45' }}>
                            {s.text}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <h6 className="fw-bold text-purple mb-3 fs-6">
                <i className="bi bi-file-earmark-text me-2"></i> BUILD YOUR ARTICLE[cite: 26]
              </h6>

              {['p1', 'p2', 'p3'].map((pKey, idx) => (
                <div key={pKey} className="p-3 p-md-4 mb-3 rounded-4 shadow-sm border-0" style={{ backgroundColor: '#F8F6FF' }}>
                  <h6 className="fw-bold mb-3 fs-6" style={{ color: '#2B1C6D' }}>
                    Paragraph {idx + 1}
                  </h6>
                  <div className="d-flex flex-column gap-2">
                    {[0, 1, 2, 3].map(pos => {
                      const slotKey = `${pKey}-${pos}`;
                      const assignedId = userParagraphs[pKey][pos];
                      const sentenceObj = assignedId ? getSentenceById(assignedId) : null;
                      const status = feedbackStatus[slotKey];

                      return (
                        <div
                          key={slotKey}
                          onClick={() => {
                            if (selectedCardId && !assignedId) handlePlaceCard(pKey, pos);
                            else if (assignedId) handleReturnCard(pKey, pos);
                          }}
                          className="p-2 px-3 rounded-3 d-flex align-items-center justify-content-between"
                          style={{
                            minHeight: '54px',
                            cursor: assignedId || selectedCardId ? 'pointer' : 'default',
                            backgroundColor: status === 'correct' ? '#DCFCE7' : status === 'incorrect' ? '#FEE2E2' : selectedCardId && !assignedId ? '#EDE9FE' : '#FFFFFF',
                            border: status === 'correct' ? '2px solid #10B981' : status === 'incorrect' ? '2px solid #EF4444' : '1.5px dashed #CBD5E1'
                          }}
                        >
                          {sentenceObj ? (
                            <div className="d-flex align-items-center gap-2 w-100">
                              <span className={`badge px-2 py-1 ${status === 'correct' ? 'bg-success' : status === 'incorrect' ? 'bg-danger' : 'btn-purple'}`} style={{ fontSize: '0.85rem' }}>
                                {sentenceObj.id}
                              </span>
                              <span className="text-dark" style={{ fontSize: '0.95rem', lineHeight: '1.45' }}>
                                {sentenceObj.text}
                              </span>
                              <i className="bi bi-x-circle-fill text-muted ms-auto fs-5"></i>
                            </div>
                          ) : (
                            <span className="text-muted fst-italic w-100 text-center" style={{ fontSize: '0.9rem' }}>
                              {selectedCardId ? `✨ Click here to place [${selectedCardId}]` : `Click to place · Position ${pos + 1}`}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="text-end mt-4">
                <button 
                  onClick={handleCheckPhase1}
                  disabled={availableSentences.length > 0}
                  className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
                >
                  Submit & Check Order <i className="bi bi-check2-all ms-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. FASE 2: VOCABULARY DETECTIVE */}
      {step === 'vocabulary' && (
        <div>
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom gap-2">
            <div>
              <span className="badge bg-purple-light text-purple px-3 py-1 rounded-pill fw-bold">
                Phase 2 of 3: Digital Vocabulary Detective[cite: 113]
              </span>
              <h4 className="fw-bold text-dark mt-2 mb-0">Match Advanced Vocabulary</h4>
            </div>
            <div className="d-flex align-items-center gap-3">
              <span className="badge bg-light text-dark border px-3 py-2 fs-6">
                Placed: <strong>{placedVocabIds.length} / 6</strong>
              </span>
              <span className="badge bg-warning-subtle text-warning-emphasis px-3 py-2 fs-6">
                Opportunities: <strong>{vocabAttempts}</strong>
              </span>
            </div>
          </div>

          {vocabErrorMessage && (
            <div className="alert alert-danger fs-6 fw-semibold mb-4 rounded-4 shadow-sm">
              <i className="bi bi-exclamation-triangle-fill me-2"></i> {vocabErrorMessage}
            </div>
          )}

          <div className="row g-4">
            <div className="col-lg-5">
              <div className="sticky-top" style={{ top: '20px' }}>
                <h6 className="fw-bold text-purple mb-1 fs-6">
                  <i className="bi bi-hand-index-thumb me-1"></i> AVAILABLE MEANINGS ({availableMeanings.length})
                </h6>
                <p className="text-muted small mb-3">Click a meaning card to select it, then click an empty slot on the right:</p>

                <div className="d-flex flex-column gap-2 overflow-auto pe-2" style={{ maxHeight: '70vh' }}>
                  {availableMeanings.length === 0 ? (
                    <div className="p-4 text-center rounded-4 border bg-light">
                      <i className="bi bi-check2-circle display-5 text-success"></i>
                      <p className="fs-6 fw-semibold text-dark mt-2 mb-0">All meanings placed!</p>
                      <small className="text-muted">Click "Submit Vocabulary" below.</small>
                    </div>
                  ) : (
                    availableMeanings.map(m => {
                      const isSelected = selectedVocabCard === m.id;
                      return (
                        <div
                          key={m.id}
                          onClick={() => setSelectedVocabCard(isSelected ? null : m.id)}
                          className="p-2 px-3 rounded-3 shadow-sm d-flex align-items-start gap-2 transition-all"
                          style={{
                            cursor: 'pointer',
                            backgroundColor: isSelected ? '#EDE9FE' : '#FFFFFF',
                            border: isSelected ? '2px solid #6C4AB6' : '1.5px solid #CBD5E1',
                            userSelect: 'none'
                          }}
                        >
                          <span className={`badge px-2 py-1 mt-1 ${isSelected ? 'bg-purple' : 'btn-purple'}`} style={{ fontSize: '0.85rem' }}>
                            {m.id}
                          </span>
                          <span className="text-dark" style={{ fontSize: '0.95rem', lineHeight: '1.45' }}>
                            {m.text}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <h6 className="fw-bold text-purple mb-3 fs-6">
                <i className="bi bi-journal-text me-2"></i> VOCABULARY MATCHING[cite: 113]
              </h6>

              <div className="d-flex flex-column gap-3">
                {vocabTerms.map(item => {
                  const assignedId = userVocabSlots[item.key];
                  const meaningObj = assignedId ? getMeaningById(assignedId) : null;
                  const status = vocabFeedback[item.key];

                  return (
                    <div
                      key={item.key}
                      onClick={() => {
                        if (selectedVocabCard && !assignedId) handlePlaceVocabCard(item.key);
                        else if (assignedId) handleReturnVocabCard(item.key);
                      }}
                      className="p-3 rounded-4 shadow-sm d-flex flex-wrap align-items-center justify-content-between gap-3"
                      style={{
                        cursor: assignedId || selectedVocabCard ? 'pointer' : 'default',
                        backgroundColor: status === 'correct' ? '#DCFCE7' : status === 'incorrect' ? '#FEE2E2' : selectedVocabCard && !assignedId ? '#EDE9FE' : '#FFFFFF',
                        border: status === 'correct' ? '2px solid #10B981' : status === 'incorrect' ? '2px solid #EF4444' : '1.5px dashed #CBD5E1'
                      }}
                    >
                      <div>
                        <strong className="text-purple fs-5">{item.term}</strong>
                      </div>
                      <div className="flex-grow-1 text-end">
                        {meaningObj ? (
                          <div className="d-flex align-items-center justify-content-end gap-2">
                            <span className={`badge px-2 py-1 ${status === 'correct' ? 'bg-success' : status === 'incorrect' ? 'bg-danger' : 'btn-purple'}`}>
                              {meaningObj.id}
                            </span>
                            <span className="text-dark small text-start">{meaningObj.text}</span>
                            <i className="bi bi-x-circle-fill text-muted ms-2"></i>
                          </div>
                        ) : (
                          <span className="text-muted fst-italic small">
                            {selectedVocabCard ? `✨ Click here to place [${selectedVocabCard}]` : `Click to place definition...`}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-end mt-4">
                <button
                  onClick={handleCheckPhase2}
                  disabled={placedVocabIds.length < 6}
                  className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
                >
                  Submit Vocabulary <i className="bi bi-arrow-right ms-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. FASE 3: HEADLINE CHALLENGE */}
      {step === 'headline' && (
        <div className="mx-auto" style={{ maxWidth: '800px' }}>
          <span className="badge bg-purple-light text-purple px-3 py-1 rounded-pill fw-bold mb-2">
            Phase 3 of 3: Final Investigation[cite: 114]
          </span>
          <h3 className="fw-bold text-dark mb-2">Which headline tells the whole story?[cite: 114]</h3>
          <p className="text-muted mb-4">Select the headline that best represents the article you reconstructed[cite: 114].</p>

          <div className="d-flex flex-column gap-3 mb-4">
            {[
              { key: 'A', text: 'The Hidden Costs of Personalised Feeds – And How to Make Them Healthier' },
              { key: 'B', text: "Social Media Is Destroying Everyone's Ability to Think" },
              { key: 'C', text: 'Why Technology Companies Only Care About Making Money' }
            ].map(opt => (
              <div 
                key={opt.key}
                onClick={() => setSelectedHeadline(opt.key)}
                className={`p-3 rounded-4 border transition-all d-flex align-items-center gap-3 ${selectedHeadline === opt.key ? 'bg-purple-light border-purple shadow-sm' : 'bg-white'}`}
                style={{ cursor: 'pointer' }}
              >
                <input 
                  type="radio" 
                  name="headline" 
                  checked={selectedHeadline === opt.key} 
                  onChange={() => setSelectedHeadline(opt.key)} 
                />
                <span className="fw-bold text-dark"><strong>{opt.key}.</strong> {opt.text}</span>
              </div>
            ))}
          </div>

          <div className="text-end">
            <button
              onClick={handleCheckPhase3}
              disabled={!selectedHeadline}
              className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
            >
              Finish Reading Activity <i className="bi bi-check2-all ms-2"></i>
            </button>
          </div>
        </div>
      )}

      {/* 5. PANTALLA FINAL DE RESULTADOS */}
      {step === 'results' && (
        <div className="text-center py-5 mx-auto" style={{ maxWidth: '650px' }}>
          <div className="mb-3">
            <span className="display-1">
              {finalMetrics.percentage >= 75 ? '😊' : '😕'}
            </span>
          </div>

          <h3 className="fw-bold text-dark mb-3">Reading Mission Completed!</h3>

          {/* Mensaje dinámico en Inglés con carita */}
          <div className={`p-4 rounded-4 mb-4 shadow-sm border ${finalMetrics.percentage >= 75 ? 'bg-success-subtle border-success text-success-emphasis' : 'bg-warning-subtle border-warning text-warning-emphasis'}`}>
            <p className="fs-5 fw-bold mb-1">
              {finalMetrics.percentage >= 75 ? 'Great job! You mastered this reading challenge!' : 'Keep practicing! You can improve your reading skills!'}
            </p>
            <p className="fs-6 mb-0">
              You scored <strong>{finalMetrics.totalScore} out of 20</strong> total points in <strong>{timeSpent.minutes} minutes and {timeSpent.seconds} seconds</strong>.
            </p>
          </div>

          {/* Desglose de puntajes y tiempo empleado */}
          <div className="p-3 bg-light rounded-4 mb-4 border text-start">
            <h6 className="fw-bold text-purple mb-2">Detailed Breakdown:</h6>
            <ul className="small text-muted mb-0 ps-3">
              <li>Article Reconstruction: <strong>{phase1Score} / 12</strong></li>
              <li>Vocabulary Detective: <strong>{phase2Score} / 6</strong></li>
              <li>Headline Challenge: <strong>{phase3Score} / 2</strong></li>
              <li>Time Spent: <strong>{timeSpent.minutes}m {timeSpent.seconds}s</strong></li>
            </ul>
            <hr className="my-2" />
            <h4 className="fw-bold text-dark mb-0 text-center">Final Reading Score: {finalMetrics.percentage}%</h4>
          </div>

          <button 
            onClick={() => onComplete(finalMetrics.percentage)}
            className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
          >
            Continue to Listening Challenge ➔
          </button>
        </div>
      )}
    </div>
  );
}