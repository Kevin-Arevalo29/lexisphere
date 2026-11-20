import React, { useState, useEffect } from 'react';

export default function ListeningActivityM3({ activityData, onComplete }) {
  const [step, setStep] = useState('intro'); // 'intro', 'part2', 'part3', 'results'

  // --- TEMPORIZADOR (20 minutos = 1200 segundos) ---
  const [timeLeft, setTimeLeft] = useState(1200);
  const [timerActive, setTimerActive] = useState(false);
  const [timeSpent, setTimeSpent] = useState({ minutes: 0, seconds: 0 });

  // =========================================================================
  // <--- COLOCA AQUÍ LA RUTA DE TU AUDIO --->
  // Ejemplo si está en public/audio/: "/audio/AUDIO 3 - SOCIETY LISTENING.ogg"
  // O importa el archivo arriba: import societyAudio from '../../../assets/...'
  // =========================================================================
  const AUDIO_SRC = "../../../../public/audio/AUDIO 3 - SOCIETY LISTENING.ogg";

  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      handleFinishAll(scorePart2, 0);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const startTimer = () => {
    setTimerActive(true);
    setStep('part2');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ==========================================
  // PARTE 2: LISTENING COMPREHENSION (1 a 5)
  // ==========================================
  const questionsPart2 = [
    {
      id: 1,
      text: '1. What is the main topic of the podcast?',
      options: [
        { label: 'A', text: 'The importance of economic competition.' },
        { label: 'B', text: 'The role of young people in creating a fairer society.' },
        { label: 'C', text: 'The disadvantages of living in large cities.' },
        { label: 'D', text: 'The impact of technology on education.' }
      ],
      correct: 'B'
    },
    {
      id: 2,
      text: '2. According to the interview, what is one consequence of unemployment?',
      options: [
        { label: 'A', text: "It only affects people's financial situation." },
        { label: 'B', text: 'It encourages cultural diversity.' },
        { label: 'C', text: "It can affect people's confidence and social participation." },
        { label: 'D', text: 'It completely eliminates poverty.' }
      ],
      correct: 'C'
    },
    {
      id: 3,
      text: '3. What example of discrimination is mentioned in the discussion?',
      options: [
        { label: 'A', text: 'People being treated unfairly because of their background.' },
        { label: 'B', text: 'People choosing different career paths.' },
        { label: 'C', text: 'Students participating in volunteer activities.' },
        { label: 'D', text: 'Communities organizing cultural festivals.' }
      ],
      correct: 'A'
    },
    {
      id: 4,
      text: '4. How can volunteering contribute to social change?',
      options: [
        { label: 'A', text: 'By replacing all government institutions.' },
        { label: 'B', text: 'By increasing competition between communities.' },
        { label: 'C', text: 'By helping people develop solidarity and support others.' },
        { label: 'D', text: 'By reducing the importance of human rights.' }
      ],
      correct: 'C'
    },
    {
      id: 5,
      text: "5. What is the speakers' final conclusion?",
      options: [
        { label: 'A', text: 'Social problems should only be solved by governments.' },
        { label: 'B', text: 'A successful society requires awareness, cooperation and equal opportunities.' },
        { label: 'C', text: 'Economic growth is more important than human rights.' },
        { label: 'D', text: 'Cultural diversity creates more social conflicts.' }
      ],
      correct: 'B'
    }
  ];

  const [answersPart2, setAnswersPart2] = useState({ 1: '', 2: '', 3: '', 4: '', 5: '' });
  const [scorePart2, setScorePart2] = useState(0);

  const handleOptionSelectPart2 = (qId, optionLabel) => {
    setAnswersPart2((prev) => ({ ...prev, [qId]: optionLabel }));
  };

  const handleSubmitPart2 = () => {
    let correctCount = 0;
    questionsPart2.forEach((q) => {
      if (answersPart2[q.id] === q.correct) correctCount++;
    });

    const p2Score = Math.round((correctCount / questionsPart2.length) * 100);
    setScorePart2(p2Score);
    setStep('part3');
  };

  // ==========================================
  // PARTE 3: COMPLETE THE SENTENCES (Word Bank)
  // ==========================================
  const wordBankPart3 = ['Inequality', 'Awareness', 'Solidarity', 'Community', 'Human rights'];

  const sentencesPart3 = [
    {
      id: 1,
      before: '1. Social ',
      after: ' prevents people from having the same opportunities.',
      correctWord: 'Inequality'
    },
    {
      id: 2,
      before: '2. Raising ',
      after: ' is essential to understanding social problems.',
      correctWord: 'Awareness'
    },
    {
      id: 3,
      before: '3. ',
      after: ' encourages people to support one another.',
      correctWord: 'Solidarity'
    },
    {
      id: 4,
      before: '4. A strong ',
      after: ' can work together to improve living conditions.',
      correctWord: 'Community'
    },
    {
      id: 5,
      before: '5. Everyone deserves respect and protection of their ',
      after: '.',
      correctWord: 'Human rights'
    }
  ];

  const [userSlotsPart3, setUserSlotsPart3] = useState({ 1: null, 2: null, 3: null, 4: null, 5: null });
  const [selectedWord, setSelectedWord] = useState(null);
  const [draggedWord, setDraggedWord] = useState(null);
  const [scorePart3, setScorePart3] = useState(0);

  const placeWordInSlot = (sentenceId, word) => {
    setUserSlotsPart3((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (next[k] === word) next[k] = null;
      });
      next[sentenceId] = word;
      return next;
    });
    setSelectedWord(null);
  };

  const removeWordFromSlot = (sentenceId) => {
    setUserSlotsPart3((prev) => ({ ...prev, [sentenceId]: null }));
  };

  const handleSubmitPart3 = () => {
    let correctCount = 0;
    sentencesPart3.forEach((s) => {
      if (userSlotsPart3[s.id] === s.correctWord) {
        correctCount++;
      }
    });

    const p3Score = Math.round((correctCount / sentencesPart3.length) * 100);
    setScorePart3(p3Score);
    handleFinishAll(scorePart2, p3Score);
  };

  const [finalOverallScore, setFinalOverallScore] = useState(0);

  const handleFinishAll = (s2, s3) => {
    setTimerActive(false);
    const totalSecondsSpent = 1200 - timeLeft;
    setTimeSpent({
      minutes: Math.floor(totalSecondsSpent / 60),
      seconds: totalSecondsSpent % 60
    });

    const overall = Math.round((s2 + s3) / 2);
    setFinalOverallScore(overall);
    setStep('results');
  };

  const allPart2Answered = Object.values(answersPart2).every(Boolean);
  const allPart3Filled = Object.values(userSlotsPart3).every(Boolean);

  return (
    <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4 p-lg-5 bg-white w-100 position-relative">
      {/* Temporizador superior */}
      {step !== 'intro' && step !== 'results' && (
        <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded-4 border">
          <span className="fw-bold" style={{ color: '#6C4AB6' }}>
            <i className="bi bi-clock-history me-2"></i> Listening Time Remaining:
          </span>
          <span
            className={`badge px-3 py-2 fs-5 ${timeLeft < 300 ? 'bg-danger' : ''}`}
            style={timeLeft >= 300 ? { backgroundColor: '#6C4AB6', color: '#FFFFFF' } : {}}
          >
            {formatTime(timeLeft)}
          </span>
        </div>
      )}

      {/* 1. INTRODUCCIÓN */}
      {step === 'intro' && (
        <div className="mx-auto" style={{ maxWidth: '900px' }}>
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
            <span
              className="badge px-3 py-2 rounded-pill fw-bold"
              style={{ backgroundColor: '#EDE9FE', color: '#6C4AB6' }}
            >
              LISTENING ACTIVITY – SOCIETY
            </span>
            <div className="d-flex flex-wrap gap-2">
              <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: '#EDE9FE', color: '#1E1248' }}>
                B2+
              </span>
              <span className="badge rounded-pill px-3 py-2 bg-light text-dark border">
                Listening comprehension
              </span>
              <span className="badge rounded-pill px-3 py-2 bg-light text-dark border">
                20 minutes
              </span>
            </div>
          </div>

          <h2 className="fw-bold mb-1" style={{ color: '#1E1248' }}>
            Part 1. Listen to the podcast
          </h2>
          <h4 className="fw-bold mb-2" style={{ color: '#6C4AB6' }}>
            The Society We Want to Build
          </h4>
          <p className="text-uppercase small fw-semibold text-muted mb-4" style={{ letterSpacing: '0.5px' }}>
            PODCAST · SOCIAL ISSUES · COMMUNITY AND EQUALITY
          </p>

          <div
            className="p-4 rounded-4 mb-4 border-start border-4 text-start shadow-sm"
            style={{ backgroundColor: '#F8F7FC', borderColor: '#6C4AB6' }}
          >
            <p className="text-dark fs-6 mb-3" style={{ lineHeight: '1.65' }}>
              Imagine you are listening to a podcast about social challenges and how young people can contribute to creating a better society.
            </p>
            <h6 className="fw-bold mb-2" style={{ color: '#6C4AB6' }}>
              <i className="bi bi-headphones me-2"></i> Instructions:
            </h6>
            <ul className="text-dark mb-0 d-flex flex-column gap-1" style={{ lineHeight: '1.6' }}>
              <li>Listen carefully to the conversation.</li>
              <li>You can listen twice.</li>
              <li>Pay attention to the speakers' opinions and examples.</li>
              <li>Answer the questions without reading the transcript.</li>
            </ul>
          </div>

          <div className="text-center">
            <button
              onClick={startTimer}
              className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-5 fw-bold shadow"
              style={{ backgroundColor: '#6C4AB6', borderColor: '#6C4AB6', color: '#FFFFFF' }}
            >
              Start Listening Mission <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      )}

      {/* REPRODUCTOR DE AUDIO FIJO DURANTE PART 2 Y PART 3 */}
      {step !== 'intro' && step !== 'results' && (
        <div
          className="p-4 rounded-4 mb-4 shadow-sm border text-center"
          style={{ backgroundColor: '#F8F7FC', borderColor: '#DDD6FE' }}
        >
          <span
            className="badge rounded-pill px-3 py-1 fw-bold mb-2"
            style={{ backgroundColor: '#EDE9FE', color: '#6C4AB6' }}
          >
            Part 1 · Audio Player
          </span>
          <h5 className="fw-bold mb-1" style={{ color: '#1E1248' }}>
            <i className="bi bi-volume-up-fill me-2" style={{ color: '#6C4AB6' }}></i>
            The Society We Want to Build
          </h5>
          <p className="text-muted small mb-3">
            Podcast · Social Issues · Community and Equality (No transcript available)
          </p>

          {/* <--- COLOCA AQUÍ LA RUTA DE TU AUDIO ---> */}
          <audio controls className="w-100 mx-auto d-block" style={{ maxWidth: '540px' }}>
            <source src={AUDIO_SRC} type="audio/ogg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {/* ========================================== */}
      {/* PARTE 2: LISTENING COMPREHENSION           */}
      {/* ========================================== */}
      {step === 'part2' && (
        <div>
          <div className="mb-4 pb-3 border-bottom">
            <span
              className="badge px-3 py-1 rounded-pill fw-bold"
              style={{ backgroundColor: '#EDE9FE', color: '#6C4AB6' }}
            >
              Part 2. Listening comprehension
            </span>
            <h4 className="fw-bold text-dark mt-2 mb-0">
              Choose the correct answer (A, B, C or D).
            </h4>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmitPart2();
            }}
          >
            <div className="d-flex flex-column gap-4 mb-5">
              {questionsPart2.map((q) => (
                <div
                  key={q.id}
                  className="p-4 rounded-4 border shadow-sm"
                  style={{ backgroundColor: '#F8F7FC', borderColor: '#E9E5F5' }}
                >
                  <h5 className="fw-bold mb-3" style={{ color: '#1E1248' }}>
                    {q.text}
                  </h5>
                  <div className="d-flex flex-column gap-2">
                    {q.options.map((opt) => {
                      const isSelected = answersPart2[q.id] === opt.label;
                      return (
                        <div
                          key={opt.label}
                          onClick={() => handleOptionSelectPart2(q.id, opt.label)}
                          className="p-3 rounded-4 d-flex align-items-center gap-3 transition-all"
                          style={{
                            cursor: 'pointer',
                            backgroundColor: isSelected ? '#EDE9FE' : '#FFFFFF',
                            border: isSelected ? '2px solid #6C4AB6' : '1px solid #E2E8F0'
                          }}
                        >
                          <input
                            type="radio"
                            name={`listening-q-${q.id}`}
                            checked={isSelected}
                            onChange={() => handleOptionSelectPart2(q.id, opt.label)}
                            className="form-check-input m-0"
                            style={{ accentColor: '#6C4AB6', cursor: 'pointer' }}
                          />
                          <span className="fw-semibold text-dark">
                            <strong style={{ color: '#6C4AB6' }}>{opt.label}.</strong> {opt.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-end">
              <button
                type="submit"
                disabled={!allPart2Answered}
                className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
                style={{ backgroundColor: '#6C4AB6', borderColor: '#6C4AB6', color: '#FFFFFF' }}
              >
                Continue to Part 3 <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================== */}
      {/* PARTE 3: COMPLETE THE SENTENCES            */}
      {/* ========================================== */}
      {step === 'part3' && (
        <div>
          <div className="mb-4 pb-3 border-bottom">
            <span
              className="badge px-3 py-1 rounded-pill fw-bold"
              style={{ backgroundColor: '#EDE9FE', color: '#6C4AB6' }}
            >
              Part 3. Complete the sentences
            </span>
            <h4 className="fw-bold text-dark mt-2 mb-0">
              Listen again and complete the sentences with the correct vocabulary word.
            </h4>
          </div>

          {/* WORD BANK */}
          <div
            className="p-4 rounded-4 border mb-4 shadow-sm text-center"
            style={{ backgroundColor: '#F8F7FC', borderColor: '#DDD6FE' }}
          >
            <h6
              className="fw-bold text-uppercase mb-3"
              style={{ color: '#6C4AB6', letterSpacing: '1px' }}
            >
              <i className="bi bi-tags-fill me-2"></i> WORD BANK (Drag or Click)
            </h6>
            <div className="d-flex flex-wrap justify-content-center gap-2">
              {wordBankPart3.map((word) => {
                const isPlaced = Object.values(userSlotsPart3).includes(word);
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
                      if (!isPlaced) {
                        setSelectedWord((prev) => (prev === word ? null : word));
                      }
                    }}
                    className="px-3 py-2 rounded-pill fw-bold shadow-sm transition-all"
                    style={{
                      cursor: isPlaced ? 'default' : 'grab',
                      userSelect: 'none',
                      opacity: isPlaced ? 0.5 : 1,
                      backgroundColor: isPlaced ? '#CBD5E1' : isSelected ? '#6C4AB6' : '#EDE9FE',
                      color: isPlaced ? '#475569' : isSelected ? '#FFFFFF' : '#1E1248',
                      border: isSelected ? '2px solid #1E1248' : '1px solid #C4B5FD'
                    }}
                  >
                    {word} {isPlaced && '✓'}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ORACIONES */}
          <div className="d-flex flex-column gap-3 mb-5">
            {sentencesPart3.map((s) => {
              const placedWord = userSlotsPart3[s.id];

              return (
                <div
                  key={s.id}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const w = e.dataTransfer.getData('text/plain') || draggedWord;
                    if (w) placeWordInSlot(s.id, w);
                  }}
                  className="p-3 px-4 rounded-4 border shadow-sm d-flex flex-wrap align-items-center justify-content-between"
                  style={{
                    backgroundColor: '#F8F7FC',
                    borderColor: '#E9E5F5'
                  }}
                >
                  <div className="text-dark fs-6 d-flex align-items-center flex-wrap" style={{ lineHeight: '2.1' }}>
                    <span>{s.before}</span>
                    <span
                      onClick={() => {
                        if (selectedWord) {
                          placeWordInSlot(s.id, selectedWord);
                        } else if (placedWord) {
                          removeWordFromSlot(s.id);
                        }
                      }}
                      className="mx-2 px-3 py-1 rounded-pill d-inline-flex align-items-center gap-2 shadow-sm transition-all"
                      style={{
                        minWidth: '145px',
                        minHeight: '38px',
                        backgroundColor: placedWord ? '#EDE9FE' : '#FFFFFF',
                        border: placedWord ? '2px solid #6C4AB6' : '2px dashed #A78BFA',
                        cursor: 'pointer',
                        color: '#1E1248',
                        fontWeight: 'bold',
                        justifyContent: 'center'
                      }}
                      title={placedWord ? 'Click to remove word' : 'Click to place selected word or drop here'}
                    >
                      {placedWord ? (
                        <>
                          <span>{placedWord}</span>
                          <i className="bi bi-x-circle" style={{ color: '#6C4AB6', fontSize: '0.85rem' }}></i>
                        </>
                      ) : (
                        <span className="text-muted fw-normal fst-italic" style={{ fontSize: '0.85rem' }}>
                          [ drop here ]
                        </span>
                      )}
                    </span>
                    <span>{s.after}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-end">
            <button
              onClick={handleSubmitPart3}
              disabled={!allPart3Filled}
              className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
              style={{ backgroundColor: '#6C4AB6', borderColor: '#6C4AB6', color: '#FFFFFF' }}
            >
              Submit answers <i className="bi bi-check2-all ms-2"></i>
            </button>
          </div>
        </div>
      )}

      {/* 3. PANTALLA FINAL DE RESULTADOS */}
      {step === 'results' && (
        <div className="text-center py-4 mx-auto" style={{ maxWidth: '650px' }}>
          <div className="mb-2">
            <span className="display-2">{finalOverallScore >= 75 ? '😊' : '😕'}</span>
          </div>

          <h3 className="fw-bold text-dark mb-3">Listening Mission Completed!</h3>

          <div
            className={`p-4 rounded-4 mb-4 shadow-sm border ${
              finalOverallScore >= 75
                ? 'bg-success-subtle border-success text-success-emphasis'
                : 'bg-warning-subtle border-warning text-warning-emphasis'
            }`}
          >
            <p className="fs-5 fw-bold mb-1">
              {finalOverallScore >= 75
                ? 'Great listening comprehension!'
                : 'Good effort! Listen to the podcast carefully and try again!'}
            </p>
            <p className="fs-6 mb-0">
              Completed in{' '}
              <strong>
                {timeSpent.minutes}m {timeSpent.seconds}s
              </strong>{' '}
              with an overall score of <strong>{finalOverallScore}%</strong>.
            </p>
          </div>

          <div
            className="p-4 rounded-4 mb-4 border text-start"
            style={{ backgroundColor: '#F8F7FC', borderColor: '#E9E5F5' }}
          >
            <h5 className="fw-bold mb-3" style={{ color: '#6C4AB6' }}>
              Listening Evaluation Summary:
            </h5>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0 small text-dark">
              <li>
                Part 2 Score (Listening Comprehension): <strong>{scorePart2}%</strong>
              </li>
              <li>
                Part 3 Score (Complete the Sentences): <strong>{scorePart3}%</strong>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onComplete(finalOverallScore)}
            className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
            style={{ backgroundColor: '#6C4AB6', borderColor: '#6C4AB6', color: '#FFFFFF' }}
          >
            Continue to Next Mission ➔
          </button>
        </div>
      )}
    </div>
  );
}