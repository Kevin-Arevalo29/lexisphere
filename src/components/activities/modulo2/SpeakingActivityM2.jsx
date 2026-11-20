import React, { useState, useEffect } from 'react';

export default function SpeakingActivityM2({ activityData, onComplete }) {
  const [step, setStep] = useState('intro'); // 'intro', 'speaking', 'submitted'
  const [showVocabularySidebar, setShowVocabularySidebar] = useState(false);
  
  // --- TEMPORIZADOR ---
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutos
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
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const startTimer = () => {
    setTimerActive(true);
    setStep('speaking');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- VOCABULARIO DESPLEGABLE (USEFUL VOCABULARY – B1) ---
  const usefulVocabularyB1 = [
    {
      num: 1,
      term: 'Pollution',
      definition: 'The presence of harmful substances in the environment.'
    },
    {
      num: 2,
      term: 'Deforestation',
      definition: 'The cutting down of trees.'
    },
    {
      num: 3,
      term: 'Climate change',
      definition: "Long-term changes in the Earth's climate."
    },
    {
      num: 4,
      term: 'Renewable energy',
      definition: 'Energy from natural sources that can be replaced.'
    },
    {
      num: 5,
      term: 'Reduce waste',
      definition: 'To produce less rubbish.'
    },
    {
      num: 6,
      term: 'Protect wildlife',
      definition: 'To keep animals safe in nature.'
    },
    {
      num: 7,
      term: 'Save resources',
      definition: 'To use natural resources carefully.'
    },
    {
      num: 8,
      term: 'Sustainable lifestyle',
      definition: 'A way of living that protects the environment.'
    }
  ];

  const VocabularyReferenceContent = () => (
    <div className="d-flex flex-column gap-2">
      <h6 className="fw-bold text-dark mb-2">Useful Vocabulary – B1</h6>
      {usefulVocabularyB1.map((item) => (
        <div
          key={item.num}
          className="p-3 rounded-3 border bg-light"
          style={{ lineHeight: '1.5' }}
        >
          <span className="fw-bold text-dark">
            {item.num}. {item.term}:
          </span>{' '}
          <span className="text-dark small">{item.definition}</span>
        </div>
      ))}
    </div>
  );

  // --- LAS 4 PREGUNTAS / PASOS DE SPEAKING ---
  const speakingPrompts = [
    {
      id: 1,
      title: '1. Describe the problem',
      question: 'What is happening to the environment?',
      example: '"Plastic pollution is affecting oceans and marine animals."'
    },
    {
      id: 2,
      title: '2. Explain the causes',
      question: 'Why is this problem happening?',
      example: '"One important cause is the excessive use of plastic products."'
    },
    {
      id: 3,
      title: '3. Suggest solutions',
      question: 'What can people do to solve it?',
      example: '"People should recycle more and use reusable bags."'
    },
    {
      id: 4,
      title: '4. Give your opinion',
      question: 'Why is it important to protect the environment?',
      example: '"I believe protecting nature is important because future generations need a healthy planet."'
    }
  ];

  // Estados de grabación y control por casilla
  const [recordings, setRecordings] = useState({ 1: null, 2: null, 3: null, 4: null });
  const [activeRecordingId, setActiveRecordingId] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const startRecording = async (id) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      let chunks = [];

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
        const audioUrl = URL.createObjectURL(blob);
        setRecordings(prev => ({ ...prev, [id]: audioUrl }));
        setActiveRecordingId(null);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setActiveRecordingId(id);
    } catch (err) {
      alert('Microphone access is required to record your speaking response.');
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  };

  const deleteRecording = (id) => {
    setRecordings(prev => ({ ...prev, [id]: null }));
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

  // Validar si las 4 casillas tienen audio grabado
  const allRecorded = Object.values(recordings).every(Boolean);

  return (
    <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4 p-lg-5 bg-white w-100 position-relative">
      
      {/* Temporizador superior */}
      {step === 'speaking' && (
        <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded-4 border">
          <span className="fw-bold text-purple">
            <i className="bi bi-clock-history me-2"></i> Speaking Time Remaining:
          </span>
          <span className={`badge px-3 py-2 fs-5 ${timeLeft < 300 ? 'bg-danger animate-pulse' : 'bg-purple'}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      )}

      {/* 1. INTRODUCCIÓN */}
      {step === 'intro' && (
        <div className="mx-auto text-center" style={{ maxWidth: '900px' }}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="badge bg-purple-light text-purple px-3 py-2 rounded-pill fw-bold">
              Module 2 - Speaking Mission
            </span>
            <button
              type="button"
              onClick={() => setShowVocabularySidebar(true)}
              className="btn btn-outline-purple rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-2 shadow-sm"
              style={{ borderColor: '#6C4AB6', color: '#6C4AB6' }}
            >
              <i className="bi bi-translate"></i> Vocabulary
            </button>
          </div>
          <h2 className="fw-bold mb-3" style={{ color: '#1E1248' }}>BE AN ECO-EXPERT!</h2>
          <p className="text-muted fs-5 fst-italic mb-4">Television Interview Simulation</p>

          <div className="p-4 rounded-4 bg-light mb-4 border-start border-4 text-start" style={{ borderColor: '#6C4AB6' }}>
            <h5 className="fw-bold mb-2" style={{ color: '#6C4AB6' }}>
              <i className="bi bi-mic-fill me-2"></i> SPEAKING INSTRUCTIONS
            </h5>
            <p className="text-dark fs-6 mb-0" style={{ lineHeight: '1.6' }}>
              Imagine you are environmental experts participating in a television interview. Record an individual audio response for each of the 4 interview questions below. You must complete all 4 slots to finish.
            </p>
          </div>

          <button 
            onClick={startTimer}
            className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-5 fw-bold shadow"
          >
            Start Speaking Interview <i className="bi bi-arrow-right ms-2"></i>
          </button>
        </div>
      )}

      {/* 2. ZONA DE ENTREVISTA CON 4 CASILLAS DE AUDIO Y BOTÓN DE BORRAR */}
      {step === 'speaking' && (
        <div>
          <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-4 pb-3 border-bottom">
            <div>
              <span className="badge bg-purple-light text-purple px-3 py-1 rounded-pill fw-bold">
                Speaking challenge: Be an Eco-Expert!
              </span>
              <h4 className="fw-bold text-dark mt-2 mb-0">Record your response for each question</h4>
              <p className="text-muted small mt-1">If you want to re-record a specific question, click the delete button to clear its slot.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowVocabularySidebar(true)}
              className="btn btn-outline-purple rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-2 shadow-sm"
              style={{ borderColor: '#6C4AB6', color: '#6C4AB6' }}
            >
              <i className="bi bi-translate"></i> Vocabulary
            </button>
          </div>

          <div className="d-flex flex-column gap-4 mb-4">
            {speakingPrompts.map(item => {
              const isThisRecording = activeRecordingId === item.id;
              const hasAudio = recordings[item.id];

              return (
                <div 
                  key={item.id} 
                  className={`p-4 rounded-4 border shadow-sm transition-all ${
                    hasAudio ? 'bg-success-subtle border-success' : 'bg-light border'
                  }`}
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge bg-purple text-white">Question {item.id}</span>
                    <span className={`badge ${hasAudio ? 'bg-success' : 'bg-warning text-dark'}`}>
                      {hasAudio ? 'Recorded Audio Saved ✓' : 'Slot Available (Desocupada)'}
                    </span>
                  </div>

                  <h5 className="fw-bold text-dark mb-1">{item.title}: {item.question}</h5>
                  <p className="text-muted small fst-italic mb-3">Example: {item.example}</p>

                  <div className="d-flex flex-wrap align-items-center gap-3">
                    {!isThisRecording ? (
                      <button
                        onClick={() => startRecording(item.id)}
                        disabled={activeRecordingId !== null}
                        className={`btn rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2 ${
                          hasAudio ? 'btn-outline-secondary' : 'btn-danger'
                        }`}
                      >
                        <i className="bi bi-mic-fill"></i> {hasAudio ? 'Record Again' : 'Start Recording'}
                      </button>
                    ) : (
                      <button
                        onClick={stopRecording}
                        className="btn btn-dark rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2 animate-pulse"
                      >
                        <i className="bi bi-stop-circle-fill text-danger"></i> Stop Recording
                      </button>
                    )}

                    {isThisRecording && (
                      <span className="text-danger fw-bold small animate-bounce">
                        🔴 Recording question {item.id}... Speak now.
                      </span>
                    )}

                    {hasAudio && !isThisRecording && (
                      <div className="flex-grow-1 d-flex align-items-center gap-3 flex-wrap">
                        <audio controls src={hasAudio} className="flex-grow-1" style={{ height: '35px', minWidth: '220px' }} />
                        <button
                          onClick={() => deleteRecording(item.id)}
                          className="btn btn-outline-danger btn-sm rounded-pill px-3 py-1 fw-semibold d-flex align-items-center gap-1"
                          title="Delete audio and leave slot open"
                        >
                          <i className="bi bi-trash-fill"></i> Delete Audio
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
              onClick={handleSubmitAll}
              disabled={!allRecorded}
              className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
            >
              Submit All Recordings <i className="bi bi-check2-all ms-2"></i>
            </button>
          </div>
        </div>
      )}

      {/* PANEL LATERAL DE VOCABULARIO */}
      {showVocabularySidebar && (
        <div 
          className="position-fixed top-0 end-0 h-100 bg-white shadow-lg p-4 d-flex flex-column" 
          style={{ width: '440px', maxWidth: '100vw', zIndex: 1050, overflowY: 'auto' }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
            <h5 className="fw-bold text-purple mb-0">
              <i className="bi bi-translate me-2"></i> B1 Vocabulary
            </h5>
            <button onClick={() => setShowVocabularySidebar(false)} className="btn btn-close" aria-label="Close"></button>
          </div>
          <div className="flex-grow-1">
            <VocabularyReferenceContent />
          </div>
          <div className="mt-4 pt-3 border-top text-center">
            <button onClick={() => setShowVocabularySidebar(false)} className="btn btn-purple rounded-pill px-4 py-2 w-100 fw-semibold">
              Close vocabulary
            </button>
          </div>
        </div>
      )}

      {showVocabularySidebar && (
        <div onClick={() => setShowVocabularySidebar(false)} className="position-fixed top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1040 }}></div>
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
              Your 4 interview audio responses have been successfully sent to your instructor for evaluation. Completed in <strong>{timeSpent.minutes}m {timeSpent.seconds}s</strong>.
            </p>
          </div>

          <button 
            onClick={() => onComplete(85)}
            className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
          >
            Continue to Next Activity ➔
          </button>
        </div>
      )}
    </div>
  );
}