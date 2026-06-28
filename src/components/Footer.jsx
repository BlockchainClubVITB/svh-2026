import { Link } from 'react-router-dom';
import blockchainLogo from '../assets/Blockchain.png';
import svhLogo        from '../assets/svh.jpeg';

const socials = [
  {
    label: 'LinkedIn', href: 'https://in.linkedin.com/company/blockchain-club-vitb',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16 }}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" /></svg>,
  },
  {
    label: 'Instagram', href: 'https://www.instagram.com/blockchain.vitb/',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>,
  },
  {
    label: 'Facebook', href: 'https://www.facebook.com/blockchainclubvitb/',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16 }}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>,
  },
  {
    label: 'YouTube', href: 'https://youtube.com/@blockchainclubvitb',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16 }}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>,
  },
];

const quickLinks = [
  { label: 'Home',                to: '/' },
  { label: 'Guidelines',         to: '/guidelines' },
  { label: 'Problem Statements', to: '/problem-statements' },
  { label: 'FAQs',               to: '/faq' },
  { label: 'Contact Us',         to: '/contact' },
];

const timelineLinks = [
  { label: 'Registration: 1–20 July 2026',        phase: 'Round 1' },
  { label: 'PPT Submission: 20 Jul – 5 Aug 2026', phase: 'Round 2' },
  { label: 'Evaluation: 5–10 Aug 2026',           phase: 'Results' },
  { label: 'Grand Finale: 24–25 Aug 2026',        phase: 'Finale' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: 'linear-gradient(160deg, #07192c 0%, #0a1d35 100%)', color: '#fff', position: 'relative' }}>
      {/* Tricolour top */}
      <div style={{ height: 4, background: 'linear-gradient(to right, #FF9933 33.33%, rgba(255,255,255,0.5) 33.33% 66.66%, #138808 66.66%)' }} />

      {/* Main footer grid */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 24px 40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 48 }}>

        {/* Column 1 — Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <img src={svhLogo} alt="SVH 2026" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid #FF9933' }} />
            <div>
              <div style={{ color: '#fff', fontSize: 14, fontFamily: 'Montserrat,sans-serif', fontWeight: 800, letterSpacing: 1, lineHeight: 1.2 }}>Smart VIT Hackathon</div>
              <div style={{ color: '#FF9933', fontSize: 11, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, letterSpacing: 4 }}>SVH 2026</div>
            </div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, fontFamily: 'Poppins,sans-serif', lineHeight: 1.8, marginBottom: 20 }}>
            An internal hackathon inspired by Smart India Hackathon, organized by the Blockchain Club, VIT Bhopal University.
          </p>

          {/* Blockchain Club logo */}
          <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={blockchainLogo} alt="Blockchain Club" style={{ height: 36, width: 'auto', objectFit: 'contain', filter: 'brightness(1.1)' }} />
            <div>
              <div style={{ color: '#FF9933', fontSize: 12, fontFamily: 'Montserrat,sans-serif', fontWeight: 700 }}>Blockchain Club</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'Poppins,sans-serif' }}>VIT Bhopal University</div>
            </div>
          </div>

          {/* Socials */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {socials.map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.65)', textDecoration: 'none', transition: 'all 0.2s', border: '1px solid rgba(255,255,255,0.08)' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#FF9933'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#FF9933'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Column 2 — Quick Links */}
        <div>
          <h4 style={{ color: '#FF9933', fontSize: 13, fontFamily: 'Montserrat,sans-serif', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid rgba(255,153,51,0.2)' }}>
            Quick Links
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {quickLinks.map((l, i) => (
              <li key={i}>
                <Link to={l.to} style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontFamily: 'Poppins,sans-serif', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#FF9933'; e.currentTarget.style.paddingLeft = '4px'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.paddingLeft = '0'; }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#FF9933', display: 'inline-block', flexShrink: 0 }} />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3 — Key Dates */}
        <div>
          <h4 style={{ color: '#138808', fontSize: 13, fontFamily: 'Montserrat,sans-serif', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid rgba(19,136,8,0.3)' }}>
            Key Dates 2026
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {timelineLinks.map((l, i) => (
              <li key={i} style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontFamily: 'Poppins,sans-serif', fontWeight: 500, lineHeight: 1.5 }}>
                {l.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4 — Contact */}
        <div>
          <h4 style={{ color: '#FF9933', fontSize: 13, fontFamily: 'Montserrat,sans-serif', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid rgba(255,153,51,0.2)' }}>
            Contact Us
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Email */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,153,51,0.7)" strokeWidth="1.8" style={{ width: 18, height: 18, flexShrink: 0, marginTop: 2 }}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 7l10 7 10-7" strokeLinecap="round" /></svg>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Email</div>
                <a href="mailto:blockchainclub@vitbhopal.ac.in" style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, fontFamily: 'Poppins,sans-serif', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#FF9933'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}>
                  blockchainclub@vitbhopal.ac.in
                </a>
              </div>
            </div>
            {/* Address */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,153,51,0.7)" strokeWidth="1.8" style={{ width: 18, height: 18, flexShrink: 0, marginTop: 2 }}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="9" r="2.5" /></svg>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Address</div>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, fontFamily: 'Poppins,sans-serif', margin: 0, lineHeight: 1.6 }}>
                  VIT Bhopal University,<br />
                  Kothri Kalan, Sehore,<br />
                  Madhya Pradesh 466114
                </p>
              </div>
            </div>
            {/* Faculty */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,153,51,0.7)" strokeWidth="1.8" style={{ width: 18, height: 18, flexShrink: 0, marginTop: 2 }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" /><circle cx="12" cy="7" r="4" /></svg>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Faculty Coordinator</div>
                <p style={{ color: '#FF9933', fontSize: 13, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, margin: 0 }}>Dr. Hemraj Lamkuche</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '20px 24px', maxWidth: 1400, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, fontFamily: 'Poppins,sans-serif', margin: 0 }}>
          © {year} Smart VIT Hackathon · Blockchain Club, VIT Bhopal University. All rights reserved.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 30, height: 3, background: '#FF9933', borderRadius: 2 }} />
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'Montserrat,sans-serif', fontWeight: 600 }}>BHARAT</span>
          <span style={{ width: 30, height: 3, background: '#138808', borderRadius: 2 }} />
        </div>
      </div>

      {/* Tricolour bottom */}
      <div style={{ height: 4, background: 'linear-gradient(to right, #FF9933 33.33%, rgba(255,255,255,0.4) 33.33% 66.66%, #138808 66.66%)' }} />
    </footer>
  );
}
