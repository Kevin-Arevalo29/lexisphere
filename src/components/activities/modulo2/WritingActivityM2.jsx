import React, { useState, useEffect } from 'react';

export default function WritingActivityM2({ activityData, onComplete }) {
  const [step, setStep] = useState('intro'); // 'intro', 'writing', 'submitted'
  
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
    setStep('writing');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- ESTADOS DE LA ACTIVIDAD DE ESCRITURA ---
  const [proposalText, setProposalText] = useState('');
  const [wordCount, setWordCount] = useState(0);

  // Panel desplegable para Vocabulario y Conectores
  const [showResources, setShowResources] = useState(false);

  // Lista de autoevaluación (Checkboxes)
  const [checklist, setChecklist] = useState({
    words130: false,
    problemsCauses: false,
    threeSolutions: false,
    envVocabulary: false,
    connectorsModals: false,
    conditional: false,
    grammarChecked: false
  });

  const handleTextChange = (e) => {
    const text = e.target.value;
    setProposalText(text);
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
  };

  const handleCheckboxChange = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmitWriting = () => {
    setTimerActive(false);
    const totalSecondsSpent = 1200 - timeLeft;
    setTimeSpent({
      minutes: Math.floor(totalSecondsSpent / 60),
      seconds: totalSecondsSpent % 60
    });
    setStep('submitted');
  };

  const allChecked = Object.values(checklist).every(Boolean);

  return (
    <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4 p-lg-5 bg-white w-100 position-relative">
      
      {/* Temporizador superior */}
      {step === 'writing' && (
        <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded-4 border">
          <span className="fw-bold text-purple">
            <i className="bi bi-clock-history me-2"></i> Writing Time Remaining:
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
            Module 2 - Writing Mission
          </span>
          <h2 className="fw-bold mb-3" style={{ color: '#1E1248' }}>ENVIRONMENTAL PROPOSAL</h2>
          <p className="text-muted fs-5 fst-italic mb-4">Write a Sustainable Proposal for Your City</p>

          <div className="p-4 rounded-4 bg-light mb-4 border-start border-4 text-start" style={{ borderColor: '#6C4AB6' }}>
            <h5 className="fw-bold mb-2" style={{ color: '#6C4AB6' }}>
              <i className="bi bi-journal-richtext me-2"></i> THE CHALLENGE
            </h5>
            <p className="text-dark fs-6 mb-0" style={{ lineHeight: '1.6' }}>
              Imagine your city faces serious environmental problems. Air pollution is increasing, green areas are disappearing, and people produce too much waste. Your task is to write a proposal explaining how your city could become a more sustainable place (130–160 words)[cite: 18].
            </p>
          </div>

          <button 
            onClick={startTimer}
            className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-5 fw-bold shadow"
          >
            Start Writing Mission <i className="bi bi-arrow-right ms-2"></i>
          </button>
        </div>
      )}

      {/* 2. ZONA DE ESCRITURA Y RECURSOS */}
      {step === 'writing' && (
        <div>
          {/* Botón flotante para ver Vocabulario y Conectores en cualquier momento */}
          <div className="mb-4">
            <button
              onClick={() => setShowResources(!showResources)}
              className="btn btn-outline-purple rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2 shadow-sm"
              style={{ borderColor: '#6C4AB6', color: '#6C4AB6' }}
            >
              <i className="bi bi-book-fill"></i> 
              {showResources ? 'Hide Vocabulary & Connectors ✕' : '📚 View Vocabulary Bank & Connectors Reference (Click to Open)'}
            </button>

            {/* Panel desplegable con la Imagen 1 y la Imagen 3 ordenadas */}
            {showResources && (
              <div className="p-4 rounded-4 bg-light border mt-3 shadow-sm animate-fade-in" style={{ borderLeft: '5px solid #6C4AB6' }}>
                <h5 className="fw-bold text-purple mb-3">
                  <i className="bi bi-journal-bookmark-fill me-2"></i> 3. Vocabulary bank – B1[cite: 17]
                </h5>
                <div className="row g-2 mb-4">
                  {[
                    { word: 'Environmental damage', meaning: 'Harm to nature and the environment.' },
                    { word: 'Greenhouse gases', meaning: 'Gases that trap heat in the atmosphere.' },
                    { word: 'Waste management', meaning: 'The process of collecting and recycling waste.' },
                    { word: 'Renewable resources', meaning: 'Natural resources that can be replaced.' },
                    { word: 'Drought', meaning: 'A long period without enough rain.' },
                    { word: 'Flooding', meaning: 'When water covers normally dry land.' },
                    { word: 'Public awareness', meaning: "People's knowledge about important issues." },
                    { word: 'Carbon emissions', meaning: 'Carbon gases released into the air.' },
                    { word: 'Sustainable development', meaning: 'Development that protects the environment for the future.' },
                    { word: 'Natural resources', meaning: 'Materials that come from nature.' }
                  ].map((item, idx) => (
                    <div key={idx} className="col-md-6 border-bottom pb-1">
                      <strong className="text-dark">{item.word}:</strong> <span className="text-muted small">{item.meaning}</span>
                    </div>
                  ))}
                </div>

                <h5 className="fw-bold text-purple mb-3 pt-2 border-top">
                  <i className="bi bi-diagram-3-fill me-2"></i> 4. Connect your ideas (Connectors)[cite: 20]
                </h5>
                <div className="table-responsive">
                  <table className="table table-sm table-bordered bg-white rounded-3">
                    <thead className="table-light text-purple">
                      <tr>
                        <th>Function</th>
                        <th>Connectors</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>Adding ideas</td><td>Furthermore, Moreover[cite: 20]</td></tr>
                      <tr><td>Contrasting</td><td>However, Although[cite: 20]</td></tr>
                      <tr><td>Giving reasons</td><td>Because, Since[cite: 20]</td></tr>
                      <tr><td>Showing results</td><td>Therefore, As a result[cite: 20]</td></tr>
                      <tr><td>Giving opinions</td><td>In my opinion, I believe that[cite: 20]</td></tr>
                      <tr><td>Suggesting</td><td>It would be better to, We should[cite: 20]</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Instrucciones y Parámetros (Imagen 2 y 4) */}
          <div className="p-4 rounded-4 bg-light border mb-4 shadow-sm">
            <span className="badge bg-purple-light text-purple px-3 py-1 rounded-pill fw-bold mb-2">
              Writing task – Environmental Proposal (130–160 words)[cite: 18]
            </span>
            <h5 className="fw-bold text-dark mt-2 mb-2">Your text must answer the following four challenges:[cite: 18]</h5>
            <ol className="text-dark small mb-3 ps-3">
              <li><strong>Describe:</strong> What are the main environmental problems affecting your city?[cite: 18]</li>
              <li><strong>Explain:</strong> What are their causes and consequences?[cite: 18]</li>
              <li><strong>Propose:</strong> What three realistic actions could help improve the situation?[cite: 18]</li>
              <li><strong>Predict:</strong> What could happen if people do not change their habits?[cite: 18]</li>
            </ol>

            <h6 className="fw-bold text-purple mt-3 mb-2">Important conditions:[cite: 18]</h6>
            <ul className="text-muted small mb-0 ps-3">
              <li>Use at least 5 environmental vocabulary words.[cite: 18]</li>
              <li>Include at least 4 linking words.[cite: 18]</li>
              <li>Use at least 2 modal verbs (should, must, could).[cite: 18]</li>
              <li>Include one conditional sentence (If...).[cite: 18]</li>
              <li>Give your personal opinion.[cite: 18]</li>
            </ul>
          </div>

          {/* Textarea para escribir */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="fw-bold text-dark">Your Proposal Text:</label>
              <span className={`badge px-3 py-2 ${wordCount >= 130 && wordCount <= 160 ? 'bg-success' : 'bg-warning text-dark'}`}>
                Word count: <strong>{wordCount}</strong> / 130–160 words[cite: 18]
              </span>
            </div>
            <textarea
              rows="7"
              value={proposalText}
              onChange={handleTextChange}
              placeholder="Write your environmental proposal here following the 4 challenges and conditions..."
              className="form-control rounded-4 p-3 border-purple shadow-sm"
              style={{ fontSize: '1rem', lineHeight: '1.6' }}
            ></textarea>
          </div>

          {/* Autoevaluación (Imagen 5) */}
          {/* <div className="p-4 rounded-4 bg-light border mb-4 shadow-sm">
            <h5 className="fw-bold text-purple mb-3">
              <i className="bi bi-check2-square me-2"></i> Writing self-assessment
            </h5>
            <p className="text-muted small mb-3">Before submitting, check the items you have successfully fulfilled in your text:</p>
            
            <div className="d-flex flex-column gap-2">
              {[
                { key: 'words130', label: 'I wrote between 130 and 160 words.' },
                { key: 'problemsCauses', label: 'I described environmental problems and their causes.' },
                { key: 'threeSolutions', label: 'I included three realistic solutions.' },
                { key: 'envVocabulary', label: 'I used environmental vocabulary.' },
                { key: 'connectorsModals', label: 'I included connectors and modal verbs.' },
                { key: 'conditional', label: 'I used at least one conditional sentence.' },
                { key: 'grammarChecked', label: 'I checked spelling, grammar and punctuation.' }
              ].map((item) => (
                <div key={item.key} className="form-check d-flex align-items-center gap-2">
                  <input
                    type="checkbox"
                    id={item.key}
                    checked={checklist[item.key]}
                    onChange={() => handleCheckboxChange(item.key)}
                    className="form-check-input m-0"
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                  <label htmlFor={item.key} className="form-check-label fw-semibold text-dark" style={{ cursor: 'pointer' }}>
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          </div> */}

          <div className="text-end">
            <button 
              onClick={handleSubmitWriting}
              disabled={!proposalText.trim()}
              className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
            >
              Submit Proposal for Review <i className="bi bi-send-fill ms-2"></i>
            </button>
          </div>
        </div>
      )}

      {/* 3. PANTALLA DE ESTADO: PENDIENTE DE REVISIÓN */}
      {step === 'submitted' && (
        <div className="text-center py-4 mx-auto" style={{ maxWidth: '650px' }}>
          <div className="mb-3 text-warning">
            <i className="bi bi-hourglass-split display-2"></i>
          </div>

          <h3 className="fw-bold text-dark mb-3">Proposal Submitted Successfully!</h3>

          <div className="p-4 rounded-4 mb-4 shadow-sm border bg-warning-subtle text-warning-emphasis">
            <p className="fs-5 fw-bold mb-1">Pending Review (Pendiente de revisión)</p>
            <p className="fs-6 mb-0">
              Your environmental proposal ({wordCount} words) has been submitted to your instructor for evaluation and grading. Completed in <strong>{timeSpent.minutes}m {timeSpent.seconds}s</strong>.
            </p>
          </div>

          <button 
            onClick={() => onComplete(90)}
            className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
          >
            Complete Module 2 Evaluation 🏆 <i className="bi bi-arrow-right ms-2"></i>
          </button>
        </div>
      )}
    </div>
  );
}