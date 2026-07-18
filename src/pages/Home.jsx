import { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

import blockchainLogo from '../assets/Blockchain.png';
import iicLogo from '../assets/IIC Logo.png';
import swLogo from '../assets/SW Office Logo.png';
import vitbLogo from '../assets/vitblogo.png';

/* ═══════════════════════════════════════════════
   SHARED UTILITIES
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

/* Floating Particles — deterministic positions, no Math.random at render */
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

/* IntersectionObserver hook — one-shot reveal */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* Section heading with tricolour divider */
function SectionHeading({ badge, badgeColor = '#FF9933', title, highlight, highlightColor = '#FF9933' }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 56 }}>
      <span style={{
        display: 'inline-block', padding: '4px 16px', borderRadius: 20, marginBottom: 14,
        background: `${badgeColor}18`, border: `1px solid ${badgeColor}30`,
        color: badgeColor, fontSize: 11, fontFamily: 'Montserrat,sans-serif',
        fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase',
      }}>{badge}</span>
      <h2 style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 'clamp(28px,4vw,40px)', fontWeight: 900, color: '#0f2942', margin: 0 }}>
        {title} {highlight && <span style={{ color: highlightColor }}>{highlight}</span>}
      </h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 14 }}>
        <div style={{ height: 3, width: 40, background: '#FF9933', borderRadius: 2 }} />
        <div style={{ height: 3, width: 20, background: '#e8e8e8', borderRadius: 2 }} />
        <div style={{ height: 3, width: 40, background: '#138808', borderRadius: 2 }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   COUNTDOWN
   ═══════════════════════════════════════════════ */
function useCountdown(targetDate) {
  const calc = () => {
    const diff = new Date(targetDate) - new Date();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id); }, [targetDate]);
  return t;
}

function CountdownTimer() {
  const now = new Date();
  const opens = new Date('2026-07-01T00:00:00+05:30');
  const regCloses = new Date('2026-07-25T23:59:59+05:30');
  const pptCloses = new Date('2026-08-05T23:59:59+05:30');
  const finaleStarts = new Date('2026-08-24T09:00:00+05:30');

  let phase = { label: 'Registration Opens In', target: '2026-07-01T00:00:00+05:30', color: '#FF9933' };

  if (now < opens) {
    phase = { label: 'Registration Opens In', target: '2026-07-01T00:00:00+05:30', color: '#FF9933' };
  } else if (now >= opens && now < regCloses) {
    phase = { label: 'Registration Closes In', target: '2026-07-25T23:59:59+05:30', color: '#FF9933' };
  } else if (now >= regCloses && now < pptCloses) {
    phase = { label: 'PPT Submission Closes In', target: '2026-08-05T23:59:59+05:30', color: '#138808' };
  } else if (now >= pptCloses && now < finaleStarts) {
    phase = { label: 'Grand Finale Begins In', target: '2026-08-24T09:00:00+05:30', color: '#06038D' };
  } else {
    phase = { label: 'Event Ongoing', target: '2026-08-25T18:00:00+05:30', color: '#FF9933' };
  }

  const t = useCountdown(phase.target);
  const units = [
    { l: 'Days', v: t.days },
    { l: 'Hours', v: t.hours },
    { l: 'Minutes', v: t.minutes },
    { l: 'Seconds', v: t.seconds },
  ];

  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ color: phase.color, fontSize: 11, fontWeight: 700, fontFamily: 'Montserrat,sans-serif', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 14 }}>
        {phase.label}
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        {units.map((u, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.06)', border: `1px solid ${phase.color}40`,
            borderRadius: 12, padding: '16px 20px', minWidth: 80, backdropFilter: 'blur(8px)',
          }}>
            <div style={{ fontSize: 40, fontWeight: 900, fontFamily: 'Montserrat,sans-serif', color: '#fff', lineHeight: 1, textShadow: `0 0 24px ${phase.color}90` }}>
              {String(u.v).padStart(2, '0')}
            </div>
            <div style={{ fontSize: 10, color: phase.color, fontWeight: 700, fontFamily: 'Montserrat,sans-serif', letterSpacing: 2, textTransform: 'uppercase', marginTop: 6 }}>
              {u.l}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   HERO SECTION — Staggered fade-in + particles
   ═══════════════════════════════════════════════ */
