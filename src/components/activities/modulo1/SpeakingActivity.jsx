import React, { useState } from 'react';

export default function SpeakingActivity({ activityData, onComplete }) {
  const [step, setStep] = useState('intro'); // 'intro', 'learn', 'sentence1', 'sentence2', 'sentence3', 'results'
  
  // Textos y audios independientes para cada oración
  const [sentences, setSentences] = useState({ s1: '', s2: '', s3: '' });
  const [recordings, setRecordings] = useState({ s1: null, s2: null, s3: null });
  
  // Estado de grabación activo
  const [isRecording, setIsRecording] = useState(false);
  const [activeRecorder, setActiveRecorder] = useState(null);

  // Panel lateral de vocabulario / estructuras
  const [showSidebar, setShowSidebar] = useState(false);

  // Iniciar grabación para una oración específica
  const startSentenceRecording = async (sentenceKey) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      let chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const audioURL = URL.createObjectURL(blob);
        setRecordings(prev => ({ ...prev, [sentenceKey]: audioURL }));
      };

      recorder.start();
      setActiveRecorder({ key: sentenceKey, recorder });
      setIsRecording(true);
    } catch (err) {
      alert('Microphone access is required to record your voice.');
    }
  };

  const stopSentenceRecording = () => {
    if (activeRecorder) {
      activeRecorder.recorder.stop();
      // Detener las pistas del stream del micrófono
      activeRecorder.recorder.stream?.getTracks().forEach(track => track.stop());
      setActiveRecorder(null);
      setIsRecording(false);
    }
  };

  // Cálculo de puntaje final dinámico al terminar la última oración
  const [finalScore, setFinalScore] = useState(0);

  const calculateFinalEvaluation = () => {
    let score = 0;
    // Evaluar estructura y grabación por cada oración
    if (sentences.s1.length > 10 && recordings.s1) score += 30;
    else if (sentences.s1.length > 10) score += 15;

    if (sentences.s2.length > 10 && recordings.s2) score += 25;
    else if (sentences.s2.length > 10) score += 12;

    if (sentences.s3.length > 10 && recordings.s3) score += 25;
    else if (sentences.s3.length > 10) score += 12;

    // Bono por completar todas las grabaciones (pronunciación/fluidez simulada)
    if (recordings.s1 && recordings.s2 && recordings.s3) {
      score += 20;
    }

    setFinalScore(score);
    setStep('results');
  };

  // Componente de referencia para el panel lateral
  const StructuresReferenceContent = () => (
    <div className="d-flex flex-column gap-3">
      <div className="p-3 rounded-4 border bg-light">
        <span className="badge bg-purple text-white mb-2 px-2 py-1 small">Structure 1</span>
        <h6 className="fw-bold text-dark mb-1">Although + contrast</h6>
        <p className="text-muted small mb-1"><strong>Formula:</strong> Although + sub + verb, sub + verb.</p>
        <p className="text-dark fst-italic small mb-0">"Although social media connects people, it can affect well-being."</p>
      </div>

      <div className="p-3 rounded-4 border bg-light">
        <span className="badge bg-success text-white mb-2 px-2 py-1 small">Structure 2</span>
        <h6 className="fw-bold text-dark mb-1">The more... the more...</h6>
        <p className="text-muted small mb-1"><strong>Formula:</strong> The more + sub + verb, the more + sub + verb.</p>
        <p className="text-dark fst-italic small mb-0">"The more time online, the more data shared."</p>
      </div>

      <div className="p-3 rounded-4 border bg-light">
        <span className="badge bg-warning text-dark mb-2 px-2 py-1 small">Structure 3</span>
        <h6 className="fw-bold text-dark mb-1">Instead of + verb-ing</h6>
        <p className="text-muted small mb-1"><strong>Formula:</strong> Instead of + ing, sub + should + verb.</p>
        <p className="text-dark fst-italic small mb-0">"Instead of sharing unverified info, users should check sources."</p>
      </div>
    </div>
  );

  return (
    <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4 p-lg-5 bg-white w-100 position-relative">
      
      {/* 1. INTRODUCCIÓN */}
      {step === 'intro' && (
        <div className="mx-auto text-center" style={{ maxWidth: '900px' }}>
          <span className="badge bg-purple-light text-purple px-3 py-2 rounded-pill fw-bold mb-2">
            B2 Speaking Challenge
          </span>
          <h2 className="fw-bold mb-3" style={{ color: '#1E1248' }}>YOUR VOICE, YOUR MESSAGE</h2>
          <p className="text-muted fs-5 fst-italic mb-4">Take Control of Your Digital Life</p>

          <div className="p-4 rounded-4 bg-light mb-4 border-start border-4 text-start" style={{ borderColor: '#6C4AB6' }}>
            <h5 className="fw-bold mb-2" style={{ color: '#6C4AB6' }}>
              <i className="bi bi-mic-fill me-2"></i> SPEAKING MISSION
            </h5>
            <p className="text-dark fs-6 mb-0" style={{ lineHeight: '1.6' }}>
              Master advanced B2 structures step by step. Write and record your voice for each sentence to complete the mission.
            </p>
          </div>

          <button 
            onClick={() => setStep('learn')}
            className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-5 fw-bold shadow"
          >
            Start Speaking Mission <i className="bi bi-arrow-right ms-2"></i>
          </button>
        </div>
      )}

      {/* 2. STEP 1: LEARN THE STRUCTURES */}
      {step === 'learn' && (
        <div className="mx-auto" style={{ maxWidth: '900px' }}>
          <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
            <div>
              <span className="badge bg-purple-light text-purple px-3 py-1 rounded-pill fw-bold">Step 1 of 4</span>
              <h3 className="fw-bold text-dark mt-1 mb-0">Learn the Structures</h3>
            </div>
            <span className="text-muted small">Grammar & Formulas</span>
          </div>

          <p className="text-muted mb-4">
            Review these structures and examples carefully before starting your recordings.
          </p>

          <div className="mb-4">
            <StructuresReferenceContent />
          </div>

          <div className="text-end">
            <button 
              onClick={() => setStep('sentence1')}
              className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
            >
              Start Sentence 1 <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      )}

      {/* 3. ORACIÓN 1 */}
      {step === 'sentence1' && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
            <div>
              <span className="badge bg-purple-light text-purple px-3 py-1 rounded-pill fw-bold">Step 2 of 4 (Sentence 1)</span>
              <h3 className="fw-bold text-dark mt-1 mb-0">Expressing Contrast</h3>
            </div>
            <button
              onClick={() => setShowSidebar(true)}
              className="btn btn-outline-purple rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-2 shadow-sm"
              style={{ borderColor: '#6C4AB6', color: '#6C4AB6' }}
            >
              <i className="bi bi-journal-bookmark-fill"></i> Guide
            </button>
          </div>

          <div className="p-3 rounded-4 bg-light mb-4 border-start border-4" style={{ borderColor: '#6C4AB6' }}>
            <h6 className="fw-bold text-purple mb-1">Instruction:</h6>
            <p className="text-dark small mb-0">
              Write an original sentence using <strong>Although + contrast</strong> and record your voice reading it.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-lg-7">
              <div className="p-4 bg-white rounded-4 border shadow-sm h-100 d-flex flex-column justify-content-center">
                <label className="fw-bold text-purple mb-2">Your Sentence 1:</label>
                <input 
                  type="text" 
                  className="form-control rounded-pill p-3 mb-3" 
                  placeholder="e.g., Although social media connects people..."
                  value={sentences.s1}
                  onChange={(e) => setSentences({...sentences, s1: e.target.value})}
                />
                <small className="text-muted">Example: <em>Although social media connects people worldwide, it can affect mental health.</em></small>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="p-4 rounded-4 bg-white border text-center shadow-sm h-100 d-flex flex-column justify-content-center align-items-center">
                <h5 className="fw-bold text-dark mb-2">Record Audio 1</h5>
                <p className="text-muted small mb-3">Tap microphone to record your voice.</p>

                {(!isRecording || activeRecorder?.key !== 's1') ? (
                  <button 
                    onClick={() => startSentenceRecording('s1')}
                    disabled={isRecording}
                    className="btn btn-danger btn-lg rounded-circle p-4 shadow mb-2"
                  >
                    <i className="bi bi-mic-fill fs-2 text-white"></i>
                  </button>
                ) : (
                  <div>
                    <button 
                      onClick={stopSentenceRecording}
                      className="btn btn-dark btn-lg rounded-circle p-4 shadow animate-pulse mb-2"
                    >
                      <i className="bi bi-stop-fill fs-2 text-white"></i>
                    </button>
                    <p className="text-danger fw-bold small">Recording Sentence 1...</p>
                  </div>
                )}

                {recordings.s1 && (
                  <div className="mt-2 w-100">
                    <span className="badge bg-success-subtle text-success mb-1">Recorded!</span>
                    <audio controls src={recordings.s1} className="w-100 mt-1" style={{ height: '35px' }}></audio>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="text-end mt-4">
            <button 
              onClick={() => setStep('sentence2')}
              disabled={!sentences.s1}
              className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
            >
              Next: Sentence 2 <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      )}

      {/* 4. ORACIÓN 2 */}
      {step === 'sentence2' && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
            <div>
              <span className="badge bg-success-subtle text-success px-3 py-1 rounded-pill fw-bold">Step 3 of 4 (Sentence 2)</span>
              <h3 className="fw-bold text-dark mt-1 mb-0">Expressing Consequences</h3>
            </div>
            <button
              onClick={() => setShowSidebar(true)}
              className="btn btn-outline-purple rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-2 shadow-sm"
              style={{ borderColor: '#6C4AB6', color: '#6C4AB6' }}
            >
              <i className="bi bi-journal-bookmark-fill"></i> Guide
            </button>
          </div>

          <div className="p-3 rounded-4 bg-light mb-4 border-start border-4 border-success">
            <h6 className="fw-bold text-success mb-1">Instruction:</h6>
            <p className="text-dark small mb-0">
              Write an original sentence using <strong>The more... the more...</strong> and record your voice reading it.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-lg-7">
              <div className="p-4 bg-white rounded-4 border shadow-sm h-100 d-flex flex-column justify-content-center">
                <label className="fw-bold text-success mb-2">Your Sentence 2:</label>
                <input 
                  type="text" 
                  className="form-control rounded-pill p-3 mb-3" 
                  placeholder="e.g., The more time people spend online..."
                  value={sentences.s2}
                  onChange={(e) => setSentences({...sentences, s2: e.target.value})}
                />
                <small className="text-muted">Example: <em>The more time people spend online, the more data they share.</em></small>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="p-4 rounded-4 bg-white border text-center shadow-sm h-100 d-flex flex-column justify-content-center align-items-center">
                <h5 className="fw-bold text-dark mb-2">Record Audio 2</h5>
                <p className="text-muted small mb-3">Tap microphone to record your voice.</p>

                {(!isRecording || activeRecorder?.key !== 's2') ? (
                  <button 
                    onClick={() => startSentenceRecording('s2')}
                    disabled={isRecording}
                    className="btn btn-danger btn-lg rounded-circle p-4 shadow mb-2"
                  >
                    <i className="bi bi-mic-fill fs-2 text-white"></i>
                  </button>
                ) : (
                  <div>
                    <button 
                      onClick={stopSentenceRecording}
                      className="btn btn-dark btn-lg rounded-circle p-4 shadow animate-pulse mb-2"
                    >
                      <i className="bi bi-stop-fill fs-2 text-white"></i>
                    </button>
                    <p className="text-danger fw-bold small">Recording Sentence 2...</p>
                  </div>
                )}

                {recordings.s2 && (
                  <div className="mt-2 w-100">
                    <span className="badge bg-success-subtle text-success mb-1">Recorded!</span>
                    <audio controls src={recordings.s2} className="w-100 mt-1" style={{ height: '35px' }}></audio>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="text-end mt-4">
            <button 
              onClick={() => setStep('sentence3')}
              disabled={!sentences.s2}
              className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
            >
              Next: Sentence 3 <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      )}

      {/* 5. ORACIÓN 3 */}
      {step === 'sentence3' && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
            <div>
              <span className="badge bg-warning-subtle text-warning-emphasis px-3 py-1 rounded-pill fw-bold">Step 4 of 4 (Sentence 3)</span>
              <h3 className="fw-bold text-dark mt-1 mb-0">Giving Recommendations</h3>
            </div>
            <button
              onClick={() => setShowSidebar(true)}
              className="btn btn-outline-purple rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-2 shadow-sm"
              style={{ borderColor: '#6C4AB6', color: '#6C4AB6' }}
            >
              <i className="bi bi-journal-bookmark-fill"></i> Guide
            </button>
          </div>

          <div className="p-3 rounded-4 bg-light mb-4 border-start border-4 border-warning">
            <h6 className="fw-bold text-warning-emphasis mb-1">Instruction:</h6>
            <p className="text-dark small mb-0">
              Write an original sentence using <strong>Instead of + verb-ing</strong> and record your voice reading it.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-lg-7">
              <div className="p-4 bg-white rounded-4 border shadow-sm h-100 d-flex flex-column justify-content-center">
                <label className="fw-bold text-warning-emphasis mb-2">Your Sentence 3:</label>
                <input 
                  type="text" 
                  className="form-control rounded-pill p-3 mb-3" 
                  placeholder="e.g., Instead of sharing unverified info..."
                  value={sentences.s3}
                  onChange={(e) => setSentences({...sentences, s3: e.target.value})}
                />
                <small className="text-muted">Example: <em>Instead of sharing unverified info, users should check sources.</em></small>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="p-4 rounded-4 bg-white border text-center shadow-sm h-100 d-flex flex-column justify-content-center align-items-center">
                <h5 className="fw-bold text-dark mb-2">Record Audio 3</h5>
                <p className="text-muted small mb-3">Tap microphone to record your voice.</p>

                {(!isRecording || activeRecorder?.key !== 's3') ? (
                  <button 
                    onClick={() => startSentenceRecording('s3')}
                    disabled={isRecording}
                    className="btn btn-danger btn-lg rounded-circle p-4 shadow mb-2"
                  >
                    <i className="bi bi-mic-fill fs-2 text-white"></i>
                  </button>
                ) : (
                  <div>
                    <button 
                      onClick={stopSentenceRecording}
                      className="btn btn-dark btn-lg rounded-circle p-4 shadow animate-pulse mb-2"
                    >
                      <i className="bi bi-stop-fill fs-2 text-white"></i>
                    </button>
                    <p className="text-danger fw-bold small">Recording Sentence 3...</p>
                  </div>
                )}

                {recordings.s3 && (
                  <div className="mt-2 w-100">
                    <span className="badge bg-success-subtle text-success mb-1">Recorded!</span>
                    <audio controls src={recordings.s3} className="w-100 mt-1" style={{ height: '35px' }}></audio>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="text-end mt-4">
            <button 
              onClick={calculateFinalEvaluation}
              disabled={!sentences.s3}
              className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
            >
              Finish & Evaluate Speaking <i className="bi bi-check2-all ms-2"></i>
            </button>
          </div>
        </div>
      )}

      {/* PANEL LATERAL DE GUÍA */}
      {showSidebar && (
        <div 
          className="position-fixed top-0 end-0 h-100 bg-white shadow-lg p-4 d-flex flex-column" 
          style={{ width: '400px', zIndex: 1050, overflowY: 'auto' }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
            <h5 className="fw-bold text-purple mb-0">
              <i className="bi bi-journal-text me-2"></i> B2 Reference Guide
            </h5>
            <button onClick={() => setShowSidebar(false)} className="btn btn-close" aria-label="Close"></button>
          </div>
          <div className="flex-grow-1">
            <StructuresReferenceContent />
          </div>
          <div className="mt-4 pt-3 border-top text-center">
            <button onClick={() => setShowSidebar(false)} className="btn btn-purple rounded-pill px-4 py-2 w-100 fw-semibold">
              Close guide
            </button>
          </div>
        </div>
      )}

      {showSidebar && (
        <div onClick={() => setShowSidebar(false)} className="position-fixed top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1040 }}></div>
      )}

      {/* 6. PANTALLA FINAL DE RESULTADOS */}
      {step === 'results' && (
        <div className="text-center py-5 mx-auto" style={{ maxWidth: '700px' }}>
          <div className="mb-3">
            <span className="display-1">
              {finalScore >= 75 ? '😊' : '😕'}
            </span>
          </div>

          <h3 className="fw-bold text-dark mb-3">Speaking Mission Completed!</h3>

          <div className={`p-4 rounded-4 mb-4 shadow-sm border ${finalScore >= 75 ? 'bg-success-subtle border-success text-success-emphasis' : 'bg-warning-subtle border-warning text-warning-emphasis'}`}>
            <p className="fs-5 fw-bold mb-1">
              {finalScore >= 75 ? 'Great job! Your pronunciation and structures were evaluated successfully.' : 'Good effort! Keep practicing your speaking skills!'}
            </p>
            <p className="fs-6 mb-0">You recorded all 3 sentences with their corresponding audio files.</p>
          </div>

          <div className="p-4 bg-light rounded-4 mb-4 border text-start">
            <h5 className="fw-bold text-purple mb-3">Speaking Evaluation Rubric:</h5>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              <li className="d-flex justify-content-between border-bottom pb-2">
                <span>Correct sentence structure (B2 grammar)</span>
                <strong>30%</strong>
              </li>
              <li className="d-flex justify-content-between border-bottom pb-2">
                <span>B2 vocabulary related to technology</span>
                <strong>25%</strong>
              </li>
              <li className="d-flex justify-content-between border-bottom pb-2">
                <span>Pronunciation and intonation (Audio recorded)</span>
                <strong>25%</strong>
              </li>
              <li className="d-flex justify-content-between pb-1">
                <span>Fluency and oral expression</span>
                <strong>20%</strong>
              </li>
            </ul>
            <hr className="my-3" />
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="fw-bold text-dark mb-0">Final Speaking Score:</h5>
              <h4 className="fw-bold text-purple mb-0">{finalScore}% (Level B2)</h4>
            </div>
          </div>

          <button 
            onClick={() => onComplete(finalScore)}
            className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
          >
            Continue to Writing Challenge ➔
          </button>
        </div>
      )}
    </div>
  );
}