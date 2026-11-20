import React, { useState, useEffect } from 'react';

export default function WritingActivityM3({ activityData, onComplete }) {
  const [step, setStep] = useState('intro'); // 'intro', 'activity1', 'activity2', 'activity3', 'part4', 'submitted'

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
    setStep('activity1');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- PANEL DESPLEGABLE DE VOCABULARIO Y CONECTORES ---
  const [showVocabBank, setShowVocabBank] = useState(false);

  const vocabularyBank = [
    { term: 'Civic engagement', definition: 'Active participation in activities that improve society.' },
    { term: 'Marginalization', definition: 'The process of excluding certain groups from social opportunities.' },
    { term: 'Social mobility', definition: "The possibility of improving one's social or economic position." },
    { term: 'Advocacy', definition: 'Public support for a particular cause or social change.' },
    { term: 'Accountability', definition: "The responsibility to explain and accept the consequences of one's actions." },
    { term: 'Prejudice', definition: 'An unfair opinion about someone without knowing enough about them.' },
    { term: 'Social cohesion', definition: 'The connection and cooperation between different members of society.' },
    { term: 'Public policy', definition: 'Decisions and actions taken by governments to address social issues.' },
    { term: 'Grassroots movement', definition: 'A social initiative organized by ordinary people to create change.' },
    { term: 'Accessibility', definition: 'The possibility for everyone to use services, spaces and opportunities.' }
  ];

  const connectorsList = [
    'Nevertheless',
    'Furthermore',
    'Whereas',
    'Despite this',
    'Consequently',
    'On the other hand'
  ];

  // ==========================================
  // ACTIVITY 1: THE SOCIAL CHANGE PROPOSAL
  // ==========================================
  const [guidedAnswersA1, setGuidedAnswersA1] = useState({
    q1Problem: '',
    q2CausesConsequences: '',
    q3AffectedGroups: '',
    q4Actions: '',
    q5LongTermChange: ''
  });

  const [formalProposal, setFormalProposal] = useState('');
  const [wordCountA1, setWordCountA1] = useState(0);

  const handleProposalChange = (e) => {
    const text = e.target.value;
    setFormalProposal(text);
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCountA1(words);
  };

  // ==========================================
  // ACTIVITY 2: OPINION ESSAY – WHO IS RESPONSIBLE?
  // ==========================================
  const [essayOutlineA2, setEssayOutlineA2] = useState({
    introduction: '',
    body1Government: '',
    body2Individuals: '',
    conclusion: ''
  });

  const [argumentativeEssay, setArgumentativeEssay] = useState('');
  const [wordCountA2, setWordCountA2] = useState(0);

  const handleEssayChange = (e) => {
    const text = e.target.value;
    setArgumentativeEssay(text);
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCountA2(words);
  };

  // ==========================================
  // ACTIVITY 3: CREATE A SOCIAL AWARENESS CAMPAIGN
  // ==========================================
  const campaignTopics = [
    'Ending discrimination.',
    'Fighting poverty and unemployment.',
    'Promoting accessibility for everyone.',
    'Protecting human rights.',
    'Encouraging civic engagement.'
  ];

  const [selectedTopicA3, setSelectedTopicA3] = useState('');
  const [campaignSectionsA3, setCampaignSectionsA3] = useState({
    campaignTitle: '',
    mainMessage: '',
    causes: '',
    callToAction: '',
    finalSlogan: ''
  });

  // ==========================================
  // PART 4: INDIVIDUAL WRITING CHALLENGE (150-180 words)
  // ==========================================
  const [part4Notes, setPart4Notes] = useState({
    secondConditionalIdeas: '',
    positiveNegativeConsequences: ''
  });

  const [reflectiveTextP4, setReflectiveTextP4] = useState('');
  const [wordCountP4, setWordCountP4] = useState(0);

  const handleReflectiveChange = (e) => {
    const text = e.target.value;
    setReflectiveTextP4(text);
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCountP4(words);
  };

  const handleNavigateStep = (nextStep) => {
    setShowVocabBank(false);
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const hasAnyAnswerA1 =
    formalProposal.trim().length > 0 ||
    Object.values(guidedAnswersA1).some((val) => val.trim().length > 0);

  const hasAnyAnswerA2 =
    argumentativeEssay.trim().length > 0 ||
    Object.values(essayOutlineA2).some((val) => val.trim().length > 0);

  const hasAnyAnswerA3 =
    Boolean(selectedTopicA3) ||
    Object.values(campaignSectionsA3).some((val) => val.trim().length > 0);

  const hasAnyAnswerP4 =
    reflectiveTextP4.trim().length > 0 ||
    Object.values(part4Notes).some((val) => val.trim().length > 0);

  return (
    <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4 p-lg-5 bg-white w-100 position-relative">
      {/* Temporizador superior */}
      {(step === 'activity1' || step === 'activity2' || step === 'activity3' || step === 'part4') && (
        <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded-4 border">
          <span className="fw-bold" style={{ color: '#6C4AB6' }}>
            <i className="bi bi-clock-history me-2"></i> Writing Time Remaining:
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
          <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
            <span
              className="badge px-3 py-2 rounded-pill fw-bold"
              style={{ backgroundColor: '#EDE9FE', color: '#6C4AB6' }}
            >
              Module 3 - Writing Mission
            </span>
            <span className="badge rounded-pill px-3 py-2 bg-success-subtle text-success-emphasis fw-bold">
              B2+ Final Challenge Included
            </span>
          </div>

          <h2 className="fw-bold mb-3" style={{ color: '#1E1248' }}>
            Building a Better Society: Writing Tasks
          </h2>

          <div
            className="p-4 rounded-4 mb-4 border-start border-4 text-start shadow-sm"
            style={{ backgroundColor: '#F8F7FC', borderColor: '#6C4AB6' }}
          >
            <p className="text-dark fs-6 mb-2" style={{ lineHeight: '1.65' }}>
              Complete the writing tasks for Module 3: a formal social change proposal, an argumentative opinion essay, a social awareness campaign, and the individual reflective writing challenge.
            </p>
            <p className="text-dark small mb-0" style={{ lineHeight: '1.65' }}>
              All writing submissions remain pending instructor review once submitted.
            </p>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={startTimer}
              className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-5 fw-bold shadow"
              style={{ backgroundColor: '#6C4AB6', borderColor: '#6C4AB6', color: '#FFFFFF' }}
            >
              Start Writing Mission <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* ACTIVITY 1: THE SOCIAL CHANGE PROPOSAL     */}
      {/* ========================================== */}
      {step === 'activity1' && (
        <div>
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setShowVocabBank(!showVocabBank)}
              className="btn rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2 shadow-sm"
              style={{
                border: '2px solid #6C4AB6',
                color: showVocabBank ? '#FFFFFF' : '#6C4AB6',
                backgroundColor: showVocabBank ? '#6C4AB6' : '#FFFFFF'
              }}
            >
              <i className="bi bi-book-fill"></i>
              {showVocabBank ? 'Hide Vocabulary Bank ✕' : '📖 View Vocabulary Bank (Use at least 7 words)'}
            </button>

            {showVocabBank && (
              <div
                className="p-4 rounded-4 border mt-3 shadow-sm"
                style={{ backgroundColor: '#F8F7FC', borderLeft: '5px solid #6C4AB6' }}
              >
                <h6 className="fw-bold mb-3" style={{ color: '#6C4AB6' }}>
                  Vocabulary Bank (Min. 7 words)
                </h6>
                <div className="row g-2">
                  {vocabularyBank.map((item, idx) => (
                    <div key={idx} className="col-md-6 border-bottom pb-2">
                      <strong style={{ color: '#1E1248' }}>{item.term}:</strong>{' '}
                      <span className="text-muted small">{item.definition}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div
            className="p-4 rounded-4 border mb-4 shadow-sm"
            style={{ backgroundColor: '#F8F7FC', borderColor: '#DDD6FE' }}
          >
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <span
                className="badge px-3 py-1 rounded-pill fw-bold"
                style={{ backgroundColor: '#EDE9FE', color: '#6C4AB6' }}
              >
                Activity 1. The Social Change Proposal
              </span>
              <span className="badge rounded-pill px-3 py-1 bg-success-subtle text-success-emphasis fw-bold">
                B2+ Challenge
              </span>
            </div>

            <p className="text-dark small mb-2" style={{ lineHeight: '1.6' }}>
              <strong>Situation:</strong> Your university wants to launch a project called <em>Building a Better Society</em>. You have been invited to present a written proposal addressing one important social problem in your community.
            </p>
            <p className="text-dark small mb-2">
              <strong>Your task:</strong> Write a formal proposal (180–220 words) explaining points 1 to 5 below.
            </p>
            <strong className="small d-block mb-1" style={{ color: '#6C4AB6' }}>
              Requirements:
            </strong>
            <ul className="text-dark small mb-0 ps-3">
              <li>Use at least 7 vocabulary words from the vocabulary bank.</li>
              <li>Include three specific solutions.</li>
              <li>Use formal language.</li>
              <li>Explain why your solutions would be effective.</li>
            </ul>
          </div>

          <div className="d-flex flex-column gap-3 mb-4">
            <h5 className="fw-bold mb-1" style={{ color: '#1E1248' }}>
              <i className="bi bi-pencil-square me-2" style={{ color: '#6C4AB6' }}></i>
              Drafting Space – Answer the 5 Points
            </h5>

            <div className="p-3 p-md-4 rounded-4 border shadow-sm" style={{ backgroundColor: '#F8F7FC', borderColor: '#E9E5F5' }}>
              <label className="fw-bold small d-block mb-2" style={{ color: '#1E1248' }}>
                1. What social problem needs immediate attention?
              </label>
              <textarea
                rows="2"
                value={guidedAnswersA1.q1Problem}
                onChange={(e) => setGuidedAnswersA1({ ...guidedAnswersA1, q1Problem: e.target.value })}
                placeholder="Write your answer for question 1..."
                className="form-control rounded-3 bg-white"
              />
            </div>

            <div className="p-3 p-md-4 rounded-4 border shadow-sm" style={{ backgroundColor: '#F8F7FC', borderColor: '#E9E5F5' }}>
              <label className="fw-bold small d-block mb-2" style={{ color: '#1E1248' }}>
                2. What are its main causes and consequences?
              </label>
              <textarea
                rows="2"
                value={guidedAnswersA1.q2CausesConsequences}
                onChange={(e) => setGuidedAnswersA1({ ...guidedAnswersA1, q2CausesConsequences: e.target.value })}
                placeholder="Write your answer for question 2..."
                className="form-control rounded-3 bg-white"
              />
            </div>

            <div className="p-3 p-md-4 rounded-4 border shadow-sm" style={{ backgroundColor: '#F8F7FC', borderColor: '#E9E5F5' }}>
              <label className="fw-bold small d-block mb-2" style={{ color: '#1E1248' }}>
                3. Which groups are most affected?
              </label>
              <textarea
                rows="2"
                value={guidedAnswersA1.q3AffectedGroups}
                onChange={(e) => setGuidedAnswersA1({ ...guidedAnswersA1, q3AffectedGroups: e.target.value })}
                placeholder="Write your answer for question 3..."
                className="form-control rounded-3 bg-white"
              />
            </div>

            <div className="p-3 p-md-4 rounded-4 border shadow-sm" style={{ backgroundColor: '#F8F7FC', borderColor: '#E9E5F5' }}>
              <label className="fw-bold small d-block mb-2" style={{ color: '#1E1248' }}>
                4. What actions should the university and local government take? (Include 3 specific solutions & why they are effective)
              </label>
              <textarea
                rows="3"
                value={guidedAnswersA1.q4Actions}
                onChange={(e) => setGuidedAnswersA1({ ...guidedAnswersA1, q4Actions: e.target.value })}
                placeholder="Write your answer for question 4..."
                className="form-control rounded-3 bg-white"
              />
            </div>

            <div className="p-3 p-md-4 rounded-4 border shadow-sm" style={{ backgroundColor: '#F8F7FC', borderColor: '#E9E5F5' }}>
              <label className="fw-bold small d-block mb-2" style={{ color: '#1E1248' }}>
                5. How could your proposal create long-term social change?
              </label>
              <textarea
                rows="2"
                value={guidedAnswersA1.q5LongTermChange}
                onChange={(e) => setGuidedAnswersA1({ ...guidedAnswersA1, q5LongTermChange: e.target.value })}
                placeholder="Write your answer for question 5..."
                className="form-control rounded-3 bg-white"
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
              <label className="fw-bold" style={{ color: '#1E1248' }}>
                Formal Proposal (180–220 words):
              </label>
              <span
                className={`badge px-3 py-2 ${
                  wordCountA1 >= 180 && wordCountA1 <= 220 ? 'bg-success' : 'bg-warning text-dark'
                }`}
              >
                Word count: <strong>{wordCountA1}</strong> / 180–220 words
              </span>
            </div>
            <textarea
              rows="8"
              value={formalProposal}
              onChange={handleProposalChange}
              placeholder="Write your formal proposal (180–220 words) using formal language and at least 7 vocabulary words..."
              className="form-control rounded-4 p-3 shadow-sm"
              style={{ borderColor: '#6C4AB6', fontSize: '1rem', lineHeight: '1.65' }}
            />
          </div>

          <div className="text-end">
            <button
              type="button"
              onClick={() => handleNavigateStep('activity2')}
              disabled={!hasAnyAnswerA1}
              className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
              style={{ backgroundColor: '#6C4AB6', borderColor: '#6C4AB6', color: '#FFFFFF' }}
            >
              Continue to Activity 2 (Opinion Essay) <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* ACTIVITY 2: OPINION ESSAY – WHO IS RESPONSIBLE? */}
      {/* ========================================== */}
      {step === 'activity2' && (
        <div>
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setShowVocabBank(!showVocabBank)}
              className="btn rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2 shadow-sm"
              style={{
                border: '2px solid #6C4AB6',
                color: showVocabBank ? '#FFFFFF' : '#6C4AB6',
                backgroundColor: showVocabBank ? '#6C4AB6' : '#FFFFFF'
              }}
            >
              <i className="bi bi-book-fill"></i>
              {showVocabBank ? 'Hide Vocabulary & Connectors ✕' : '📖 View Vocabulary Bank (Min. 8 words) & Connectors'}
            </button>

            {showVocabBank && (
              <div
                className="p-4 rounded-4 border mt-3 shadow-sm"
                style={{ backgroundColor: '#F8F7FC', borderLeft: '5px solid #6C4AB6' }}
              >
                <h6 className="fw-bold mb-3" style={{ color: '#6C4AB6' }}>
                  Vocabulary Bank (Use at least 8 words)
                </h6>
                <div className="row g-2 mb-4">
                  {vocabularyBank.map((item, idx) => (
                    <div key={idx} className="col-md-6 border-bottom pb-2">
                      <strong style={{ color: '#1E1248' }}>{item.term}:</strong>{' '}
                      <span className="text-muted small">{item.definition}</span>
                    </div>
                  ))}
                </div>

                <h6 className="fw-bold mb-2" style={{ color: '#6C4AB6' }}>
                  Contrasting & Linking Connectors:
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  {connectorsList.map((conn) => (
                    <span
                      key={conn}
                      className="badge rounded-pill px-3 py-2 fw-semibold"
                      style={{ backgroundColor: '#EDE9FE', color: '#1E1248' }}
                    >
                      {conn}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div
            className="p-4 rounded-4 border mb-4 shadow-sm"
            style={{ backgroundColor: '#F8F7FC', borderColor: '#DDD6FE' }}
          >
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <span
                className="badge px-3 py-1 rounded-pill fw-bold"
                style={{ backgroundColor: '#EDE9FE', color: '#6C4AB6' }}
              >
                Activity 2. Opinion Essay – Who Is Responsible?
              </span>
              <span className="badge rounded-pill px-3 py-1 bg-success-subtle text-success-emphasis fw-bold">
                Advanced writing
              </span>
            </div>

            <h6 className="fw-bold mt-2 mb-1" style={{ color: '#6C4AB6' }}>
              Writing question:
            </h6>
            <p className="text-dark fs-6 fst-italic mb-2" style={{ lineHeight: '1.6' }}>
              Is creating a fair and inclusive society mainly the responsibility of governments or individuals?
            </p>
            <p className="text-dark small fw-bold mb-2">
              Write an argumentative essay of 220–250 words.
            </p>

            <strong className="small d-block mb-1" style={{ color: '#6C4AB6' }}>
              Your essay must include:
            </strong>
            <ul className="text-dark small mb-3 ps-3" style={{ lineHeight: '1.6' }}>
              <li><strong>Introduction:</strong> Introduce the issue and present your position.</li>
              <li><strong>Body paragraph 1:</strong> Explain the responsibility of governments.</li>
              <li><strong>Body paragraph 2:</strong> Discuss the role of individuals and communities.</li>
              <li><strong>Conclusion:</strong> Summarize your arguments and provide a final reflection.</li>
            </ul>

            <strong className="small d-block mb-1" style={{ color: '#6C4AB6' }}>
              Challenge: Include at least 8 vocabulary words and use contrasting connectors such as:
            </strong>
            <ul className="text-dark small mb-0 ps-3 d-flex flex-wrap gap-3">
              <li>Nevertheless</li>
              <li>Furthermore</li>
              <li>Whereas</li>
              <li>Despite this</li>
              <li>Consequently</li>
              <li>On the other hand</li>
            </ul>
          </div>

          <div className="d-flex flex-column gap-3 mb-4">
            <h5 className="fw-bold mb-1" style={{ color: '#1E1248' }}>
              <i className="bi bi-journal-text me-2" style={{ color: '#6C4AB6' }}></i>
              Section Notes – Essay Structure
            </h5>

            <div className="p-3 p-md-4 rounded-4 border shadow-sm" style={{ backgroundColor: '#F8F7FC', borderColor: '#E9E5F5' }}>
              <label className="fw-bold small d-block mb-2" style={{ color: '#1E1248' }}>
                Introduction (Introduce the issue and present your position):
              </label>
              <textarea
                rows="2"
                value={essayOutlineA2.introduction}
                onChange={(e) => setEssayOutlineA2({ ...essayOutlineA2, introduction: e.target.value })}
                placeholder="Draft your introduction here..."
                className="form-control rounded-3 bg-white"
              />
            </div>

            <div className="p-3 p-md-4 rounded-4 border shadow-sm" style={{ backgroundColor: '#F8F7FC', borderColor: '#E9E5F5' }}>
              <label className="fw-bold small d-block mb-2" style={{ color: '#1E1248' }}>
                Body Paragraph 1 (Explain the responsibility of governments):
              </label>
              <textarea
                rows="3"
                value={essayOutlineA2.body1Government}
                onChange={(e) => setEssayOutlineA2({ ...essayOutlineA2, body1Government: e.target.value })}
                placeholder="Draft body paragraph 1 here..."
                className="form-control rounded-3 bg-white"
              />
            </div>

            <div className="p-3 p-md-4 rounded-4 border shadow-sm" style={{ backgroundColor: '#F8F7FC', borderColor: '#E9E5F5' }}>
              <label className="fw-bold small d-block mb-2" style={{ color: '#1E1248' }}>
                Body Paragraph 2 (Discuss the role of individuals and communities):
              </label>
              <textarea
                rows="3"
                value={essayOutlineA2.body2Individuals}
                onChange={(e) => setEssayOutlineA2({ ...essayOutlineA2, body2Individuals: e.target.value })}
                placeholder="Draft body paragraph 2 here..."
                className="form-control rounded-3 bg-white"
              />
            </div>

            <div className="p-3 p-md-4 rounded-4 border shadow-sm" style={{ backgroundColor: '#F8F7FC', borderColor: '#E9E5F5' }}>
              <label className="fw-bold small d-block mb-2" style={{ color: '#1E1248' }}>
                Conclusion (Summarize your arguments and provide a final reflection):
              </label>
              <textarea
                rows="2"
                value={essayOutlineA2.conclusion}
                onChange={(e) => setEssayOutlineA2({ ...essayOutlineA2, conclusion: e.target.value })}
                placeholder="Draft your conclusion here..."
                className="form-control rounded-3 bg-white"
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
              <label className="fw-bold" style={{ color: '#1E1248' }}>
                Argumentative Opinion Essay (220–250 words):
              </label>
              <span
                className={`badge px-3 py-2 ${
                  wordCountA2 >= 220 && wordCountA2 <= 250 ? 'bg-success' : 'bg-warning text-dark'
                }`}
              >
                Word count: <strong>{wordCountA2}</strong> / 220–250 words
              </span>
            </div>
            <textarea
              rows="9"
              value={argumentativeEssay}
              onChange={handleEssayChange}
              placeholder="Write your full argumentative essay (220–250 words) with at least 8 vocabulary words and contrasting connectors..."
              className="form-control rounded-4 p-3 shadow-sm"
              style={{ borderColor: '#6C4AB6', fontSize: '1rem', lineHeight: '1.65' }}
            />
          </div>

          <div className="text-end">
            <button
              type="button"
              onClick={() => handleNavigateStep('activity3')}
              disabled={!hasAnyAnswerA2}
              className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
              style={{ backgroundColor: '#6C4AB6', borderColor: '#6C4AB6', color: '#FFFFFF' }}
            >
              Continue to Activity 3 (Social Awareness Campaign) <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* ACTIVITY 3: CREATE A SOCIAL AWARENESS CAMPAIGN */}
      {/* ========================================== */}
      {step === 'activity3' && (
        <div>
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setShowVocabBank(!showVocabBank)}
              className="btn rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2 shadow-sm"
              style={{
                border: '2px solid #6C4AB6',
                color: showVocabBank ? '#FFFFFF' : '#6C4AB6',
                backgroundColor: showVocabBank ? '#6C4AB6' : '#FFFFFF'
              }}
            >
              <i className="bi bi-book-fill"></i>
              {showVocabBank ? 'Hide Vocabulary Reference ✕' : '📖 View Vocabulary Reference'}
            </button>

            {showVocabBank && (
              <div
                className="p-4 rounded-4 border mt-3 shadow-sm"
                style={{ backgroundColor: '#F8F7FC', borderLeft: '5px solid #6C4AB6' }}
              >
                <h6 className="fw-bold mb-3" style={{ color: '#6C4AB6' }}>
                  Vocabulary Reference
                </h6>
                <div className="row g-2">
                  {vocabularyBank.map((item, idx) => (
                    <div key={idx} className="col-md-6 border-bottom pb-2">
                      <strong style={{ color: '#1E1248' }}>{item.term}:</strong>{' '}
                      <span className="text-muted small">{item.definition}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div
            className="p-4 rounded-4 border mb-4 shadow-sm"
            style={{ backgroundColor: '#F8F7FC', borderColor: '#DDD6FE' }}
          >
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <span
                className="badge px-3 py-1 rounded-pill fw-bold"
                style={{ backgroundColor: '#EDE9FE', color: '#6C4AB6' }}
              >
                Activity 3. Create a Social Awareness Campaign
              </span>
              <span className="badge rounded-pill px-3 py-1" style={{ backgroundColor: '#EDE9FE', color: '#1E1248' }}>
                Creative writing
              </span>
            </div>

            <p className="text-dark small mb-2" style={{ lineHeight: '1.6' }}>
              <strong>Situation:</strong> A social organization has asked your group to create a campaign to raise awareness about an issue affecting society.
            </p>
            <p className="text-dark small mb-2">
              <strong>Your task:</strong> Write the content for a social awareness campaign.
            </p>

            <strong className="small d-block mb-2" style={{ color: '#6C4AB6' }}>
              Choose ONE topic:
            </strong>
            <div className="d-flex flex-column gap-2 mb-2">
              {campaignTopics.map((topic) => {
                const isPicked = selectedTopicA3 === topic;
                return (
                  <div
                    key={topic}
                    onClick={() => setSelectedTopicA3(topic)}
                    className="p-2 px-3 rounded-3 d-flex align-items-center gap-2 transition-all"
                    style={{
                      cursor: 'pointer',
                      backgroundColor: isPicked ? '#EDE9FE' : '#FFFFFF',
                      border: isPicked ? '2px solid #6C4AB6' : '1px solid #E2E8F0'
                    }}
                  >
                    <input
                      type="radio"
                      name="campaignTopicA3"
                      checked={isPicked}
                      onChange={() => setSelectedTopicA3(topic)}
                      className="form-check-input m-0"
                      style={{ accentColor: '#6C4AB6', cursor: 'pointer' }}
                    />
                    <span className="small fw-semibold text-dark">{topic}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="d-flex flex-column gap-3 mb-5">
            <h5 className="fw-bold mb-1" style={{ color: '#1E1248' }}>
              <i className="bi bi-megaphone-fill me-2" style={{ color: '#6C4AB6' }}></i>
              Your Campaign Content
            </h5>

            <div className="p-3 p-md-4 rounded-4 border shadow-sm" style={{ backgroundColor: '#F8F7FC', borderColor: '#E9E5F5' }}>
              <label className="fw-bold small d-block mb-1" style={{ color: '#1E1248' }}>
                Campaign title — <span className="text-muted fw-normal">A creative and powerful title.</span>
              </label>
              <input
                type="text"
                value={campaignSectionsA3.campaignTitle}
                onChange={(e) =>
                  setCampaignSectionsA3({ ...campaignSectionsA3, campaignTitle: e.target.value })
                }
                placeholder="Write a creative and powerful campaign title..."
                className="form-control rounded-3 bg-white mt-2"
              />
            </div>

            <div className="p-3 p-md-4 rounded-4 border shadow-sm" style={{ backgroundColor: '#F8F7FC', borderColor: '#E9E5F5' }}>
              <label className="fw-bold small d-block mb-1" style={{ color: '#1E1248' }}>
                Main message — <span className="text-muted fw-normal">A short message explaining the problem.</span>
              </label>
              <textarea
                rows="2"
                value={campaignSectionsA3.mainMessage}
                onChange={(e) =>
                  setCampaignSectionsA3({ ...campaignSectionsA3, mainMessage: e.target.value })
                }
                placeholder="Write a short message explaining the problem..."
                className="form-control rounded-3 bg-white mt-2"
              />
            </div>

            <div className="p-3 p-md-4 rounded-4 border shadow-sm" style={{ backgroundColor: '#F8F7FC', borderColor: '#E9E5F5' }}>
              <label className="fw-bold small d-block mb-1" style={{ color: '#1E1248' }}>
                Causes — <span className="text-muted fw-normal">Two reasons why the problem exists.</span>
              </label>
              <textarea
                rows="3"
                value={campaignSectionsA3.causes}
                onChange={(e) =>
                  setCampaignSectionsA3({ ...campaignSectionsA3, causes: e.target.value })
                }
                placeholder="Write two reasons why the problem exists..."
                className="form-control rounded-3 bg-white mt-2"
              />
            </div>

            <div className="p-3 p-md-4 rounded-4 border shadow-sm" style={{ backgroundColor: '#F8F7FC', borderColor: '#E9E5F5' }}>
              <label className="fw-bold small d-block mb-1" style={{ color: '#1E1248' }}>
                Call to action — <span className="text-muted fw-normal">Three actions people can take.</span>
              </label>
              <textarea
                rows="3"
                value={campaignSectionsA3.callToAction}
                onChange={(e) =>
                  setCampaignSectionsA3({ ...campaignSectionsA3, callToAction: e.target.value })
                }
                placeholder="Write three actions people can take..."
                className="form-control rounded-3 bg-white mt-2"
              />
            </div>

            <div className="p-3 p-md-4 rounded-4 border shadow-sm" style={{ backgroundColor: '#F8F7FC', borderColor: '#E9E5F5' }}>
              <label className="fw-bold small d-block mb-1" style={{ color: '#1E1248' }}>
                Final slogan — <span className="text-muted fw-normal">A memorable sentence encouraging social change.</span>
              </label>
              <input
                type="text"
                value={campaignSectionsA3.finalSlogan}
                onChange={(e) =>
                  setCampaignSectionsA3({ ...campaignSectionsA3, finalSlogan: e.target.value })
                }
                placeholder="Write a memorable sentence encouraging social change..."
                className="form-control rounded-3 bg-white mt-2"
              />
            </div>
          </div>

          <div className="text-end">
            <button
              type="button"
              onClick={() => handleNavigateStep('part4')}
              disabled={!hasAnyAnswerA3}
              className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
              style={{ backgroundColor: '#6C4AB6', borderColor: '#6C4AB6', color: '#FFFFFF' }}
            >
              Continue to Part 4 (Individual Challenge) <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* PART 4: INDIVIDUAL WRITING CHALLENGE         */}
      {/* ========================================== */}
      {step === 'part4' && (
        <div>
          {/* Botón desplegable para consultar el Vocabulary Bank */}
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setShowVocabBank(!showVocabBank)}
              className="btn rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2 shadow-sm"
              style={{
                border: '2px solid #6C4AB6',
                color: showVocabBank ? '#FFFFFF' : '#6C4AB6',
                backgroundColor: showVocabBank ? '#6C4AB6' : '#FFFFFF'
              }}
            >
              <i className="bi bi-book-fill"></i>
              {showVocabBank ? 'Hide Vocabulary Bank ✕' : '📖 View Vocabulary Bank (Use at least 8 words)'}
            </button>

            {showVocabBank && (
              <div
                className="p-4 rounded-4 border mt-3 shadow-sm"
                style={{ backgroundColor: '#F8F7FC', borderLeft: '5px solid #6C4AB6' }}
              >
                <h6 className="fw-bold mb-3" style={{ color: '#6C4AB6' }}>
                  Vocabulary Bank (Use at least 8 words)
                </h6>
                <div className="row g-2">
                  {vocabularyBank.map((item, idx) => (
                    <div key={idx} className="col-md-6 border-bottom pb-2">
                      <strong style={{ color: '#1E1248' }}>{item.term}:</strong>{' '}
                      <span className="text-muted small">{item.definition}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Enunciado y Requisitos de Part 4 */}
          <div
            className="p-4 rounded-4 border mb-4 shadow-sm"
            style={{ backgroundColor: '#F8F7FC', borderColor: '#DDD6FE' }}
          >
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <span
                className="badge px-3 py-1 rounded-pill fw-bold"
                style={{ backgroundColor: '#EDE9FE', color: '#6C4AB6' }}
              >
                Part 4. Individual writing challenge
              </span>
              <span className="badge rounded-pill px-3 py-1 bg-success-subtle text-success-emphasis fw-bold">
                B2+ Final challenge
              </span>
            </div>

            <h5 className="fw-bold mt-2 mb-3" style={{ color: '#1E1248' }}>
              The future of society is in our hands.
            </h5>

            <p className="text-dark small fw-bold mb-1">
              Write a reflective text answering:
            </p>
            <p className="text-dark fs-6 fst-italic mb-3" style={{ lineHeight: '1.6' }}>
              What would society look like in 20 years if people started taking greater responsibility for social problems today?
            </p>

            <ul className="text-dark small mb-0 ps-3 d-flex flex-column gap-1" style={{ lineHeight: '1.6' }}>
              <li>Length: 150–180 words.</li>
              <li>Use at least 8 vocabulary words.</li>
              <li>Include hypothetical situations using the second conditional.</li>
              <li>Explain possible positive and negative consequences.</li>
            </ul>
          </div>

          {/* Espacios de apoyo para ideas clave */}
          <div className="d-flex flex-column gap-3 mb-4">
            <div className="p-3 p-md-4 rounded-4 border shadow-sm" style={{ backgroundColor: '#F8F7FC', borderColor: '#E9E5F5' }}>
              <label className="fw-bold small d-block mb-2" style={{ color: '#1E1248' }}>
                Second Conditional Ideas (Hypothetical situations in 20 years):
              </label>
              <textarea
                rows="2"
                value={part4Notes.secondConditionalIdeas}
                onChange={(e) => setPart4Notes({ ...part4Notes, secondConditionalIdeas: e.target.value })}
                placeholder="Draft your second conditional sentences (e.g., If people took greater responsibility today, society would...)..."
                className="form-control rounded-3 bg-white"
              />
            </div>

            <div className="p-3 p-md-4 rounded-4 border shadow-sm" style={{ backgroundColor: '#F8F7FC', borderColor: '#E9E5F5' }}>
              <label className="fw-bold small d-block mb-2" style={{ color: '#1E1248' }}>
                Possible Positive and Negative Consequences:
              </label>
              <textarea
                rows="2"
                value={part4Notes.positiveNegativeConsequences}
                onChange={(e) =>
                  setPart4Notes({ ...part4Notes, positiveNegativeConsequences: e.target.value })
                }
                placeholder="Note the positive outcomes if action is taken and negative consequences if responsibility is ignored..."
                className="form-control rounded-3 bg-white"
              />
            </div>
          </div>

          {/* Espacio principal para el texto reflexivo (150-180 palabras) */}
          <div className="mb-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
              <label className="fw-bold" style={{ color: '#1E1248' }}>
                Reflective Text (150–180 words):
              </label>
              <span
                className={`badge px-3 py-2 ${
                  wordCountP4 >= 150 && wordCountP4 <= 180 ? 'bg-success' : 'bg-warning text-dark'
                }`}
              >
                Word count: <strong>{wordCountP4}</strong> / 150–180 words
              </span>
            </div>
            <textarea
              rows="8"
              value={reflectiveTextP4}
              onChange={handleReflectiveChange}
              placeholder="Write your reflective text (150–180 words) using at least 8 vocabulary words, second conditional sentences, and positive/negative consequences..."
              className="form-control rounded-4 p-3 shadow-sm"
              style={{ borderColor: '#6C4AB6', fontSize: '1rem', lineHeight: '1.65' }}
            />
          </div>

          <div className="text-end">
            <button
              type="button"
              onClick={handleSubmitWriting}
              disabled={!hasAnyAnswerP4}
              className="btn btn-purple btn-lg rounded-pill px-5 py-2 fs-6 fw-bold shadow"
              style={{ backgroundColor: '#6C4AB6', borderColor: '#6C4AB6', color: '#FFFFFF' }}
            >
              Submit Writing Mission for Review <i className="bi bi-send-fill ms-2"></i>
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

          <h3 className="fw-bold text-dark mb-3">Writing Mission Submitted Successfully!</h3>

          <div className="p-4 rounded-4 mb-4 shadow-sm border bg-warning-subtle text-warning-emphasis">
            <p className="fs-5 fw-bold mb-1">Pending Review (Pendiente de revisión)</p>
            <p className="fs-6 mb-0">
              Your social change proposal ({wordCountA1} words), opinion essay ({wordCountA2} words), social awareness campaign, and individual reflective challenge ({wordCountP4} words) have been submitted for instructor evaluation. Completed in{' '}
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
            Complete Module 3 Evaluation 🏆 <i className="bi bi-arrow-right ms-2"></i>
          </button>
        </div>
      )}
    </div>
  );
}