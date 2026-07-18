import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/* Shared Background Assets */
function AshokaChakra({ size = 200, opacity = 0.08, spin = true }) {
  const spokes = Array.from({ length: 24 }, (_, i) => i);
  return (
    <svg width={size} height={size} viewBox="0 0 200 200"
      style={{ opacity, animation: spin ? 'spin-slow 40s linear infinite' : 'none', display: 'block', flexShrink: 0 }}>
      <circle cx="100" cy="100" r="96" fill="none" stroke="#06038D" strokeWidth="4" />
      <circle cx="100" cy="100" r="12" fill="#06038D" />
      {spokes.map(i => {
        const a = (i * 15 * Math.PI) / 180;
        return <line key={i} x1={100 + 12 * Math.cos(a)} y1={100 + 12 * Math.sin(a)} x2={100 + 92 * Math.cos(a)} y2={100 + 92 * Math.sin(a)} stroke="#06038D" strokeWidth="1.5" />;
      })}
      <circle cx="100" cy="100" r="78" fill="none" stroke="#06038D" strokeWidth="1" />
    </svg>
  );
}

function FloatingParticles({ count = 18 }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${(i * 37 + 11) % 95 + 2}%`,
      size: (i % 3) + 2,
      duration: 12 + (i % 7) * 2.5,
      delay: -((i * 3.7) % 12),
      color: i % 3 === 0
        ? 'rgba(255,153,51,0.45)'
        : i % 3 === 1
          ? 'rgba(19,136,8,0.35)'
          : 'rgba(255,255,255,0.2)',
    })), [count]);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute', bottom: '-8px', left: p.left,
          width: p.size, height: p.size, borderRadius: '50%', background: p.color,
          animation: `particle-drift ${p.duration}s linear ${p.delay}s infinite`,
          willChange: 'transform',
        }} />
      ))}
    </div>
  );
}

export default function EvaluatorDashboard() {
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState('evaluate'); // 'evaluate' or 'completed'
  const [selectedSubmission, setSelectedSubmission] = useState(null); // Active submission in modal
  const navigate = useNavigate();

  // State to track all submissions
  const [submissions, setSubmissions] = useState([
    {
      teamId: 'T-4032',
      teamName: 'Team Alpha',
      leaderName: 'Amit Patel',
      psId: 'PS-104',
      psName: 'Decentralized Crop Insurance Platform',
      solutionId: 'SOL-8821',
      videoLink: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Demo video link
      questionsAsked: 'How does it handle satellite data offline? What is the gas cost optimization strategy?',
      pptUrl: 'https://docs.google.com/presentation/d/17MCZsoHCGdJTqVKxhuHExweQI1M-0w59/embed?start=false&loop=false&delayms=3000'
    },
    {
      teamId: 'T-8219',
      teamName: 'Team ByteCraft',
      leaderName: 'Sneha Reddy',
      psId: 'PS-208',
      psName: 'AI-Powered Traffic Congestion Management',
      solutionId: 'SOL-5491',
      videoLink: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      questionsAsked: 'What is the inference latency of the model? How does it perform in low lighting conditions?',
      pptUrl: 'https://docs.google.com/presentation/d/17MCZsoHCGdJTqVKxhuHExweQI1M-0w59/embed?start=false&loop=false&delayms=3000'
    },
    {
      teamId: 'T-1102',
      teamName: 'Team CyberNaut',
      leaderName: 'Rohan Sen',
      psId: 'PS-312',
      psName: 'Secure Medical Record Sharing Protocol',
      solutionId: 'SOL-9304',
      videoLink: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      questionsAsked: 'Are zero-knowledge proof generation times feasible on mobile devices?',
      pptUrl: 'https://docs.google.com/presentation/d/17MCZsoHCGdJTqVKxhuHExweQI1M-0w59/embed?start=false&loop=false&delayms=3000'
    }
  ]);

  // Track completed evaluations
  const [completedEvaluations, setCompletedEvaluations] = useState([]);

  // Temp scores state for evaluation modal
  const [evalScores, setEvalScores] = useState({
    alignment: 10,
    innovation: 10,
    feasibility: 10,
    scalability: 10,
    compliance: 10,
    comments: ''
  });

  useEffect(() => {
    const sessionStr = localStorage.getItem('evaluator_session');
    if (!sessionStr) {
      navigate('/login');
      return;
    }
    setSession(JSON.parse(sessionStr));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('evaluator_session');
    navigate('/login');
  };

  // Open modal and load default scores
  const startEvaluation = (submission) => {
    setSelectedSubmission(submission);
    setEvalScores({
      alignment: 10,
      innovation: 10,
      feasibility: 10,
      scalability: 10,
      compliance: 10,
      comments: ''
    });
  };

  const handleScoreChange = (field, val) => {
    if (field === 'comments') {
      setEvalScores(prev => ({ ...prev, comments: val }));
    } else {
      const numericVal = Math.min(10, Math.max(0, parseInt(val) || 0));
      setEvalScores(prev => ({ ...prev, [field]: numericVal }));
    }
  };

  const submitEvaluation = () => {
    if (!selectedSubmission) return;

    const totalScore = 
      evalScores.alignment + 
      evalScores.innovation + 
      evalScores.feasibility + 
      evalScores.scalability + 
      evalScores.compliance;

    const newEvaluation = {
      ...selectedSubmission,
      scores: { ...evalScores },
      totalScore,
      evaluatedAt: new Date().toLocaleDateString()
    };

    // Add to completed list
    setCompletedEvaluations(prev => [...prev, newEvaluation]);
    
    // Remove from active list
    setSubmissions(prev => prev.filter(sub => sub.teamId !== selectedSubmission.teamId));

    // Close Modal
    setSelectedSubmission(null);
    alert(`Evaluation for ${selectedSubmission.teamName} successfully submitted!`);
  };

  return (
    <section style={{
      position: 'relative', minHeight: '100vh',
      background: 'linear-gradient(160deg, #07192c 0%, #0f2942 45%, #07192c 100%)',
      display: 'flex',
      overflow: 'hidden'
    }}>
      <FloatingParticles count={22} />

      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', zIndex: 0 }}>
        <AshokaChakra size={640} opacity={0.035} spin />
      </div>

      {/* Sidebar */}
      <nav style={{
        width: 320,
        background: 'rgba(255,255,255,0.02)',
        borderRight: '1px solid rgba(255,153,51,0.15)',
        backdropFilter: 'blur(16px)',
        padding: '40px 24px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 28,
        zIndex: 10,
        flexShrink: 0
      }}>
        {/* Sidebar Nav */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={() => setActiveTab('evaluate')}
            style={{
              padding: '14px 18px',
              background: activeTab === 'evaluate' ? 'rgba(255,153,51,0.12)' : 'transparent',
              color: activeTab === 'evaluate' ? '#FF9933' : '#fff',
              border: activeTab === 'evaluate' ? '1px solid rgba(255,153,51,0.25)' : '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              cursor: 'pointer',
              fontWeight: 600,
              fontFamily: 'Poppins,sans-serif',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            Evaluate Ideas
          </button>
          
          <button
            onClick={() => setActiveTab('completed')}
            style={{
              padding: '14px 18px',
              background: activeTab === 'completed' ? 'rgba(19,136,8,0.12)' : 'transparent',
              color: activeTab === 'completed' ? '#138808' : '#fff',
              border: activeTab === 'completed' ? '1px solid rgba(19,136,8,0.25)' : '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              cursor: 'pointer',
              fontWeight: 600,
              fontFamily: 'Poppins,sans-serif',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            Completed Evaluations
          </button>
        </div>

        {/* Footer controls */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '12px',
              background: 'transparent',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 10,
              cursor: 'pointer',
              fontWeight: 600,
              fontFamily: 'Poppins,sans-serif',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            Return to Home
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '12px',
              background: 'rgba(255,107,107,0.1)',
              color: '#ff6b6b',
              border: '1px solid rgba(255,107,107,0.2)',
              borderRadius: 10,
              cursor: 'pointer',
              fontWeight: 600,
              fontFamily: 'Poppins,sans-serif',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,107,107,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,107,107,0.1)'; }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main style={{
        flex: 1,
        padding: '40px 48px',
        zIndex: 10,
        overflowY: 'auto',
        boxSizing: 'border-box'
      }}>
        {activeTab === 'evaluate' ? (
          <div>
            <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 900, color: '#fff', fontSize: 32, marginBottom: 28, letterSpacing: -0.5 }}>
              Evaluate Ideas
            </h1>

            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 153, 51, 0.15)',
              borderRadius: 20,
              padding: '24px 32px',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
              overflowX: 'auto'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'Poppins,sans-serif' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 13, textTransform: 'uppercase' }}>Team ID</th>
                    <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 13, textTransform: 'uppercase' }}>Team Name</th>
                    <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 13, textTransform: 'uppercase' }}>Team Leader</th>
                    <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 13, textTransform: 'uppercase' }}>PS ID</th>
                    <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 13, textTransform: 'uppercase' }}>Problem Statement Name</th>
                    <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 13, textTransform: 'uppercase' }}>Solution ID</th>
                    <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 13, textTransform: 'uppercase', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ padding: '32px 16px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', fontSize: 14 }}>
                        No pending ideas to evaluate.
                      </td>
                    </tr>
                  ) : (
                    submissions.map((sub, idx) => (
                      <tr key={sub.teamId} style={{ borderBottom: idx < submissions.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                        <td style={{ padding: '16px', color: '#FF9933', fontWeight: 600, fontSize: 14 }}>{sub.teamId}</td>
                        <td style={{ padding: '16px', color: '#fff', fontSize: 14, fontWeight: 500 }}>{sub.teamName}</td>
                        <td style={{ padding: '16px', color: '#fff', fontSize: 14 }}>{sub.leaderName}</td>
                        <td style={{ padding: '16px', color: '#FF9933', fontSize: 14, fontFamily: 'Courier New, monospace' }}>{sub.psId}</td>
                        <td style={{ padding: '16px', color: 'rgba(255,255,255,0.8)', fontSize: 14, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub.psName}</td>
                        <td style={{ padding: '16px', color: '#138808', fontSize: 14, fontFamily: 'Courier New, monospace' }}>{sub.solutionId}</td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <button
                            onClick={() => startEvaluation(sub)}
                            style={{
                              padding: '8px 16px',
                              background: 'linear-gradient(135deg, #FF9933 0%, #e07800 100%)',
                              color: '#fff',
                              borderRadius: 8,
                              border: 'none',
                              fontFamily: 'Montserrat,sans-serif',
                              fontWeight: 700,
                              fontSize: 12,
                              cursor: 'pointer',
                              boxShadow: '0 4px 12px rgba(255,153,51,0.25)',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                          >
                            Evaluate
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 900, color: '#fff', fontSize: 32, marginBottom: 28, letterSpacing: -0.5 }}>
              Completed Evaluations
            </h1>

            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(19, 136, 8, 0.2)',
              borderRadius: 20,
              padding: '24px 32px',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
              overflowX: 'auto'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'Poppins,sans-serif' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 13, textTransform: 'uppercase' }}>Team ID</th>
                    <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 13, textTransform: 'uppercase' }}>Team Name</th>
                    <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 13, textTransform: 'uppercase' }}>PS ID</th>
                    <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 13, textTransform: 'uppercase' }}>Solution ID</th>
                    <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 13, textTransform: 'uppercase' }}>Score Given</th>
                    <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 13, textTransform: 'uppercase' }}>Evaluated On</th>
                  </tr>
                </thead>
                <tbody>
                  {completedEvaluations.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ padding: '32px 16px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', fontSize: 14 }}>
                        No completed evaluations yet.
                      </td>
                    </tr>
                  ) : (
                    completedEvaluations.map((sub, idx) => (
                      <tr key={sub.teamId} style={{ borderBottom: idx < completedEvaluations.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                        <td style={{ padding: '16px', color: '#138808', fontWeight: 600, fontSize: 14 }}>{sub.teamId}</td>
                        <td style={{ padding: '16px', color: '#fff', fontSize: 14, fontWeight: 500 }}>{sub.teamName}</td>
                        <td style={{ padding: '16px', color: 'rgba(255,255,255,0.8)', fontSize: 14, fontFamily: 'Courier New, monospace' }}>{sub.psId}</td>
                        <td style={{ padding: '16px', color: 'rgba(255,255,255,0.8)', fontSize: 14, fontFamily: 'Courier New, monospace' }}>{sub.solutionId}</td>
                        <td style={{ padding: '16px', color: '#FF9933', fontSize: 15, fontWeight: 700 }}>{sub.totalScore} <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>/ 50</span></td>
                        <td style={{ padding: '16px', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{sub.evaluatedAt}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Interactive Evaluation Popup Modal */}
      {selectedSubmission && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(7, 25, 44, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: 20
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: 1200,
            height: '90vh',
            background: 'linear-gradient(135deg, rgba(255, 153, 51, 0.15) 0%, rgba(19, 136, 8, 0.1) 100%)',
            border: '1.5px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 24,
            padding: 2,
            boxShadow: '0 24px 60px rgba(0,0,0,0.6)'
          }}>
            <div style={{
              background: '#07192c',
              borderRadius: 22,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              {/* Header */}
              <div style={{
                padding: '24px 32px',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.02)'
              }}>
                <div>
                  <span style={{ color: '#FF9933', fontSize: 12, fontWeight: 700, fontFamily: 'Montserrat,sans-serif', textTransform: 'uppercase', letterSpacing: 1.5 }}>Review & Evaluate</span>
                  <h2 style={{ color: '#fff', fontSize: 22, fontFamily: 'Montserrat,sans-serif', fontWeight: 900, margin: '4px 0 0' }}>
                    {selectedSubmission.teamName} <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>({selectedSubmission.teamId})</span>
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    color: '#fff',
                    fontSize: 16,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                >
                  ✕
                </button>
              </div>

              {/* Body (Split Screen) */}
              <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {/* Left side: Info & Embedded Presentation */}
                <div style={{
                  flex: 1.2,
                  padding: 32,
                  overflowY: 'auto',
                  borderRight: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 24
                }}>
                  {/* Metadata fields */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div>
                      <strong style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Problem Statement</strong>
                      <div style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>{selectedSubmission.psId} — {selectedSubmission.psName}</div>
                    </div>
                    <div>
                      <strong style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Solution ID</strong>
                      <div style={{ color: '#138808', fontSize: 14, fontWeight: 700, fontFamily: 'Courier New, monospace' }}>{selectedSubmission.solutionId}</div>
                    </div>
                    <div>
                      <strong style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Video Link</strong>
                      <a href={selectedSubmission.videoLink} target="_blank" rel="noopener noreferrer" style={{ color: '#FF9933', fontSize: 13.5, fontWeight: 600, textDecoration: 'underline' }}>
                        🔗 Demo Presentation Video
                      </a>
                    </div>
                    <div>
                      <strong style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Questions Answered</strong>
                      <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, lineHeight: 1.5 }}>
                        {selectedSubmission.questionsAsked}
                      </div>
                    </div>
                  </div>

                  {/* Embedded PDF/PPT Viewer */}
                  <div style={{ flex: 1, minHeight: 350, display: 'flex', flexDirection: 'column' }}>
                    <strong style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>Submitted PPT Slide Deck</strong>
                    <div style={{
                      flex: 1,
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 12,
                      overflow: 'hidden',
                      background: '#04111f',
                      position: 'relative'
                    }}>
                      <iframe 
                        src={selectedSubmission.pptUrl} 
                        width="100%" 
                        height="100%" 
                        allowFullScreen 
                        style={{ border: 'none' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right side: Point Scoring */}
                <div style={{
                  flex: 0.8,
                  padding: 32,
                  overflowY: 'auto',
                  background: 'rgba(255,255,255,0.01)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 24
                }}>
                  <h3 style={{ color: '#fff', fontSize: 16, fontFamily: 'Montserrat,sans-serif', fontWeight: 800, margin: 0 }}>
                    Award Points (Max 10 per category)
                  </h3>

                  {/* 5 Scoring points */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {[
                      { key: 'alignment', label: 'Problem-Solution Alignment', desc: 'Alignment with ministry statements' },
                      { key: 'innovation', label: 'Innovation & Uniqueness', desc: 'UVP & originality' },
                      { key: 'feasibility', label: 'Technical Feasibility', desc: 'Architecture & tech stack suitability' },
                      { key: 'scalability', label: 'Scalability & Practicality', desc: 'Pan-India viability' },
                      { key: 'compliance', label: 'Template & Format Compliance', desc: '6-slide deck limit & rules' }
                    ].map((item) => (
                      <div key={item.key} style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: 12,
                        padding: '14px 18px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: '#fff', fontSize: 13.5, fontWeight: 600 }}>{item.label}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <input
                              type="number"
                              min="0"
                              max="10"
                              value={evalScores[item.key]}
                              onChange={(e) => handleScoreChange(item.key, e.target.value)}
                              style={{
                                width: 56,
                                padding: '6px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: 6,
                                color: '#FF9933',
                                fontWeight: 700,
                                textAlign: 'center',
                                outline: 'none'
                              }}
                            />
                            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>/ 10</span>
                          </div>
                        </div>
                        <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>{item.desc}</span>
                      </div>
                    ))}
                  </div>

                  {/* Comment Box */}
                  <div>
                    <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Evaluator Comments</label>
                    <textarea
                      placeholder="Enter detailed feedback or suggestions here..."
                      value={evalScores.comments}
                      onChange={(e) => handleScoreChange('comments', e.target.value)}
                      rows="3"
                      style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: 10,
                        padding: 12,
                        color: '#fff',
                        fontSize: 13,
                        fontFamily: 'Poppins,sans-serif',
                        outline: 'none',
                        resize: 'none'
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={submitEvaluation}
                    style={{
                      marginTop: 'auto',
                      padding: '14px',
                      background: 'linear-gradient(135deg, #138808, #0e6605)',
                      color: '#fff',
                      borderRadius: 10,
                      border: 'none',
                      fontFamily: 'Montserrat,sans-serif',
                      fontWeight: 800,
                      fontSize: 13,
                      cursor: 'pointer',
                      boxShadow: '0 8px 24px rgba(19,136,8,0.3)',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                  >
                    Submit Evaluation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
