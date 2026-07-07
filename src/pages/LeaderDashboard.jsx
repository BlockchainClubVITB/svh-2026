import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, Building, Hash } from 'lucide-react';

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
  const navigate = useNavigate();

  useEffect(() => { const t = setTimeout(() => setM(true), 80); return () => clearTimeout(t); }, []);

  const a = (delay, extra = {}) => ({
    opacity: m ? 1 : 0,
    transform: m ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
    ...extra,
  });

  // Mock data for frontend demonstration
  const teamInfo = {
    teamName: "Innovators",
    teamLeaderName: "John Doe",
    teamId: "TM-2026-001",
    collegeName: "VIT Bhopal"
  };

  return (
    <section style={{
      position: 'relative', minHeight: 'calc(100vh - 60px)',
      background: 'linear-gradient(160deg, #07192c 0%, #0f2942 45%, #07192c 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', padding: '60px 20px',
    }}>
      <FloatingParticles count={22} />

      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', zIndex: 0 }}>
        <AshokaChakra size={640} opacity={0.045} spin />
      </div>

      <div style={{ position: 'absolute', top: '20%', left: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(255,153,51,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(19,136,8,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 800 }}>
        <div style={{ textAlign: 'center', marginBottom: 40, ...a(100) }}>
          <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 900, color: '#fff', fontSize: 36, margin: '0 0 12px', letterSpacing: -1 }}>
            Team Leader Dashboard
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, fontFamily: 'Poppins,sans-serif', margin: 0 }}>
            Welcome back, {teamInfo.teamLeaderName}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, ...a(200) }}>
          {/* Card 1: Team Name */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 153, 51, 0.2)',
            borderRadius: 20, padding: '32px',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
            position: 'relative', overflow: 'hidden'
          }}>
            <h3 style={{ color: 'rgba(255,255,255,0.6)', margin: '0 0 8px 0', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1.5, fontFamily: 'Montserrat,sans-serif' }}>Team Name</h3>
            <p style={{ color: '#fff', margin: 0, fontSize: 24, fontWeight: 700, fontFamily: 'Poppins,sans-serif' }}>{teamInfo.teamName}</p>
            <Users style={{ position: 'absolute', right: -15, bottom: -15, opacity: 0.1, color: '#FF9933' }} size={120} />
          </div>

          {/* Card 2: Team Leader Name */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(19, 136, 8, 0.2)',
            borderRadius: 20, padding: '32px',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
            position: 'relative', overflow: 'hidden'
          }}>
            <h3 style={{ color: 'rgba(255,255,255,0.6)', margin: '0 0 8px 0', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1.5, fontFamily: 'Montserrat,sans-serif' }}>Team Leader</h3>
            <p style={{ color: '#fff', margin: 0, fontSize: 24, fontWeight: 700, fontFamily: 'Poppins,sans-serif' }}>{teamInfo.teamLeaderName}</p>
            <UserPlus style={{ position: 'absolute', right: -15, bottom: -15, opacity: 0.1, color: '#138808' }} size={120} />
          </div>

          {/* Card 3: Team ID */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 20, padding: '32px',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
            position: 'relative', overflow: 'hidden'
          }}>
            <h3 style={{ color: 'rgba(255,255,255,0.6)', margin: '0 0 8px 0', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1.5, fontFamily: 'Montserrat,sans-serif' }}>Team ID</h3>
            <p style={{ color: '#fff', margin: 0, fontSize: 24, fontWeight: 700, fontFamily: 'Poppins,sans-serif' }}>{teamInfo.teamId}</p>
            <Hash style={{ position: 'absolute', right: -15, bottom: -15, opacity: 0.05, color: '#fff' }} size={120} />
          </div>

          {/* Card 4: College Name */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(0, 198, 255, 0.2)',
            borderRadius: 20, padding: '32px',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
            position: 'relative', overflow: 'hidden'
          }}>
            <h3 style={{ color: 'rgba(255,255,255,0.6)', margin: '0 0 8px 0', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1.5, fontFamily: 'Montserrat,sans-serif' }}>College Name</h3>
            <p style={{ color: '#fff', margin: 0, fontSize: 24, fontWeight: 700, fontFamily: 'Poppins,sans-serif' }}>{teamInfo.collegeName}</p>
            <Building style={{ position: 'absolute', right: -15, bottom: -15, opacity: 0.1, color: '#00c6ff' }} size={120} />
          </div>
        </div>

        <div style={{ ...a(300), display: 'flex', justifyContent: 'center', marginTop: 50 }}>
          <button onClick={() => navigate('/')} style={{
            padding: '14px 28px', background: 'transparent', color: '#fff', borderRadius: 8,
            fontSize: 13, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: 1, border: '1.5px solid rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'all 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF9933'; e.currentTarget.style.color = '#FF9933'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = '#fff'; }}
          >
            Return to Home
          </button>
        </div>
      </div>
    </section>
  );
}
