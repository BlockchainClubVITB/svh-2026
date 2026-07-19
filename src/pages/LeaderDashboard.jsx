import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { STATEMENTS } from '../data/problemStatements';

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

export default function LeaderDashboard() {
  const [teamInfo, setTeamInfo] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('teamDetails');

  // Submission form state
  const [submissionStatus, setSubmissionStatus] = useState('loading'); // 'loading', 'none', 'submitted'
  const [submissionData, setSubmissionData] = useState(null);
  const [problemCode, setProblemCode] = useState('');
  const [problemTitle, setProblemTitle] = useState('');
  const [theme, setTheme] = useState('');
  const [category, setCategory] = useState('');
  const [ideaTitle, setIdeaTitle] = useState('');
  const [uniqueIdea, setUniqueIdea] = useState('');
  const [ideaDesc, setIdeaDesc] = useState('');
  const [ytLink, setYtLink] = useState('');
  const [documentLink, setDocumentLink] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTeamData() {
      try {
        const sessionStr = localStorage.getItem('leader_session');
        if (!sessionStr) {
          navigate('/login');
          return;
        }
        const session = JSON.parse(sessionStr);
        setTeamInfo(session);

        if (session.teamId) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('team_id', session.teamId);
          
          if (error) throw error;
          setMembers(data || []);

          // Fetch submission from new submissions table
          const { data: subData, error: subErr } = await supabase
            .from('submissions')
            .select('*')
            .eq('team_id', session.teamId)
            .maybeSingle(); 
          
          if (!subErr && subData) {
            setSubmissionData(subData);
            setSubmissionStatus('submitted');
          } else {
            setSubmissionStatus('none');
          }
        }
      } catch (err) {
        console.error("Error fetching team data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTeamData();
  }, [navigate]);

  const handleProblemCodeChange = (e) => {
    const code = e.target.value;
    setProblemCode(code);
    const stmt = STATEMENTS.find(s => s.id === code);
    if (stmt) {
      setProblemTitle(stmt.title);
      setTheme(stmt.theme);
      setCategory(stmt.category);
    } else {
      setProblemTitle('');
      setTheme('');
      setCategory('');
    }
  };

  const handleProblemTitleChange = (e) => {
    const title = e.target.value;
    setProblemTitle(title);
    const stmt = STATEMENTS.find(s => s.title === title);
    if (stmt) {
      setProblemCode(stmt.id);
      setTheme(stmt.theme);
      setCategory(stmt.category);
    } else {
      setProblemCode('');
      setTheme('');
      setCategory('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!problemCode || !problemTitle || !theme || !category || !ideaTitle || !uniqueIdea || !ideaDesc) {
      setSubmitError('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        team_id: teamInfo.teamId,
        problem_code: problemCode,
        problem_statement: problemTitle,
        theme: theme,
        category: category,
        idea_title: ideaTitle,
        unique_idea: uniqueIdea,
        idea_description: ideaDesc,
        yt_link: ytLink,
        document_link: documentLink
      };
      
      const { error } = await supabase
        .from('submissions')
        .insert([payload])
        .select();

      if (error) throw error;
      
      setSubmissionData(payload); 
      setSubmissionStatus('submitted');
      setActiveTab('review');
    } catch (err) {
      console.error("Submission error:", err);
      setSubmitError(err.message || 'Error submitting your idea.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="flex flex-col md:flex-row" style={{
      position: 'relative', minHeight: '100vh',
      background: 'linear-gradient(160deg, #07192c 0%, #0f2942 45%, #07192c 100%)',
      overflowX: 'hidden'
    }}>
      <FloatingParticles count={22} />

      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', zIndex: 0 }}>
        <AshokaChakra size={640} opacity={0.035} spin />
      </div>

      {/* Sidebar */}
      <nav className="w-full md:w-[320px] h-auto md:h-screen md:sticky top-0 overflow-y-auto" style={{
        background: 'rgba(255,255,255,0.02)',
        borderRight: '1px solid rgba(255,153,51,0.15)',
        borderBottom: '1px solid rgba(255,153,51,0.15)',
        backdropFilter: 'blur(16px)',
        padding: '24px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        zIndex: 10,
        flexShrink: 0
      }}>
        {/* Team Profile Header in Sidebar */}
        <div style={{ paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ color: '#fff', fontSize: 18, fontFamily: 'Montserrat,sans-serif', fontWeight: 800, margin: '0 0 4px' }}>
            {teamInfo ? teamInfo.teamName : 'Team Dashboard'}
          </h2>
          <div style={{ color: '#FF9933', fontSize: 13, fontFamily: 'Courier New, monospace', fontWeight: 700 }}>
            {teamInfo ? teamInfo.teamId : 'Loading...'}
          </div>
        </div>

        {/* Sidebar Nav */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={() => setActiveTab('teamDetails')}
            style={{
              padding: '14px 18px',
              background: activeTab === 'teamDetails' ? 'rgba(255,153,51,0.12)' : 'transparent',
              color: activeTab === 'teamDetails' ? '#FF9933' : '#fff',
              border: activeTab === 'teamDetails' ? '1px solid rgba(255,153,51,0.25)' : '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              cursor: 'pointer',
              fontWeight: 600,
              fontFamily: 'Poppins,sans-serif',
              textAlign: 'left',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}
          >
            Team Details
          </button>
          
          <button
            onClick={() => setActiveTab('submission')}
            style={{
              padding: '14px 18px',
              background: activeTab === 'submission' ? 'rgba(255,153,51,0.12)' : 'transparent',
              color: activeTab === 'submission' ? '#FF9933' : '#fff',
              border: activeTab === 'submission' ? '1px solid rgba(255,153,51,0.25)' : '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              cursor: 'pointer',
              fontWeight: 600,
              fontFamily: 'Poppins,sans-serif',
              textAlign: 'left',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}
          >
            Submission
          </button>

          <button
            onClick={() => setActiveTab('review')}
            style={{
              padding: '14px 18px',
              background: activeTab === 'review' ? 'rgba(255,153,51,0.12)' : 'transparent',
              color: activeTab === 'review' ? '#FF9933' : '#fff',
              border: activeTab === 'review' ? '1px solid rgba(255,153,51,0.25)' : '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              cursor: 'pointer',
              fontWeight: 600,
              fontFamily: 'Poppins,sans-serif',
              textAlign: 'left',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}
          >
            Review Submissions
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
            onClick={() => { localStorage.removeItem('leader_session'); navigate('/'); }}
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
      <main className="flex-1 p-6 md:p-10 z-10 box-border overflow-y-auto h-auto md:h-screen">
        {activeTab === 'teamDetails' && (
          <div>
            <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 900, color: '#fff', fontSize: 32, marginBottom: 28, letterSpacing: -0.5 }}>
              Team Details
            </h1>

            {loading ? (
              <p style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Poppins,sans-serif' }}>Loading team data...</p>
            ) : (
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
                      <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 13, textTransform: 'uppercase' }}>Full Name</th>
                      <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 13, textTransform: 'uppercase' }}>Role</th>
                      <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 13, textTransform: 'uppercase' }}>Email ID</th>
                      <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 13, textTransform: 'uppercase' }}>Mobile Number</th>
                      <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 13, textTransform: 'uppercase' }}>Gender</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ padding: '32px 16px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', fontSize: 14 }}>
                          No team members found.
                        </td>
                      </tr>
                    ) : (
                      members.map((member, idx) => (
                        <tr key={member.id || idx} style={{ borderBottom: idx < members.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', transition: 'background 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ padding: '16px', color: '#fff', fontWeight: 500, fontSize: 14 }}>{member.full_name || 'Unnamed'}</td>
                          <td style={{ padding: '16px' }}>
                            {member.is_team_leader ? (
                              <span style={{ background: 'rgba(255,153,51,0.15)', color: '#FF9933', fontSize: 10, fontWeight: 700, fontFamily: 'Montserrat,sans-serif', padding: '4px 10px', borderRadius: 12, textTransform: 'uppercase', letterSpacing: 1, border: '1px solid rgba(255,153,51,0.3)' }}>Leader</span>
                            ) : (
                              <span style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: 700, fontFamily: 'Montserrat,sans-serif', padding: '4px 10px', borderRadius: 12, textTransform: 'uppercase', letterSpacing: 1, border: '1px solid rgba(255,255,255,0.1)' }}>Member</span>
                            )}
                          </td>
                          <td style={{ padding: '16px', color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                            {member.is_team_leader ? (member.email || '-') : (member.phone || '-')}
                          </td>
                          <td style={{ padding: '16px', color: 'rgba(255,255,255,0.7)', fontSize: 14, fontFamily: 'Courier New, monospace' }}>
                            {member.is_team_leader ? (member.phone || '-') : (member.email || '-')}
                          </td>
                          <td style={{ padding: '16px', color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>{member.gender || '-'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'submission' && (
          <div>
            <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 900, color: '#fff', fontSize: 32, marginBottom: 28, letterSpacing: -0.5 }}>
              Submission
            </h1>
            
            {submissionStatus === 'loading' ? (
              <p style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Poppins,sans-serif' }}>Loading...</p>
            ) : submissionStatus === 'submitted' ? (
              <div style={{ 
                padding: '40px 20px', 
                textAlign: 'center', 
                background: 'rgba(39, 174, 96, 0.1)', 
                borderRadius: 20, 
                border: '2px dashed rgba(39, 174, 96, 0.3)',
                backdropFilter: 'blur(16px)'
              }}>
                <div style={{ fontSize: 48, marginBottom: 20 }}>✅</div>
                <h3 style={{ margin: '0 0 12px', color: '#2ecc71', fontFamily: 'Montserrat,sans-serif', fontSize: 20, fontWeight: 700 }}>
                  Successfully Submitted
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'Poppins,sans-serif', margin: 0, fontSize: 15 }}>
                  Your team has already submitted a problem statement. You can view it in the Review tab.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ 
                display: 'flex', flexDirection: 'column', gap: 24,
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 153, 51, 0.15)',
                borderRadius: 20,
                padding: '32px',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 16px 40px rgba(0,0,0,0.3)'
              }}>
                {submitError && <div style={{ color: '#ff6b6b', background: 'rgba(255,107,107,0.1)', padding: 12, borderRadius: 8, fontFamily: 'Poppins,sans-serif', fontSize: 14 }}>{submitError}</div>}
                
                {/* Row 1: Code and Title */}
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 200px' }}>
                    <label style={{ display: 'block', fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 8 }}>Problem Code</label>
                    <select required value={problemCode} onChange={handleProblemCodeChange} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff', fontFamily: 'Poppins,sans-serif', fontSize: 14, outline: 'none' }}>
                      <option value="" style={{ color: '#000' }}>Select Code</option>
                      {STATEMENTS.map(s => <option key={s.id} value={s.id} style={{ color: '#000' }}>{s.id}</option>)}
                    </select>
                  </div>
                  
                  <div style={{ flex: '2 1 300px' }}>
                    <label style={{ display: 'block', fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 8 }}>Problem Statement</label>
                    <select required value={problemTitle} onChange={handleProblemTitleChange} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff', fontFamily: 'Poppins,sans-serif', fontSize: 14, outline: 'none' }}>
                      <option value="" style={{ color: '#000' }}>Select Statement</option>
                      {STATEMENTS.map(s => <option key={s.id} value={s.title} style={{ color: '#000' }}>{s.title}</option>)}
                    </select>
                  </div>
                </div>

                {/* Row 2: Theme and Category (Auto-filled) */}
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 200px' }}>
                    <label style={{ display: 'block', fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 8 }}>Theme</label>
                    <input type="text" readOnly value={theme} placeholder="Auto-filled" style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', fontFamily: 'Poppins,sans-serif', fontSize: 14, outline: 'none', cursor: 'not-allowed', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ flex: '1 1 200px' }}>
                    <label style={{ display: 'block', fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 8 }}>Category</label>
                    <input type="text" readOnly value={category} placeholder="Auto-filled" style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', fontFamily: 'Poppins,sans-serif', fontSize: 14, outline: 'none', cursor: 'not-allowed', boxSizing: 'border-box' }} />
                  </div>
                </div>

                {/* Row 3: Idea Title */}
                <div>
                  <label style={{ display: 'block', fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 8 }}>Idea Title</label>
                  <input required type="text" value={ideaTitle} onChange={e => setIdeaTitle(e.target.value)} placeholder="Give your idea a catchy title..." style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff', fontFamily: 'Poppins,sans-serif', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                </div>

                {/* Row 4: Links */}
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 200px' }}>
                    <label style={{ display: 'block', fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 8 }}>YouTube Video Link (Optional)</label>
                    <input type="url" value={ytLink} onChange={e => setYtLink(e.target.value)} placeholder="https://youtube.com/..." style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff', fontFamily: 'Poppins,sans-serif', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ flex: '1 1 200px' }}>
                    <label style={{ display: 'block', fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 8 }}>Document Drive Link (Optional)</label>
                    <input type="url" value={documentLink} onChange={e => setDocumentLink(e.target.value)} placeholder="https://drive.google.com/..." style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff', fontFamily: 'Poppins,sans-serif', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                </div>

                {/* Row 5: Text areas */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <label style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 14, color: '#fff' }}>How your idea is unique</label>
                    <span style={{ fontSize: 12, fontFamily: 'Poppins,sans-serif', color: uniqueIdea.length > 1000 ? '#ff6b6b' : 'rgba(255,255,255,0.5)' }}>{uniqueIdea.length} / 1000</span>
                  </div>
                  <textarea required maxLength={1000} value={uniqueIdea} onChange={e => setUniqueIdea(e.target.value)} style={{ width: '100%', minHeight: 120, padding: '12px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff', fontFamily: 'Poppins,sans-serif', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} placeholder="Explain what makes your approach different..." />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <label style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 14, color: '#fff' }}>Idea Description</label>
                    <span style={{ fontSize: 12, fontFamily: 'Poppins,sans-serif', color: ideaDesc.length > 2000 ? '#ff6b6b' : 'rgba(255,255,255,0.5)' }}>{ideaDesc.length} / 2000</span>
                  </div>
                  <textarea required maxLength={2000} value={ideaDesc} onChange={e => setIdeaDesc(e.target.value)} style={{ width: '100%', minHeight: 180, padding: '12px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff', fontFamily: 'Poppins,sans-serif', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} placeholder="Provide a detailed description of your idea and implementation plan..." />
                </div>

                <button disabled={submitting} type="submit" style={{ background: 'linear-gradient(135deg, #FF9933, #e07800)', color: '#fff', padding: '14px 32px', borderRadius: 30, border: 'none', fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 16, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1, alignSelf: 'flex-start', boxShadow: '0 8px 24px rgba(255,153,51,0.4)', transition: 'all 0.3s ease' }}>
                  {submitting ? 'Submitting...' : 'Submit Idea'}
                </button>
              </form>
            )}
          </div>
        )}

        {activeTab === 'review' && (
          <div>
            <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 900, color: '#fff', fontSize: 32, marginBottom: 28, letterSpacing: -0.5 }}>
              Review Submissions
            </h1>

            {submissionStatus === 'loading' ? (
               <p style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Poppins,sans-serif' }}>Loading...</p>
            ) : submissionStatus === 'submitted' && submissionData ? (
               <div style={{ 
                 background: 'rgba(255, 255, 255, 0.03)', 
                 border: '1px solid rgba(255, 153, 51, 0.15)',
                 padding: 32, 
                 borderRadius: 20, 
                 backdropFilter: 'blur(16px)',
                 boxShadow: '0 16px 40px rgba(0,0,0,0.3)'
               }}>
                 <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
                   <div style={{ background: 'rgba(255,153,51,0.2)', color: '#FF9933', padding: '6px 12px', borderRadius: 6, fontFamily: 'Montserrat,sans-serif', fontWeight: 800, fontSize: 14, border: '1px solid rgba(255,153,51,0.3)' }}>
                     {submissionData.problem_code}
                   </div>
                   <h3 style={{ margin: 0, color: '#fff', fontFamily: 'Montserrat,sans-serif', fontSize: 18, fontWeight: 700 }}>
                     {submissionData.problem_statement}
                   </h3>
                 </div>

                 {/* Tags */}
                 <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
                   <span style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontFamily: 'Poppins,sans-serif', border: '1px solid rgba(255,255,255,0.1)' }}>
                     <strong>Theme:</strong> {submissionData.theme}
                   </span>
                   <span style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontFamily: 'Poppins,sans-serif', border: '1px solid rgba(255,255,255,0.1)' }}>
                     <strong>Category:</strong> {submissionData.category}
                   </span>
                 </div>
                 
                 <div style={{ marginBottom: 24 }}>
                   <h4 style={{ color: '#FF9933', fontFamily: 'Montserrat,sans-serif', fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Idea Title</h4>
                   <p style={{ color: '#fff', fontFamily: 'Montserrat,sans-serif', fontSize: 22, fontWeight: 800, margin: 0 }}>
                     {submissionData.idea_title}
                   </p>
                 </div>
                 
                 <div style={{ marginBottom: 24 }}>
                   <h4 style={{ color: '#FF9933', fontFamily: 'Montserrat,sans-serif', fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Unique Idea</h4>
                   <p style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'Poppins,sans-serif', fontSize: 15, lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap', background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                     {submissionData.unique_idea}
                   </p>
                 </div>
                 
                 <div style={{ marginBottom: 24 }}>
                   <h4 style={{ color: '#FF9933', fontFamily: 'Montserrat,sans-serif', fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Idea Description</h4>
                   <p style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'Poppins,sans-serif', fontSize: 15, lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap', background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                     {submissionData.idea_description}
                   </p>
                 </div>

                 {/* Links Section */}
                 {(submissionData.yt_link || submissionData.document_link) && (
                   <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                     {submissionData.yt_link && (
                       <a href={submissionData.yt_link} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fff', textDecoration: 'none', background: 'rgba(231, 76, 60, 0.15)', padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(231, 76, 60, 0.3)', fontFamily: 'Poppins,sans-serif', fontSize: 14, fontWeight: 600, transition: 'all 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(231, 76, 60, 0.25)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(231, 76, 60, 0.15)'}>
                         📺 YouTube Video
                       </a>
                     )}
                     {submissionData.document_link && (
                       <a href={submissionData.document_link} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fff', textDecoration: 'none', background: 'rgba(52, 152, 219, 0.15)', padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(52, 152, 219, 0.3)', fontFamily: 'Poppins,sans-serif', fontSize: 14, fontWeight: 600, transition: 'all 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(52, 152, 219, 0.25)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(52, 152, 219, 0.15)'}>
                         📄 Drive Document
                       </a>
                     )}
                   </div>
                 )}
               </div>
            ) : (
              <div style={{ 
                padding: '60px 20px', 
                textAlign: 'center', 
                background: 'rgba(255,255,255,0.02)', 
                borderRadius: 20, 
                border: '2px dashed rgba(255,153,51,0.25)',
                backdropFilter: 'blur(16px)'
              }}>
                <div style={{ fontSize: 48, marginBottom: 20 }}>⏳</div>
                <h3 style={{ margin: '0 0 12px', color: '#fff', fontFamily: 'Montserrat,sans-serif', fontSize: 20, fontWeight: 700 }}>
                  No Submission Found
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Poppins,sans-serif', margin: 0, fontSize: 15, maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}>
                  You have not submitted any problem statement yet. Please go to the Submission tab to submit your idea.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </section>
  );
}
