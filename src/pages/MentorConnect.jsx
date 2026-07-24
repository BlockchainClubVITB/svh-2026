import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

/* ═══════════════════════════════════════════════
   SHARED UTILITIES & PARTICLE COMPONENT
   ═══════════════════════════════════════════════ */
function FloatingParticles({ count = 10 }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${(i * 43 + 9) % 95 + 2}%`,
      size: (i % 3) + 2,
      duration: 11 + (i % 5) * 2.5,
      delay: -((i * 3.1) % 10),
      color: i % 3 === 0 ? 'rgba(255,153,51,0.35)' : i % 3 === 1 ? 'rgba(19,136,8,0.25)' : 'rgba(255,255,255,0.15)',
    })), [count]);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute', bottom: '-8px', left: p.left,
          width: p.size, height: p.size, borderRadius: '50%', background: p.color,
          animation: `particle-drift ${p.duration}s linear ${p.delay}s infinite`,
        }} />
      ))}
    </div>
  );
}

export default function MentorConnect() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [activeFlyer, setActiveFlyer] = useState(null); // Lightbox modal state

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const a = (delay) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(22px)',
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  const sessions = [
    {
      id: 'I',
      num: 'Session I',
      date: '25 July',
      day: 'Saturday',
      time: '9:00 PM',
      speaker: 'Dhairya Gothi',
      desc: 'Leader, Team Gati (SIH \'25 Finalist)',
      topic: 'Roadmap to SIH 2026 & SVH Guidance',
      img: '/img/mentor-session/mentor-dhairya.png',
      status: 'Ongoing/Completed'
    },
    {
      id: 'II',
      num: 'Session II',
      date: '26 July',
      day: 'Sunday',
      time: '9:00 PM',
      speaker: 'Riddhi Mhadgut',
      desc: 'Team Gati (SIH \'25 Finalist)',
      topic: 'How to Draft an SIH Winning PPT',
      img: '/img/mentor-session/mentor-riddhi.png',
      status: 'Upcoming'
    },
    {
      id: 'III',
      num: 'Session III',
      date: '1 August',
      day: 'Saturday',
      time: '9:00 PM',
      speaker: 'Rishita Mehta',
      desc: 'Team Gati (SIH \'25 Finalist)',
      topic: 'Tips to Crack SIH 2026 & Presentation Strategy',
      img: '/img/mentor-session/mentor-rishita.png',
      status: 'Upcoming'
    },
    {
      id: 'IV',
      num: 'Session IV',
      date: '2 August',
      day: 'Sunday',
      time: '9:00 PM',
      speaker: 'Shreya Dubey',
      desc: 'Team Gati (SIH \'25 Finalist)',
      topic: 'How to Prepare Your Idea & Research for SIH 2026',
      img: '/img/mentor-session/mentor-shreya.png',
      status: 'Upcoming'
    },
    {
      id: 'V',
      num: 'Session V',
      date: '8 August',
      day: 'Saturday',
      time: '9:00 PM',
      speaker: 'Shruti Dewaskar',
      desc: 'Team Gati (SIH \'25 Finalist)',
      topic: 'Hack to Win: Innovation Thinking & Team Strategy for SIH 2026',
      img: '/img/mentor-session/mentor-shruti.png',
      status: 'Upcoming'
    },
    {
      id: 'VI',
      num: 'Session VI',
      date: '9 August',
      day: 'Sunday',
      time: '9:00 PM',
      speaker: 'Prem Kolte',
      desc: 'Team Gati (SIH \'25 Finalist)',
      topic: 'Zero to MVP: How to Build a Working Prototype for SIH 2026',
      img: '/img/mentor-session/mentor-prem.png',
      status: 'Upcoming'
    }
  ];

  return (
    <div style={{ width: '100%', background: '#f8f9fb', minHeight: '100vh', fontFamily: 'Poppins, sans-serif' }}>

      {/* ── HERO BANNER ── */}
      <section style={{
        position: 'relative',
        background: 'linear-gradient(160deg, #07192c 0%, #0f2942 55%, #07192c 100%)',
        padding: '80px 20px 90px',
        overflow: 'hidden',
        textAlign: 'center',
      }}>
        <FloatingParticles count={10} />
        <div style={{ position: 'absolute', top: '10%', right: '5%', width: 280, height: 280, background: 'radial-gradient(circle, rgba(255,153,51,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(to right, #FF9933 33.33%, #fff 33.33% 66.66%, #138808 66.66%)' }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 900, margin: '0 auto' }}>
          <div style={{ ...a(80), display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', background: 'rgba(255,153,51,0.12)', border: '1px solid rgba(255,153,51,0.3)', borderRadius: 40, marginBottom: 24 }}>
            <span style={{ fontSize: 13 }}>💡</span>
            <span style={{ color: '#FF9933', fontSize: 11, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>Mentorship Initiative</span>
          </div>

          <h1 style={{ ...a(180), margin: '0 0 16px', fontFamily: 'Montserrat,sans-serif', fontWeight: 900, fontSize: 'clamp(30px, 5vw, 54px)', color: '#fff', lineHeight: 1.1, letterSpacing: -1 }}>
            Mentor Connect{' '}
            <span style={{ background: 'linear-gradient(90deg, #FF9933 0%, #ffffff 50%, #138808 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Sessions
            </span>
          </h1>

          <p style={{ ...a(280), color: 'rgba(255,255,255,0.72)', fontSize: 'clamp(14px, 1.8vw, 16px)', maxWidth: 650, margin: '0 auto', lineHeight: 1.6 }}>
            Exclusive guidance programs led by distinguished SIH '25 Finalists to help you refine problem statements, draft winning proposals, and construct functional MVPs.
          </p>
        </div>
      </section>

      {/* ── CONTENT AREA ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '50px 16px 80px' }}>

        {/* ── SCHEDULE TABLE SECTION ── */}
        <section style={{ ...a(380), background: '#fff', borderRadius: 20, border: '1px solid rgba(0,0,0,0.07)', padding: '28px 24px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', marginBottom: 50 }}>
          <h2 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, color: '#0f2942', fontSize: 20, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 4, height: 22, background: '#FF9933', borderRadius: 2, display: 'inline-block' }} />
            Session Schedule
          </h2>
          <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 24px 0' }}>
            Check out the official timelines and roadmap topics for the mentor sessions.
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5, textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#0f2942', color: '#fff', borderBottom: '2px solid #FF9933' }}>
                  <th style={{ padding: '14px 16px', fontFamily: 'Montserrat,sans-serif', fontWeight: 700 }}>Session</th>
                  <th style={{ padding: '14px 16px', fontFamily: 'Montserrat,sans-serif', fontWeight: 700 }}>Date & Day</th>
                  <th style={{ padding: '14px 16px', fontFamily: 'Montserrat,sans-serif', fontWeight: 700 }}>Time (IST)</th>
                  <th style={{ padding: '14px 16px', fontFamily: 'Montserrat,sans-serif', fontWeight: 700 }}>Speaker</th>
                  <th style={{ padding: '14px 16px', fontFamily: 'Montserrat,sans-serif', fontWeight: 700 }}>Topic</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? 'rgba(0,0,0,0.01)' : 'transparent' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#FF9933' }}>{s.num}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: '#0f2942' }}>{s.date} <span style={{ fontSize: 11.5, color: '#64748b', fontWeight: 400 }}>({s.day})</span></td>
                    <td style={{ padding: '14px 16px', color: '#334155' }}>{s.time}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 700, color: '#0f2942' }}>{s.speaker}</div>
                      <div style={{ fontSize: 11, color: '#64748b', marginTop: 1 }}>{s.desc}</div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#0f2942', fontWeight: 600 }}>{s.topic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── FLYERS GRID SECTION ── */}
        <section style={{ ...a(480), marginBottom: 50 }}>
          <h2 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, color: '#0f2942', fontSize: 20, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 4, height: 22, background: '#138808', borderRadius: 2, display: 'inline-block' }} />
            Official Session Flyers
          </h2>
          <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 28px 0' }}>
            Click on any flyer image below to expand and view full session highlights.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
            {sessions.map((s, idx) => (
              <div
                key={idx}
                style={{
                  background: '#fff',
                  border: '1px solid rgba(0,0,0,0.06)',
                  borderRadius: 14,
                  overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                  transition: 'all 0.28s ease',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 10px 24px rgba(0,0,0,0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255,153,51,0.25)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.03)';
                  e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)';
                }}
                onClick={() => setActiveFlyer(s)}
              >
                <div style={{ width: '100%', overflow: 'hidden', background: '#07192c', position: 'relative' }}>
                  <img
                    src={s.img}
                    alt={`${s.speaker} Flyer`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                  />
                  <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(15,41,66,0.85)', color: '#FF9933', padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700, letterSpacing: 0.5, fontFamily: 'Montserrat, sans-serif' }}>
                    🔍 View Flyer
                  </div>
                </div>
                <div style={{ padding: 18, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: 10, background: 'rgba(255,153,51,0.1)', color: '#FF9933', padding: '2px 8px', borderRadius: 4, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, fontFamily: 'Montserrat, sans-serif' }}>
                      {s.num}
                    </span>
                    <h3 style={{ margin: '8px 0 4px', fontSize: 15, fontWeight: 700, color: '#0f2942', fontFamily: 'Montserrat, sans-serif' }}>
                      {s.speaker}
                    </h3>
                    <p style={{ margin: 0, fontSize: 11.5, color: '#64748b', fontWeight: 500, marginBottom: 8 }}>
                      {s.desc}
                    </p>
                    <p style={{ margin: 0, fontSize: 12.5, color: '#0f2942', fontWeight: 600, lineHeight: 1.4 }}>
                      {s.topic}
                    </p>
                  </div>
                  <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11.5, color: '#64748b' }}>
                    <span>📅 {s.date}</span>
                    <span>⏰ {s.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── NOTES & DISCLAIMERS CARD ── */}
        <section style={{ ...a(580), background: 'rgba(15, 41, 66, 0.03)', border: '1.5px dashed rgba(15, 41, 66, 0.15)', borderRadius: 16, padding: '24px 28px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#0f2942', fontSize: 16, fontFamily: 'Montserrat, sans-serif', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
            📌 Important Guidelines & Rules
          </h3>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: '#334155', lineHeight: 1.6 }}>
            <li style={{ marginBottom: 6 }}><strong>Platform:</strong> Google Meet (joining details will be shared on official channels before each session).</li>
            <li style={{ marginBottom: 6 }}><strong>Eligibility:</strong> Exclusive and mandatory mentoring support for all registered SVH 2026 hackathon teams.</li>
            <li style={{ marginBottom: 6 }}><strong>Duration:</strong> 9:00 PM – 10:00 PM (IST) per session.</li>
            <li style={{ marginBottom: 6 }}><strong>Organizer:</strong> Organized by the <strong>Blockchain Club, VIT Bhopal</strong> in collaboration with Smart VIT Hackathon (SVH) 2026.</li>
            <li><strong>Disclaimer:</strong> Session dates and timings are subject to change if required. Participants will be notified in advance of any updates.</li>
          </ul>
        </section>

      </div>

      {/* ── LIGHTBOX FLYER MODAL ── */}
      {activeFlyer && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            cursor: 'zoom-out',
          }}
          onClick={() => setActiveFlyer(null)}
        >
          <div
            style={{
              position: 'relative',
              background: '#07192c',
              border: '1px solid rgba(255,153,51,0.3)',
              borderRadius: 16,
              maxWidth: '90%',
              maxHeight: '90%',
              overflow: 'hidden',
              cursor: 'default',
              boxShadow: '0 12px 50px rgba(0,0,0,0.6)',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveFlyer(null)}
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                background: 'rgba(15,41,66,0.8)',
                border: 'none',
                color: '#fff',
                width: 32,
                height: 32,
                borderRadius: '50%',
                fontSize: 16,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
              }}
            >
              ✕
            </button>
            <img
              src={activeFlyer.img}
              alt={`${activeFlyer.speaker} Poster`}
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', display: 'block' }}
            />
            <div style={{ padding: 18, color: '#fff', background: '#0a1d33', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                <div>
                  <h4 style={{ margin: 0, color: '#FF9933', fontFamily: 'Montserrat, sans-serif', fontSize: 16, fontWeight: 800 }}>
                    {activeFlyer.speaker} — {activeFlyer.num}
                  </h4>
                  <p style={{ margin: '4px 0 0', fontSize: 12.5, color: 'rgba(255,255,255,0.7)' }}>
                    {activeFlyer.topic}
                  </p>
                </div>
                <div style={{ textAlign: 'right', fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                  <div>Date: {activeFlyer.date} ({activeFlyer.day})</div>
                  <div>Time: {activeFlyer.time} IST</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
