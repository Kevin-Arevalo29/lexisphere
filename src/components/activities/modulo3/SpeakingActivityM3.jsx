import React, { useState, useEffect } from 'react';

export default function SpeakingActivityM3({ activityData, onComplete }) {
  const [step, setStep] = useState('intro'); // 'intro', 'part2', 'part3', 'part4', 'submitted'

  // --- TEMPORIZADOR (20 minutos = 1200 segundos) ---
  const [timeLeft, setTimeLeft] = useState(1200);
  const [timerActive, setTimerActive] = useState(false);
  const [timeSpent, setTimeSpent] = useState({ minutes: 0, seconds: 0 });

  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
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

  // --- VOCABULARY REFERENCE ---
  const [showVocab, setShowVocab] = useState(false);
  const advancedVocabulary = [
    { id: 1, term: 'Civic engagement', definition: 'Active participation in activities that improve society.' },
    { id: 2, term: 'Marginalization', definition: 'The process of excluding certain groups from social opportunities.' },
    { id: 3, term: 'Social mobility', definition: "The possibility of improving one's social or economic position." },
    { id: 4, term: 'Advocacy', definition: 'Public support for a particular cause or social change.' },
    { id: 5, term: 'Accountability', definition: "The responsibility to explain and accept the consequences of one's actions." },
    { id: 6, term: 'Prejudice', definition: 'An unfair opinion about someone without knowing enough about them.' },
    { id: 7, term: 'Social cohesion', definition: 'The connection and cooperation between different members of society.' },
    { id: 8, term: 'Public policy', definition: 'Decisions and actions taken by governments to address social issues.' },
    { id: 9, term: 'Grassroots movement', definition: 'A social initiative organized by ordinary people to create change.' },
    { id: 10, term: 'Accessibility', definition: 'The possibility for everyone to use services, spaces and opportunities.' }
  ];

  // --- USEFUL EXPRESSIONS ---
  const [showExpressions, setShowExpressions] = useState(false);
  const usefulExpressions = [
    { func: 'Giving opinions', expr: 'From my perspective... / I strongly believe that...' },
    { func: 'Giving arguments', expr: 'One significant factor to consider is...' },
    { func: 'Explaining causes', expr: 'This happens because... / One of the main causes is...' },
    { func: 'Giving consequences', expr: 'As a result... / This can lead to...' },
    { func: 'Suggesting solutions', expr: 'A possible approach would be to...' },
    { func: 'Giving examples', expr: 'This can be illustrated by...' },
    { func: 'Concluding', expr: 'Taking everything into account... / In conclusion...' }
  ];

  // --- PART 2 PROMPTS ---
  const part2Prompts = [
    { id: 1, title: '1. Choose three social problems', instruction: 'Choose three social problems from the list below and introduce them.' },
    { id: 2, title: '2. Explain causes and consequences', instruction: 'Explain their causes and consequences in your city.' },
    { id: 3, title: '3. Propose realistic solutions', instruction: 'Propose realistic solutions for each problem and defend your opinions.' },
    { id: 4, title: '4. Final presentation', instruction: 'Present your overall conclusion using advanced vocabulary.' }
  ];
  const [recordingsPart2, setRecordingsPart2] = useState({ 1: null, 2: null, 3: null, 4: null });

  // --- PART 3 QUESTIONS ---
  const part3Questions = [
    { id: 1, text: '1. Why do some groups experience marginalization despite living in modern societies?' },
    { id: 2, text: '2. Should governments be held accountable for failing to provide equal opportunities?' },
    { id: 3, text: '3. How can civic engagement influence public policy?' },
    { id: 4, text: '4. Does social mobility depend more on personal effort or social conditions?' },
    { id: 5, text: '5. Can grassroots movements create meaningful and lasting social change?' },
    { id: 6, text: '6. How can schools reduce prejudice and promote social cohesion?' }
  ];
  const [recordingsPart3, setRecordingsPart3] = useState({ 1: null, 2: null, 3: null, 4: null, 5: null, 6: null });

  // --- PART 4 FINAL INDIVIDUAL CHALLENGE ---
  const [recordingsPart4, setRecordingsPart4] = useState({ 1: null });

  // --- RECORDER STATE ---
  const [activeRecording, setActiveRecording] = useState(null); // { part: 'part2'|'part3'|'part4', id: number }
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const startRecording = async (part, id) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
        const url = URL.createObjectURL(blob);

        if (part === 'part2') {
          setRecordingsPart2((prev) => ({ ...prev, [id]: url }));
        } else if (part === 'part3') {
          setRecordingsPart3((prev) => ({ ...prev, [id]: url }));
        } else {
          setRecordingsPart4((prev) => ({ ...prev, [id]: url }));
        }
        setActiveRecording(null);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setActiveRecording({ part, id });
    } catch (err) {
      alert('Microphone access is required to record your response.');
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }
  };

  const deleteRecording = (part, id) => {
    if (part === 'part2') {
      setRecordingsPart2((prev) => ({ ...prev, [id]: null }));
    } else if (part === 'part3') {
      setRecordingsPart3((prev) => ({ ...prev, [id]: null }));
    } else {
      setRecordingsPart4((prev) => ({ ...prev, [id]: null }));
    }
  };

  const handleSubmitAll = () => {
    setTimerActive(false);
    const totalSecondsSpent = 1200 - timeLeft;
    setTimeSpent({
      minutes: Math.floor(totalSecondsSpent / 60),
      seconds: totalSecondsSpent % 60
    });
    setStep('submitted');
  };

  const allPart2Recorded = Object.values(recordingsPart2).every(Boolean);
  const allPart3Recorded = Object.values(recordingsPart3).every(Boolean);
  const allPart4Recorded = Object.values(recordingsPart4).every(Boolean);

  return (
    <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4 p-lg-5 bg-white w-100 position-relative">
      {/* Temporizador superior */}
      {step !== 'intro' && step !== 'submitted' && (
        <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded-4 border">
          <span className="fw-bold" style={{ color: '#6C4AB6' }}>
            <i className="bi bi-clock-history me-2"></i> Speaking Time Remaining:
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
          <span
            className="badge px-3 py-2 rounded-pill fw-bold mb-2"
            style={{ backgroundColor: '#EDE9FE', color: '#6C4AB6' }}
          >
            Module 3 - Speaking Mission
          </span>
          <h2 className="fw-bold mb-2" style={{ color: '#1E1248' }}>
            The Future of Our Society: Speak Up!
          </h2>
          <p className="text-muted fs-5 fst-italic mb-4">
            Public Discussion & Final Individual Challenge (B2+)
          </p>

          <div
            className="p-4 rounded-4 mb-4 border-start border-4 text-start shadow-sm"
            style={{ backgroundColor: '#F8F7FC', borderColor: '#6C4AB6' }}
          >
            <h6 className="fw-bold mb-1" style={{ color: '#6C4AB6' }}>
              Mission Overview:
            </h6>
            <p className="text-dark fs-6 mb-3" style={{ lineHeight: '1.65' }}>
              Complete the speaking tasks: discuss social challenges, answer structured speaking questions, and conclude with the B2+ Individual Speaking challenge. You can review the advanced vocabulary reference at any time.
            </p>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={startTimer}
              className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-5 fw-bold shadow"
              style={{ backgroundColor: '#6C4AB6', borderColor: '#6C4AB6', color: '#FFFFFF' }}
            >
              Start Speaking Mission <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* PARTE 2: MAIN SPEAKING CHALLENGE           */}
      {/* ========================================== */}
      {step === 'part2' && (
        <div>
          {/* Botón Vocabulario Avanzado */}
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setShowVocab(!showVocab)}
              className="btn rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2 shadow-sm"
              style={{
                border: '2px solid #6C4AB6',
                color: showVocab ? '#FFFFFF' : '#6C4AB6',
                backgroundColor: showVocab ? '#6C4AB6' : '#FFFFFF'
              }}
            >
              <i className="bi bi-book-fill"></i>
              {showVocab ? 'Hide Part 1. Advanced Vocabulary ✕' : '📖 View Part 1. Advanced Vocabulary (Reference)'}
            </button>

            {showVocab && (
              <div
                className="p-4 rounded-4 border mt-3 shadow-sm"
                style={{ backgroundColor: '#F8F7FC', borderLeft: '5px solid #6C4AB6' }}
              >
                <span className="badge px-3 py-1 rounded-pill fw-bold mb-2" style={{ backgroundColor: '#EDE9FE', color: '#6C4AB6' }}>
                  Part 1. Advanced vocabulary
                </span>
                <div className="table-responsive mt-2">
                  <table className="table table-sm bg-white rounded-3 overflow-hidden mb-0 border">
                    <thead style={{ backgroundColor: '#EDE9FE', color: '#1E1248' }}>
                      <tr>
                        <th style={{ width: '32%' }}>Vocabulary</th>
                        <th>Definition in English</th>
                      </tr>
                    </thead>
                    <tbody>
                      {advancedVocabulary.map((item) => (
                        <tr key={item.id}>
                          <td className="fw-semibold" style={{ color: '#1E1248' }}>{item.id}. {item.term}</td>
                          <td className="text-dark small">{item.definition}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 rounded-4 border mb-4 shadow-sm" style={{ backgroundColor: '#F8F7FC', borderColor: '#DDD6FE' }}>
            <span className="badge px-3 py-1 rounded-pill fw-bold mb-2" style={{ backgroundColor: '#EDE9FE', color: '#6C4AB6' }}>
              Part 2. Main Speaking Challenge
            </span>
            <h4 className="fw-bold mt-1 mb-2" style={{ color: '#1E1248' }}>The Future of Our Society: Speak Up!</h4>
            <p className="text-dark small mb-2">Your city is experiencing several social challenges. Record your responses below.</p>
          </div>

          <div className="d-flex flex-column gap-4 mb-4">
            {part2Prompts.map((item) => {
              const isThisRecording = activeRecording?.part === 'part2' && activeRecording?.id === item.id;
              const hasAudio = recordingsPart2[item.id];

              return (
                <div key={item.id} className="p-4 rounded-4 border shadow-sm" style={{ backgroundColor: hasAudio ? '#F3E8FF' : '#F8F7FC', borderColor: hasAudio ? '#6C4AB6' : '#E9E5F5' }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge px-3 py-1 rounded-pill fw-bold" style={{ backgroundColor: '#EDE9FE', color: '#6C4AB6' }}>Prompt {item.id}</span>
                    <span className={`badge rounded-pill px-3 py-1 ${hasAudio ? 'text-white' : 'bg-light text-muted border'}`} style={hasAudio ? { backgroundColor: '#6C4AB6' } : {}}>
                      {hasAudio ? 'Audio Saved ✓' : 'Empty Slot'}
                    </span>
                  </div>
                  <h5 className="fw-bold mb-1" style={{ color: '#1E1248' }}>{item.title}</h5>
                  <p className="text-muted small mb-3">{item.instruction}</p>

                  <div className="d-flex flex-wrap align-items-center gap-3">
                    {!isThisRecording ? (
                      <button
                        type="button"
                        onClick={() => startRecording('part2', item.id)}
                        disabled={activeRecording !== null}
                        className="btn rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2 shadow-sm"
                        style={{ backgroundColor: hasAudio ? '#EDE9FE' : '#6C4AB6', borderColor: '#6C4AB6', color: hasAudio ? '#1E1248' : '#FFFFFF' }}
                      >
                        <i className="bi bi-mic-fill"></i> {hasAudio ? 'Record Again' : 'Start Recording'}
                      </button>
                    ) : (
                      <button type="button" onClick={stopRecording} className="btn btn-danger rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2 shadow-sm">
                        <i className="bi bi-stop-circle-fill"></i> Stop Recording
                      </button>
                    )}
                    {isThisRecording && <span className="text-danger fw-bold small">● Recording...</span>}
                    {hasAudio && !isThisRecording && (
                      <div className="flex-grow-1 d-flex align-items-center gap-3 flex-wrap">
                        <audio controls src={hasAudio} className="flex-grow-1" style={{ height: '36px', minWidth: '220px' }} />
                        <button type="button" onClick={() => deleteRecording('part2', item.id)} className="btn btn-outline-danger btn-sm rounded-pill px-3 py-1 fw-semibold d-flex align-items-center gap-1">
                          <i className="bi bi-trash-fill"></i> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-end">
            <button
              type="button"
              onClick={() => { setStep('part3'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              disabled={!allPart2Recorded}
              className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
              style={{ backgroundColor: '#6C4AB6', borderColor: '#6C4AB6', color: '#FFFFFF' }}
            >
              Continue to Part 3 <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* PARTE 3: SPEAKING QUESTIONS                */}
      {/* ========================================== */}
      {step === 'part3' && (
        <div>
          {/* Botón Expresiones Útiles */}
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setShowExpressions(!showExpressions)}
              className="btn rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2 shadow-sm"
              style={{ border: '2px solid #6C4AB6', color: showExpressions ? '#FFFFFF' : '#6C4AB6', backgroundColor: showExpressions ? '#6C4AB6' : '#FFFFFF' }}
            >
              <i className="bi bi-chat-quote-fill"></i>
              {showExpressions ? 'Hide Useful Speaking Expressions ✕' : '💬 View Useful Speaking Expressions'}
            </button>

            {showExpressions && (
              <div className="p-4 rounded-4 border mt-3 shadow-sm" style={{ backgroundColor: '#F8F7FC', borderLeft: '5px solid #6C4AB6' }}>
                <span className="badge px-3 py-1 rounded-pill fw-bold mb-2" style={{ backgroundColor: '#EDE9FE', color: '#6C4AB6' }}>
                  Useful Speaking Expressions
                </span>
                <div className="table-responsive mt-2">
                  <table className="table table-sm bg-white rounded-3 overflow-hidden mb-0 border">
                    <thead style={{ backgroundColor: '#EDE9FE', color: '#1E1248' }}>
                      <tr>
                        <th style={{ width: '32%' }}>Function</th>
                        <th>Expressions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usefulExpressions.map((row, idx) => (
                        <tr key={idx}>
                          <td className="fw-semibold" style={{ color: '#1E1248' }}>{row.func}</td>
                          <td className="text-dark small">{row.expr}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="mb-4 pb-3 border-bottom">
            <span className="badge px-3 py-1 rounded-pill fw-bold" style={{ backgroundColor: '#EDE9FE', color: '#6C4AB6' }}>
              Part 3. Speaking Questions
            </span>
            <h4 className="fw-bold mt-2 mb-1" style={{ color: '#1E1248' }}>Answer and discuss these questions using arguments and examples.</h4>
          </div>

          <div className="d-flex flex-column gap-4 mb-5">
            {part3Questions.map((q) => {
              const isThisRecording = activeRecording?.part === 'part3' && activeRecording?.id === q.id;
              const hasAudio = recordingsPart3[q.id];

              return (
                <div key={q.id} className="p-4 rounded-4 border shadow-sm" style={{ backgroundColor: hasAudio ? '#F3E8FF' : '#F8F7FC', borderColor: hasAudio ? '#6C4AB6' : '#E9E5F5' }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge px-3 py-1 rounded-pill fw-bold" style={{ backgroundColor: '#EDE9FE', color: '#6C4AB6' }}>Question {q.id}</span>
                    <span className={`badge rounded-pill px-3 py-1 ${hasAudio ? 'text-white' : 'bg-light text-muted border'}`} style={hasAudio ? { backgroundColor: '#6C4AB6' } : {}}>
                      {hasAudio ? 'Audio Saved ✓' : 'Empty Slot'}
                    </span>
                  </div>
                  <h5 className="fw-bold mb-3" style={{ color: '#1E1248' }}>{q.text}</h5>

                  <div className="d-flex flex-wrap align-items-center gap-3">
                    {!isThisRecording ? (
                      <button
                        type="button"
                        onClick={() => startRecording('part3', q.id)}
                        disabled={activeRecording !== null}
                        className="btn rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2 shadow-sm"
                        style={{ backgroundColor: hasAudio ? '#EDE9FE' : '#6C4AB6', borderColor: '#6C4AB6', color: hasAudio ? '#1E1248' : '#FFFFFF' }}
                      >
                        <i className="bi bi-mic-fill"></i> {hasAudio ? 'Record Again' : 'Start Recording'}
                      </button>
                    ) : (
                      <button type="button" onClick={stopRecording} className="btn btn-danger rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2 shadow-sm">
                        <i className="bi bi-stop-circle-fill"></i> Stop Recording
                      </button>
                    )}
                    {isThisRecording && <span className="text-danger fw-bold small">● Recording...</span>}
                    {hasAudio && !isThisRecording && (
                      <div className="flex-grow-1 d-flex align-items-center gap-3 flex-wrap">
                        <audio controls src={hasAudio} className="flex-grow-1" style={{ height: '36px', minWidth: '220px' }} />
                        <button type="button" onClick={() => deleteRecording('part3', q.id)} className="btn btn-outline-danger btn-sm rounded-pill px-3 py-1 fw-semibold d-flex align-items-center gap-1">
                          <i className="bi bi-trash-fill"></i> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-end">
            <button
              type="button"
              onClick={() => { setStep('part4'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              disabled={!allPart3Recorded}
              className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
              style={{ backgroundColor: '#6C4AB6', borderColor: '#6C4AB6', color: '#FFFFFF' }}
            >
              Continue to Part 4 (Final Challenge) <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* PARTE 4: FINAL INDIVIDUAL CHALLENGE        */}
      {/* ========================================== */}
      {step === 'part4' && (
        <div>
          {/* Botón Vocabulario Avanzado para Parte 4 */}
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setShowVocab(!showVocab)}
              className="btn rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2 shadow-sm"
              style={{ border: '2px solid #6C4AB6', color: showVocab ? '#FFFFFF' : '#6C4AB6', backgroundColor: showVocab ? '#6C4AB6' : '#FFFFFF' }}
            >
              <i className="bi bi-book-fill"></i>
              {showVocab ? 'Hide Advanced Vocabulary ✕' : '📖 View Advanced Vocabulary Reference (Min. 5 words)'}
            </button>

            {showVocab && (
              <div className="p-4 rounded-4 border mt-3 shadow-sm" style={{ backgroundColor: '#F8F7FC', borderLeft: '5px solid #6C4AB6' }}>
                <span className="badge px-3 py-1 rounded-pill fw-bold mb-2" style={{ backgroundColor: '#EDE9FE', color: '#6C4AB6' }}>
                  Advanced Vocabulary Reference
                </span>
                <div className="table-responsive mt-2">
                  <table className="table table-sm bg-white rounded-3 overflow-hidden mb-0 border">
                    <thead style={{ backgroundColor: '#EDE9FE', color: '#1E1248' }}>
                      <tr>
                        <th style={{ width: '32%' }}>Vocabulary</th>
                        <th>Definition in English</th>
                      </tr>
                    </thead>
                    <tbody>
                      {advancedVocabulary.map((item) => (
                        <tr key={item.id}>
                          <td className="fw-semibold" style={{ color: '#1E1248' }}>{item.id}. {item.term}</td>
                          <td className="text-dark small">{item.definition}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 rounded-4 border mb-4 shadow-sm" style={{ backgroundColor: '#F8F7FC', borderColor: '#DDD6FE' }}>
            <span className="badge px-3 py-1 rounded-pill fw-bold mb-2" style={{ backgroundColor: '#EDE9FE', color: '#6C4AB6' }}>
              Part 4. Final Individual Challenge
            </span>
            <h5 className="text-muted small fst-italic mb-3">(B2+ Individual Speaking)</h5>

            <h6 className="fw-bold mb-2" style={{ color: '#6C4AB6' }}>Question:</h6>
            <p className="text-dark fs-5 fst-italic mb-4" style={{ lineHeight: '1.6' }}>
              "If you had the power to change one social policy in your country, what would you change and how would this decision improve society?"[cite: 21]
            </p>

            <h6 className="fw-bold mb-2" style={{ color: '#6C4AB6' }}>Requirements:[cite: 21]</h6>
            <ul className="text-dark small mb-0 ps-3 d-flex flex-column gap-1">
              <li>Speak for 2 minutes.[cite: 21]</li>
              <li>Use at least 5 advanced vocabulary words.[cite: 21]</li>
              <li>Give two arguments.[cite: 21]</li>
              <li>Include one real or hypothetical example.[cite: 21]</li>
              <li>Present a clear conclusion.[cite: 21]</li>
            </ul>
          </div>

          {/* Grabación del Reto Final */}
          <div className="p-4 rounded-4 border text-center mb-5 shadow-sm" style={{ backgroundColor: '#F8F7FC', borderColor: '#DDD6FE' }}>
            <h5 className="fw-bold mb-1" style={{ color: '#1E1248' }}>
              <i className="bi bi-mic-fill me-2" style={{ color: '#6C4AB6' }}></i>
              Record Your Final Individual Speech
            </h5>
            <p className="text-muted small mb-3">Make sure to include your 2 arguments, example, and at least 5 advanced vocabulary words[cite: 21].</p>

            {(() => {
              const isThisRecording = activeRecording?.part === 'part4' && activeRecording?.id === 1;
              const hasAudio = recordingsPart4[1];

              return (
                <div className="d-flex flex-column align-items-center gap-3">
                  {!isThisRecording ? (
                    <button
                      type="button"
                      onClick={() => startRecording('part4', 1)}
                      disabled={activeRecording !== null}
                      className="btn rounded-pill px-5 py-3 fw-bold shadow d-flex align-items-center gap-2"
                      style={{ backgroundColor: hasAudio ? '#EDE9FE' : '#6C4AB6', borderColor: '#6C4AB6', color: hasAudio ? '#1E1248' : '#FFFFFF' }}
                    >
                      <i className="bi bi-mic-fill fs-5"></i> {hasAudio ? 'Record Again' : 'Start Recording Speech'}
                    </button>
                  ) : (
                    <button type="button" onClick={stopRecording} className="btn btn-danger rounded-pill px-5 py-3 fw-bold shadow animate-pulse d-flex align-items-center gap-2">
                      <i className="bi bi-stop-circle-fill fs-5"></i> Stop Recording
                    </button>
                  )}

                  {isThisRecording && <span className="text-danger fw-bold animate-bounce">● Recording final speech... Speak clearly.</span>}

                  {hasAudio && !isThisRecording && (
                    <div className="d-flex align-items-center gap-3 flex-wrap justify-content-center mt-2">
                      <audio controls src={hasAudio} style={{ height: '38px', minWidth: '260px' }} />
                      <button type="button" onClick={() => deleteRecording('part4', 1)} className="btn btn-outline-danger btn-sm rounded-pill px-3 py-1 fw-semibold">
                        <i className="bi bi-trash-fill"></i> Delete Audio
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          <div className="text-end">
            <button
              type="button"
              onClick={handleSubmitAll}
              disabled={!allPart4Recorded}
              className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
              style={{ backgroundColor: '#6C4AB6', borderColor: '#6C4AB6', color: '#FFFFFF' }}
            >
              Submit All Speaking Missions <i className="bi bi-check2-all ms-2"></i>
            </button>
          </div>
        </div>
      )}

      {/* 3. PANTALLA DE ESTADO: PENDIENTE DE CALIFICAR */}
      {step === 'submitted' && (
        <div className="text-center py-4 mx-auto" style={{ maxWidth: '650px' }}>
          <div className="mb-3 text-warning">
            <i className="bi bi-hourglass-split display-2"></i>
          </div>

          <h3 className="fw-bold text-dark mb-3">All Speaking Recordings Submitted!</h3>

          <div className="p-4 rounded-4 mb-4 shadow-sm border bg-warning-subtle text-warning-emphasis">
            <p className="fs-5 fw-bold mb-1">Pending Evaluation (Pendiente de calificar)</p>
            <p className="fs-6 mb-0">
              Your speaking recordings across all parts have been submitted for instructor evaluation. Completed in{' '}
              <strong>
                {timeSpent.minutes}m {timeSpent.seconds}s
              </strong>
              .
            </p>
          </div>

          <button
            type="button"
            onClick={() => onComplete(90)}
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