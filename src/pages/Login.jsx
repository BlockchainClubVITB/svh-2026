import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/* ═══════════════════════════════════════════════
   SHARED UTILITIES (Matching Home.jsx)
═══════════════════════════════════════════════ */

/* Ashoka Chakra SVG */
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

/* Floating Particles */
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

export default function Login() {
  const [m, setM] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('team_leader');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => { const t = setTimeout(() => setM(true), 80); return () => clearTimeout(t); }, []);

  // Stagger helper
  const a = (delay, extra = {}) => ({
    opacity: m ? 1 : 0,
    transform: m ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
    ...extra,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    // Mock login for now
    setError('');
    alert('Login successful! Welcome to SVH 2026.');
    navigate('/');
  };

  return (
    <section style={{
      position: 'relative', minHeight: 'calc(100vh - 60px)',
      background: 'linear-gradient(160deg, #07192c 0%, #0f2942 45%, #07192c 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', padding: '60px 20px',
    }}>
      {/* Animated particles */}
      <FloatingParticles count={22} />

      {/* Chakras */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', zIndex: 0 }}>
        <AshokaChakra size={640} opacity={0.045} spin />
      </div>

      {/* Ambient glows */}
      <div style={{ position: 'absolute', top: '20%', left: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(255,153,51,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(19,136,8,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* ── CONTENT ── */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 440 }}>
        <div style={{
          ...a(200),
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 153, 51, 0.15)',
          borderRadius: 24,
          padding: '40px 32px',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 900, color: '#fff', fontSize: 32, margin: '0 0 8px', letterSpacing: -1 }}>
              Welcome Back
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, fontFamily: 'Poppins,sans-serif', margin: 0 }}>
              Login to your SVH 2026 portal
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {error && (
              <div style={{ padding: '12px', background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.3)', borderRadius: 8, color: '#ff6b6b', fontSize: 13, fontFamily: 'Poppins,sans-serif', textAlign: 'center' }}>
                {error}
              </div>
            )}
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.85)', fontSize: 12, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>User Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(0,0,0,0.2)', color: '#fff', fontSize: 14, fontFamily: 'Poppins,sans-serif',
                  outline: 'none', transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#FF9933'; e.target.style.background = 'rgba(0,0,0,0.3)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(0,0,0,0.2)'; }}
              >
                <option value="team_leader" style={{ background: '#0f2942', color: '#fff' }}>Team Leader</option>
                <option value="evaluator" style={{ background: '#0f2942', color: '#fff' }}>Evaluator</option>
                <option value="superadmin" style={{ background: '#0f2942', color: '#fff' }}>Superadmin</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.85)', fontSize: 12, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="team@example.com"
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(0,0,0,0.2)', color: '#fff', fontSize: 14, fontFamily: 'Poppins,sans-serif',
                  outline: 'none', transition: 'all 0.2s'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#FF9933'; e.target.style.background = 'rgba(0,0,0,0.3)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(0,0,0,0.2)'; }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.85)', fontSize: 12, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(0,0,0,0.2)', color: '#fff', fontSize: 14, fontFamily: 'Poppins,sans-serif',
                  outline: 'none', transition: 'all 0.2s'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#FF9933'; e.target.style.background = 'rgba(0,0,0,0.3)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(0,0,0,0.2)'; }}
              />
            </div>

            <button type="submit" style={{
              marginTop: 10, padding: '16px', background: 'linear-gradient(135deg, #FF9933, #e07800)',
              color: '#fff', borderRadius: 8, fontSize: 14, fontFamily: 'Montserrat,sans-serif',
              fontWeight: 800, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: 1.5,
              border: 'none', cursor: 'pointer', boxShadow: '0 6px 24px rgba(255,153,51,0.3)', transition: 'all 0.25s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(255,153,51,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(255,153,51,0.3)'; }}
            >
              Secure Login
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontFamily: 'Poppins,sans-serif', margin: 0 }}>
              Don't have an account?{' '}
              <Link to="/guidelines" style={{ color: '#138808', fontWeight: 600, textDecoration: 'none' }}>
                Register Now
              </Link>
            </p>
          </div>
        </div>

        {/* Tricolour footer strip - fixed to the card */}
        <div style={{ ...a(300), display: 'flex', justifyContent: 'center', marginTop: 30 }}>
           <div style={{ height: 3, width: 40, background: '#FF9933', borderRadius: 2 }} />
           <div style={{ height: 3, width: 20, background: '#fff', borderRadius: 2, margin: '0 6px' }} />
           <div style={{ height: 3, width: 40, background: '#138808', borderRadius: 2 }} />
        </div>
      </div>
    </section>
  );
}