function HeroSection() {
  const [m, setM] = useState(false); // mounted
  useEffect(() => { const t = setTimeout(() => setM(true), 80); return () => clearTimeout(t); }, []);

  const now = new Date();
  const isRegistrationOpen = now >= new Date('2026-07-01T00:00:00+05:30') && now < new Date('2026-07-25T23:59:59+05:30');

  // Stagger helper
  const a = (delay, extra = {}) => ({
    opacity: m ? 1 : 0,
    transform: m ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
    ...extra,
  });

  return (
    <section style={{
      position: 'relative', minHeight: '100vh',
      background: 'linear-gradient(160deg, #07192c 0%, #0f2942 45%, #07192c 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', padding: '90px 20px 80px',
    }}>
      {/* Animated particles */}
      <FloatingParticles count={22} />

      {/* Chakras */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', zIndex: 0 }}>
        <AshokaChakra size={640} opacity={0.045} spin />
      </div>
      <div style={{ position: 'absolute', top: -70, right: -70, pointerEvents: 'none', zIndex: 0 }}>
        <AshokaChakra size={240} opacity={0.055} spin />
      </div>
      <div style={{ position: 'absolute', bottom: -70, left: -70, pointerEvents: 'none', zIndex: 0 }}>
        <AshokaChakra size={240} opacity={0.055} spin />
      </div>

      {/* Ambient glows */}
      <div style={{ position: 'absolute', top: '15%', left: '5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(255,153,51,0.07) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '15%', right: '5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(19,136,8,0.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* ── CONTENT ── */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: 960, margin: '0 auto', width: '100%' }}>

        {/* Country badge */}
        <div style={{ ...a(80), display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,153,51,0.12)', border: '1px solid rgba(255,153,51,0.3)', borderRadius: 40, padding: '6px 20px', marginBottom: 28 }}>
          <span style={{ color: '#FF9933', fontSize: 12, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase' }}>
            Blockchain Club, VIT Bhopal
          </span>
        </div>

        {/* Main title */}
        <h1 style={{ ...a(180), margin: '0 0 8px', fontFamily: 'Montserrat,sans-serif', fontWeight: 900, lineHeight: 1.02 }}>
          <span style={{ display: 'block', fontSize: 'clamp(46px, 8vw, 92px)', color: '#fff', letterSpacing: -2 }}>SMART VIT</span>
          <span style={{
            display: 'block', fontSize: 'clamp(46px, 8vw, 92px)', letterSpacing: -2,
            background: 'linear-gradient(90deg, #FF9933 0%, #ffffff 50%, #138808 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>HACKATHON</span>
        </h1>

        {/* Year divider */}
        <div style={{ ...a(280), display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 20 }}>
          <div style={{ height: 2, width: 70, background: 'linear-gradient(to right, transparent, #FF9933)' }} />
          <span style={{ color: '#FF9933', fontSize: 24, fontFamily: 'Montserrat,sans-serif', fontWeight: 900, letterSpacing: 8 }}>2026</span>
          <div style={{ height: 2, width: 70, background: 'linear-gradient(to left, transparent, #138808)' }} />
        </div>

        {/* Tagline */}
        <p style={{ ...a(380), color: 'rgba(255,255,255,0.72)', fontSize: 'clamp(14px, 2vw, 18px)', fontFamily: 'Poppins,sans-serif', lineHeight: 1.7, maxWidth: 680, margin: '0 auto 36px' }}>
          India's most ambitious internal hackathon — inspired by Smart India Hackathon.{' '}
          <strong style={{ color: '#fff' }}>Innovate. Build. Represent.</strong>
        </p>

        {/* Countdown */}
        <div style={{ ...a(580), marginBottom: 46 }}>
          <CountdownTimer />
        </div>

        {/* CTA buttons */}
        <div style={{ ...a(700), display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
          {isRegistrationOpen ? (
            <>
              <a href="https://forms.gle/zYNYkjygKYfbAjhy6" target="_blank" rel="noopener noreferrer" style={{
                padding: '14px 38px', background: 'linear-gradient(135deg, #FF9933, #e07800)',
                color: '#fff', borderRadius: 8, fontSize: 13, fontFamily: 'Montserrat,sans-serif',
                fontWeight: 800, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: 1.5,
                boxShadow: '0 6px 24px rgba(255,153,51,0.4)', transition: 'all 0.25s', display: 'inline-block',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 34px rgba(255,153,51,0.55)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(255,153,51,0.4)'; }}>
                Register for SVH 2026
              </a>
              <Link to="/problem-statements" style={{
                padding: '14px 38px', background: 'transparent', color: '#fff', borderRadius: 8,
                fontSize: 13, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, textDecoration: 'none',
                textTransform: 'uppercase', letterSpacing: 1.5, border: '1.5px solid rgba(255,255,255,0.28)',
                transition: 'all 0.25s', display: 'inline-block',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)'; }}>
                Problem Statements
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" style={{
                padding: '14px 38px', background: 'linear-gradient(135deg, #138808, #0f6d06)',
                color: '#fff', borderRadius: 8, fontSize: 13, fontFamily: 'Montserrat,sans-serif',
                fontWeight: 800, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: 1.5,
                boxShadow: '0 6px 24px rgba(19,136,8,0.4)', transition: 'all 0.25s', display: 'inline-block',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 34px rgba(19,136,8,0.55)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(19,136,8,0.4)'; }}>
                Submit PPT (Round 1)
              </Link>
              <Link to="/problem-statements" style={{
                padding: '14px 38px', background: 'transparent', color: '#fff', borderRadius: 8,
                fontSize: 13, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, textDecoration: 'none',
                textTransform: 'uppercase', letterSpacing: 1.5, border: '1.5px solid rgba(255,255,255,0.28)',
                transition: 'all 0.25s', display: 'inline-block',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)'; }}>
                Problem Statements
              </Link>
            </>
          )}

        </div>



        {/* Info chips */}
        <div style={{ ...a(820), display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 42 }}>
          {[
            { icon: '📅', text: 'Registration: 1–25 July 2026' },
            { icon: '👥', text: '6 Members / Team' },
            { icon: '💰', text: '₹450 / Team' },
            { icon: '🏆', text: '10 SW + 2 HW Problem Statements' },
          ].map((chip, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.11)',
              borderRadius: 40, padding: '6px 16px', backdropFilter: 'blur(4px)',
            }}>
              <span style={{ fontSize: 14 }}>{chip.icon}</span>
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontFamily: 'Poppins,sans-serif', fontWeight: 500 }}>{chip.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll mouse indicator */}
      <div style={{ ...a(920, { position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)' }), zIndex: 10 }}>
        <div style={{ width: 22, height: 38, border: '2px solid rgba(255,255,255,0.25)', borderRadius: 12, display: 'flex', justifyContent: 'center', padding: '5px 0' }}>
          <div style={{ width: 4, height: 9, background: '#FF9933', borderRadius: 4, animation: 'scroll-dot 1.8s ease-in-out infinite' }} />
        </div>
      </div>

      {/* Tricolour footer strip */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(to right, #FF9933 33.33%, #fff 33.33% 66.66%, #138808 66.66%)' }} />
    </section>
  );
}

/* ═══════════════════════════════════════════════
   NEWS TICKER
   ═══════════════════════════════════════════════ */
function NewsTicker() {
  return (
    <div style={{ background: '#07192c', borderTop: '2px solid rgba(255,153,51,0.35)', borderBottom: '2px solid rgba(255,153,51,0.35)', padding: '10px 0', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ background: '#FF9933', padding: '4px 20px', whiteSpace: 'nowrap', fontFamily: 'Montserrat,sans-serif', fontWeight: 800, fontSize: 12, color: '#fff', letterSpacing: 1, flexShrink: 0 }}>
          LIVE
        </div>
        <div style={{ overflow: 'hidden', flex: 1 }}>
          <div style={{ display: 'inline-block', whiteSpace: 'nowrap', animation: 'sih-marquee 55s linear infinite' }}
            onMouseEnter={e => e.currentTarget.style.animationPlayState = 'paused'}
            onMouseLeave={e => e.currentTarget.style.animationPlayState = 'running'}>
            <span style={{ color: 'rgba(255,255,255,0.82)', fontFamily: 'Montserrat,sans-serif', fontSize: 13, fontWeight: 500 }}>
              &nbsp;&nbsp;&nbsp;SVH 2026 by Blockchain Club, VIT Bhopal — Inspired by Smart India Hackathon &nbsp;·&nbsp;
              Registration: <strong style={{ color: '#FF9933' }}>1–25 July 2026</strong> &nbsp;·&nbsp;
              PPT Submission: <strong style={{ color: '#FF9933' }}>25 July – 5 Aug 2026</strong> &nbsp;·&nbsp;
              Team: <strong style={{ color: '#FF9933' }}>6 Members (Min. 1 Female)</strong> &nbsp;·&nbsp;
              Fee: <strong style={{ color: '#FF9933' }}>₹75/Member · ₹450/Team</strong> &nbsp;·&nbsp;
              Grand Finale: <strong style={{ color: '#138808' }}>24–25 Aug 2026 (Tentative)</strong> &nbsp;·&nbsp;
              Venue: <strong style={{ color: '#138808' }}>VIT Bhopal University</strong> &nbsp;·&nbsp;
              <strong style={{ color: '#FF9933' }}>10 Software + 2 Hardware</strong> Problem Statements &nbsp;·&nbsp;
              blockchainclub@vitbhopal.ac.in
              &nbsp;&nbsp;&nbsp;
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   EVENT ROUNDS CAROUSEL (SIH-style)
   ═══════════════════════════════════════════════ */
const rounds = [
  {
    num: 1, label: 'ROUND 1', title: 'PPT Submission', subtitle: 'Online Evaluation Phase',
    date: '25 July – 5 Aug 2026', color: '#FF9933', borderColor: 'rgba(255,153,51,0.25)',
    bgAccent: 'rgba(255,153,51,0.05)', icon: '📊',
    description: 'Teams select up to 2 problem statements and submit a comprehensive presentation covering problem understanding, proposed solution, technical architecture, expected real-world impact, and step-by-step implementation roadmap.',
    what: [
      'Clear understanding of the chosen problem statement',
      'Proposed solution approach & core value proposition',
      'Technical architecture, tech stack & methodology',
      'Expected real-world impact, feasibility & scale',
      'Step-by-step implementation & execution roadmap',
    ],
    criteria: ['Problem Understanding', 'Innovation & Creativity', 'Feasibility', 'Technical Approach', 'Presentation Quality'],
    outcome: 'Top 5 teams per problem statement advance to the Grand Finale (max 60 finalist teams)',
  },
  {
    num: 2, label: 'ROUND 2', title: 'Grand Finale', subtitle: 'Prototype Development Phase',
    date: '24 – 25 Aug 2026 (Tentative)', color: '#138808', borderColor: 'rgba(19,136,8,0.25)',
    bgAccent: 'rgba(19,136,8,0.04)', icon: '🚀',
    description: 'Shortlisted finalist teams build and demonstrate a fully functional prototype at VIT Bhopal University. A 2-day, 12-hour intensive offline hackathon. Participation subject to OD approval from the institute.',
    what: [
      'Build a working prototype of the proposed solution',
      'Live demonstration to the expert evaluation panel',
      'Technical Q&A and in-depth solution discussion',
      '6 hours of development per day × 2 days = 12 hours total',
      'Final pitch presentation to the judging committee',
    ],
    criteria: ['Technical Implementation', 'Working Prototype', 'Innovation & Scalability', 'User Experience', 'Final Demonstration'],
    outcome: 'Winner, Runner-Up & Special Innovation Recognition Awards for top teams',
  },
];

function EventRoundsCarousel() {
  const [active, setActive] = useState(0);
  const [secRef, secVisible] = useInView(0.08);

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % rounds.length), 7000);
    return () => clearInterval(t);
  }, []);

  const r = rounds[active];

  return (
    <section ref={secRef} id="event-structure" style={{ background: '#fff', padding: '90px 20px', borderBottom: '1px solid #f0f0f0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Section heading */}
        <div style={{
          opacity: secVisible ? 1 : 0, transform: secVisible ? 'none' : 'translateY(20px)',
          transition: 'all 0.6s ease',
        }}>
          <SectionHeading badge="How It Works" title="Event" highlight="Structure" />
        </div>

        {/* Round selector tabs */}
        <div className="carousel-tabs" style={{
          display: 'flex', justifyContent: 'center', gap: 14, marginBottom: 40, flexWrap: 'wrap',
          opacity: secVisible ? 1 : 0, transform: secVisible ? 'none' : 'translateY(16px)',
          transition: 'all 0.6s ease 0.15s',
        }}>
          {rounds.map((rd, i) => (
            <button key={i} onClick={() => setActive(i)} style={{
              padding: '11px 34px',
              background: i === active ? `linear-gradient(135deg, ${rd.color}, ${rd.color}cc)` : 'transparent',
              color: i === active ? '#fff' : rd.color,
              border: `2px solid ${rd.color}`,
              borderRadius: 50,
              fontSize: 13, fontFamily: 'Montserrat,sans-serif', fontWeight: 800,
              cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1,
              transition: 'all 0.3s ease',
              boxShadow: i === active ? `0 6px 20px ${rd.color}40` : 'none',
              whiteSpace: 'nowrap',
            }}>
              Round {rd.num} — {rd.title}
            </button>
          ))}
        </div>

        {/* Sliding carousel track */}
        <div className="carousel-track-container" style={{
          overflow: 'hidden', borderRadius: 20,
          opacity: secVisible ? 1 : 0, transform: secVisible ? 'none' : 'translateY(24px)',
          transition: 'all 0.6s ease 0.25s',
        }}>
          <div style={{
            display: 'flex',
            transform: `translateX(-${active * 100}%)`,
            transition: 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
            willChange: 'transform',
          }}>
            {rounds.map((rd, idx) => (
              <div key={idx} className="carousel-slide" style={{ width: '100%', flexShrink: 0 }}>
                <div style={{ background: rd.bgAccent, border: `2px solid ${rd.borderColor}`, borderRadius: 20, overflow: 'hidden' }}>

                  {/* Card header bar */}
                  <div className="carousel-card-header" style={{
                    background: 'linear-gradient(135deg, #0f2942, #07192c)',
                    padding: '26px 36px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    flexWrap: 'wrap', gap: 16,
                    borderBottom: `3px solid ${rd.color}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                      <div style={{
                        width: 68, height: 68, borderRadius: 16,
                        background: `${rd.color}20`, border: `2px solid ${rd.color}45`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30,
                        flexShrink: 0,
                      }}>{rd.icon}</div>
                      <div>
                        <div style={{ color: rd.color, fontSize: 11, fontFamily: 'Montserrat,sans-serif', fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>{rd.label}</div>
                        <h3 style={{ color: '#fff', fontSize: 'clamp(20px,3vw,28px)', fontFamily: 'Montserrat,sans-serif', fontWeight: 900, margin: 0 }}>{rd.title}</h3>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontFamily: 'Poppins,sans-serif', marginTop: 3 }}>{rd.subtitle}</div>
                      </div>
                    </div>
                    <div style={{ padding: '8px 22px', background: `${rd.color}22`, border: `1px solid ${rd.color}50`, borderRadius: 30, color: rd.color, fontSize: 13, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, whiteSpace: 'nowrap' }}>
                      {rd.date}
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="carousel-card-body" style={{ padding: '32px 36px' }}>
                    <p style={{ color: '#555', fontSize: 14, fontFamily: 'Poppins,sans-serif', lineHeight: 1.85, marginBottom: 32, textAlign: 'justify', maxWidth: 900 }}>
                      {rd.description}
                    </p>

                    <div className="carousel-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>

                      {/* What list */}
                      <div>
                        <h4 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, color: '#0f2942', fontSize: 12, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 4, height: 18, background: rd.color, borderRadius: 2 }} />
                          {idx === 0 ? 'Submission Must Include' : 'What Finalists Will Do'}
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {rd.what.map((item, j) => (
                            <li key={j} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                              <div style={{ width: 20, height: 20, borderRadius: '50%', background: `${rd.color}15`, border: `1.5px solid ${rd.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: rd.color }} />
                              </div>
                              <span style={{ color: '#555', fontSize: 13, fontFamily: 'Poppins,sans-serif', lineHeight: 1.65 }}>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Criteria + outcome */}
                      <div>
                        <h4 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, color: '#0f2942', fontSize: 12, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 4, height: 18, background: rd.color, borderRadius: 2 }} />
                          Evaluation Criteria
                        </h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                          {rd.criteria.map((c, j) => (
                            <span key={j} style={{
                              padding: '7px 16px', background: `${rd.color}10`,
                              color: '#0f2942', fontSize: 12, fontFamily: 'Montserrat,sans-serif',
                              fontWeight: 700, borderRadius: 24, border: `1.5px solid ${rd.color}30`,
                              transition: 'all 0.2s',
                            }}
                              onMouseEnter={e => { e.currentTarget.style.background = `${rd.color}22`; e.currentTarget.style.borderColor = rd.color; }}
                              onMouseLeave={e => { e.currentTarget.style.background = `${rd.color}10`; e.currentTarget.style.borderColor = `${rd.color}30`; }}>
                              {c}
                            </span>
                          ))}
                        </div>

                        {/* Outcome box */}
                        <div style={{ padding: '16px 20px', background: 'linear-gradient(135deg, #0f2942, #07192c)', borderRadius: 12, border: `1.5px solid ${rd.color}30` }}>
                          <div style={{ color: rd.color, fontSize: 10, fontFamily: 'Montserrat,sans-serif', fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Outcome</div>
                          <div style={{ color: '#fff', fontSize: 13, fontFamily: 'Poppins,sans-serif', fontWeight: 500, lineHeight: 1.6 }}>{rd.outcome}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dot navigation */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, marginTop: 28 }}>
          <button onClick={() => setActive(a => (a - 1 + rounds.length) % rounds.length)}
            style={{ background: 'none', border: '1.5px solid #ddd', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 18, transition: 'all 0.2s', lineHeight: 1 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF9933'; e.currentTarget.style.color = '#FF9933'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#ddd'; e.currentTarget.style.color = '#aaa'; }}>‹</button>

          <div style={{ display: 'flex', gap: 8 }}>
            {rounds.map((rd, i) => (
              <button key={i} onClick={() => setActive(i)} style={{
                width: i === active ? 34 : 8, height: 8, borderRadius: 4,
                background: i === active ? rd.color : '#ddd',
                border: 'none', cursor: 'pointer', transition: 'all 0.35s ease',
              }} />
            ))}
          </div>

          <button onClick={() => setActive(a => (a + 1) % rounds.length)}
            style={{ background: 'none', border: '1.5px solid #ddd', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 18, transition: 'all 0.2s', lineHeight: 1 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#138808'; e.currentTarget.style.color = '#138808'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#ddd'; e.currentTarget.style.color = '#aaa'; }}>›</button>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   ABOUT SVH
   ═══════════════════════════════════════════════ */
function AboutSection() {
  const [ref, visible] = useInView(0.1);
  return (
    <section ref={ref} style={{ background: 'linear-gradient(135deg, #07192c 0%, #0f2942 100%)', padding: '90px 20px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', right: -80, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 0 }}>
        <AshokaChakra size={520} opacity={0.04} spin />
      </div>
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: 60, alignItems: 'center',
          opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(30px)',
          transition: 'all 0.7s ease',
        }}>
          <div>
            <span style={{ display: 'inline-block', padding: '4px 16px', background: 'rgba(255,153,51,0.15)', color: '#FF9933', fontSize: 11, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', borderRadius: 20, marginBottom: 20, border: '1px solid rgba(255,153,51,0.25)' }}>
              About the Event
            </span>
            <h2 style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 'clamp(28px,4vw,42px)', fontWeight: 900, color: '#fff', margin: '0 0 20px', lineHeight: 1.1 }}>
              What is <span style={{ color: '#FF9933' }}>SVH 2026</span>?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, lineHeight: 1.85, fontFamily: 'Poppins,sans-serif', marginBottom: 20, textAlign: 'justify' }}>
              Smart VIT Hackathon (SVH) 2026 is an internal hackathon organized by the{' '}
              <strong style={{ color: '#FF9933' }}>Blockchain Club, VIT Bhopal</strong>, inspired by the structure and methodology of the Smart India Hackathon (SIH).
            </p>
            <p style={{ color: 'rgba(255,255,255,0.62)', fontSize: 15, lineHeight: 1.85, fontFamily: 'Poppins,sans-serif', textAlign: 'justify', marginBottom: 28 }}>
              The event provides students with a realistic SIH-like experience — exposing them to problem-statement-based innovation, proposal development, pitching, and rapid prototype creation. Through two rigorous rounds and expert mentorship, participants solve real-world challenges.
            </p>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {[
                { text: 'SIH-Inspired Format', color: '#FF9933' },
                { text: 'Expert Mentorship', color: '#138808' },
                { text: 'Real-world Problems', color: 'rgba(255,255,255,0.6)' },
              ].map((tag, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, color: tag.color, fontSize: 13, fontFamily: 'Montserrat,sans-serif', fontWeight: 700 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: tag.color, display: 'inline-block' }} />
                  {tag.text}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: '2 Rounds', sub: 'PPT Submission + Prototype', icon: '🎯', color: '#FF9933' },
              { label: '10+2 PSs', sub: '10 Software · 2 Hardware', icon: '📋', color: '#138808' },
              { label: 'Venue', sub: 'VIT Bhopal University', icon: '🏛️', color: '#06038D' },
              { label: 'Certificates', sub: 'Participation & Shortlisting', icon: '🏆', color: '#FF9933' },
            ].map((c, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 14, padding: '24px 18px', transition: 'all 0.25s',
                opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)',
                transitionDelay: `${0.2 + i * 0.09}s`,
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = `${c.color}55`; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{c.icon}</div>
                <div style={{ color: c.color, fontSize: 17, fontWeight: 800, fontFamily: 'Montserrat,sans-serif', marginBottom: 4 }}>{c.label}</div>
                <div style={{ color: 'rgba(255,255,255,0.52)', fontSize: 12, fontFamily: 'Poppins,sans-serif' }}>{c.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   TIMELINE — Each item animates in on scroll
   ═══════════════════════════════════════════════ */
const timelinePhases = [
  { num: 1, title: 'Registration', date: '1 – 25 July 2026', desc: 'Teams of 6 register online. Minimum 1 female member mandatory. Fee: ₹75/member (₹450/team). Register through the official Google Form.', icon: '✍️', color: '#FF9933' },
  { num: 2, title: 'PPT Submission', date: '25 July – 5 Aug 2026', desc: 'Submit a comprehensive presentation covering problem understanding, proposed solution, technical architecture, expected impact & implementation roadmap.', icon: '📊', color: '#138808' },
  { num: 3, title: 'PPT Evaluation', date: '5 – 10 Aug 2026', desc: 'Internal panel evaluates all submissions. Top 5 teams per problem statement shortlisted. Max 60 finalist teams across all 12 PSs.', icon: '⚖️', color: '#06038D' },
  { num: 4, title: 'Results', date: 'Post 10 Aug 2026', desc: 'Shortlisted finalist teams officially announced. Teams notified through internal college channels and official platforms.', icon: '📢', color: '#FF9933' },
  { num: 5, title: 'Grand Finale', date: '24 – 25 Aug 2026', desc: 'Finalists build a functional prototype at VIT Bhopal. 2-day, 12-hr offline format. Subject to OD approval from the institute.', icon: '🚀', color: '#138808' },
];

function TimelineItem({ phase, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const isLeft = index % 2 === 0;

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.22 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      display: 'flex', alignItems: 'flex-start', gap: 0, marginBottom: 44,
      flexDirection: isLeft ? 'row' : 'row-reverse',
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : `translateX(${isLeft ? -52 : 52}px)`,
      transition: `opacity 0.65s ease ${index * 0.1}s, transform 0.65s ease ${index * 0.1}s`,
    }}>
      {/* Content card */}
      <div style={{ flex: 1, padding: isLeft ? '0 44px 0 0' : '0 0 0 44px' }}>
        <div style={{
          background: '#fff', border: `2px solid ${phase.color}22`, borderRadius: 16, padding: '24px',
          boxShadow: '0 4px 22px rgba(0,0,0,0.07)', transition: 'all 0.28s',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = phase.color; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 10px 32px ${phase.color}22`; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = `${phase.color}22`; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 22px rgba(0,0,0,0.07)'; }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 20 }}>{phase.icon}</span>
            <h3 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, color: '#0f2942', fontSize: 16, margin: 0 }}>{phase.title}</h3>
          </div>
          <div style={{ display: 'inline-block', padding: '3px 12px', background: `${phase.color}14`, color: phase.color, fontSize: 11, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, borderRadius: 20, marginBottom: 10, border: `1px solid ${phase.color}28` }}>
            {phase.date}
          </div>
          <p style={{ color: '#666', fontSize: 13, fontFamily: 'Poppins,sans-serif', lineHeight: 1.72, margin: 0, textAlign: 'justify' }}>{phase.desc}</p>
        </div>
      </div>

      {/* Center circle node */}
      <div style={{ position: 'relative', zIndex: 10, flexShrink: 0 }}>
        <div style={{
          width: 54, height: 54,
          background: `linear-gradient(135deg, ${phase.color}, ${phase.color}bb)`,
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15, fontWeight: 900, color: '#fff', fontFamily: 'Montserrat,sans-serif',
          boxShadow: `0 4px 18px ${phase.color}55`, border: '3px solid #fff',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.18)'; e.currentTarget.style.boxShadow = `0 8px 28px ${phase.color}70`; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = `0 4px 18px ${phase.color}55`; }}>
          {phase.num}
        </div>
      </div>

      <div style={{ flex: 1 }} />
    </div>
  );
}

function MobileTimelineItem({ phase, index, isLast }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      display: 'flex', gap: 14, marginBottom: 20,
      opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(24px)',
      transition: `all 0.55s ease ${index * 0.08}s`,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ width: 42, height: 42, background: `linear-gradient(135deg, ${phase.color}, ${phase.color}bb)`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: '#fff', fontFamily: 'Montserrat,sans-serif', boxShadow: `0 4px 12px ${phase.color}50`, border: '2px solid #fff', flexShrink: 0 }}>
          {phase.num}
        </div>
        {!isLast && <div style={{ width: 2, flex: 1, background: `linear-gradient(to bottom, ${phase.color}, ${timelinePhases[Math.min(index + 1, timelinePhases.length - 1)].color})`, minHeight: 24, marginTop: 4 }} />}
      </div>
      <div style={{ background: '#fff', border: `1.5px solid ${phase.color}22`, borderRadius: 12, padding: '16px', boxShadow: '0 2px 14px rgba(0,0,0,0.06)', flex: 1, marginBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 16 }}>{phase.icon}</span>
          <h3 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, color: '#0f2942', fontSize: 14, margin: 0 }}>{phase.title}</h3>
        </div>
        <div style={{ display: 'inline-block', padding: '2px 10px', background: `${phase.color}14`, color: phase.color, fontSize: 11, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, borderRadius: 20, marginBottom: 8 }}>{phase.date}</div>
        <p style={{ color: '#666', fontSize: 12, fontFamily: 'Poppins,sans-serif', lineHeight: 1.65, margin: 0, textAlign: 'justify' }}>{phase.desc}</p>
      </div>
    </div>
  );
}

function TimelineSection() {
  const [headerRef, headerVisible] = useInView(0.2);

  return (
    <section id="process-flow" style={{ background: '#fff', padding: '90px 20px' }}>
      <div style={{ maxWidth: 1020, margin: '0 auto' }}>
        <div ref={headerRef} style={{
          textAlign: 'center', marginBottom: 64,
          opacity: headerVisible ? 1 : 0, transform: headerVisible ? 'none' : 'translateY(22px)',
          transition: 'all 0.6s ease',
        }}>
          <span style={{ display: 'inline-block', padding: '4px 16px', background: 'rgba(19,136,8,0.08)', color: '#138808', fontSize: 11, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', borderRadius: 20, marginBottom: 14, border: '1px solid rgba(19,136,8,0.2)' }}>
            Timeline
          </span>
          <h2 style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 'clamp(28px,4vw,40px)', fontWeight: 900, color: '#0f2942', margin: 0 }}>Event Process Flow</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 14 }}>
            <div style={{ height: 3, width: 40, background: '#FF9933', borderRadius: 2 }} />
            <div style={{ height: 3, width: 20, background: '#e8e8e8', borderRadius: 2 }} />
            <div style={{ height: 3, width: 40, background: '#138808', borderRadius: 2 }} />
          </div>
        </div>

        {/* Desktop alternating */}
        <div style={{ position: 'relative' }} className="hidden md:block">
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: 'linear-gradient(to bottom, #FF9933, #06038D, #138808)', transform: 'translateX(-50%)', zIndex: 0 }} />
          {timelinePhases.map((p, i) => <TimelineItem key={i} phase={p} index={i} />)}
        </div>

        {/* Mobile vertical */}
        <div className="md:hidden">
          {timelinePhases.map((p, i) => <MobileTimelineItem key={i} phase={p} index={i} isLast={i === timelinePhases.length - 1} />)}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   WHY JOIN SVH — Staggered card reveal
   ═══════════════════════════════════════════════ */
const benefits = [
  { icon: '🧠', title: 'SIH Simulation', desc: 'Realistic Smart India Hackathon experience with identical structure, evaluation criteria, and real problem statements.', color: '#FF9933' },
  { icon: '🏆', title: 'Certificates', desc: 'Earn Participation, Shortlisting, Winner, and Special Innovation certificates. Stand out on your resume and LinkedIn.', color: '#138808' },
  { icon: '🤝', title: 'Expert Mentorship', desc: 'Guided by senior club members, SIH nationals participants, faculty, and domain experts throughout the hackathon.', color: '#06038D' },
  { icon: '💡', title: 'Real Problem Solving', desc: 'Work on 12 curated real-world problem statements spanning Blockchain, AI/ML, IoT, Smart Cities, Healthcare & more.', color: '#FF9933' },
  { icon: '🔗', title: 'Team Building', desc: 'Collaborate in diverse teams of 6. Learn to pitch, build prototypes, and perform under competitive pressure.', color: '#138808' },
  { icon: '🚀', title: 'Career Readiness', desc: 'Build practical skills and competitive confidence for SIH and other national-level innovation competitions.', color: '#06038D' },
];

function WhySVHSection() {
  const [ref, visible] = useInView(0.07);
  return (
    <section ref={ref} style={{ background: 'linear-gradient(180deg, #fafafa 0%, #fff 100%)', padding: '90px 20px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)', transition: 'all 0.6s ease' }}>
          <SectionHeading badge="Benefits" title="Why Join" highlight="SVH 2026?" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 22 }}>
          {benefits.map((b, i) => (
            <div key={i} style={{
              background: '#fff', border: '1.5px solid #f0f0f0', borderRadius: 18, padding: '28px 24px',
              display: 'flex', gap: 18, alignItems: 'flex-start',
              boxShadow: '0 2px 14px rgba(0,0,0,0.05)',
              transition: `all 0.28s, opacity 0.55s ease ${i * 0.07}s, transform 0.55s ease ${i * 0.07}s`,
              opacity: visible ? 1 : 0,
              transform: visible ? 'none' : 'translateY(28px)',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = b.color; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 10px 30px ${b.color}22`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0f0f0'; e.currentTarget.style.transform = visible ? 'none' : 'translateY(28px)'; e.currentTarget.style.boxShadow = '0 2px 14px rgba(0,0,0,0.05)'; }}>
              <div style={{ width: 54, height: 54, borderRadius: 14, background: `${b.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0, border: `1px solid ${b.color}22` }}>
                {b.icon}
              </div>
              <div>
                <h3 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, color: '#0f2942', fontSize: 15, margin: '0 0 8px' }}>{b.title}</h3>
                <p style={{ color: '#666', fontSize: 13, fontFamily: 'Poppins,sans-serif', lineHeight: 1.72, margin: 0, textAlign: 'justify' }}>{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   EVALUATION CRITERIA
   ═══════════════════════════════════════════════ */
function EvaluationSection() {
  const [ref, visible] = useInView(0.08);
  const evalRounds = [
    {
      round: 'Round 1', sub: 'PPT Submission', date: '20 Jul – 5 Aug 2026', color: '#FF9933', bg: 'rgba(255,153,51,0.06)',
      criteria: ['Problem Understanding', 'Innovation & Creativity', 'Feasibility of Solution', 'Technical Approach', 'Presentation Quality'],
      desc: 'Teams submit a comprehensive presentation covering their solution approach, technical architecture, impact, and implementation roadmap.',
    },
    {
      round: 'Round 2', sub: 'Grand Finale — Prototype', date: '24–25 Aug 2026', color: '#138808', bg: 'rgba(19,136,8,0.06)',
      criteria: ['Technical Implementation', 'Functionality & Working Prototype', 'Innovation & Scalability', 'User Experience', 'Final Demonstration'],
      desc: 'Shortlisted teams build and demonstrate a functional prototype. A 2-day, 12-hour hands-on development sprint.',
    },
  ];
  return (
    <section ref={ref} style={{ background: '#0f2942', padding: '90px 20px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: -100, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
        <AshokaChakra size={400} opacity={0.04} spin />
      </div>
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)', transition: 'all 0.6s ease' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span style={{ display: 'inline-block', padding: '4px 16px', background: 'rgba(255,153,51,0.15)', color: '#FF9933', fontSize: 11, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', borderRadius: 20, marginBottom: 14, border: '1px solid rgba(255,153,51,0.25)' }}>Judging</span>
            <h2 style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 'clamp(28px,4vw,40px)', fontWeight: 900, color: '#fff', margin: 0 }}>Evaluation Criteria</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 14 }}>
              <div style={{ height: 3, width: 40, background: '#FF9933', borderRadius: 2 }} />
              <div style={{ height: 3, width: 20, background: 'rgba(255,255,255,0.15)', borderRadius: 2 }} />
              <div style={{ height: 3, width: 40, background: '#138808', borderRadius: 2 }} />
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: 24 }}>
          {evalRounds.map((r, i) => (
            <div key={i} style={{
              background: r.bg, border: `1.5px solid ${r.color}30`, borderRadius: 20, padding: '32px',
              opacity: visible ? 1 : 0,
              transform: visible ? 'none' : `translateX(${i === 0 ? -30 : 30}px)`,
              transition: `all 0.65s ease ${0.15 + i * 0.15}s`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <div style={{ color: r.color, fontSize: 11, fontFamily: 'Montserrat,sans-serif', fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>{r.round}</div>
                  <h3 style={{ color: '#fff', fontSize: 22, fontFamily: 'Montserrat,sans-serif', fontWeight: 900, margin: 0 }}>{r.sub}</h3>
                </div>
                <div style={{ padding: '4px 14px', background: `${r.color}20`, color: r.color, fontSize: 11, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, borderRadius: 20, border: `1px solid ${r.color}40`, whiteSpace: 'nowrap' }}>{r.date}</div>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.62)', fontSize: 13, fontFamily: 'Poppins,sans-serif', lineHeight: 1.75, marginBottom: 22, textAlign: 'justify' }}>{r.desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {r.criteria.map((c, j) => (
                  <span key={j} style={{ padding: '5px 14px', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 12, fontFamily: 'Montserrat,sans-serif', fontWeight: 600, borderRadius: 20, border: `1px solid ${r.color}28` }}>{c}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   ORGANIZERS
   ═══════════════════════════════════════════════ */
function OrganizersSection() {
  const [ref, visible] = useInView(0.08);
  const orgs = [
    { src: blockchainLogo, name: 'Blockchain Club VITB', desc: 'Event Organizer', bg: 'rgba(255,153,51,0.07)', border: 'rgba(255,153,51,0.2)' },
    { src: iicLogo, name: 'IIC VIT Bhopal', desc: "Institution's Innovation Council", bg: 'rgba(6,3,141,0.06)', border: 'rgba(6,3,141,0.15)' },
    { src: swLogo, name: 'SW Office', desc: 'Student Welfare Office', bg: 'rgba(19,136,8,0.06)', border: 'rgba(19,136,8,0.2)' },
    { src: vitbLogo, name: 'VIT Bhopal', desc: 'VIT Bhopal University', bg: 'rgba(255,153,51,0.07)', border: 'rgba(255,153,51,0.2)' },
  ];
  return (
    <section ref={ref} id="organizers" style={{ background: '#fff', padding: '80px 20px', borderTop: '1px solid #f0f0f0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)', transition: 'all 0.6s ease' }}>
          <SectionHeading badge="Supporters" title="Organized &" highlight="Supported By" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 22 }}>
          {orgs.map((org, i) => (
            <div key={i} style={{
              background: org.bg, border: `1.5px solid ${org.border}`, borderRadius: 18,
              padding: '32px 24px', textAlign: 'center', transition: 'all 0.28s',
              opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(22px) scale(0.96)',
              transitionDelay: `${0.1 + i * 0.1}s`,
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = `0 14px 36px ${org.border}`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = visible ? 'none' : 'translateY(22px) scale(0.96)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                <img src={org.src} alt={org.name} style={{ maxHeight: 66, maxWidth: '100%', objectFit: 'contain' }} />
              </div>
              <h3 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, color: '#0f2942', fontSize: 14, margin: '0 0 5px' }}>{org.name}</h3>
              <p style={{ color: '#999', fontSize: 12, fontFamily: 'Poppins,sans-serif', margin: 0 }}>{org.desc}</p>
            </div>
          ))}
        </div>

        {/* Faculty card */}
        <div style={{
          marginTop: 36, background: 'linear-gradient(135deg, #0f2942, #07192c)', borderRadius: 18,
          padding: '26px 32px', display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap',
          border: '1px solid rgba(255,153,51,0.2)',
          opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(16px)',
          transition: 'all 0.6s ease 0.5s',
        }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,153,51,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, border: '2px solid rgba(255,153,51,0.4)', flexShrink: 0 }}>
            👨‍🏫
          </div>
          <div>
            <div style={{ color: 'rgba(255,153,51,0.7)', fontSize: 10, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Faculty Coordinator</div>
            <div style={{ color: '#fff', fontSize: 20, fontFamily: 'Montserrat,sans-serif', fontWeight: 900 }}>Dr. Hemraj Lamkuche</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontFamily: 'Poppins,sans-serif', marginTop: 2 }}>Blockchain Club Coordinator · VIT Bhopal University</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   REGISTRATION CTA
   ═══════════════════════════════════════════════ */
function RegistrationCTA() {
  const [ref, visible] = useInView(0.1);
  const now = new Date();
  const isRegistrationOpen = now >= new Date('2026-07-01T00:00:00+05:30') && now < new Date('2026-07-20T23:59:59+05:30');

  return (
    <section ref={ref} style={{ background: 'linear-gradient(135deg, #0f2942 0%, #07192c 100%)', padding: '80px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(to right, #FF9933 33.33%, #fff 33.33% 66.66%, #138808 66.66%)' }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', zIndex: 0 }}>
        <AshokaChakra size={500} opacity={0.04} spin />
      </div>
      <div style={{
        position: 'relative', zIndex: 1, maxWidth: 780, margin: '0 auto',
        opacity: visible ? 1 : 0, transform: visible ? 'none' : 'scale(0.96) translateY(20px)',
        transition: 'all 0.7s ease',
      }}>
        <div style={{ fontSize: 52, marginBottom: 14, animation: 'float 3s ease-in-out infinite' }}>🚀</div>
        <h2 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 900, color: '#fff', fontSize: 'clamp(28px,5vw,48px)', margin: '0 0 16px', lineHeight: 1.1 }}>
          {isRegistrationOpen ? 'Form Your Team & Register' : 'Join the Live Event'}
        </h2>

        {isRegistrationOpen ? (
          <>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, fontFamily: 'Poppins,sans-serif', lineHeight: 1.75, marginBottom: 18, maxWidth: 620, margin: '0 auto 24px' }}>
              Registration is active until <strong style={{ color: '#FF9933' }}>25 July 2026</strong>. Form your team of 6 (minimum 1 female member) and secure your slot strictly via the Google Form.
            </p>
            <div style={{ background: 'rgba(255,153,51,0.08)', border: '1px solid rgba(255,153,51,0.25)', borderRadius: 8, padding: '16px 20px', marginBottom: 30, color: '#fff', fontSize: 14, fontFamily: 'Poppins,sans-serif', display: 'inline-block', maxWidth: 620 }}>
              ⚠️ <strong style={{ color: '#FF9933' }}>Notice:</strong> Form registrations are managed on Google Forms. Registration is NOT hosted on this website. The portal here is used exclusively for Round 1 PPT uploads beginning 25th July.
            </div>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
              <a href="https://forms.gle/zYNYkjygKYfbAjhy6" target="_blank" rel="noopener noreferrer" style={{ padding: '14px 40px', background: 'linear-gradient(135deg, #FF9933, #e07800)', color: '#fff', borderRadius: 8, fontSize: 13, fontFamily: 'Montserrat,sans-serif', fontWeight: 800, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: 1.5, boxShadow: '0 6px 24px rgba(255,153,51,0.4)', transition: 'all 0.25s', display: 'inline-block' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 34px rgba(255,153,51,0.6)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(255,153,51,0.4)'; }}>
                Register on Google Form
              </a>
              <a href="https://chat.whatsapp.com/L7lXF9VZQRDCx0aXXwBhGw?s=sw&p=a&mlu=2" target="_blank" rel="noopener noreferrer" style={{ padding: '14px 40px', background: '#16a34a', color: '#fff', borderRadius: 8, fontSize: 13, fontFamily: 'Montserrat,sans-serif', fontWeight: 800, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: 1.5, boxShadow: '0 6px 24px rgba(22,163,74,0.4)', transition: 'all 0.25s', display: 'inline-block' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 34px rgba(22,163,74,0.6)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(22,163,74,0.4)'; }}>
                Join WhatsApp Group
              </a>
            </div>
          </>
        ) : (
          <>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, fontFamily: 'Poppins,sans-serif', lineHeight: 1.75, marginBottom: 24, maxWidth: 620, margin: '0 auto 24px' }}>
              Registration phase has ended. PPT Submissions are now open for all registered teams until <strong style={{ color: '#138808' }}>5 August 2026</strong>.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link to="/login" style={{ padding: '14px 40px', background: 'linear-gradient(135deg, #138808, #0f6d06)', color: '#fff', borderRadius: 8, fontSize: 13, fontFamily: 'Montserrat,sans-serif', fontWeight: 800, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: 1.5, boxShadow: '0 6px 24px rgba(19,136,8,0.4)', transition: 'all 0.25s', display: 'inline-block' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 34px rgba(19,136,8,0.6)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(19,136,8,0.4)'; }}>
                Submit PPT (Round 1)
              </Link>
              <a href="https://chat.whatsapp.com/L7lXF9VZQRDCx0aXXwBhGw?s=sw&p=a&mlu=2" target="_blank" rel="noopener noreferrer" style={{ padding: '14px 40px', background: '#16a34a', color: '#fff', borderRadius: 8, fontSize: 13, fontFamily: 'Montserrat,sans-serif', fontWeight: 800, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: 1.5, boxShadow: '0 6px 24px rgba(22,163,74,0.4)', transition: 'all 0.25s', display: 'inline-block' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 34px rgba(22,163,74,0.6)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(22,163,74,0.4)'; }}>
                Join WhatsApp Group
              </a>
            </div>
          </>
        )}
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(to right, #FF9933 33.33%, #fff 33.33% 66.66%, #138808 66.66%)' }} />
    </section>
  );
}

/* ═══════════════════════════════════════════════
   ORIENTATION POPUP MODAL
   ═══════════════════════════════════════════════ */
function OrientationModal() {
  const [isOpen, setIsOpen] = useState(true);
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(7, 25, 44, 0.4)',
      backdropFilter: 'blur(3px)',
      padding: 20
    }}>
      {/* Backdrop close area */}
      <div 
        onClick={() => setIsOpen(false)} 
        style={{ position: 'absolute', inset: 0, cursor: 'pointer' }} 
      />

      {/* Modal Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: 580,
        background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)',
        borderRadius: 24,
        padding: 2, // Border effect
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 153, 51, 0.15)',
        zIndex: 10,
        animation: 'pop-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}>
        <div style={{
          background: 'rgba(7, 25, 44, 0.98)',
          borderRadius: 22,
          padding: '36px 32px',
          position: 'relative',
        }}>
          {/* Close button */}
          <button 
            onClick={() => setIsOpen(false)} 
            style={{
              position: 'absolute',
              top: 18,
              right: 18,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              width: 32,
              height: 32,
              borderRadius: '50%',
              color: '#fff',
              fontSize: 16,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              zIndex: 12
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            ✕
          </button>

          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(255, 153, 51, 0.15)',
            border: '1px solid rgba(255, 153, 51, 0.35)',
            borderRadius: 20,
            padding: '4px 14px',
            marginBottom: 20
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF9933', display: 'inline-block' }} />
            <span style={{ color: '#FF9933', fontSize: 10, fontFamily: 'Montserrat,sans-serif', fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase' }}>
              Important Update
            </span>
          </div>

          {/* Title */}
          <h3 style={{
            fontFamily: 'Montserrat,sans-serif',
            fontSize: 'clamp(20px, 4vw, 24px)',
            fontWeight: 900,
            color: '#fff',
            margin: '0 0 10px',
            letterSpacing: -0.5
          }}>
            Attention SVH 2026 Participants!
          </h3>

          {/* Subtitle */}
          <p style={{
            color: '#FF9933',
            fontSize: 15,
            fontFamily: 'Poppins,sans-serif',
            fontWeight: 600,
            margin: '0 0 24px'
          }}>
            📢 Mentor Connect Sessions Announcement
          </p>

          {/* Description Details */}
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: 20,
            marginBottom: 28,
            textAlign: 'left'
          }}>
            <p style={{
              color: 'rgba(255, 255, 255, 0.95)',
              fontSize: 14,
              fontFamily: 'Poppins,sans-serif',
              lineHeight: 1.65,
              margin: '0 0 16px'
            }}>
              The Blockchain Club is excited to announce the upcoming <strong>Mentor Connect Sessions</strong> for <strong>SVH 2026</strong>!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 16 }}>💡</span>
                <span style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 13.5, fontFamily: 'Poppins,sans-serif', lineHeight: 1.5 }}>
                  These exclusive mentoring sessions are available <strong>only for registered SVH 2026 teams</strong>.
                </span>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 16 }}>📌</span>
                <span style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 13.5, fontFamily: 'Poppins,sans-serif', lineHeight: 1.5 }}>
                  Detailed information about the mentors and session schedule will be shared with registered teams via email.
                </span>
              </div>
            </div>

            <p style={{
              color: 'rgba(255, 255, 255, 0.75)',
              fontSize: 13.5,
              fontFamily: 'Poppins,sans-serif',
              lineHeight: 1.6,
              margin: '0 0 20px',
              fontStyle: 'italic'
            }}>
              This is your opportunity to learn directly from those who have successfully navigated the SIH journey and emerged as winners.
            </p>

            <div style={{
              background: 'rgba(255, 153, 51, 0.1)',
              border: '1.5px solid rgba(255, 153, 51, 0.3)',
              borderRadius: 12,
              padding: '12px 18px',
              textAlign: 'center',
              color: '#fff',
              fontFamily: 'Montserrat,sans-serif',
              fontWeight: 800,
              fontSize: 14
            }}>
              ⏳ Registrations are extended till 25th July!
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <a 
              href="https://forms.gle/zYNYkjygKYfbAjhy6" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #FF9933 0%, #e07800 100%)',
                color: '#fff',
                borderRadius: 8,
                fontSize: 12.5,
                fontFamily: 'Montserrat,sans-serif',
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(255, 153, 51, 0.3)',
                transition: 'all 0.25s',
                textTransform: 'uppercase'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 153, 51, 0.45)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(255, 153, 51, 0.3)';
              }}
            >
              🔥 Register Now
            </a>

            <a 
              href="https://chat.whatsapp.com/L7lXF9VZQRDCx0aXXwBhGw?s=sw&p=a&mlu=2" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 24px',
                background: '#16a34a',
                color: '#fff',
                borderRadius: 8,
                fontSize: 12.5,
                fontFamily: 'Montserrat,sans-serif',
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)',
                transition: 'all 0.25s',
                textTransform: 'uppercase'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(22, 163, 74, 0.45)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(22, 163, 74, 0.3)';
              }}
            >
              💬 WhatsApp Group
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   HOME PAGE
   ═══════════════════════════════════════════════ */
export default function Home() {
  return (
    <div style={{ width: '100%' }}>
      <OrientationModal />
      <HeroSection />
      <NewsTicker />
      <EventRoundsCarousel />
      <AboutSection />
      <TimelineSection />
      <WhySVHSection />
      <EvaluationSection />
      <OrganizersSection />
      <RegistrationCTA />
    </div>
  );
}
