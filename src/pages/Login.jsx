import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

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
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('team_leader');

  // New fields for team and profile
  const [teamName, setTeamName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Female');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { const t = setTimeout(() => setM(true), 80); return () => clearTimeout(t); }, []);

  // Stagger helper
  const a = (delay, extra = {}) => ({
    opacity: m ? 1 : 0,
    transform: m ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
    ...extra,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (!isLogin && !fullName)) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!isLogin && role === 'team_leader' && (!teamName || !collegeName)) {
      setError('Please provide Team Name and College Name.');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Evaluator Login Check
        if (role === 'evaluator') {
          if (email === 'evaluator@demoogmail.com' && password === 'demoevaluator850') {
            localStorage.setItem('evaluator_session', JSON.stringify({
              email: 'evaluator@demoogmail.com',
              name: 'Dr. Rajesh Kumar (Demo Evaluator)',
              role: 'Evaluator'
            }));
            alert('Evaluator Login successful!');
            navigate('/evaluator-dashboard');
            return;
          } else {
            setError('Invalid Evaluator credentials.');
            setLoading(false);
            return;
          }
        }

        // Sign In
        const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          throw new Error('Invalid Email or Password. Please try again.');
        }

        alert('Login successful! Welcome to SVH 2026.');
        if (role === 'team_leader') {
          // Fetch profile and team info
          const { data: profileData, error: profileErr } = await supabase
            .from('profiles')
            .select('*, teams(*)')
            .eq('id', authData.user.id)
            .maybeSingle();

          if (profileErr) {
            console.error("Profile fetch error:", profileErr);
          }

          localStorage.setItem('leader_session', JSON.stringify({
            leaderName: profileData?.full_name || 'Team Leader',
            teamName: profileData?.teams?.team_name || 'No Team',
            teamId: profileData?.team_id || null,
            collegeName: profileData?.teams?.college_name || '',
          }));

          navigate('/coming-soon');
        } else {
          navigate('/');
        }
      } else {
        // Sign Up
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;

        if (authData.user) {
          let newTeamId = null;

          // If role is team leader, create the team first
          if (role === 'team_leader') {
            const { data: teamData, error: teamError } = await supabase
              .from('teams')
              .insert([{
                team_name: teamName,
                college_name: collegeName,
                email: email,
                password: password
              }])
              .select()
              .single();

            if (teamError) throw teamError;
            newTeamId = teamData.id;
          }

          // Insert profile details
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: authData.user.id,
                email,
                full_name: fullName,
                is_team_leader: role === 'team_leader',
                team_id: newTeamId,
                phone: phone,
                gender: gender
              }
            ]);

          if (profileError) throw profileError;
        }

        alert('Registration successful! Please login.');
        setIsLogin(true);
      }
    } catch (err) {
      if (isLogin && err.message === 'Invalid Email or Password. Please try again.') {
        alert(err.message);
      }
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
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
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 900, color: '#fff', fontSize: 28, margin: '0 0 20px', letterSpacing: -0.5 }}>
            Login Portal
          </h1>

          {error && (
            <div style={{
              background: 'rgba(255, 107, 107, 0.15)',
              border: '1px solid rgba(255, 107, 107, 0.3)',
              color: '#ff6b6b',
              padding: '12px',
              borderRadius: 8,
              fontSize: 14,
              marginBottom: 20,
              fontFamily: 'Poppins,sans-serif',
              textAlign: 'left'
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, fontFamily: 'Poppins,sans-serif' }}>
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'Poppins,sans-serif',
                  outline: 'none',
                }}
              >
                <option value="team_leader" style={{ background: '#0f2942', color: '#fff' }}>Team Leader</option>
                <option value="evaluator" style={{ background: '#0f2942', color: '#fff' }}>Evaluator</option>
                <option value="super_admin" style={{ background: '#0f2942', color: '#fff' }}>Super Admin</option>
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, fontFamily: 'Poppins,sans-serif' }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'Poppins,sans-serif',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, fontFamily: 'Poppins,sans-serif' }}>
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'Poppins,sans-serif',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #FF9933, #e07800)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontFamily: 'Montserrat,sans-serif',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(255,153,51,0.3)',
                transition: 'all 0.2s',
              }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
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
