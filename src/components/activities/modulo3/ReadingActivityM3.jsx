import React, { useState, useEffect } from 'react';

export default function ReadingActivityM3({ activityData, onComplete }) {
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

  // --- ESTADO DEL TEXTO DE LECTURA (Desplegable) ---
  const [showReadingText, setShowReadingText] = useState(false);

  // ==========================================
  // PARTE 1: READING COMPREHENSION
  // ==========================================
  const questionsPart1 = [
    {
      id: 1,
      question: '1. What is the main argument of the text?',
      options: [
        { label: 'A', text: 'Economic development is the only way to eliminate poverty.' },
        { label: 'B', text: 'Individual effort is more important than government action.' },
        { label: 'C', text: 'A fair society requires collective responsibility and equal opportunities.' },
        { label: 'D', text: 'Volunteering is the most effective solution to unemployment.' }
      ],
      correct: 'C'
    },
    {
      id: 2,
      question: "2. What does the expression 'structural barriers' refer to in paragraph 2?",
      options: [
        { label: 'A', text: 'Personal decisions that prevent people from succeeding.' },
        { label: 'B', text: "Social and economic conditions that limit people's opportunities." },
        { label: 'C', text: 'Physical obstacles in public spaces.' },
        { label: 'D', text: 'The lack of motivation among young people.' }
      ],
      correct: 'B'
    },
    {
      id: 3,
      question: '3. According to the text, why is individual effort sometimes insufficient?',
      options: [
        { label: 'A', text: 'Because governments control every personal decision.' },
        { label: 'B', text: 'Because social inequalities can restrict access to essential resources.' },
        { label: 'C', text: 'Because education is no longer important.' },
        { label: 'D', text: 'Because people prefer depending on community organizations.' }
      ],
      correct: 'B'
    },
    {
      id: 4,
      question: '4. What can be inferred about social awareness?',
      options: [
        { label: 'A', text: 'Recognizing a problem does not necessarily mean taking action.' },
        { label: 'B', text: 'It is only necessary for people who work in government.' },
        { label: 'C', text: 'It is only necessary for people who work in government.' },
        { label: 'D', text: 'It is less important than economic growth.' }
      ],
      correct: 'A'
    },
    {
      id: 5,
      question: '5. Which statement best reflects the author`s perspective?',
      options: [
        { label: 'A', text: 'Social problems are impossible to solve completely.' },
        { label: 'B', text: 'Economic growth should always be the main priority.' },
        { label: 'C', text: 'Social progress depends on cooperation and inclusion.' },
        { label: 'D', text: 'Community initiatives should replace public institutions.' }
      ],
      correct: 'C'
    }
  ];

  const [userAnswersPart1, setUserAnswersPart1] = useState({ 1: '', 2: '', 3: '', 4: '', 5: '' });
  const [scorePart1, setScorePart1] = useState(0);

  const handleSelectOptionPart1 = (qId, optionLabel) => {
    setUserAnswersPart1(prev => ({ ...prev, [qId]: optionLabel }));
  };

  const handleSubmitPart1 = () => {
    let correctCount = 0;
    questionsPart1.forEach(q => {
      if (userAnswersPart1[q.id] === q.correct) correctCount++;
    });
    const p1Score = Math.round((correctCount / questionsPart1.length) * 100);
    setScorePart1(p1Score);
    setStep('part2');
    setShowReadingText(false); // Ocultar texto por defecto al pasar a la parte 2
  };

  // ==========================================
  // PARTE 2: VOCABULARY IN CONTEXT (Completar oraciones)
  // ==========================================
  const wordBankPart2 = ['INEQUALITY', 'SOLIDARITY', 'AWARENESS', 'DIVERSITY', 'UNEMPLOYMENT'];

  const sentencesPart2 = [
    { id: 1, before: '1. The government launched a campaign to increase public ', after: ' about environmental and social issues.', correctWord: 'AWARENESS' },
    { id: 2, before: '2. Cultural ', after: ' allows people from different backgrounds to share their traditions and perspectives.', correctWord: 'DIVERSITY' },
    { id: 3, before: '3. High levels of ', after: ' can negatively affect families and the national economy.', correctWord: 'UNEMPLOYMENT' },
    { id: 4, before: '4. Social ', after: ' becomes evident when certain groups have fewer opportunities than others.', correctWord: 'INEQUALITY' },
    { id: 5, before: '5. During difficult situations, ', after: ' encourages people to support and protect one another.', correctWord: 'SOLIDARITY' }
  ];

  const [userSlotsPart2, setUserSlotsPart2] = useState({ 1: null, 2: null, 3: null, 4: null, 5: null });
  const [selectedWord, setSelectedWord] = useState(null);
  const [draggedWord, setDraggedWord] = useState(null);

  const [attemptsPart2, setAttemptsPart2] = useState(2);
  const [errorMsgPart2, setErrorMsgPart2] = useState('');
  const [slotStatusPart2, setSlotStatusPart2] = useState({});
  const [scorePart2, setScorePart2] = useState(0);

  const placeWordInSlot = (sentenceId, word) => {
    setUserSlotsPart2(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(k => {
        if (next[k] === word) next[k] = null;
      });
      next[sentenceId] = word;
      return next;
    });
    setSelectedWord(null);
  };

  const removeWordFromSlot = (sentenceId) => {
    if (slotStatusPart2[sentenceId] === 'correct') return;
    setUserSlotsPart2(prev => ({ ...prev, [sentenceId]: null }));
  };

  const handleSubmitPart2 = () => {
    let statusMap = {};
    let correctCount = 0;
    let incorrectIds = [];

    sentencesPart2.forEach(s => {
      if (userSlotsPart2[s.id] === s.correctWord) {
        statusMap[s.id] = 'correct';
        correctCount++;
      } else {
        statusMap[s.id] = 'incorrect';
        incorrectIds.push(s.id);
      }
    });

    setSlotStatusPart2(statusMap);

    if (correctCount === 5) {
      setTimeout(() => handleFinishAll(scorePart1, 100), 1100);
    } else {
      if (attemptsPart2 > 1) {
        setAttemptsPart2(prev => prev - 1);
        setErrorMsgPart2('Some answers are incorrect. 1 opportunity left. Incorrect words returned to bank.');
        setTimeout(() => {
          setUserSlotsPart2(prev => {
            const next = { ...prev };
            incorrectIds.forEach(id => { next[id] = null; });
            return next;
          });
          setSlotStatusPart2(prev => {
            const cleaned = {};
            Object.keys(prev).forEach(k => { if (prev[k] === 'correct') cleaned[k] = 'correct'; });
            return cleaned;
          });
          setErrorMsgPart2('');
        }, 2000);
      } else {
        const p2Score = Math.round((correctCount / 5) * 100);
        setErrorMsgPart2('Attempts exhausted. Calculating final score...');
        setTimeout(() => handleFinishAll(scorePart1, p2Score), 2000);
      }
    }
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

  const readingTextContent = `Modern society is often described as a place where everyone has the opportunity to succeed. However, this idea does not always reflect reality. Millions of people continue to experience poverty, unemployment and discrimination, which prevent them from achieving their full potential. Although economic development has improved living conditions in many countries, inequality remains a significant challenge.

One of the main problems is that opportunities are not equally distributed. People from disadvantaged backgrounds may have limited access to quality education, healthcare and employment. As a result, their ability to improve their circumstances becomes restricted. This situation demonstrates that individual effort is important, but it is not always enough to overcome structural barriers.

Another important issue is the lack of social awareness. Many individuals recognize problems such as discrimination or poverty but do not consider themselves responsible for addressing them. Nevertheless, creating a more inclusive society requires collective action. Human rights should not simply exist in legal documents; they must be respected and protected in everyday life.

Fortunately, community participation can make a meaningful difference. Volunteering, supporting local organizations and promoting cultural diversity are examples of actions that encourage solidarity. These initiatives allow people from different backgrounds to cooperate, understand one another and develop solutions to shared problems.

Ultimately, building a better society is not the responsibility of governments alone. Educational institutions, businesses and individuals must work together to create equal opportunities and strengthen social relationships. A successful society should not be measured exclusively by its economic growth, but also by how fairly it treats its members.`;

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
            Module 3 - Reading Mission
          </span>
          <h2 className="fw-bold mb-3" style={{ color: '#1E1248' }}>BUILDING A FAIRER SOCIETY</h2>
          <p className="text-muted fs-5 fst-italic mb-4">Reading Comprehension & Vocabulary in Context</p>

          <div className="p-4 rounded-4 bg-light mb-4 border-start border-4 text-start" style={{ borderColor: '#6C4AB6' }}>
            <h5 className="fw-bold mb-2" style={{ color: '#6C4AB6' }}>
              <i className="bi bi-book-half me-2"></i> MISSION OBJECTIVE
            </h5>
            <p className="text-dark fs-6 mb-0" style={{ lineHeight: '1.6' }}>
              Complete the two parts of this reading mission: first, answer the text comprehension questions; second, complete the sentences using vocabulary in context[cite: 20].
            </p>
          </div>

          <button 
            onClick={startTimer}
            className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-5 fw-bold shadow"
          >
            Start Reading Mission <i className="bi bi-arrow-right ms-2"></i>
          </button>
        </div>
      )}

      {/* ========================================== */}
      {/* PARTE 1: COMPRENSIÓN DE LECTURA */}
      {/* ========================================== */}
      {step === 'part1' && (
        <div>
          {/* Botón superior para ver/quitar el texto */}
          <div className="mb-4">
            <button
              onClick={() => setShowReadingText(!showReadingText)}
              className="btn btn-outline-purple rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2 shadow-sm"
              style={{ borderColor: '#6C4AB6', color: '#6C4AB6' }}
            >
              <i className="bi bi-journal-text-fill"></i> 
              {showReadingText ? 'Hide Reading Text ✕' : '📖 Read Text (Click to View)'}
            </button>

            {showReadingText && (
              <div className="p-4 rounded-4 bg-light border mt-3 shadow-sm animate-fade-in" style={{ borderLeft: '5px solid #6C4AB6' }}>
                <h5 className="fw-bold text-purple mb-3">MODERN SOCIETY AND SOCIAL CHALLENGES</h5>
                {readingTextContent.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-dark" style={{ lineHeight: '1.7' }}>
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="mb-4 pb-3 border-bottom">
            <span className="badge bg-purple-light text-purple px-3 py-1 rounded-pill fw-bold">
              Part 2. Reading comprehension
            </span>
            <h4 className="fw-bold text-dark mt-2 mb-0">Choose the correct answer (A, B, C or D).</h4>
          </div>

          <div className="d-flex flex-column gap-4 mb-5">
            {questionsPart1.map(q => (
              <div key={q.id} className="p-4 rounded-4 bg-light border shadow-sm">
                <h5 className="fw-bold text-dark mb-3">{q.question}</h5>
                <div className="d-flex flex-column gap-2">
                  {q.options.map((opt) => {
                    const isSelected = userAnswersPart1[q.id] === opt.label;
                    return (
                      <div 
                        key={opt.label}
                        onClick={() => handleSelectOptionPart1(q.id, opt.label)}
                        className="p-3 rounded-pill bg-white border d-flex align-items-center gap-3 transition-all"
                        style={{ 
                          cursor: 'pointer', 
                          borderColor: isSelected ? '#6C4AB6' : '#E2E8F0', 
                          borderWidth: isSelected ? '2px' : '1px',
                          backgroundColor: isSelected ? '#EDE9FE' : '#FFFFFF'
                        }}
                      >
                        <input 
                          type="radio" 
                          name={`q-${q.id}`} 
                          checked={isSelected}
                          onChange={() => handleSelectOptionPart1(q.id, opt.label)}
                          className="form-check-input m-0"
                        />
                        <span className="fw-semibold text-dark"><strong>{opt.label}.</strong> {opt.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="text-end">
            <button 
              onClick={handleSubmitPart1}
              disabled={!Object.values(userAnswersPart1).every(Boolean)}
              className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
            >
              Continue to Part 3 (Vocabulary) <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* PARTE 2: VOCABULARY IN CONTEXT */}
      {/* ========================================== */}
      {step === 'part2' && (
        <div>
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom gap-2">
            <div>
              <span className="badge bg-purple-light text-purple px-3 py-1 rounded-pill fw-bold">
                Part 3. Vocabulary in context[cite: 20]
              </span>
              <h4 className="fw-bold text-dark mt-2 mb-0">Complete the sentences using the correct word from the box[cite: 20].</h4>
            </div>
            <span className="badge bg-warning-subtle text-warning-emphasis px-3 py-2 fs-6">
              Opportunities: <strong>{attemptsPart2}</strong>
            </span>
          </div>

          {errorMsgPart2 && (
            <div className="alert alert-danger fs-6 fw-semibold mb-4 rounded-4 shadow-sm">
              <i className="bi bi-exclamation-triangle-fill me-2"></i> {errorMsgPart2}
            </div>
          )}

          {/* BANCO DE PALABRAS */}
          <div className="p-4 rounded-4 bg-light border mb-4 shadow-sm text-center">
            <h6 className="fw-bold text-purple text-uppercase mb-3" style={{ letterSpacing: '1px' }}>
              <i className="bi bi-tags-fill me-2"></i> Word Bank (Drag or Click)
            </h6>
            <div className="d-flex flex-wrap justify-content-center gap-2">
              {wordBankPart2.map((word) => {
                const isPlaced = Object.values(userSlotsPart2).includes(word);
                const isSelected = selectedWord === word;

                return (
                  <div
                    key={word}
                    draggable={!isPlaced}
                    onDragStart={(e) => {
                      setDraggedWord(word);
                      e.dataTransfer.setData('text/plain', word);
                    }}
                    onClick={() => {
                      if (!isPlaced) setSelectedWord(prev => (prev === word ? null : word));
                    }}
                    className={`px-3 py-2 rounded-pill fw-bold shadow-sm transition-all ${
                      isPlaced ? 'opacity-50 bg-secondary text-white' :
                      isSelected ? 'bg-dark text-white scale-105' : 'bg-white text-purple border border-purple'
                    }`}
                    style={{ cursor: isPlaced ? 'default' : 'grab', userSelect: 'none', borderColor: '#6C4AB6' }}
                  >
                    {word} {isPlaced && '✓'}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ORACIONES */}
          <div className="d-flex flex-column gap-3 mb-5">
            {sentencesPart2.map((s) => {
              const placedWord = userSlotsPart2[s.id];
              const status = slotStatusPart2[s.id];

              return (
                <div 
                  key={s.id}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const w = e.dataTransfer.getData('text/plain') || draggedWord;
                    if (w) placeWordInSlot(s.id, w);
                  }}
                  className="p-3 px-4 rounded-4 bg-light border shadow-sm d-flex flex-wrap align-items-center justify-content-between"
                  style={{
                    backgroundColor: status === 'correct' ? '#DCFCE7' : status === 'incorrect' ? '#FEE2E2' : '#F8FAFC',
                    borderColor: status === 'correct' ? '#10B981' : status === 'incorrect' ? '#EF4444' : '#E2E8F0',
                    borderWidth: '2px'
                  }}
                >
                  <div className="text-dark fs-6 d-flex align-items-center flex-wrap" style={{ lineHeight: '2' }}>
                    <span>{s.before}</span>
                    <span
                      onClick={() => {
                        if (selectedWord) placeWordInSlot(s.id, selectedWord);
                        else if (placedWord) removeWordFromSlot(s.id);
                      }}
                      className="mx-2 px-3 py-1 rounded-pill d-inline-flex align-items-center gap-2 shadow-sm transition-all"
                      style={{
                        minWidth: '140px',
                        minHeight: '38px',
                        backgroundColor: placedWord ? '#EDE9FE' : '#FFFFFF',
                        border: placedWord ? '2px solid #6C4AB6' : '2px dashed #94A3B8',
                        cursor: 'pointer',
                        color: '#1E1248',
                        fontWeight: 'bold',
                        justifyContent: 'center'
                      }}
                    >
                      {placedWord ? (
                        <>
                          <span>{placedWord}</span>
                          <i className="bi bi-x-circle text-muted ms-1" style={{ fontSize: '0.85rem' }}></i>
                        </>
                      ) : (
                        <span className="text-muted fw-normal fst-italic" style={{ fontSize: '0.85rem' }}>[ drop here ]</span>
                      )}
                    </span>
                    <span>{s.after}</span>
                  </div>

                  {status && (
                    <div className="ms-3">
                      {status === 'correct' ? <span className="badge bg-success px-3 py-2">Correct ✓</span> : <span className="badge bg-danger px-3 py-2">Incorrect ✗</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-end">
            <button 
              onClick={handleSubmitPart2}
              disabled={!Object.values(userSlotsPart2).every(Boolean)}
              className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
            >
              Submit & Finish Reading Mission <i className="bi bi-check2-all ms-2"></i>
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

          <h3 className="fw-bold text-dark mb-3">Reading Mission Completed!</h3>

          <div className={`p-4 rounded-4 mb-4 shadow-sm border ${finalOverallScore >= 75 ? 'bg-success-subtle border-success text-success-emphasis' : 'bg-warning-subtle border-warning text-warning-emphasis'}`}>
            <p className="fs-5 fw-bold mb-1">
              {finalOverallScore >= 75 ? 'Outstanding reading performance!' : 'Good effort! Review the materials and try again!'}
            </p>
            <p className="fs-6 mb-0">
              Completed in <strong>{timeSpent.minutes}m {timeSpent.seconds}s</strong> with an overall score of <strong>{finalOverallScore}%</strong>.
            </p>
          </div>

          <div className="p-4 bg-light rounded-4 mb-4 border text-start">
            <h5 className="fw-bold text-purple mb-3">Evaluation Breakdown:</h5>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0 small">
              <li>Part 2 Score (Reading Comprehension): <strong>{scorePart1}%</strong></li>
              <li>Part 3 Score (Vocabulary in Context): <strong>{scorePart2}%</strong></li>
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