import { useEffect, useRef, useState, useMemo } from 'react';

/* ═══════════════════════════════════════════════
   SHARED UTILITIES
═══════════════════════════════════════════════ */
function FloatingParticles({ count = 10 }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${(i * 43 + 9) % 95 + 2}%`,
      size: (i % 3) + 2,
      duration: 11 + (i % 5) * 2.5,
      delay: -((i * 3.1) % 10),
      color: i % 3 === 0 ? 'rgba(255,153,51,0.4)' : i % 3 === 1 ? 'rgba(19,136,8,0.3)' : 'rgba(255,255,255,0.15)',
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

function useInView(threshold = 0.1) {
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

/* Social link card */
function SocialCard({ name, handle, url, icon, color, bgColor, index, visible }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '18px 22px',
        background: 'rgba(255,255,255,0.05)',
        border: `1.5px solid rgba(255,255,255,0.1)`,
        borderRadius: 14, textDecoration: 'none',
        transition: 'all 0.25s ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(18px)',
        transitionDelay: `${0.1 + index * 0.08}s`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = bgColor;
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.transform = 'translateX(6px)';
        e.currentTarget.style.boxShadow = `0 8px 28px ${color}30`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: bgColor, border: `1.5px solid ${color}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, flexShrink: 0,
        transition: 'all 0.22s',
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, color: '#fff', fontSize: 14, marginBottom: 2 }}>{name}</div>
        <div style={{ fontFamily: 'Poppins,sans-serif', color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{handle}</div>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5">
        <path d="M7 17L17 7M7 7h10v10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}

/* Contact info row */
function ContactRow({ icon, label, value, link, color = '#FF9933', delay, visible }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    if (link && link.startsWith('mailto:')) {
      navigator.clipboard.writeText(link.replace('mailto:', ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{
      display: 'flex', gap: 16, alignItems: 'flex-start',
      padding: '18px',
      background: `${color}06`,
      border: `1.5px solid ${color}18`,
      borderRadius: 14,
      transition: 'all 0.22s',
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateX(-20px)',
      transitionDelay: `${delay}s`,
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}45`; e.currentTarget.style.background = `${color}0e`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = `${color}18`; e.currentTarget.style.background = `${color}06`; }}>
      <div style={{
        width: 46, height: 46, borderRadius: 12,
        background: `${color}12`, border: `1.5px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, color: '#999', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
        {link ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <a href={link} style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, color: '#0f2942', fontSize: 14, textDecoration: 'none', wordBreak: 'break-all', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = color}
              onMouseLeave={e => e.currentTarget.style.color = '#0f2942'}>
              {value}
            </a>
            {link.startsWith('mailto:') && (
              <button onClick={handleCopy} style={{
                padding: '3px 10px', background: copied ? '#138808' : `${color}12`,
                border: `1px solid ${copied ? '#138808' : color + '35'}`,
                borderRadius: 6, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 10,
                color: copied ? '#fff' : color, cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0,
              }}>
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            )}
          </div>
        ) : (
          <div style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, color: '#0f2942', fontSize: 14, lineHeight: 1.5 }}>{value}</div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   CONTACT US PAGE
═══════════════════════════════════════════════ */
export default function ContactUs() {
  const [mounted, setMounted] = useState(false);
  const [leftRef, leftVisible] = useInView(0.1);
  const [rightRef, rightVisible] = useInView(0.1);
  const [bottomRef, bottomVisible] = useInView(0.1);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  const a = (delay) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(22px)',
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  const socials = [
    { name: 'LinkedIn', handle: 'Blockchain Club VITB', url: 'https://linkedin.com/company/blockchain-club-vitb', icon: '💼', color: '#0A66C2', bgColor: 'rgba(10,102,194,0.15)' },
    { name: 'Instagram', handle: '@blockchain.vitb', url: 'https://instagram.com/blockchain.vitb', icon: '📸', color: '#E1306C', bgColor: 'rgba(225,48,108,0.15)' },
    { name: 'YouTube', handle: '@blockchainclubvitb', url: 'https://youtube.com/@blockchainclubvitb', icon: '▶️', color: '#FF0000', bgColor: 'rgba(255,0,0,0.12)' },
    { name: 'X (Twitter)', handle: '@blockchainvitb', url: 'https://x.com/blockchainvitb', icon: '🐦', color: '#1DA1F2', bgColor: 'rgba(29,161,242,0.15)' },
  ];

  return (
    <div style={{ width: '100%', background: '#f8f9fb', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <section style={{
        position: 'relative',
        background: 'linear-gradient(160deg, #07192c 0%, #0f2942 55%, #07192c 100%)',
        padding: '80px 20px 90px', overflow: 'hidden',
      }}>
        <FloatingParticles count={12} />
        <div style={{ position: 'absolute', top: '15%', right: '5%', width: 320, height: 320, background: 'radial-gradient(circle, rgba(255,153,51,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: '5%', left: '5%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(19,136,8,0.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(to right, #FF9933 33.33%, #fff 33.33% 66.66%, #138808 66.66%)' }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ ...a(80), display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', background: 'rgba(255,153,51,0.12)', border: '1px solid rgba(255,153,51,0.3)', borderRadius: 40, marginBottom: 24 }}>
            <span style={{ fontSize: 14 }}>📬</span>
            <span style={{ color: '#FF9933', fontSize: 11, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase' }}>Blockchain Club · VIT Bhopal</span>
          </div>

          <h1 style={{ ...a(200), margin: '0 0 16px', fontFamily: 'Montserrat,sans-serif', fontWeight: 900, fontSize: 'clamp(30px,5.5vw,60px)', color: '#fff', lineHeight: 1.05, letterSpacing: -1 }}>
            Get In{' '}
            <span style={{ background: 'linear-gradient(90deg, #FF9933 0%, #ffffff 50%, #138808 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Touch
            </span>
          </h1>

          <p style={{ ...a(360), color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(14px,2vw,17px)', fontFamily: 'Poppins,sans-serif', maxWidth: 580, margin: '0 auto', lineHeight: 1.75 }}>
            Have questions about SVH 2026? Reach out to the Blockchain Club, VIT Bhopal — we're here to help every step of the way.
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 16px 80px' }}>

        {/* Top 2-column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 28, marginBottom: 28 }}>

          {/* Left: Contact Info */}
          <div ref={leftRef}>
            <div style={{ background: '#fff', borderRadius: 20, padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1.5px solid rgba(0,0,0,0.07)', height: '100%' }}>
              <h2 style={{
                fontFamily: 'Montserrat,sans-serif', fontWeight: 900, color: '#0f2942',
                fontSize: 'clamp(18px,2.5vw,22px)', marginBottom: 8,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ width: 4, height: 22, background: '#FF9933', borderRadius: 2, display: 'inline-block' }} />
                Official Channels
              </h2>
              <p style={{ fontFamily: 'Poppins,sans-serif', color: '#888', fontSize: 13, lineHeight: 1.7, marginBottom: 24 }}>
                Reach us through any of the following official contacts for SVH 2026 queries.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <ContactRow
  icon="📧"
  label="Email Address"
  value="blockchainclub@vitbhopal.ac.in"
  link="mailto:blockchainclub@vitbhopal.ac.in"
  color="#FF9933"
  delay={0.1}
  visible={leftVisible}
/>

<ContactRow
  icon="💬"
  label="WhatsApp Group"
  value="Join Official SVH WhatsApp Group"
  link="https://chat.whatsapp.com/L7lXF9VZQRDCx0aXXwBhGw?s=sw&p=a&mlu=2"
  color="#25D366"
  delay={0.15}
  visible={leftVisible}
/>

<ContactRow
  icon="📍"
  label="Location"
  value={
    <>
      VIT Bhopal University, Kothri Kalan,
      <br />
      Sehore, Madhya Pradesh – 466114
    </>
  }
  color="#138808"
  delay={0.2}
  visible={leftVisible}
/>

<ContactRow
  icon="👨‍🏫"
  label="Faculty Coordinator"
  value={
    <>
      <strong style={{ display: 'block' }}>Dr. Hemraj Lamkuche</strong>
      <span style={{ fontSize: 12, color: '#aaa' }}>
        Blockchain Club · VIT Bhopal University
      </span>
    </>
  }
  color="#06038D"
  delay={0.3}
  visible={leftVisible}
/>
              </div>
            </div>
          </div>

          {/* Right: Social Media */}
          <div ref={rightRef}>
            <div style={{
              background: 'linear-gradient(135deg, #0f2942 0%, #07192c 100%)',
              borderRadius: 20, padding: '32px',
              border: '1.5px solid rgba(255,153,51,0.18)',
              height: '100%',
            }}>
              <h2 style={{
                fontFamily: 'Montserrat,sans-serif', fontWeight: 900, color: '#FF9933',
                fontSize: 'clamp(18px,2.5vw,22px)', marginBottom: 8,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ width: 4, height: 22, background: '#FF9933', borderRadius: 2, display: 'inline-block' }} />
                Follow Our Club
              </h2>
              <p style={{ fontFamily: 'Poppins,sans-serif', color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.7, marginBottom: 24 }}>
                Stay updated with real-time announcements, session schedules, resources, and event updates.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {socials.map((soc, i) => (
                  <SocialCard key={i} {...soc} index={i} visible={rightVisible} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Map + Quick info */}
        <div ref={bottomRef} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
          gap: 28,
          opacity: bottomVisible ? 1 : 0,
          transform: bottomVisible ? 'none' : 'translateY(28px)',
          transition: 'all 0.65s ease',
        }}>

          {/* Quick response card */}
          <div style={{
            background: 'linear-gradient(135deg, #FF9933, #e07800)',
            borderRadius: 20, padding: '32px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', right: -20, bottom: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', right: 20, top: -30, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>⚡</div>
              <h3 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 900, color: '#fff', fontSize: 20, marginBottom: 10 }}>Quick Response</h3>
              <p style={{ fontFamily: 'Poppins,sans-serif', color: 'rgba(255,255,255,0.85)', fontSize: 13.5, lineHeight: 1.7, marginBottom: 20 }}>
                We typically respond to all queries within 24–48 hours during the registration and submission period.
              </p>
              <a href="mailto:blockchainclub@vitbhopal.ac.in"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '11px 24px', background: '#fff',
                  color: '#e07800', borderRadius: 8, fontFamily: 'Montserrat,sans-serif',
                  fontWeight: 800, fontSize: 12, textDecoration: 'none', textTransform: 'uppercase',
                  letterSpacing: 1, transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                📧 Send Email
              </a>
            </div>
          </div>

          {/* Location card */}
          <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1.5px solid rgba(0,0,0,0.07)' }}>
            {/* Map placeholder */}
            <div style={{
              height: 160,
              background: 'linear-gradient(135deg, #0f2942 0%, #07192c 100%)',
              position: 'relative', overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {/* Grid lines */}
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{ position: 'absolute', left: `${i * 33}%`, top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.07)' }} />
              ))}
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{ position: 'absolute', top: `${i * 33}%`, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.07)' }} />
              ))}
              <div style={{ textAlign: 'center', zIndex: 1, position: 'relative' }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>📍</div>
                <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, color: '#FF9933', fontSize: 13 }}>VIT Bhopal University</div>
                <div style={{ fontFamily: 'Poppins,sans-serif', color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Kothri Kalan, Sehore MP</div>
              </div>
            </div>
            <div style={{ padding: '20px 22px' }}>
              <h3 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, color: '#0f2942', fontSize: 15, marginBottom: 6 }}>Event Venue</h3>
              <p style={{ fontFamily: 'Poppins,sans-serif', color: '#777', fontSize: 13, lineHeight: 1.65, marginBottom: 14 }}>
                VIT Bhopal University, Kothri Kalan, Sehore, Madhya Pradesh – 466114. Grand Finale held on-campus.
              </p>
              <a href="https://maps.google.com/?q=VIT+Bhopal+University" target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px', background: 'rgba(255,153,51,0.1)',
                  border: '1.5px solid rgba(255,153,51,0.3)',
                  borderRadius: 8, fontFamily: 'Montserrat,sans-serif', fontWeight: 700,
                  fontSize: 12, color: '#FF9933', textDecoration: 'none', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#FF9933'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,153,51,0.1)'; e.currentTarget.style.color = '#FF9933'; }}>
                🗺️ Open in Maps
              </a>
            </div>
          </div>

          {/* Event highlights card */}
          <div style={{ background: 'linear-gradient(135deg, #0f2942, #07192c)', borderRadius: 20, padding: '28px', border: '1.5px solid rgba(19,136,8,0.2)' }}>
            <h3 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 900, color: '#fff', fontSize: 16, marginBottom: 4 }}>
              <span style={{ color: '#138808' }}>SVH 2026</span> at a Glance
            </h3>
            <p style={{ fontFamily: 'Poppins,sans-serif', color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 20 }}>
              Key event details for quick reference
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: '📅', label: 'Registration', val: '1 – 20 Jul 2026' },
                { icon: '💰', label: 'Fee', val: '₹75/member · ₹450/team' },
                { icon: '👥', label: 'Team Size', val: '6 members (min. 1 female)' },
                { icon: '📋', label: 'Problem Statements', val: '12 total (10 SW + 2 HW)' },
                { icon: '🚀', label: 'Grand Finale', val: '24–25 Aug 2026 (Tentative)' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Poppins,sans-serif', color: 'rgba(255,255,255,0.4)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>{item.label}</div>
                    <div style={{ fontFamily: 'Montserrat,sans-serif', color: '#fff', fontSize: 12, fontWeight: 700 }}>{item.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
