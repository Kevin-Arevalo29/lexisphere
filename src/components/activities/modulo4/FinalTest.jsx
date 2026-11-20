import React, { useState, useEffect, useRef } from 'react';

export default function FinalTest({ activityData, onComplete }) {
  // 'intro' | 'reading' | 'listening' | 'writing' | 'speaking' | 'submitted'
  const [section, setSection] = useState('intro');

  // --- TEMPORIZADOR GENERAL DEL EXAMEN: 90 MINUTOS (5400 SEGUNDOS) ---
  const [timeLeft, setTimeLeft] = useState(5400);
  const [timerActive, setTimerActive] = useState(false);
  const [timeSpent, setTimeSpent] = useState({ minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const formatClock = (totalSecs) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return hrs > 0
      ? `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      : `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ==========================================
  // 1. READING (25 POINTS · 5 PREGUNTAS x 5 PTS)
  // ==========================================
  const readingText = `Technology has transformed modern society in many ways. Social media platforms allow people to communicate instantly, share information and participate in social movements. However, this digital transformation also raises concerns about misinformation, data privacy and digital addiction. Many users are unaware of their digital footprint and how companies collect personal information through online activities.
At the same time, technological development has created opportunities to address environmental challenges. Renewable energy systems, smart transportation and digital monitoring tools can contribute to sustainable development. Nevertheless, technological progress alone cannot solve problems such as climate change, deforestation and biodiversity loss. Governments and citizens must also adopt responsible consumption habits and improve waste management.
Another important challenge is social inequality. Although digital platforms provide access to education and employment opportunities, marginalized communities may still experience discrimination and limited access to technology. This situation can increase the digital divide and restrict social mobility.
Building a better future requires digital literacy, environmental responsibility and social inclusion. Individuals, institutions and governments must work together to create a more sustainable, fair and connected society.`;

  const readingQuestions = [
    {
      id: 1,
      prompt: 'Question 1. What is the main idea of the text?',
      options: {
        A: 'Technology is responsible for all social problems.',
        B: 'Modern challenges require technological, environmental and social solutions.',
        C: 'Social media should replace traditional communication.',
        D: 'Environmental problems are more important than social issues.'
      },
      correct: 'B'
    },
    {
      id: 2,
      prompt: 'Question 2. What does the term digital footprint refer to?',
      options: {
        A: 'The physical damage caused by electronic devices.',
        B: 'The information people leave behind through their online activities.',
        C: 'The number of followers a person has.',
        D: 'The time people spend studying online.'
      },
      correct: 'B'
    },
    {
      id: 3,
      prompt: 'Question 3. How can technology contribute to environmental protection?',
      options: {
        A: 'By increasing industrial production.',
        B: 'By eliminating the need for governments.',
        C: 'By supporting renewable energy and smart transportation.',
        D: 'By encouraging excessive consumption.'
      },
      correct: 'C'
    },
    {
      id: 4,
      prompt: 'Question 4. What is one consequence of the digital divide?',
      options: {
        A: 'Greater access to employment for everyone.',
        B: 'Increased social mobility in every community.',
        C: 'Limited opportunities for marginalized communities.',
        D: 'The disappearance of social inequality.'
      },
      correct: 'C'
    },
    {
      id: 5,
      prompt: 'Question 5. Which combination is necessary to build a better future?',
      options: {
        A: 'Digital literacy, environmental responsibility and social inclusion.',
        B: 'Economic growth, advertising and online popularity.',
        C: 'Industrial development and excessive consumption.',
        D: 'Social media restrictions and technological isolation.'
      },
      correct: 'A'
    }
  ];

  const [readingAnswers, setReadingAnswers] = useState({});

  // ==========================================
  // 2. LISTENING (25 POINTS · 5 PREGUNTAS x 5 PTS · MAX 2 PLAYS)
  // ==========================================
  const LISTENING_AUDIO_URL = '/audio/AUDIO 4 - FINAL TEST LISTENING.ogg';
  const audioRef = useRef(null);
  const [playCount, setPlayCount] = useState(0);

  const listeningQuestions = [
    {
      id: 6,
      prompt: 'Question 6. What is one concern related to social media?',
      options: {
        A: 'Renewable energy.',
        B: 'Data privacy.',
        C: 'Deforestation.',
        D: 'Biodiversity.'
      },
      correct: 'B'
    },
    {
      id: 7,
      prompt: 'Question 7. Why is digital literacy important?',
      options: {
        A: 'It helps people identify reliable information.',
        B: 'It increases electronic waste.',
        C: 'It eliminates social interaction.',
        D: 'It promotes excessive consumption.'
      },
      correct: 'A'
    },
    {
      id: 8,
      prompt: 'Question 8. What environmental problem is mentioned?',
      options: {
        A: 'Air pollution from transportation.',
        B: 'Global warming caused by agriculture.',
        C: 'Increasing electronic waste.',
        D: 'Loss of forest ecosystems.'
      },
      correct: 'C'
    },
    {
      id: 9,
      prompt: 'Question 9. How can the digital divide affect society?',
      options: {
        A: 'It guarantees equal opportunities.',
        B: 'It increases access to technology for everyone.',
        C: 'It can increase economic inequality.',
        D: 'It eliminates discrimination.'
      },
      correct: 'C'
    },
    {
      id: 10,
      prompt: 'Question 10. What is the main conclusion of the conversation?',
      options: {
        A: 'Technology should be completely prohibited.',
        B: 'Collective responsibility is necessary to address modern challenges.',
        C: 'Environmental problems are impossible to solve.',
        D: 'Social media is the only way to improve society.'
      },
      correct: 'B'
    }
  ];

  const [listeningAnswers, setListeningAnswers] = useState({});

  const handleAudioEnded = () => {
    setPlayCount((prev) => Math.min(prev + 1, 2));
  };

  // ==========================================
  // 3. WRITING (25 POINTS · 180–220 PALABRAS · RÚBRICA MANUAL)
  // ==========================================
  const [writingNotes, setWritingNotes] = useState({
    introPosition: '',
    argumentsExamples: '',
    conclusionReflection: ''
  });
  const [essayText, setEssayText] = useState('');
  const [wordCount, setWordCount] = useState(0);

  const handleEssayChange = (e) => {
    const value = e.target.value;
    setEssayText(value);
    const words = value.trim() ? value.trim().split(/\s+/).length : 0;
    setWordCount(words);
  };

  // ==========================================
  // 4. SPEAKING (25 POINTS · ORAL PRODUCTION · AUDIO)
  // ==========================================
  const [showSpeakingVocab, setShowSpeakingVocab] = useState(false);
  const [speakingCueNotes, setSpeakingCueNotes] = useState('');

  // Grabación exclusiva de Audio
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [mediaError, setMediaError] = useState('');
  const [recordedAudioUrl, setRecordedAudioUrl] = useState('');

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const activeStreamRef = useRef(null);

  const speakingVocabulary = [
    { topic: 'Technology', term: 'Digital literacy & Data privacy' },
    { topic: 'Technology', term: 'Digital footprint & Misinformation' },
    { topic: 'Environment', term: 'Sustainable development & Renewable energy' },
    { topic: 'Environment', term: 'Waste management & Biodiversity loss' },
    { topic: 'Society', term: 'Social inclusion & Civic engagement' },
    { topic: 'Society', term: 'Digital divide & Social mobility' }
  ];

  const stopAudioStream = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (activeStreamRef.current) {
      activeStreamRef.current.getTracks().forEach((track) => track.stop());
      activeStreamRef.current = null;
    }
    setIsRecordingAudio(false);
  };

  useEffect(() => {
    return () => {
      if (activeStreamRef.current) {
        activeStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleStartAudioRecording = async () => {
    setMediaError('');
    chunksRef.current = [];

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMediaError(
        'Your browser does not support audio recording. You can still submit and have your speaking evaluated via rubric or in-person session.'
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      activeStreamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl(url);

        stream.getTracks().forEach((track) => track.stop());
        activeStreamRef.current = null;
        setIsRecordingAudio(false);
      };

      recorder.start();
      setIsRecordingAudio(true);
    } catch (err) {
      setMediaError(
        'Microphone permission was denied or no microphone was detected. You may still submit and have your speaking evaluated via rubric or in-person session.'
      );
    }
  };

  const handleStopAudioRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const clearRecordedAudio = () => {
    if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
    setRecordedAudioUrl('');
  };

  // --- PUNTAJE OBJETIVO (READING 25 + LISTENING 25 = 50 PTS AUTO-CALIFICABLES) ---
  const calculateObjectiveScore = () => {
    let score = 0;
    readingQuestions.forEach((q) => {
      if (readingAnswers[q.id] === q.correct) score += 5;
    });
    listeningQuestions.forEach((q) => {
      if (listeningAnswers[q.id] === q.correct) score += 5;
    });
    return score;
  };

  const goToSection = (nextSection) => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    if (isRecordingAudio) {
      stopAudioStream();
    }
    setShowSpeakingVocab(false);
    setSection(nextSection);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartExam = () => {
    setTimerActive(true);
    setSection('reading');
  };

  const handleSubmitExam = () => {
    setTimerActive(false);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    if (isRecordingAudio) {
      stopAudioStream();
    }
    const elapsed = 5400 - timeLeft;
    setTimeSpent({
      minutes: Math.floor(elapsed / 60),
      seconds: elapsed % 60
    });
    setSection('submitted');
  };

  const objectiveScore = calculateObjectiveScore();
  const hasSpeakingSubmission = Boolean(recordedAudioUrl || speakingCueNotes.trim());

  return (
    <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4 p-lg-5 bg-white w-100">
      {/* Barra superior con temporizador y navegación de secciones */}
      {section !== 'intro' && section !== 'submitted' && (
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4 p-3 bg-light rounded-4 border">
          <div className="d-flex flex-wrap align-items-center gap-2">
            <button
              type="button"
              onClick={() => goToSection('reading')}
              className="btn btn-sm rounded-pill px-3 fw-semibold"
              style={{
                backgroundColor: section === 'reading' ? '#6C4AB6' : '#FFFFFF',
                color: section === 'reading' ? '#FFFFFF' : '#1E1248',
                border: '1px solid #6C4AB6'
              }}
            >
              1. Reading (25 pts)
            </button>
            <button
              type="button"
              onClick={() => goToSection('listening')}
              className="btn btn-sm rounded-pill px-3 fw-semibold"
              style={{
                backgroundColor: section === 'listening' ? '#6C4AB6' : '#FFFFFF',
                color: section === 'listening' ? '#FFFFFF' : '#1E1248',
                border: '1px solid #6C4AB6'
              }}
            >
              2. Listening (25 pts)
            </button>
            <button
              type="button"
              onClick={() => goToSection('writing')}
              className="btn btn-sm rounded-pill px-3 fw-semibold"
              style={{
                backgroundColor: section === 'writing' ? '#6C4AB6' : '#FFFFFF',
                color: section === 'writing' ? '#FFFFFF' : '#1E1248',
                border: '1px solid #6C4AB6'
              }}
            >
              3. Writing (25 pts)
            </button>
            <button
              type="button"
              onClick={() => goToSection('speaking')}
              className="btn btn-sm rounded-pill px-3 fw-semibold"
              style={{
                backgroundColor: section === 'speaking' ? '#6C4AB6' : '#FFFFFF',
                color: section === 'speaking' ? '#FFFFFF' : '#1E1248',
                border: '1px solid #6C4AB6'
              }}
            >
              4. Speaking (25 pts)
            </button>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="fw-bold small" style={{ color: '#6C4AB6' }}>
              <i className="bi bi-clock-history me-1"></i> Time Left:
            </span>
            <span
              className={`badge px-3 py-2 fs-6 ${timeLeft < 300 ? 'bg-danger' : ''}`}
              style={timeLeft >= 300 ? { backgroundColor: '#6C4AB6', color: '#FFFFFF' } : {}}
            >
              {formatClock(timeLeft)}
            </span>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 1. CONFIGURACIÓN GENERAL E INSTRUCCIONES */}
      {/* ========================================== */}
      {section === 'intro' && (
        <div className="mx-auto" style={{ maxWidth: '900px' }}>
          <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
            <span
              className="badge px-3 py-2 rounded-pill fw-bold"
              style={{ backgroundColor: '#EDE9FE', color: '#6C4AB6' }}
            >
              English level: B2+
            </span>
            <span className="badge rounded-pill px-3 py-2 fw-bold" style={{ backgroundColor: '#1E1248', color: '#FFFFFF' }}>
              Total score: 100 points
            </span>
          </div>

          <h2 className="fw-bold mb-3" style={{ color: '#1E1248' }}>
            Final Test
          </h2>

          <div className="table-responsive mb-4">
            <table className="table table-bordered rounded-3 overflow-hidden mb-0">
              <thead style={{ backgroundColor: '#EDE9FE', color: '#1E1248' }}>
                <tr>
                  <th>Elemento</th>
                  <th>Configuración</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="fw-semibold">Exam name</td>
                  <td>Final Test</td>
                </tr>
                <tr>
                  <td className="fw-semibold">English level</td>
                  <td>B2+</td>
                </tr>
                <tr>
                  <td className="fw-semibold">Total score</td>
                  <td>100 points</td>
                </tr>
                <tr>
                  <td className="fw-semibold">Duration</td>
                  <td>90 minutes</td>
                </tr>
                <tr>
                  <td className="fw-semibold">Number of skills</td>
                  <td>4</td>
                </tr>
                <tr>
                  <td className="fw-semibold">Number of questions</td>
                  <td>10 objective questions + 2 production tasks</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            className="p-4 rounded-4 mb-4 border-start border-4 shadow-sm"
            style={{ backgroundColor: '#F8F7FC', borderColor: '#6C4AB6' }}
          >
            <h4 className="fw-bold text-danger mb-2">Welcome to your Final English Assessment!</h4>
            <p className="text-dark mb-3" style={{ lineHeight: '1.65' }}>
              This examination evaluates your ability to understand and communicate in English through four language skills: Reading, Listening, Writing and Speaking.
            </p>
            <p className="fw-bold text-dark mb-1">The questions integrate three main topics:</p>
            <ul className="text-dark mb-3">
              <li>Social Media and Technology.</li>
              <li>Environment.</li>
              <li>Society.</li>
            </ul>

            <h6 className="fw-bold text-danger mb-2">Instructions:</h6>
            <ol className="text-dark small mb-0 ps-3 d-flex flex-column gap-1" style={{ lineHeight: '1.6' }}>
              <li>Read each instruction carefully.</li>
              <li>Complete all four sections.</li>
              <li>Select only one answer for each multiple-choice question.</li>
              <li>Use appropriate vocabulary and grammar.</li>
              <li>Complete the writing and speaking activities.</li>
              <li>Review your answers before submitting.</li>
            </ol>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleStartExam}
              className="btn btn-lg rounded-pill px-5 py-2 fs-5 fw-bold shadow"
              style={{ backgroundColor: '#6C4AB6', borderColor: '#6C4AB6', color: '#FFFFFF' }}
            >
              Start Final Test <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 2. READING (25 POINTS · 5 PREGUNTAS x 5 PTS) */}
      {/* ========================================== */}
      {section === 'reading' && (
        <div>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div>
              <span
                className="badge px-3 py-1 rounded-pill fw-bold me-2"
                style={{ backgroundColor: '#EDE9FE', color: '#6C4AB6' }}
              >
                Reading · 25 points
              </span>
              <span className="badge rounded-pill px-3 py-1 bg-light text-dark border">
                5 questions · 5 pts each
              </span>
            </div>
          </div>

          <div
            className="p-4 rounded-4 border mb-4 shadow-sm"
            style={{ backgroundColor: '#F8F7FC', borderColor: '#DDD6FE' }}
          >
            <h6 className="fw-bold mb-2" style={{ color: '#1E1248' }}>
              Student instructions: Read the following text carefully and answer questions 1–5.
            </h6>
            <h5 className="fw-bold mb-3" style={{ color: '#6C4AB6' }}>
              Reading text: A Connected World: Progress or Problem?
            </h5>
            {readingText.split('\n').map((paragraph, idx) => (
              <p key={idx} className="text-dark mb-2" style={{ lineHeight: '1.7', textAlign: 'justify' }}>
                {paragraph}
              </p>
            ))}
          </div>

          <div className="d-flex flex-column gap-4 mb-4">
            {readingQuestions.map((q) => {
              const selected = readingAnswers[q.id];
              return (
                <div
                  key={q.id}
                  className="p-4 rounded-4 border shadow-sm"
                  style={{ backgroundColor: '#F8F7FC', borderColor: '#E9E5F5' }}
                >
                  <h6 className="fw-bold mb-3" style={{ color: '#1E1248' }}>
                    {q.prompt} <span className="text-muted small fw-normal">(5 pts)</span>
                  </h6>
                  <div className="d-flex flex-column gap-2">
                    {Object.entries(q.options).map(([letter, text]) => {
                      const isPicked = selected === letter;
                      return (
                        <div
                          key={letter}
                          onClick={() => setReadingAnswers((prev) => ({ ...prev, [q.id]: letter }))}
                          className="p-3 rounded-3 d-flex align-items-center gap-3"
                          style={{
                            cursor: 'pointer',
                            backgroundColor: isPicked ? '#EDE9FE' : '#FFFFFF',
                            border: isPicked ? '2px solid #6C4AB6' : '1px solid #E2E8F0'
                          }}
                        >
                          <input
                            type="radio"
                            name={`reading-q-${q.id}`}
                            checked={isPicked}
                            onChange={() => setReadingAnswers((prev) => ({ ...prev, [q.id]: letter }))}
                            className="form-check-input m-0"
                            style={{ accentColor: '#6C4AB6', cursor: 'pointer' }}
                          />
                          <span className="small text-dark">
                            <strong>{letter}.</strong> {text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-end">
            <button
              type="button"
              onClick={() => goToSection('listening')}
              className="btn btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
              style={{ backgroundColor: '#6C4AB6', borderColor: '#6C4AB6', color: '#FFFFFF' }}
            >
              Continue to Listening <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 3. LISTENING (25 POINTS · Q6–Q10 · MAX 2 PLAYS) */}
      {/* ========================================== */}
      {section === 'listening' && (
        <div>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div>
              <span
                className="badge px-3 py-1 rounded-pill fw-bold me-2"
                style={{ backgroundColor: '#EDE9FE', color: '#6C4AB6' }}
              >
                Listening · 25 points
              </span>
              <span className="badge rounded-pill px-3 py-1 bg-light text-dark border">
                Plays used: {playCount} / 2
              </span>
            </div>
          </div>

          <div
            className="p-4 rounded-4 border mb-4 shadow-sm"
            style={{ backgroundColor: '#F8F7FC', borderColor: '#DDD6FE' }}
          >
            <h6 className="fw-bold text-danger mb-2">Student instructions:</h6>
            <p className="text-dark mb-1" style={{ lineHeight: '1.65' }}>
              Listen carefully to the conversation between two university students discussing technology, environmental problems and social challenges.
            </p>
            <p className="text-dark fw-semibold mb-3">
              You will listen to the recording twice. Then, answer questions 6–10.
            </p>

            <div className="p-3 rounded-3 bg-white border">
              <audio
                ref={audioRef}
                src={LISTENING_AUDIO_URL}
                controls
                preload="metadata"
                className="w-100"
                onEnded={handleAudioEnded}
              />
            </div>
          </div>

          <div className="d-flex flex-column gap-4 mb-4">
            {listeningQuestions.map((q) => {
              const selected = listeningAnswers[q.id];
              return (
                <div
                  key={q.id}
                  className="p-4 rounded-4 border shadow-sm"
                  style={{ backgroundColor: '#F8F7FC', borderColor: '#E9E5F5' }}
                >
                  <h6 className="fw-bold mb-3" style={{ color: '#1E1248' }}>
                    {q.prompt} <span className="text-muted small fw-normal">(5 pts)</span>
                  </h6>
                  <div className="d-flex flex-column gap-2">
                    {Object.entries(q.options).map(([letter, text]) => {
                      const isPicked = selected === letter;
                      return (
                        <div
                          key={letter}
                          onClick={() => setListeningAnswers((prev) => ({ ...prev, [q.id]: letter }))}
                          className="p-3 rounded-3 d-flex align-items-center gap-3"
                          style={{
                            cursor: 'pointer',
                            backgroundColor: isPicked ? '#EDE9FE' : '#FFFFFF',
                            border: isPicked ? '2px solid #6C4AB6' : '1px solid #E2E8F0'
                          }}
                        >
                          <input
                            type="radio"
                            name={`listening-q-${q.id}`}
                            checked={isPicked}
                            onChange={() => setListeningAnswers((prev) => ({ ...prev, [q.id]: letter }))}
                            className="form-check-input m-0"
                            style={{ accentColor: '#6C4AB6', cursor: 'pointer' }}
                          />
                          <span className="small text-dark">
                            <strong>{letter}.</strong> {text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <button
              type="button"
              onClick={() => goToSection('reading')}
              className="btn btn-outline-secondary rounded-pill px-4 py-2 fw-semibold"
            >
              <i className="bi bi-arrow-left me-1"></i> Back to Reading
            </button>

            <button
              type="button"
              onClick={() => goToSection('writing')}
              className="btn btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
              style={{ backgroundColor: '#6C4AB6', borderColor: '#6C4AB6', color: '#FFFFFF' }}
            >
              Continue to Writing <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 4. WRITING (25 POINTS · 180–220 PALABRAS) */}
      {/* ========================================== */}
      {section === 'writing' && (
        <div>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div>
              <span
                className="badge px-3 py-1 rounded-pill fw-bold me-2"
                style={{ backgroundColor: '#EDE9FE', color: '#6C4AB6' }}
              >
                Writing · 25 points
              </span>
              <span className="badge rounded-pill px-3 py-1 bg-light text-dark border">
                180–220 words · Rubric review
              </span>
            </div>
          </div>

          <div
            className="p-4 rounded-4 border mb-4 shadow-sm"
            style={{ backgroundColor: '#F8F7FC', borderColor: '#DDD6FE' }}
          >
            <h6 className="fw-bold text-danger mb-2">Student instructions:</h6>
            <p className="text-dark mb-2" style={{ lineHeight: '1.65' }}>
              Write an argumentative essay of 180–220 words responding to the following statement:
            </p>
            <p className="fw-bold fs-6 mb-2" style={{ color: '#1E1248' }}>
              "The future of our society depends on how we use technology and protect the environment."
            </p>
            <p className="text-dark small mb-3" style={{ lineHeight: '1.65' }}>
              Do you agree or disagree with this statement? Explain your position using arguments and real-life examples.
            </p>

            <strong className="small d-block mb-1" style={{ color: '#6C4AB6' }}>
              Your essay must include:
            </strong>
            <ol className="text-dark small mb-0 ps-3 d-flex flex-column gap-1" style={{ lineHeight: '1.6' }}>
              <li>An introduction presenting your opinion.</li>
              <li>At least two developed arguments.</li>
              <li>Examples related to technology, environmental challenges or social inequality.</li>
              <li>A conclusion with a final reflection.</li>
            </ol>
          </div>

          <div className="d-flex flex-column gap-3 mb-4">
            <div
              className="p-3 p-md-4 rounded-4 border shadow-sm"
              style={{ backgroundColor: '#F8F7FC', borderColor: '#E9E5F5' }}
            >
              <label className="fw-bold small d-block mb-2" style={{ color: '#1E1248' }}>
                1. Introduction & Position (Agree / Disagree):
              </label>
              <textarea
                rows="2"
                value={writingNotes.introPosition}
                onChange={(e) => setWritingNotes({ ...writingNotes, introPosition: e.target.value })}
                placeholder="Write your main stance here..."
                className="form-control rounded-3 bg-white"
              />
            </div>

            <div
              className="p-3 p-md-4 rounded-4 border shadow-sm"
              style={{ backgroundColor: '#F8F7FC', borderColor: '#E9E5F5' }}
            >
              <label className="fw-bold small d-block mb-2" style={{ color: '#1E1248' }}>
                2–3. Key Arguments & Examples (Technology, Environment or Social Inequality):
              </label>
              <textarea
                rows="2"
                value={writingNotes.argumentsExamples}
                onChange={(e) => setWritingNotes({ ...writingNotes, argumentsExamples: e.target.value })}
                placeholder="Outline at least two arguments and real-life examples..."
                className="form-control rounded-3 bg-white"
              />
            </div>

            <div
              className="p-3 p-md-4 rounded-4 border shadow-sm"
              style={{ backgroundColor: '#F8F7FC', borderColor: '#E9E5F5' }}
            >
              <label className="fw-bold small d-block mb-2" style={{ color: '#1E1248' }}>
                4. Conclusion & Final Reflection:
              </label>
              <textarea
                rows="2"
                value={writingNotes.conclusionReflection}
                onChange={(e) => setWritingNotes({ ...writingNotes, conclusionReflection: e.target.value })}
                placeholder="Note your closing takeaway..."
                className="form-control rounded-3 bg-white"
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
              <label className="fw-bold" style={{ color: '#1E1248' }}>
                Argumentative Essay (180–220 words):
              </label>
              <span
                className={`badge px-3 py-2 ${
                  wordCount >= 180 && wordCount <= 220 ? 'bg-success' : 'bg-warning text-dark'
                }`}
              >
                Word count: <strong>{wordCount}</strong> / 180–220 words
              </span>
            </div>

            <textarea
              rows="9"
              value={essayText}
              onChange={handleEssayChange}
              placeholder="Write your argumentative essay (180–220 words) here..."
              className="form-control rounded-4 p-3 shadow-sm"
              style={{ borderColor: '#6C4AB6', fontSize: '1rem', lineHeight: '1.65' }}
            />
          </div>

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <button
              type="button"
              onClick={() => goToSection('listening')}
              className="btn btn-outline-secondary rounded-pill px-4 py-2 fw-semibold"
            >
              <i className="bi bi-arrow-left me-1"></i> Back to Listening
            </button>

            <button
              type="button"
              onClick={() => goToSection('speaking')}
              className="btn btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
              style={{ backgroundColor: '#6C4AB6', borderColor: '#6C4AB6', color: '#FFFFFF' }}
            >
              Continue to Speaking <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 5. SPEAKING (25 POINTS · ORAL PRODUCTION) */}
      {/* ========================================== */}
      {section === 'speaking' && (
        <div>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
            <div className="d-flex flex-wrap align-items-center gap-2">
              <span
                className="badge px-3 py-1 rounded-pill fw-bold"
                style={{ backgroundColor: '#EDE9FE', color: '#6C4AB6' }}
              >
                Speaking · 25 points
              </span>
              <span className="badge rounded-pill px-3 py-1 bg-warning-subtle text-warning-emphasis fw-bold">
                Rubric Evaluation
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowSpeakingVocab(!showSpeakingVocab)}
              className="btn btn-sm rounded-pill px-3 py-2 fw-semibold shadow-sm"
              style={{
                border: '2px solid #6C4AB6',
                color: showSpeakingVocab ? '#FFFFFF' : '#6C4AB6',
                backgroundColor: showSpeakingVocab ? '#6C4AB6' : '#FFFFFF'
              }}
            >
              <i className="bi bi-book-fill me-1"></i>
              {showSpeakingVocab ? 'Hide Topic Terms ✕' : 'Topic Vocabulary (Min. 6 terms)'}
            </button>
          </div>

          {showSpeakingVocab && (
            <div
              className="p-4 rounded-4 border mb-4 shadow-sm"
              style={{ backgroundColor: '#F8F7FC', borderLeft: '5px solid #6C4AB6' }}
            >
              <h6 className="fw-bold mb-3" style={{ color: '#6C4AB6' }}>
                Key Terms Across the Three Topics (Use at least 6)
              </h6>
              <div className="row g-2">
                {speakingVocabulary.map((item, idx) => (
                  <div key={idx} className="col-md-6">
                    <div className="p-2 rounded-3 bg-white border d-flex justify-content-between align-items-center">
                      <span className="small fw-semibold" style={{ color: '#1E1248' }}>
                        {item.term}
                      </span>
                      <span
                        className="badge rounded-pill"
                        style={{ backgroundColor: '#EDE9FE', color: '#6C4AB6' }}
                      >
                        {item.topic}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instrucciones del estudiante, 4 preguntas y requisitos */}
          <div
            className="p-4 rounded-4 border mb-4 shadow-sm"
            style={{ backgroundColor: '#F8F7FC', borderColor: '#DDD6FE' }}
          >
            <h6 className="fw-bold text-danger mb-2">Student instructions:</h6>
            <p className="text-dark mb-1" style={{ lineHeight: '1.65' }}>
              Imagine that you are part of a university committee responsible for creating a better future for your community.
            </p>
            <p className="text-dark fw-semibold mb-3" style={{ lineHeight: '1.65' }}>
              Your task is to explain how technology, environmental protection and social participation can work together to improve people's quality of life.
            </p>

            <h6 className="fw-bold text-danger mb-2">Answer the following questions:</h6>
            <ol
              className="fw-semibold mb-3 ps-3 d-flex flex-column gap-1"
              style={{ color: '#198754', lineHeight: '1.6' }}
            >
              <li>How can technology help solve environmental and social problems?</li>
              <li>What are the main consequences of misinformation, climate change and economic inequality?</li>
              <li>How can young people promote sustainable development and social inclusion?</li>
              <li>What specific initiative would you propose for your university or community?</li>
            </ol>

            <h6 className="fw-bold mb-1" style={{ color: '#198754' }}>
              Requirements:
            </h6>
            <ul className="text-dark small mb-0 ps-3 d-flex flex-column gap-1" style={{ lineHeight: '1.6' }}>
              <li>Use at least 6 vocabulary terms from the three topics.</li>
              <li>Give examples to support your opinions.</li>
              <li>Present at least one practical solution.</li>
              <li>Speak clearly and organize your ideas logically.</li>
            </ul>
          </div>

          {/* Grabación exclusiva de Audio + Notas rápidas */}
          <div
            className="p-4 rounded-4 border mb-4 shadow-sm"
            style={{ backgroundColor: '#F8F7FC', borderColor: '#E9E5F5' }}
          >
            <div className="p-3 p-md-4 rounded-4 bg-white border mb-3">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                <div>
                  <h6 className="fw-bold mb-1" style={{ color: '#1E1248' }}>
                    <i className="bi bi-mic-fill me-2" style={{ color: '#6C4AB6' }}></i>
                    Audio Recording
                  </h6>
                  <span className="small text-muted">
                    Record your oral response directly in the browser, or have your instructor score it via rubric / in-person evaluation if recording is unavailable.
                  </span>
                </div>

                <div className="d-flex gap-2">
                  {!isRecordingAudio ? (
                    <button
                      type="button"
                      onClick={handleStartAudioRecording}
                      className="btn btn-sm rounded-pill px-4 py-2 fw-bold shadow-sm"
                      style={{ backgroundColor: '#6C4AB6', borderColor: '#6C4AB6', color: '#FFFFFF' }}
                    >
                      <i className="bi bi-mic-fill me-1"></i> Record Audio
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStopAudioRecording}
                      className="btn btn-sm btn-danger rounded-pill px-4 py-2 fw-bold"
                    >
                      <i className="bi bi-stop-circle-fill me-1"></i> Stop Recording
                    </button>
                  )}
                </div>
              </div>

              {mediaError && (
                <div className="alert alert-warning small py-2 mb-3" role="alert">
                  {mediaError}
                </div>
              )}

              {isRecordingAudio && (
                <div className="p-3 rounded-3 mb-3 d-flex align-items-center gap-2" style={{ backgroundColor: '#EDE9FE' }}>
                  <span className="badge bg-danger px-2 py-1">REC</span>
                  <span className="small fw-semibold" style={{ color: '#1E1248' }}>
                    Recording microphone audio... Speak clearly and logically.
                  </span>
                </div>
              )}

              {recordedAudioUrl && (
                <div className="p-3 rounded-3 border" style={{ backgroundColor: '#F8F7FC' }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="small fw-bold" style={{ color: '#1E1248' }}>
                      <i className="bi bi-file-earmark-music-fill me-1" style={{ color: '#6C4AB6' }}></i>
                      Recorded Audio Response
                    </span>
                    <button
                      type="button"
                      onClick={clearRecordedAudio}
                      className="btn btn-sm btn-outline-danger rounded-pill px-3"
                    >
                      Delete & Re-record
                    </button>
                  </div>
                  <audio src={recordedAudioUrl} controls className="w-100" />
                </div>
              )}
            </div>

            <div>
              <label className="fw-bold small d-block mb-2" style={{ color: '#1E1248' }}>
                Speaker Outline / Quick Notes (Optional):
              </label>
              <textarea
                rows="3"
                value={speakingCueNotes}
                onChange={(e) => setSpeakingCueNotes(e.target.value)}
                placeholder="Jot down key points, examples, or your committee initiative to stay organized while speaking..."
                className="form-control rounded-3 bg-white"
              />
            </div>
          </div>

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <button
              type="button"
              onClick={() => goToSection('writing')}
              className="btn btn-outline-secondary rounded-pill px-4 py-2 fw-semibold"
            >
              <i className="bi bi-arrow-left me-1"></i> Back to Writing
            </button>

            <button
              type="button"
              onClick={handleSubmitExam}
              className="btn btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
              style={{ backgroundColor: '#6C4AB6', borderColor: '#6C4AB6', color: '#FFFFFF' }}
            >
              Submit Final Test <i className="bi bi-send-fill ms-2"></i>
            </button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 6. RESUMEN Y ESTADO DE ENVÍO               */}
      {/* ========================================== */}
      {section === 'submitted' && (
        <div className="text-center py-4 mx-auto" style={{ maxWidth: '720px' }}>
          <div className="mb-3" style={{ color: '#6C4AB6' }}>
            <i className="bi bi-check2-circle display-2"></i>
          </div>

          <h3 className="fw-bold mb-2" style={{ color: '#1E1248' }}>
            Final Test Submitted
          </h3>
          <p className="text-muted small mb-4">
            Completed in <strong>{timeSpent.minutes}m {timeSpent.seconds}s</strong>. Reading and Listening are auto-graded; Writing and Speaking are awaiting instructor rubric or in-person evaluation.
          </p>

          <div
            className="p-4 rounded-4 mb-4 border shadow-sm"
            style={{ backgroundColor: '#F8F7FC', borderColor: '#DDD6FE' }}
          >
            <div className="row g-3 text-center">
              <div className="col-md-4 border-end">
                <span className="small text-muted d-block fw-semibold">Objective Score</span>
                <span className="fs-2 fw-bold" style={{ color: '#6C4AB6' }}>
                  {objectiveScore} / 50
                </span>
                <span className="small text-muted d-block">Reading + Listening</span>
              </div>
              <div className="col-md-4 border-end">
                <span className="small text-muted d-block fw-semibold">Writing (25 pts)</span>
                <span className="badge bg-warning text-dark px-3 py-2 mt-2">
                  Pending Rubric ({wordCount}w)
                </span>
              </div>
              <div className="col-md-4">
                <span className="small text-muted d-block fw-semibold">Speaking (25 pts)</span>
                <span className="badge bg-warning text-dark px-3 py-2 mt-2">
                  {hasSpeakingSubmission ? 'Audio Submitted · Rubric' : 'Rubric / In-Person'}
                </span>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setTimerActive(true);
                setSection('reading');
              }}
              className="btn btn-outline-secondary rounded-pill px-4 py-2 fw-semibold"
            >
              Review Sections
            </button>
            <button
              type="button"
              onClick={() => onComplete && onComplete(objectiveScore)}
              className="btn btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
              style={{ backgroundColor: '#6C4AB6', borderColor: '#6C4AB6', color: '#FFFFFF' }}
            >
              Finish Final Test 🏆 <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}