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
      color: i % 3 === 0 ? 'rgba(255,153,51,0.45)' : i % 3 === 1 ? 'rgba(19,136,8,0.35)' : 'rgba(255,255,255,0.2)',
    })), [count]);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      {particles.map(p => (
        <div key={p.id} style={{ position: 'absolute', bottom: '-8px', left: p.left, width: p.size, height: p.size, borderRadius: '50%', background: p.color, animation: `particle-drift ${p.duration}s linear ${p.delay}s infinite`, willChange: 'transform' }} />
      ))}
    </div>
  );
}

export default function Login() {
  const [m, setM] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('team_leader');
  const [toastMessage, setToastMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { const t = setTimeout(() => setM(true), 80); return () => clearTimeout(t); }, []);

  const showToast = (text, type = 'error') => setToastMessage({ text, type });

  const a = (delay, extra = {}) => ({
    opacity: m ? 1 : 0,
    transform: m ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
    ...extra,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToastMessage(null);
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    if (!cleanEmail || !cleanPassword) { showToast('Please enter both Email and Password.', 'error'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Invalid credentials. Please verify your email and password.');
      }

      const { user } = result;
      if (user.role === 'super_admin' || user.role === 'admin') {
        localStorage.setItem('super_eval_session', JSON.stringify({ id: user.id, email: user.email, name: user.name, role: 'super_admin' }));
        showToast('Admin Login Successful. Redirecting...', 'success');
        setTimeout(() => navigate('/super-admin-dashboard'), 500);
        return;
      } else if (user.role === 'Evaluator' || user.role === 'evaluator') {
        localStorage.setItem('evaluator_session', JSON.stringify({ id: user.id, email: user.email, name: user.name, role: 'Evaluator' }));
        showToast('Evaluator Login Successful. Redirecting...', 'success');
        setTimeout(() => navigate('/evaluator-dashboard'), 500);
        return;
      } else if (user.role === 'team_leader' || user.role === 'leader') {
        localStorage.setItem('leader_session', JSON.stringify({ leaderName: user.leaderName || 'Team Leader', teamName: user.teamName || 'Your Team', teamId: user.teamId, email: user.email }));
        showToast('Login Successful. Redirecting to Portal...', 'success');
        setTimeout(() => navigate('/leader-dashboard'), 500);
        return;
      }

      throw new Error('Unrecognized user role.');
    } catch (err) {
      showToast(err.message || 'Authentication failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{
      position: 'relative', minHeight: 'calc(100vh - 60px)',
      background: 'linear-gradient(160deg, #07192c 0%, #0f2942 45%, #07192c 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', padding: '60px 20px', fontFamily: 'Poppins, sans-serif'
    }}>
      <FloatingParticles count={22} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', zIndex: 0 }}>
        <AshokaChakra size={640} opacity={0.045} spin />
      </div>
      <div style={{ position: 'absolute', top: '20%', left: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(255,153,51,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(19,136,8,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 420 }}>
        <div style={{ ...a(200), background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,153,51,0.15)', borderRadius: 24, padding: '38px 30px', backdropFilter: 'blur(16px)', boxShadow: '0 24px 64px rgba(0,0,0,0.4)', textAlign: 'center' }}>
          <div style={{ fontSize: 38, marginBottom: 10 }}>🔒</div>
          <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 900, color: '#fff', fontSize: 24, margin: '0 0 4px', letterSpacing: -0.5 }}>
            Login Portal
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12, marginBottom: 24, fontFamily: 'Poppins,sans-serif' }}>
            SVH 2026 — Team Leaders, Evaluators & Admins
          </p>

          {toastMessage && (
            <div style={{ background: toastMessage.type === 'success' ? 'rgba(74,222,128,0.12)' : 'rgba(255,107,107,0.12)', border: toastMessage.type === 'success' ? '1px solid rgba(74,222,128,0.35)' : '1px solid rgba(255,107,107,0.35)', color: toastMessage.type === 'success' ? '#4ade80' : '#ff6b6b', padding: '10px 14px', borderRadius: 8, fontSize: 12.5, marginBottom: 18, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>{toastMessage.type === 'success' ? '✅' : '⚠️'}</span>
              <span>{toastMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.65)', fontSize: 11, marginBottom: 5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, fontFamily: 'Montserrat,sans-serif' }}>Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: '11px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none' }}>
                <option value="team_leader" style={{ background: '#0f2942', color: '#fff' }}>Team Leader</option>
                <option value="evaluator" style={{ background: '#0f2942', color: '#fff' }}>Evaluator</option>
                <option value="super_admin" style={{ background: '#0f2942', color: '#fff' }}>Super Admin</option>
              </select>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.65)', fontSize: 11, marginBottom: 5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, fontFamily: 'Montserrat,sans-serif' }}>Email Address</label>
              <input type="email" required autoComplete="username" placeholder="Enter registered email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '11px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 13, boxSizing: 'border-box', outline: 'none' }} />
            </div>

            <div style={{ marginBottom: 22 }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.65)', fontSize: 11, marginBottom: 5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, fontFamily: 'Montserrat,sans-serif' }}>Password</label>
              <input type="password" required autoComplete="current-password" placeholder="Enter account password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '11px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 13, boxSizing: 'border-box', outline: 'none' }} />
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg, #FF9933, #e07800)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 6px 20px rgba(255,153,51,0.3)', transition: 'all 0.2s' }}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11.5, lineHeight: 1.65, margin: '0 0 10px', fontFamily: 'Poppins,sans-serif' }}>
              Don't have login credentials? Contact the tech team on WhatsApp to get your Team Email & Password.
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="https://wa.me/919332404107" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.25)', borderRadius: 20, color: '#25D366', fontSize: 11, textDecoration: 'none', fontWeight: 600, fontFamily: 'Poppins,sans-serif' }}>
                💬 Soumya - 9332404107

              </a>
              <a href="https://wa.me/919511454951" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.25)', borderRadius: 20, color: '#25D366', fontSize: 11, textDecoration: 'none', fontWeight: 600, fontFamily: 'Poppins,sans-serif' }}>
                💬 Abhilash - 9511454951
              </a>
            </div>
          </div>
        </div>

        <div style={{ ...a(300), display: 'flex', justifyContent: 'center', marginTop: 28 }}>
          <div style={{ height: 3, width: 40, background: '#FF9933', borderRadius: 2 }} />
          <div style={{ height: 3, width: 20, background: '#fff', borderRadius: 2, margin: '0 6px' }} />
          <div style={{ height: 3, width: 40, background: '#138808', borderRadius: 2 }} />
        </div>
      </div>
    </section>
  );
}
