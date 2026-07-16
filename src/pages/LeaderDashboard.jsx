import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

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
  const [m, setM] = useState(false);
  const [teamInfo, setTeamInfo] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { const t = setTimeout(() => setM(true), 80); return () => clearTimeout(t); }, []);

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
        }
      } catch (err) {
        console.error("Error fetching team data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTeamData();
  }, [navigate]);

  const a = (delay, extra = {}) => ({
    opacity: m ? 1 : 0,
    transform: m ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
    ...extra,
  });

  return (
    <section style={{
      position: 'relative', minHeight: 'calc(100vh - 60px)',
      background: 'linear-gradient(160deg, #ffffff 0%, #f0f4f8 45%, #ffffff 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start',
      overflow: 'hidden', padding: '100px 20px 60px',
    }}>
      <FloatingParticles count={22} />

      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', zIndex: 0 }}>
        <AshokaChakra size={640} opacity={0.045} spin />
      </div>

      <div style={{ position: 'absolute', top: '20%', left: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(255,153,51,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(19,136,8,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 1000 }}>
        <div style={{ textAlign: 'center', marginBottom: 40, ...a(100) }}>
          <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 900, color: '#06038D', fontSize: 36, margin: '0 0 12px', letterSpacing: -1 }}>
            Team Leader Dashboard
          </h1>
          {teamInfo && (
            <p style={{ color: '#0f2942', fontSize: 18, fontFamily: 'Poppins,sans-serif', margin: 0 }}>
              Team: <strong style={{ color: '#FF9933' }}>{teamInfo.teamName}</strong> | {teamInfo.collegeName}
            </p>
          )}
        </div>

        <div style={{
          ...a(200),
          background: 'rgba(255, 255, 255, 0.8)',
          border: '1px solid rgba(6, 3, 141, 0.15)',
          borderRadius: 20, padding: '40px 32px',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 16px 40px rgba(6,3,141,0.05)',
        }}>
          <h2 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, color: '#0f2942', fontSize: 24, margin: '0 0 24px', letterSpacing: 0.5, borderBottom: '1px solid rgba(6,3,141,0.1)', paddingBottom: 16 }}>
            Team Members
          </h2>

          {loading ? (
            <p style={{ color: '#0f2942', textAlign: 'center', fontFamily: 'Poppins,sans-serif' }}>Loading team data...</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
              {members.length > 0 ? members.map((member, idx) => (
                <div key={member.id || idx} style={{
                  background: '#ffffff',
                  border: '1px solid rgba(6,3,141,0.1)',
                  borderRadius: 16,
                  padding: 24,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(6,3,141,0.12)';
                  e.currentTarget.style.borderColor = 'rgba(6,3,141,0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.03)';
                  e.currentTarget.style.borderColor = 'rgba(6,3,141,0.1)';
                }}
                >
                  {member.is_team_leader && (
                    <div style={{
                      position: 'absolute', top: 0, right: 0,
                      background: 'linear-gradient(135deg, #FF9933, #e07800)',
                      color: '#fff', fontSize: 10, fontWeight: 800, fontFamily: 'Montserrat,sans-serif',
                      padding: '4px 12px', borderBottomLeftRadius: 12, textTransform: 'uppercase', letterSpacing: 1
                    }}>
                      Leader
                    </div>
                  )}
                  <h3 style={{ margin: '0 0 12px', color: '#06038D', fontSize: 20, fontFamily: 'Montserrat,sans-serif', fontWeight: 700 }}>
                    {member.full_name || 'Unnamed Member'}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, color: '#333', fontSize: 14, fontFamily: 'Poppins,sans-serif' }}>
                    {member.gender && <div><strong style={{ color: '#0f2942' }}>Gender:</strong> {member.gender}</div>}
                  </div>
                </div>
              )) : (
                <p style={{ color: '#666', fontFamily: 'Poppins,sans-serif', gridColumn: '1 / -1', textAlign: 'center' }}>
                  No team members found.
                </p>
              )}
            </div>
          )}
        </div>

        <div style={{ ...a(300), display: 'flex', justifyContent: 'center', marginTop: 40 }}>
          <button onClick={() => { localStorage.removeItem('leader_session'); navigate('/'); }} style={{
            padding: '12px 24px', background: 'transparent', color: '#ff6b6b', borderRadius: 8,
            fontSize: 13, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: 1, border: '1.5px solid rgba(255,107,107,0.3)', cursor: 'pointer', transition: 'all 0.2s'
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,107,107,0.1)'; e.currentTarget.style.borderColor = '#ff6b6b'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,107,107,0.3)'; }}
          >
            Logout
          </button>
        </div>
      </div>
    </section>
  );
}
