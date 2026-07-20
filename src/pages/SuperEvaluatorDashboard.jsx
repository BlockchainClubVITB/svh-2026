import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

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

export default function SuperEvaluatorDashboard() {
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState('teams');
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);
  const [evaluators, setEvaluators] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [loading, setLoading] = useState(true);

  const [showAddEval, setShowAddEval] = useState(false);
  const [newEval, setNewEval] = useState({ name: '', email: '', password: '' });

  const [selectedEvalId, setSelectedEvalId] = useState(null);

  useEffect(() => {
    const sessionStr = localStorage.getItem('super_eval_session');
    if (!sessionStr) {
      navigate('/login');
      return;
    }
    setSession(JSON.parse(sessionStr));
  }, [navigate]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [teamsRes, evaluatorsRes, assignmentsRes] = await Promise.all([
          supabase.from('teams').select('*'),
          supabase.from('evaluators').select('*'),
          supabase.from('evaluator_assignments').select('*'),
        ]);

        if (teamsRes.error) throw teamsRes.error;
        if (evaluatorsRes.error) throw evaluatorsRes.error;
        if (assignmentsRes.error) throw assignmentsRes.error;

        setTeams(teamsRes.data || []);
        setEvaluators(evaluatorsRes.data || []);

        const assignMap = {};
        (assignmentsRes.data || []).forEach(a => {
          if (!assignMap[a.evaluator_id]) assignMap[a.evaluator_id] = [];
          assignMap[a.evaluator_id].push(a.team_id);
        });
        setAssignments(assignMap);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('super_eval_session');
    navigate('/login');
  };

  const addEvaluator = () => {
    if (!newEval.name || !newEval.email || !newEval.password) return;
    const id = `E-${String(evaluators.length + 1).padStart(3, '0')}`;
    setEvaluators(prev => [...prev, { id, ...newEval }]);
    setAssignments(prev => ({ ...prev, [id]: [] }));
    setNewEval({ name: '', email: '', password: '' });
    setShowAddEval(false);
  };

  const deleteEvaluator = (id) => {
    setEvaluators(prev => prev.filter(e => e.id !== id));
    const newAssign = { ...assignments };
    delete newAssign[id];
    setAssignments(newAssign);
    if (selectedEvalId === id) setSelectedEvalId(null);
  };

  const toggleTeamAssignment = (evalId, teamId) => {
    setAssignments(prev => {
      const current = prev[evalId] || [];
      const updated = current.includes(teamId)
        ? current.filter(t => t !== teamId)
        : [...current, teamId];
      return { ...prev, [evalId]: updated };
    });
  };

  const getEvalTeamCount = (evalId) => (assignments[evalId] || []).length;
  const getTeamName = (teamId) => teams.find(t => t.id === teamId)?.team_name || teamId;

  const leaderboard = useMemo(() => {
    return teams
      .map((team, idx) => {
        const total = ((idx * 7 + 13) % 23) + 3;
        const evalCount = ((idx * 3 + 5) % 5) + 1;
        return { ...team, totalScore: total, evaluations: evalCount };
      })
      .sort((a, b) => b.totalScore - a.totalScore);
  }, [teams]);

  const selectedTeams = selectedEvalId ? assignments[selectedEvalId] || [] : [];

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
        {session && (
          <div style={{
            background: 'rgba(255, 153, 51, 0.05)',
            border: '1px solid rgba(255, 153, 51, 0.2)',
            borderRadius: 16,
            padding: 20,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🛡️</div>
            <h3 style={{ color: '#fff', margin: '0 0 4px', fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 16 }}>
              {session.name}
            </h3>
            <span style={{
              display: 'inline-block',
              background: 'rgba(255, 153, 51, 0.15)',
              color: '#FF9933',
              padding: '2px 10px',
              borderRadius: 20,
              fontSize: 10,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 1,
              fontFamily: 'Montserrat,sans-serif',
              marginBottom: 10
            }}>{session.role}</span>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, margin: 0, fontFamily: 'Poppins,sans-serif' }}>
              {session.email}
            </p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={() => setActiveTab('teams')}
            style={{
              padding: '14px 18px',
              background: activeTab === 'teams' ? 'rgba(255,153,51,0.15)' : 'transparent',
              color: activeTab === 'teams' ? '#FF9933' : '#fff',
              border: activeTab === 'teams' ? '1px solid rgba(255,153,51,0.3)' : '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              cursor: 'pointer',
              fontWeight: 600,
              fontFamily: 'Poppins,sans-serif',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              transition: 'all 0.2s'
            }}
          >
            <span>👥</span> Teams
          </button>
          <button
            onClick={() => setActiveTab('evaluators')}
            style={{
              padding: '14px 18px',
              background: activeTab === 'evaluators' ? 'rgba(19,136,8,0.15)' : 'transparent',
              color: activeTab === 'evaluators' ? '#138808' : '#fff',
              border: activeTab === 'evaluators' ? '1px solid rgba(19,136,8,0.3)' : '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              cursor: 'pointer',
              fontWeight: 600,
              fontFamily: 'Poppins,sans-serif',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              transition: 'all 0.2s'
            }}
          >
            <span>👨🏫</span> Evaluators
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            style={{
              padding: '14px 18px',
              background: activeTab === 'assignments' ? 'rgba(255,153,51,0.15)' : 'transparent',
              color: activeTab === 'assignments' ? '#FF9933' : '#fff',
              border: activeTab === 'assignments' ? '1px solid rgba(255,153,51,0.3)' : '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              cursor: 'pointer',
              fontWeight: 600,
              fontFamily: 'Poppins,sans-serif',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              transition: 'all 0.2s'
            }}
          >
            <span>📋</span> Assignments
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            style={{
              padding: '14px 18px',
              background: activeTab === 'leaderboard' ? 'rgba(255,215,0,0.15)' : 'transparent',
              color: activeTab === 'leaderboard' ? '#FFD700' : '#fff',
              border: activeTab === 'leaderboard' ? '1px solid rgba(255,215,0,0.3)' : '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              cursor: 'pointer',
              fontWeight: 600,
              fontFamily: 'Poppins,sans-serif',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              transition: 'all 0.2s'
            }}
          >
            <span>🏆</span> Leaderboard
          </button>
        </div>

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

      {/* Main Content */}
      <main style={{
        flex: 1,
        padding: '40px 48px',
        zIndex: 10,
        overflowY: 'auto',
        boxSizing: 'border-box'
      }}>
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, fontFamily: 'Poppins,sans-serif' }}>Loading data...</p>
          </div>
        )}
        {!loading && <>
        {/* ─── TEAMS TAB ─── */}
        {activeTab === 'teams' && (
          <div>
            <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 900, color: '#fff', fontSize: 32, marginBottom: 28, letterSpacing: -0.5 }}>
              All Teams ({teams.length})
            </h1>
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 153, 51, 0.15)',
              borderRadius: 20,
              padding: '24px',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 16px 40px rgba(0,0,0,0.3)'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'Poppins,sans-serif' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 14 }}>Team ID</th>
                    <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 14 }}>Team Name</th>
                    <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 14 }}>College</th>
                    <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 14 }}>Email</th>
                    <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 14 }}>Leader</th>
                    <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 14 }}>Members</th>
                  </tr>
                </thead>
                <tbody>
                    {teams.map((team, idx) => (
                    <tr key={team.id} style={{ borderBottom: idx < teams.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                      <td style={{ padding: '14px 16px', color: '#FF9933', fontWeight: 600, fontSize: 14 }}>{team.id?.slice(0, 8)}</td>
                      <td style={{ padding: '14px 16px', color: '#fff', fontSize: 14, fontWeight: 500 }}>{team.team_name}</td>
                      <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{team.college_name}</td>
                      <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>{team.email}</td>
                      <td style={{ padding: '14px 16px', color: '#fff', fontSize: 14 }}>{team.team_leader || '-'}</td>
                      <td style={{ padding: '14px 16px', color: '#fff', fontSize: 14 }}>{team.member_count || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── EVALUATORS TAB ─── */}
        {activeTab === 'evaluators' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 900, color: '#fff', fontSize: 32, margin: 0, letterSpacing: -0.5 }}>
                Evaluators ({evaluators.length})
              </h1>
              <button
                onClick={() => setShowAddEval(!showAddEval)}
                style={{
                  padding: '12px 24px',
                  background: showAddEval ? 'rgba(255,107,107,0.15)' : 'linear-gradient(135deg, #138808, #0e6605)',
                  color: '#fff',
                  border: showAddEval ? '1px solid rgba(255,107,107,0.3)' : 'none',
                  borderRadius: 10,
                  fontWeight: 700,
                  fontFamily: 'Montserrat,sans-serif',
                  cursor: 'pointer',
                  fontSize: 13,
                  transition: 'all 0.2s'
                }}
              >
                {showAddEval ? 'Cancel' : '+ Add Evaluator'}
              </button>
            </div>

            {showAddEval && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(19, 136, 8, 0.25)',
                borderRadius: 16,
                padding: '24px',
                marginBottom: 28,
                backdropFilter: 'blur(16px)',
                display: 'flex',
                gap: 16,
                alignItems: 'flex-end',
                flexWrap: 'wrap'
              }}>
                <div style={{ flex: '1 1 200px' }}>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 6, fontFamily: 'Poppins,sans-serif' }}>Name</label>
                  <input value={newEval.name} onChange={e => setNewEval(p => ({ ...p, name: e.target.value }))}
                    placeholder="Evaluator name"
                    style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 13, fontFamily: 'Poppins,sans-serif', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ flex: '1 1 200px' }}>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 6, fontFamily: 'Poppins,sans-serif' }}>Email</label>
                  <input value={newEval.email} onChange={e => setNewEval(p => ({ ...p, email: e.target.value }))}
                    placeholder="eval@example.com"
                    style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 13, fontFamily: 'Poppins,sans-serif', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ flex: '1 1 160px' }}>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 6, fontFamily: 'Poppins,sans-serif' }}>Password</label>
                  <input value={newEval.password} onChange={e => setNewEval(p => ({ ...p, password: e.target.value }))}
                    type="password" placeholder="••••••"
                    style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 13, fontFamily: 'Poppins,sans-serif', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <button onClick={addEvaluator}
                  style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #138808, #0e6605)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontFamily: 'Montserrat,sans-serif', cursor: 'pointer', fontSize: 13, height: 38 }}
                >
                  Create
                </button>
              </div>
            )}

            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 153, 51, 0.15)',
              borderRadius: 20,
              padding: '24px',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 16px 40px rgba(0,0,0,0.3)'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'Poppins,sans-serif' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 14 }}>ID</th>
                    <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 14 }}>Name</th>
                    <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 14 }}>Email</th>
                    <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 14 }}>Assigned Teams</th>
                    <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 14 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {evaluators.map((evalr, idx) => (
                    <tr key={evalr.id} style={{ borderBottom: idx < evaluators.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                      <td style={{ padding: '14px 16px', color: '#138808', fontWeight: 600, fontSize: 14 }}>{evalr.id}</td>
                      <td style={{ padding: '14px 16px', color: '#fff', fontSize: 14, fontWeight: 500 }}>{evalr.name}</td>
                      <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>{evalr.email}</td>
                      <td style={{ padding: '14px 16px', color: '#FF9933', fontSize: 14, fontWeight: 700 }}>{getEvalTeamCount(evalr.id)}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <button onClick={() => deleteEvaluator(evalr.id)}
                          style={{ padding: '6px 14px', background: 'rgba(255,107,107,0.15)', color: '#ff6b6b', border: '1px solid rgba(255,107,107,0.2)', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontFamily: 'Poppins,sans-serif', fontSize: 12 }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── ASSIGNMENTS TAB ─── */}
        {activeTab === 'assignments' && (
          <div>
            <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 900, color: '#fff', fontSize: 32, marginBottom: 28, letterSpacing: -0.5 }}>
              Team Assignments
            </h1>

            {/* Evaluator Selector */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 153, 51, 0.15)',
              borderRadius: 20,
              padding: '24px',
              marginBottom: 28,
              backdropFilter: 'blur(16px)',
              boxShadow: '0 16px 40px rgba(0,0,0,0.3)'
            }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 8, fontFamily: 'Poppins,sans-serif' }}>
                Select Evaluator
              </label>
              <select
                value={selectedEvalId || ''}
                onChange={e => setSelectedEvalId(e.target.value || null)}
                style={{
                  width: '100%', maxWidth: 400, padding: '12px',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, color: '#fff', fontSize: 14, fontFamily: 'Poppins,sans-serif', outline: 'none'
                }}
              >
                <option value="" style={{ background: '#0f2942', color: 'rgba(255,255,255,0.5)' }}>— Choose an evaluator —</option>
                {evaluators.map(e => (
                  <option key={e.id} value={e.id} style={{ background: '#0f2942', color: '#fff' }}>
                    {e.name} ({e.email})
                  </option>
                ))}
              </select>
            </div>

            {selectedEvalId && (
              <>
                {/* Currently Assigned */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(19, 136, 8, 0.2)',
                  borderRadius: 20,
                  padding: '24px',
                  marginBottom: 28,
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 16px 40px rgba(0,0,0,0.3)'
                }}>
                  <h2 style={{ color: '#138808', fontSize: 18, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, margin: '0 0 16px' }}>
                    Currently Assigned ({selectedTeams.length} teams)
                  </h2>
                  {selectedTeams.length === 0 ? (
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, fontFamily: 'Poppins,sans-serif', margin: 0 }}>
                      No teams assigned yet.
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                      {selectedTeams.map(teamId => (
                        <div key={teamId} style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          background: 'rgba(19, 136, 8, 0.1)', border: '1px solid rgba(19, 136, 8, 0.2)',
                          borderRadius: 8, padding: '8px 12px'
                        }}>
                          <span style={{ color: '#fff', fontSize: 13, fontFamily: 'Poppins,sans-serif' }}>
                            {getTeamName(teamId)} ({teamId})
                          </span>
                          <button onClick={() => toggleTeamAssignment(selectedEvalId, teamId)}
                            style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: 16, padding: 0, lineHeight: 1 }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* All Teams Checkboxes */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 153, 51, 0.15)',
                  borderRadius: 20,
                  padding: '24px',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 16px 40px rgba(0,0,0,0.3)'
                }}>
                  <h2 style={{ color: '#FF9933', fontSize: 18, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, margin: '0 0 16px' }}>
                    All Teams — Assign/Unassign
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 8 }}>
                    {teams.map(team => {
                      const isAssigned = selectedTeams.includes(team.id);
                      return (
                        <label key={team.id} style={{
                          display: 'flex', alignItems: 'center', gap: 12,
                          padding: '10px 14px',
                          background: isAssigned ? 'rgba(255, 153, 51, 0.08)' : 'rgba(255,255,255,0.02)',
                          border: isAssigned ? '1px solid rgba(255,153,51,0.2)' : '1px solid rgba(255,255,255,0.05)',
                          borderRadius: 8, cursor: 'pointer', transition: 'all 0.15s'
                        }}>
                          <input type="checkbox" checked={isAssigned}
                            onChange={() => toggleTeamAssignment(selectedEvalId, team.id)}
                            style={{ accentColor: '#FF9933', width: 18, height: 18, cursor: 'pointer' }}
                          />
                          <div>
                            <span style={{ color: '#fff', fontSize: 14, fontFamily: 'Poppins,sans-serif', fontWeight: 500 }}>{team.team_name}</span>
                            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'Poppins,sans-serif', marginLeft: 8 }}>{team.id}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {!selectedEvalId && (
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, fontFamily: 'Poppins,sans-serif', textAlign: 'center', padding: 40 }}>
                Select an evaluator above to manage their team assignments.
              </p>
            )}
          </div>
        )}

        {/* ─── LEADERBOARD TAB ─── */}
        {activeTab === 'leaderboard' && (
          <div>
            <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 900, color: '#fff', fontSize: 32, marginBottom: 28, letterSpacing: -0.5 }}>
              🏆 Leaderboard
            </h1>
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 215, 0, 0.2)',
              borderRadius: 20,
              padding: '24px',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 16px 40px rgba(0,0,0,0.3)'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'Poppins,sans-serif' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 14 }}>Rank</th>
                    <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 14 }}>Team Name</th>
                    <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 14 }}>College</th>
                    <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 14 }}>Total Score</th>
                    <th style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 14 }}>Evaluations</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((team, idx) => {
                    const rank = idx + 1;
                    const isTop3 = rank <= 3;
                    const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;
                    return (
                      <tr key={team.id} style={{
                        borderBottom: idx < leaderboard.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                        background: isTop3 ? 'rgba(255, 215, 0, 0.03)' : 'transparent'
                      }}>
                        <td style={{
                          padding: '14px 16px',
                          color: isTop3 ? '#FFD700' : 'rgba(255,255,255,0.6)',
                          fontWeight: 800,
                          fontSize: 18
                        }}>
                          {medal || rank}
                        </td>
                        <td style={{ padding: '14px 16px', color: '#fff', fontSize: 14, fontWeight: 500 }}>{team.team_name}</td>
                        <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{team.college_name}</td>
                        <td style={{ padding: '14px 16px', color: '#FFD700', fontSize: 16, fontWeight: 700 }}>
                          {team.totalScore} <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 400 }}>/ 25</span>
                        </td>
                        <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>{team.evaluations}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, fontFamily: 'Poppins,sans-serif', textAlign: 'center', marginTop: 20 }}>
              Scores are mock data until evaluation system is connected.
            </p>
          </div>
        )}
        </>}
      </main>
    </section>
  );
}
