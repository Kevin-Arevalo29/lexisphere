import React, { useState, useEffect } from 'react';

export default function WritingActivity({ activityData, onComplete }) {
  const [step, setStep] = useState('intro'); // 'intro', 'write', 'results'
  
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
      handleSubmitWriting(); // Forzar entrega al agotarse el tiempo
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const startTimer = () => {
    setTimerActive(true);
    setStep('write');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- ESTADOS DE ESCRITURA ---
  const [guideTitle, setGuideTitle] = useState('');
  const [guideContent, setGuideContent] = useState('');
  const [wordCount, setWordCount] = useState(0);

  // Banco de vocabulario B2
  const vocabularyBank = [
    'Digital footprint', 'Privacy settings', 'Cybersecurity', 
    'Screen time', 'Misinformation', 'Online harassment', 
    'Data protection', 'Digital well-being'
  ];

  // Control de palabras
  const handleContentChange = (e) => {
    const text = e.target.value;
    setGuideContent(text);
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    setWordCount(words);
  };

  // Añadir palabra del banco al texto automáticamente al hacer clic
  const handleInsertVocabulary = (vocab) => {
    setGuideContent(prev => prev + (prev ? ' ' : '') + vocab + ' ');
    const updatedText = guideContent + (guideContent ? ' ' : '') + vocab + ' ';
    setWordCount(updatedText.trim().split(/\s+/).length);
  };

  // Calificación basada en la rúbrica
  const [rubricScores, setRubricScores] = useState({
    organization: 0,
    grammar: 0,
    vocabulary: 0,
    creativity: 0,
    totalPercentage: 0
  });

  const handleSubmitWriting = () => {
    setTimerActive(false);
    const totalSecondsSpent = 1200 - timeLeft;
    const mins = Math.floor(totalSecondsSpent / 60);
    const secs = totalSecondsSpent % 60;
    setTimeSpent({ minutes: mins, seconds: secs });

    // Simulación de evaluación basada en criterios profesionales B2
    let org = wordCount >= 140 ? 25 : 15;
    let gram = guideTitle.length > 5 ? 25 : 10;
    let voc = vocabularyBank.some(v => guideContent.toLowerCase().includes(v.toLowerCase())) ? 25 : 15;
    let crea = guideTitle.length > 8 ? 25 : 15;
    
    let total = org + gram + voc + crea;

    setRubricScores({
      organization: org,
      grammar: gram,
      vocabulary: voc,
      creativity: crea,
      totalPercentage: total
    });

    setStep('results');
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4 p-lg-5 bg-white w-100 position-relative">
      
      {/* Temporizador superior */}
      {step === 'write' && (
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
            B2 Writing Challenge
          </span>
          <h2 className="fw-bold mb-3" style={{ color: '#1E1248' }}>MY DIGITAL SURVIVAL GUIDE</h2>
          <p className="text-muted fs-5 fst-italic mb-4">Create a healthier and safer digital environment</p>

          <div className="p-4 rounded-4 bg-light mb-4 border-start border-4 text-start" style={{ borderColor: '#6C4AB6' }}>
            <h5 className="fw-bold mb-2" style={{ color: '#6C4AB6' }}>
              <i className="bi bi-journal-text me-2"></i> INSTRUCTIONS
            </h5>
            <p className="text-dark fs-6 mb-2" style={{ lineHeight: '1.6' }}>
              Imagine you are creating a digital survival guide for new university students. Your goal is to help them develop healthier, safer and more responsible habits when using social media and technology.
            </p>
            <ul className="text-dark small mb-0 ps-3">
              <li>A creative title.</li>
              <li>A short introduction explaining why responsible technology use matters.</li>
              <li>Four practical recommendations for social media users.</li>
              <li>A short conclusion explaining the importance of digital awareness.</li>
            </ul>
          </div>

          <button 
            onClick={startTimer}
            className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-5 fw-bold shadow"
          >
            Start Writing Mission <i className="bi bi-arrow-right ms-2"></i>
          </button>
        </div>
      )}

      {/* 2. ZONA DE ESCRITURA */}
      {step === 'write' && (
        <div className="mx-auto" style={{ maxWidth: '950px' }}>
          <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
            <div>
              <span className="badge bg-purple-light text-purple px-3 py-1 rounded-pill fw-bold">Step 2: Write Your Guide</span>
              <h3 className="fw-bold text-dark mt-1 mb-0">Digital Survival Guide Production</h3>
            </div>
            <span className={`badge ${wordCount >= 150 && wordCount <= 180 ? 'bg-success' : 'bg-warning text-dark'}`}>
              {wordCount} / 150–180 words
            </span>
          </div>

          {/* Título de la guía */}
          <div className="mb-4">
            <label className="fw-bold text-purple mb-2">Guide Title</label>
            <input 
              type="text" 
              className="form-control rounded-pill p-3 shadow-sm border"
              placeholder="Give your guide a creative title..."
              value={guideTitle}
              onChange={(e) => setGuideTitle(e.target.value)}
            />
          </div>

          {/* Contenido principal */}
          <div className="mb-4">
            <label className="fw-bold text-purple mb-2">Your Written Guide (Introduction, 4 Recommendations & Conclusion)</label>
            <textarea 
              rows="8"
              className="form-control rounded-4 p-4 shadow-sm border"
              placeholder="Write your introduction, four recommendations and conclusion here..."
              value={guideContent}
              onChange={handleContentChange}
            ></textarea>
            <div className="d-flex justify-content-between align-items-center mt-2">
              <small className="text-muted">Target: 150 to 180 words.</small>
              <span className={`small fw-bold ${wordCount >= 150 ? 'text-success' : 'text-danger'}`}>
                {wordCount >= 150 ? 'Word count target reached!' : `Need ${150 - wordCount} more words minimum.`}
              </span>
            </div>
          </div>

          {/* Banco de Vocabulario B2 Interactivo */}
          <div className="p-4 rounded-4 bg-light mb-4 border">
            <h6 className="fw-bold text-purple mb-2">
              <i className="bi bi-lightbulb me-1"></i> Vocabulary bank – B2 (Click to insert):
            </h6>
            <div className="d-flex flex-wrap gap-2">
              {vocabularyBank.map((vocab, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleInsertVocabulary(vocab)}
                  className="badge bg-white text-dark border px-3 py-2 rounded-pill shadow-sm transition-all"
                  style={{ cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  + {vocab}
                </button>
              ))}
            </div>
          </div>

          <div className="text-end">
            <button 
              onClick={handleSubmitWriting}
              disabled={!guideTitle || wordCount < 50}
              className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
            >
              Submit Guide & Evaluate <i className="bi bi-check2-all ms-2"></i>
            </button>
          </div>
        </div>
      )}

      {/* 3. PANTALLA FINAL CON TABLA DE RÚBRICA ESTILIZADA */}
      {step === 'results' && (
        <div className="text-center py-4 mx-auto" style={{ maxWidth: '750px' }}>
          <div className="mb-2">
            <span className="display-2">
              {rubricScores.totalPercentage >= 75 ? '😊' : '😕'}
            </span>
          </div>

          <h3 className="fw-bold text-dark mb-2">Writing Mission Completed!</h3>

          <div className={`p-3 rounded-4 mb-4 shadow-sm border ${rubricScores.totalPercentage >= 75 ? 'bg-success-subtle border-success text-success-emphasis' : 'bg-warning-subtle border-warning text-warning-emphasis'}`}>
            <p className="fs-6 fw-bold mb-1">
              {rubricScores.totalPercentage >= 75 ? 'Excellent writing production! Your guide is well structured.' : 'Good effort! Keep practicing your writing skills!'}
            </p>
            <p className="small mb-0">Completed in <strong>{timeSpent.minutes}m {timeSpent.seconds}s</strong> with a length of <strong>{wordCount} words</strong>.</p>
          </div>

          {/* Tabla de Rúbrica Elegante y Llamativa */}
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 text-start">
            <div className="card-header bg-purple text-white py-3 px-4">
              <h5 className="fw-bold mb-0 text-white">
                <i className="bi bi-award-fill me-2"></i> WRITING EVALUATION RUBRIC
              </h5>
            </div>
            <div className="table-responsive m-0">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="py-3 px-4">Evaluation Criteria</th>
                    <th className="py-3 px-3 text-center">Max Score</th>
                    <th className="py-3 px-4 text-end">Achieved</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-3 px-4">
                      <strong>Organization and coherence</strong>
                      <div className="text-muted small">Logical structure, intro, recommendations & conclusion.</div>
                    </td>
                    <td className="text-center">25%</td>
                    <td className="text-end fw-bold text-success">{rubricScores.organization}%</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">
                      <strong>Grammar and sentence structure</strong>
                      <div className="text-muted small">B2 sentence patterns and syntactic accuracy.</div>
                    </td>
                    <td className="text-center">25%</td>
                    <td className="text-end fw-bold text-success">{rubricScores.grammar}%</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">
                      <strong>B2 vocabulary</strong>
                      <div className="text-muted small">Appropriate use of advanced technology terminology.</div>
                    </td>
                    <td className="text-center">25%</td>
                    <td className="text-end fw-bold text-success">{rubricScores.vocabulary}%</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">
                      <strong>Creativity and relevance</strong>
                      <div className="text-muted small">Original title and engaging digital survival guide tone.</div>
                    </td>
                    <td className="text-center">25%</td>
                    <td className="text-end fw-bold text-success">{rubricScores.creativity}%</td>
                  </tr>
                </tbody>
                <tfoot className="table-light">
                  <tr>
                    <th className="py-3 px{-4} fs-6 text-dark">TOTAL SCORE</th>
                    <th className="text-center fs-6 text-dark">100%</th>
                    <th className="text-end fs-5 text-purple fw-bold">{rubricScores.totalPercentage}%</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <button 
            onClick={() => onComplete(rubricScores.totalPercentage)}
            className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
          >
            Complete Module 1 & View Final Evaluation 🏆
          </button>
        </div>
      )}
    </div>
  );
}