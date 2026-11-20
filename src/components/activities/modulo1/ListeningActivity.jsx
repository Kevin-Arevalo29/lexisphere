import React, { useState, useRef } from 'react';

export default function ListeningActivity({ activityData, onComplete }) {
  // 'listen' | 'timeline' | 'evidence' | 'submitted'
  const [step, setStep] = useState('listen');

  // =========================================================================
  // 1. CONFIGURACIÓN DEL AUDIO DEL PODCAST (INSERTA AQUÍ TU RUTA / URL)
  // =========================================================================
  // 👉 PON AQUÍ LA RUTA O URL DEL AUDIO (ej. '/audio/episode-08.mp3' o URL externa):
  const PODCAST_AUDIO_URL = '/audio/socialmedia.ogg';

  const MAX_ATTEMPTS = 2;
  const audioRef = useRef(null);
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(95); // 01:35 por defecto hasta cargar metadatos

  const formatTime = (secs) => {
    const safe = Number.isFinite(secs) && secs >= 0 ? Math.floor(secs) : 0;
    const mins = Math.floor(safe / 60);
    const remSecs = safe % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  const handleToggleAudio = () => {
    const audioEl = audioRef.current;
    if (!audioEl || !PODCAST_AUDIO_URL) return;

    if (isPlaying) {
      audioEl.pause();
      setIsPlaying(false);
    } else if (attemptsUsed < MAX_ATTEMPTS) {
      audioEl.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    setCurrentTime(audioEl.currentTime || 0);
  };

  const handleLoadedMetadata = () => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    if (Number.isFinite(audioEl.duration) && audioEl.duration > 0) {
      setDuration(audioEl.duration);
    }
  };

  const handleSeekChange = (e) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setAttemptsUsed((prev) => Math.min(prev + 1, MAX_ATTEMPTS));
  };

  const listeningInstructions = [
    'Listen to the entire conversation.',
    'Identify the main events and important details.',
    "Pay attention to the speakers' opinions and expressions.",
    'You can replay the audio before submitting your answers.'
  ];

  // =========================================================================
  // 2. THE VIRAL TIMELINE – EVENTOS Y ORDEN CORRECTO
  // =========================================================================
  // 👉 AJUSTA "correctPosition" (1 a 5) SI EL ORDEN CRONOLÓGICO DEL AUDIO ES DISTINTO:
  const TIMELINE_EVENTS = [
    {
      id: 'event-1',
      text: 'A student discovers the original source of the image.',
      correctPosition: 1
    },
    {
      id: 'event-2',
      text: 'An old notice about a different application is cropped.',
      correctPosition: 2
    },
    {
      id: 'event-3',
      text: 'Students start reposting the screenshot without checking its source.',
      correctPosition: 3
    },
    {
      id: 'event-4',
      text: 'A correction is shared in the same groups.',
      correctPosition: 4
    },
    {
      id: 'event-5',
      text: 'Recommendation systems amplify the highly engaging content.',
      correctPosition: 5
    }
  ];

  const [selectedPositions, setSelectedPositions] = useState(
    Array(TIMELINE_EVENTS.length).fill('')
  );
  const [timelineScore, setTimelineScore] = useState(0);

  // =========================================================================
  // 3. SCAN THE INFORMATION – CLASSIFY THE FIVE PIECES OF EVIDENCE
  // =========================================================================
  // 👉 AJUSTA "correctAnswer" ('Confirmed' | 'Contradicted' | 'Not mentioned') SEGÚN EL AUDIO:
  const EVIDENCE_ITEMS = [
    {
      id: 'ev-1',
      statement: 'The screenshot came from an outdated notice about a different application.',
      correctAnswer: 'Confirmed'
    },
    {
      id: 'ev-2',
      statement: 'The algorithm was the only reason the misleading story spread.',
      correctAnswer: 'Contradicted'
    },
    {
      id: 'ev-3',
      statement: 'Students reposted the information without checking its original source.',
      correctAnswer: 'Confirmed'
    },
    {
      id: 'ev-4',
      statement: 'Deleting the original post guarantees that all copies disappear.',
      correctAnswer: 'Contradicted'
    },
    {
      id: 'ev-5',
      statement: 'The university officially confirmed that the application was completely safe.',
      correctAnswer: 'Not mentioned'
    }
  ];

  const evidenceOptions = ['Confirmed', 'Contradicted', 'Not mentioned'];

  const [evidenceAnswers, setEvidenceAnswers] = useState({});
  const [score, setScore] = useState(0);

  const handleSelectChange = (slotIndex, eventId) => {
    setSelectedPositions((prev) => {
      const updated = [...prev];
      updated[slotIndex] = eventId;
      return updated;
    });
  };

  const handleCheckTimeline = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    let correctCount = 0;
    selectedPositions.forEach((chosenEventId, slotIdx) => {
      const targetPosition = slotIdx + 1;
      const matchedEvent = TIMELINE_EVENTS.find((ev) => ev.id === chosenEventId);
      if (matchedEvent && matchedEvent.correctPosition === targetPosition) {
        correctCount += 1;
      }
    });

    const calculatedTimelineScore = Math.round((correctCount / TIMELINE_EVENTS.length) * 100);
    setTimelineScore(calculatedTimelineScore);
    setStep('evidence');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEvidenceSelect = (itemId, option) => {
    setEvidenceAnswers((prev) => ({
      ...prev,
      [itemId]: option
    }));
  };

  const handleSubmitEvidence = () => {
    let correctEvidence = 0;
    EVIDENCE_ITEMS.forEach((item) => {
      if (evidenceAnswers[item.id] === item.correctAnswer) {
        correctEvidence += 1;
      }
    });

    const evidenceScore = Math.round((correctEvidence / EVIDENCE_ITEMS.length) * 100);
    const finalActivityScore = Math.round((timelineScore + evidenceScore) / 2);

    setScore(finalActivityScore);
    setStep('submitted');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    setSelectedPositions(Array(TIMELINE_EVENTS.length).fill(''));
    setEvidenceAnswers({});
    setTimelineScore(0);
    setScore(0);
    setStep('listen');
  };

  const allSlotsSelected = selectedPositions.every((val) => val !== '');
  const allEvidenceSelected = EVIDENCE_ITEMS.every((item) => Boolean(evidenceAnswers[item.id]));

  return (
    <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4 p-lg-5 bg-white w-100">
      {/* ===================================================================== */}
      {/* SCREEN 1 – PODCAST PLAYER & LISTENING INSTRUCTIONS                   */}
      {/* ===================================================================== */}
      {step === 'listen' && (
        <div className="mx-auto" style={{ maxWidth: '880px' }}>
          {/* Tarjeta del Podcast con paleta morada */}
          <div
            className="rounded-4 overflow-hidden border shadow-sm mb-4"
            style={{ borderColor: '#DDD6FE' }}
          >
            {/* Cabecera del podcast */}
            <div
              className="p-3 p-md-4 d-flex flex-wrap justify-content-between align-items-center gap-3"
              style={{
                background: 'linear-gradient(135deg, #EDE9FE 0%, #F8F7FC 100%)',
                borderBottom: '1px solid #DDD6FE'
              }}
            >
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center shadow-sm"
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#6C4AB6',
                    color: '#FFFFFF'
                  }}
                >
                  <i className="bi bi-headphones fs-4"></i>
                </div>
                <div>
                  <h5 className="fw-bold mb-0" style={{ color: '#1E1248' }}>
                    Digital Talk Podcast
                  </h5>
                  <span className="small fw-semibold" style={{ color: '#6C4AB6' }}>
                    Episode 08 · The spread of misinformation
                  </span>
                </div>
              </div>

              <span
                className="badge rounded-pill px-3 py-2 fw-bold"
                style={{ backgroundColor: '#6C4AB6', color: '#FFFFFF' }}
              >
                B2
              </span>
            </div>

            {/* Cuerpo del reproductor con botón de reproducir y barra para adelantar/atrasar */}
            <div className="p-4 p-md-5 text-center" style={{ backgroundColor: '#F8F7FC' }}>
              <div
                className="mx-auto mb-2 d-inline-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: '54px',
                  height: '54px',
                  backgroundColor: '#EDE9FE',
                  color: '#6C4AB6'
                }}
              >
                <i className="bi bi-soundwave fs-3"></i>
              </div>

              <div className="fw-bold fs-4 mb-3" style={{ color: '#1E1248' }}>
                {formatTime(duration)}
              </div>

              {/* 👉 AQUÍ SE CONECTA Y REPRODUCE EL AUDIO (PODCAST_AUDIO_URL) */}
              <div
                className="p-4 rounded-4 bg-white border mx-auto mb-3 text-start"
                style={{ maxWidth: '540px', borderColor: '#DDD6FE' }}
              >
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                  <button
                    type="button"
                    onClick={handleToggleAudio}
                    disabled={!PODCAST_AUDIO_URL || (!isPlaying && attemptsUsed >= MAX_ATTEMPTS)}
                    className="btn rounded-pill px-4 py-2 fw-bold shadow-sm"
                    style={{
                      backgroundColor: '#6C4AB6',
                      borderColor: '#6C4AB6',
                      color: '#FFFFFF'
                    }}
                  >
                    <i className={`bi ${isPlaying ? 'bi-pause-fill' : 'bi-play-fill'} me-1`}></i>
                    {isPlaying
                      ? 'Pause Audio'
                      : attemptsUsed >= MAX_ATTEMPTS
                      ? 'No Attempts Left (2/2)'
                      : 'Play Audio'}
                  </button>

                  <span className="small fw-semibold text-muted">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                {/* Barra de reproducción para adelantar o atrasar */}
                <input
                  type="range"
                  min={0}
                  max={duration || 1}
                  step={0.1}
                  value={Math.min(currentTime, duration || 1)}
                  onChange={handleSeekChange}
                  disabled={!PODCAST_AUDIO_URL}
                  aria-label="Audio progress bar"
                  className="form-range"
                  style={{ accentColor: '#6C4AB6', cursor: PODCAST_AUDIO_URL ? 'pointer' : 'not-allowed' }}
                />

                {!PODCAST_AUDIO_URL && (
                  <div className="small text-muted text-center mt-1">
                    {/* 👉 PON AQUÍ LA RUTA DE TU AUDIO EN LA CONSTANTE PODCAST_AUDIO_URL */}
                    Coloca la ruta del audio en <code>PODCAST_AUDIO_URL</code> al inicio del componente.
                  </div>
                )}

                <audio
                  ref={audioRef}
                  src={PODCAST_AUDIO_URL || undefined}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={handleAudioEnded}
                />
              </div>

              <div className="d-flex justify-content-center align-items-center gap-2 flex-wrap">
                <span
                  className="badge rounded-pill px-3 py-2 fw-semibold"
                  style={{ backgroundColor: '#EDE9FE', color: '#1E1248' }}
                >
                  Replay available
                </span>
                <span className="badge rounded-pill px-3 py-2 bg-success-subtle text-success fw-bold">
                  {Math.max(0, MAX_ATTEMPTS - attemptsUsed)} attempts left
                </span>
              </div>
            </div>
          </div>

          {/* Listening instructions */}
          <div
            className="p-4 rounded-4 border mb-4 shadow-sm"
            style={{ backgroundColor: '#F8F7FC', borderLeft: '5px solid #6C4AB6' }}
          >
            <h5 className="fw-bold mb-3" style={{ color: '#1E1248' }}>
              Listening instructions
            </h5>
            <ul className="text-dark mb-0 d-flex flex-column gap-2" style={{ lineHeight: '1.6' }}>
              {listeningInstructions.map((inst, idx) => (
                <li key={idx}>{inst}</li>
              ))}
            </ul>
          </div>

          <div className="text-end">
            <button
              type="button"
              onClick={() => {
                if (audioRef.current && !audioRef.current.paused) {
                  audioRef.current.pause();
                  setIsPlaying(false);
                }
                setStep('timeline');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="btn btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
              style={{ backgroundColor: '#6C4AB6', borderColor: '#6C4AB6', color: '#FFFFFF' }}
            >
              Continue to Activity <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* THE VIRAL TIMELINE – SELECT AN EVENT DROPDOWNS                      */}
      {/* ===================================================================== */}
      {step === 'timeline' && (
        <div className="mx-auto" style={{ maxWidth: '880px' }}>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <button
              type="button"
              onClick={() => setStep('listen')}
              className="btn btn-sm rounded-pill px-3 py-1 fw-semibold"
              style={{
                border: '1px solid #6C4AB6',
                color: '#6C4AB6',
                backgroundColor: '#FFFFFF'
              }}
            >
              <i className="bi bi-headphones me-1"></i> Back to Podcast
            </button>
          </div>

          <div
            className="p-4 p-md-5 rounded-4 border shadow-sm"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#DDD6FE' }}
          >
            <h4 className="fw-bold mb-1" style={{ color: '#111827' }}>
              THE VIRAL TIMELINE
            </h4>
            <p className="text-muted small mb-4">
              Select the correct event for each position. The actual platform can implement this with drag and drop.
            </p>

            <div className="d-flex flex-column gap-3 mb-4">
              {TIMELINE_EVENTS.map((_, slotIndex) => (
                <div
                  key={slotIndex}
                  className="d-flex align-items-center gap-3 gap-md-4"
                >
                  <span
                    className="fw-bold fs-5 text-center"
                    style={{ width: '28px', color: '#111827', flexShrink: 0 }}
                  >
                    {slotIndex + 1}
                  </span>

                  <select
                    aria-label={`Event position ${slotIndex + 1}`}
                    value={selectedPositions[slotIndex]}
                    onChange={(e) => handleSelectChange(slotIndex, e.target.value)}
                    className="form-select form-select-lg rounded-4 py-3 px-4"
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#D1D5DB',
                      color: selectedPositions[slotIndex] ? '#111827' : '#9CA3AF',
                      fontSize: '0.98rem'
                    }}
                  >
                    <option value="">Select an event...</option>
                    {TIMELINE_EVENTS.map((ev) => (
                      <option
                        key={ev.id}
                        value={ev.id}
                        style={{ color: '#111827' }}
                      >
                        {ev.text}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleCheckTimeline}
              disabled={!allSlotsSelected}
              className="btn btn-lg w-100 rounded-4 py-3 fw-semibold border-0"
              style={{
                backgroundColor: allSlotsSelected ? '#6C4AB6' : '#E5E7EB',
                color: allSlotsSelected ? '#FFFFFF' : '#6B7280',
                cursor: allSlotsSelected ? 'pointer' : 'not-allowed'
              }}
            >
              Check timeline
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SCAN THE INFORMATION – CLASSIFY THE FIVE PIECES OF EVIDENCE           */}
      {/* ===================================================================== */}
      {step === 'evidence' && (
        <div className="mx-auto" style={{ maxWidth: '880px' }}>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <button
              type="button"
              onClick={() => setStep('timeline')}
              className="btn btn-sm rounded-pill px-3 py-1 fw-semibold"
              style={{
                border: '1px solid #6C4AB6',
                color: '#6C4AB6',
                backgroundColor: '#FFFFFF'
              }}
            >
              <i className="bi bi-arrow-left me-1"></i> Back to Timeline
            </button>
          </div>

          <div
            className="p-4 p-md-5 rounded-4 border shadow-sm"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#DDD6FE' }}
          >
            <h4 className="fw-bold mb-1" style={{ color: '#111827' }}>
              SCAN THE INFORMATION
            </h4>
            <p className="text-muted small mb-4">
              Classify the five pieces of evidence.
            </p>

            <div className="d-flex flex-column gap-4 mb-4">
              {EVIDENCE_ITEMS.map((item, idx) => (
                <div
                  key={item.id}
                  className={idx < EVIDENCE_ITEMS.length - 1 ? 'pb-4 border-bottom' : ''}
                >
                  <p className="fw-bold mb-3" style={{ color: '#111827' }}>
                    {idx + 1}. {item.statement}
                  </p>

                  <div className="d-flex flex-column gap-2">
                    {evidenceOptions.map((option) => {
                      const isChecked = evidenceAnswers[item.id] === option;
                      return (
                        <label
                          key={option}
                          onClick={() => handleEvidenceSelect(item.id, option)}
                          className="d-flex align-items-center gap-3 py-1 px-2 rounded-3"
                          style={{ cursor: 'pointer', color: '#374151' }}
                        >
                          <span
                            className="d-inline-flex align-items-center justify-content-center rounded-circle"
                            style={{
                              width: '20px',
                              height: '20px',
                              border: isChecked ? '6px solid #6C4AB6' : '2px solid #D1D5DB',
                              backgroundColor: '#FFFFFF',
                              flexShrink: 0
                            }}
                          />
                          <span>{option}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleSubmitEvidence}
              disabled={!allEvidenceSelected}
              className="btn btn-lg w-100 rounded-4 py-3 fw-semibold border-0"
              style={{
                backgroundColor: allEvidenceSelected ? '#6C4AB6' : '#E5E7EB',
                color: allEvidenceSelected ? '#FFFFFF' : '#6B7280',
                cursor: allEvidenceSelected ? 'pointer' : 'not-allowed'
              }}
            >
              Submit evidence
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* RESULTADO DE LA ACTIVIDAD                                             */}
      {/* ===================================================================== */}
      {step === 'submitted' && (
        <div className="text-center py-4 mx-auto" style={{ maxWidth: '620px' }}>
          <div className="mb-3" style={{ color: '#6C4AB6' }}>
            <i className="bi bi-award-fill display-2"></i>
          </div>

          <h3 className="fw-bold mb-2" style={{ color: '#1E1248' }}>
            Listening Activity Completed!
          </h3>

          <div
            className="p-4 rounded-4 mb-4 border shadow-sm"
            style={{ backgroundColor: '#F8F7FC', borderColor: '#DDD6FE' }}
          >
            <div className="display-5 fw-bold" style={{ color: '#6C4AB6' }}>
              {score} / 100 pts
            </div>
            <p className="text-muted small mb-0 mt-1">
              Episode 08 · The spread of misinformation
            </p>
          </div>

          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={handleRetry}
              className="btn btn-outline-secondary rounded-pill px-4 py-2 fw-semibold"
            >
              Try Again
            </button>
            <button
              type="button"
              onClick={() => onComplete && onComplete(score)}
              className="btn btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
              style={{ backgroundColor: '#6C4AB6', borderColor: '#6C4AB6', color: '#FFFFFF' }}
            >
              Continue <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}