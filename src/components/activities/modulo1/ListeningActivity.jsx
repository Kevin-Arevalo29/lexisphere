import React, { useState, useRef } from 'react';

export default function ListeningActivity({ activityData, onComplete }) {
  // 'listen' | 'reorder' | 'submitted'
  const [step, setStep] = useState('listen');

  // =========================================================================
  // 1. CONFIGURACIÓN DEL AUDIO DEL PODCAST (INSERTA AQUÍ TU URL / ARCHIVO)
  // =========================================================================
  // 👉 PON AQUÍ LA URL O IMPORT DEL AUDIO (ej. '/audio/episode-08.mp3' o URL de Drive/Supabase):
  const PODCAST_AUDIO_URL = '';

  const MAX_ATTEMPTS = 2;
  const audioRef = useRef(null);
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleToggleAudio = () => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    if (isPlaying) {
      audioEl.pause();
      setIsPlaying(false);
    } else if (attemptsUsed < MAX_ATTEMPTS) {
      audioEl.play();
      setIsPlaying(true);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setAttemptsUsed((prev) => Math.min(prev + 1, MAX_ATTEMPTS));
  };

  const listeningInstructions = [
    'Listen to the entire conversation.',
    'Identify the main events and important details.',
    "Pay attention to the speakers' opinions and expressions.",
    'You can replay the audio before submitting your answers.'
  ];

  // =========================================================================
  // 2. SCREEN 2 – RECONSTRUCT THE VIRAL STORY (PON AQUÍ TU TEXTO / EVENTOS)
  // =========================================================================
  // 👉 REEMPLAZA ESTOS EVENTOS DE EJEMPLO POR LA SECUENCIA REAL DEL AUDIO CUANDO TENGAS EL TEXTO:
  // Cada objeto representa un acontecimiento de la noticia falsa que se volvió viral.
  // "correctOrder" indica la posición correcta (1, 2, 3, 4...) en el orden cronológico.
  const initialEvents = [
    {
      id: 'ev-1',
      text: '👉 PON AQUÍ EL EVENTO 1 (ej. An unverified post with a sensational headline is published online).',
      correctOrder: 1
    },
    {
      id: 'ev-2',
      text: '👉 PON AQUÍ EL EVENTO 2 (ej. Users share the post rapidly without checking reliable sources).',
      correctOrder: 2
    },
    {
      id: 'ev-3',
      text: '👉 PON AQUÍ EL EVENTO 3 (ej. Algorithms amplify the story across social media feeds).',
      correctOrder: 3
    },
    {
      id: 'ev-4',
      text: '👉 PON AQUÍ EL EVENTO 4 (ej. Fact-checkers debunk the rumor after widespread harm).',
      correctOrder: 4
    }
  ];

  const [orderedEvents, setOrderedEvents] = useState(initialEvents);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [score, setScore] = useState(0);

  const moveEvent = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= orderedEvents.length) return;
    const updated = [...orderedEvents];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setOrderedEvents(updated);
    setSelectedIndex(toIndex);
  };

  const handleCardClick = (index) => {
    if (selectedIndex === null) {
      setSelectedIndex(index);
      return;
    }
    if (selectedIndex === index) {
      setSelectedIndex(null);
      return;
    }
    const updated = [...orderedEvents];
    const temp = updated[selectedIndex];
    updated[selectedIndex] = updated[index];
    updated[index] = temp;
    setOrderedEvents(updated);
    setSelectedIndex(null);
  };

  const handleSubmitOrder = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    const pointsPerEvent = Math.round(100 / orderedEvents.length);
    let correctCount = 0;

    orderedEvents.forEach((ev, idx) => {
      if (ev.correctOrder === idx + 1) {
        correctCount += 1;
      }
    });

    const calculatedScore =
      correctCount === orderedEvents.length ? 100 : correctCount * pointsPerEvent;

    setScore(calculatedScore);
    setStep('submitted');
  };

  const handleRetry = () => {
    setOrderedEvents(initialEvents);
    setSelectedIndex(null);
    setScore(0);
    setStep('listen');
  };

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

            {/* Cuerpo del reproductor y espacio de inserción de audio */}
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

              <div className="fw-bold fs-4 mb-2" style={{ color: '#1E1248' }}>
                01:35
              </div>

              {/* 👉 AQUÍ SE INSERTA / CONECTA EL AUDIO (PODCAST_AUDIO_URL) */}
              <div className="p-3 rounded-4 bg-white border mx-auto mb-3" style={{ maxWidth: '520px', borderColor: '#DDD6FE' }}>
                <p className="small fw-semibold mb-2" style={{ color: '#6C4AB6' }}>
                  Audio player to be embedded in the website
                </p>

                <div className="d-flex flex-wrap justify-content-center align-items-center gap-2 mb-2">
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
                      ? 'Pause Podcast'
                      : attemptsUsed >= MAX_ATTEMPTS
                      ? 'No Attempts Left (2/2)'
                      : 'Play Podcast'}
                  </button>
                </div>

                {!PODCAST_AUDIO_URL && (
                  <div className="small text-muted">
                    {/* 👉 PON AQUÍ TU TEXTO / NOTA DE AUDIO SI LO DESEAS */}
                    Inserta la URL del audio en <code>PODCAST_AUDIO_URL</code> para reproducirlo.
                  </div>
                )}

                <audio
                  ref={audioRef}
                  src={PODCAST_AUDIO_URL || undefined}
                  onEnded={handleAudioEnded}
                  controlsList="nodownload noplaybackrate"
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
                setStep('reorder');
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
      {/* SCREEN 2 – RECONSTRUCT THE VIRAL STORY (MAIN INTERACTIVE ACTIVITY)    */}
      {/* ===================================================================== */}
      {step === 'reorder' && (
        <div className="mx-auto" style={{ maxWidth: '880px' }}>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div>
              <span
                className="badge px-3 py-1 rounded-pill fw-bold me-2"
                style={{ backgroundColor: '#EDE9FE', color: '#6C4AB6' }}
              >
                2. Screen 2 – Reconstruct the viral story
              </span>
              <span className="badge rounded-pill px-3 py-1 bg-success-subtle text-success fw-bold">
                MAIN INTERACTIVE ACTIVITY
              </span>
            </div>

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
            className="p-4 rounded-4 border mb-4 shadow-sm"
            style={{ backgroundColor: '#F8F7FC', borderColor: '#DDD6FE' }}
          >
            <h6 className="fw-bold mb-1" style={{ color: '#1E1248' }}>
              Instructions:
            </h6>
            <p className="text-dark mb-0" style={{ lineHeight: '1.6' }}>
              Arrange the events in the correct chronological order according to the audio.
            </p>
            <span className="small text-muted d-block mt-2">
              Tip: Use the up/down arrows or click two cards to swap their positions.
            </span>
          </div>

          {/* Lista interactiva de eventos para ordenar cronológicamente */}
          <div className="d-flex flex-column gap-3 mb-4">
            {orderedEvents.map((eventItem, index) => {
              const isSelected = selectedIndex === index;
              return (
                <div
                  key={eventItem.id}
                  onClick={() => handleCardClick(index)}
                  className="p-3 p-md-4 rounded-4 d-flex justify-content-between align-items-center gap-3 shadow-sm"
                  style={{
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#EDE9FE' : '#F8F7FC',
                    border: isSelected ? '2px solid #6C4AB6' : '1px solid #DDD6FE'
                  }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <span
                      className="badge rounded-circle d-flex align-items-center justify-content-center fw-bold"
                      style={{
                        width: '34px',
                        height: '34px',
                        backgroundColor: '#6C4AB6',
                        color: '#FFFFFF',
                        flexShrink: 0
                      }}
                    >
                      {index + 1}
                    </span>

                    {/* 👉 AQUÍ SE MUESTRA EL TEXTO DE CADA EVENTO (EDITABLE EN initialEvents) */}
                    <span className="fw-semibold text-dark" style={{ lineHeight: '1.5' }}>
                      {eventItem.text}
                    </span>
                  </div>

                  <div
                    className="d-flex flex-column gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveEvent(index, index - 1)}
                      className="btn btn-sm rounded-3 py-0 px-2"
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #6C4AB6',
                        color: '#6C4AB6'
                      }}
                      title="Move up"
                    >
                      <i className="bi bi-chevron-up"></i>
                    </button>
                    <button
                      type="button"
                      disabled={index === orderedEvents.length - 1}
                      onClick={() => moveEvent(index, index + 1)}
                      className="btn btn-sm rounded-3 py-0 px-2"
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #6C4AB6',
                        color: '#6C4AB6'
                      }}
                      title="Move down"
                    >
                      <i className="bi bi-chevron-down"></i>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-end">
            <button
              type="button"
              onClick={handleSubmitOrder}
              className="btn btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
              style={{ backgroundColor: '#6C4AB6', borderColor: '#6C4AB6', color: '#FFFFFF' }}
            >
              Submit Order <i className="bi bi-check2-circle ms-2"></i>
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