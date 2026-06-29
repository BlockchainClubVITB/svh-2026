import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';

import blockchainLogo from '../assets/Blockchain.png';
import iicLogo from '../assets/IIC Logo.png';
import swLogo from '../assets/SW Office Logo.png';
import vitbLogo from '../assets/vitblogo.png';
import svhLogo from '../assets/svh.jpeg';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('#svh-nav')) { setOpenDropdown(null); setMobileOpen(false); }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = [
    { label: 'Home', to: '/', end: true },
    { label: 'Guidelines', to: '/guidelines' },
    { label: 'Problem Statements', to: '/problem-statements' },
    { label: 'FAQs', to: '/faq' },
    { label: 'Contact Us', to: '/contact' },
  ];

  const aboutDropdown = [
    { label: 'SVH Process Flow', href: '/#process-flow' },
    { label: 'Event Structure', href: '/#event-structure' },
    { label: 'Organizers', href: '/#organizers' },
  ];

  return (
    <header id="svh-nav" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>



      {/* ── MAIN NAV ── */}
      <nav style={{
        background: scrolled ? 'rgba(7,25,44,0.97)' : '#0f2942',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: '1px solid rgba(255,153,51,0.18)',
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.35)' : 'none',
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>

          {/* Brand */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src={svhLogo} alt="SVH 2026" style={{ height: 38, width: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid #FF9933' }} />
            <div style={{ lineHeight: 1.15 }}>
              <div style={{ color: '#fff', fontSize: 13, fontFamily: 'Montserrat,sans-serif', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase' }}>
                Smart VIT Hackathon
              </div>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <span style={{ width: 8, height: 3, background: '#FF9933', borderRadius: 1 }} />
                <span style={{ color: '#FF9933', fontSize: 10, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, letterSpacing: 3 }}>SVH 2026</span>
                <span style={{ width: 8, height: 3, background: '#138808', borderRadius: 1 }} />
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="hidden lg:flex">
            {/* About dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'about' ? null : 'about')}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '20px 14px', color: openDropdown === 'about' ? '#FF9933' : 'rgba(255,255,255,0.85)',
                  fontSize: 13, fontFamily: 'Montserrat,sans-serif', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 4, transition: 'color 0.2s',
                  borderBottom: openDropdown === 'about' ? '2px solid #FF9933' : '2px solid transparent',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#FF9933'}
                onMouseLeave={e => e.currentTarget.style.color = openDropdown === 'about' ? '#FF9933' : 'rgba(255,255,255,0.85)'}
              >
                About SVH
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  style={{ transform: openDropdown === 'about' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                  <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {openDropdown === 'about' && (
                <div style={{ position: 'absolute', top: '100%', left: 0, background: '#0a1d35', border: '1px solid rgba(255,153,51,0.2)', borderRadius: 10, minWidth: 200, overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.4)', zIndex: 200 }}>
                  {aboutDropdown.map((item, i) => (
                    <a key={i} href={item.href} onClick={() => setOpenDropdown(null)}
                      style={{ display: 'block', padding: '10px 18px', color: 'rgba(255,255,255,0.8)', fontSize: 13, fontFamily: 'Montserrat,sans-serif', fontWeight: 600, textDecoration: 'none', borderBottom: i < aboutDropdown.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', transition: 'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,153,51,0.12)'; e.currentTarget.style.color = '#FF9933'; e.currentTarget.style.paddingLeft = '24px'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; e.currentTarget.style.paddingLeft = '18px'; }}>
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {navLinks.slice(1).map((link, i) => (
              <NavLink key={i} to={link.to} end={link.end}
                style={({ isActive }) => ({
                  padding: '20px 14px',
                  color: isActive ? '#FF9933' : 'rgba(255,255,255,0.85)',
                  fontSize: 13, fontFamily: 'Montserrat,sans-serif', fontWeight: 600,
                  textDecoration: 'none', transition: 'all 0.2s',
                  borderBottom: isActive ? '2px solid #FF9933' : '2px solid transparent',
                  display: 'block',
                })}
                onMouseEnter={e => { e.currentTarget.style.color = '#FF9933'; }}
                onMouseLeave={e => { }}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

            {/* Login */}
            <Link to="/login"
              style={{
                padding: '7px 18px',
                background: 'transparent',
                color: 'rgba(255,255,255,0.85)',
                borderRadius: 6,
                fontSize: 12,
                fontFamily: 'Montserrat,sans-serif',
                fontWeight: 700,
                textDecoration: 'none',
                textTransform: 'uppercase',
                letterSpacing: 1,
                border: '1.5px solid rgba(255,255,255,0.28)',
                transition: 'all 0.2s',
                display: 'block',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF9933'; e.currentTarget.style.color = '#FF9933'; e.currentTarget.style.background = 'rgba(255,153,51,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; e.currentTarget.style.background = 'transparent'; }}
              className="hidden sm:block"
            >
              Login
            </Link>

            {/* Register Now */}
            <Link to="/guidelines"
              style={{
                padding: '8px 20px',
                background: 'linear-gradient(135deg, #FF9933, #e07800)',
                color: '#fff',
                borderRadius: 6,
                fontSize: 12,
                fontFamily: 'Montserrat,sans-serif',
                fontWeight: 800,
                textDecoration: 'none',
                textTransform: 'uppercase',
                letterSpacing: 1,
                boxShadow: '0 4px 14px rgba(255,153,51,0.35)',
                transition: 'all 0.2s',
                display: 'block',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,153,51,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(255,153,51,0.35)'; }}
              className="hidden sm:block"
            >
              Register Now
            </Link>

            {/* Hamburger */}
            <button
              className="lg:hidden"
              onClick={() => setMobileOpen(v => !v)}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 4 }}
              aria-label="Toggle menu"
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div style={{ background: '#07192c', borderTop: '1px solid rgba(255,153,51,0.15)', padding: '8px 0' }} className="lg:hidden">
            <Link to="/" onClick={() => setMobileOpen(false)} style={mobileNavStyle}>Home</Link>
            {aboutDropdown.map((item, i) => (
              <a key={i} href={item.href} onClick={() => setMobileOpen(false)} style={mobileNavStyle}>{item.label}</a>
            ))}
            <Link to="/guidelines" onClick={() => setMobileOpen(false)} style={mobileNavStyle}>Guidelines</Link>
            <Link to="/problem-statements" onClick={() => setMobileOpen(false)} style={mobileNavStyle}>Problem Statements</Link>
            <Link to="/faq" onClick={() => setMobileOpen(false)} style={mobileNavStyle}>FAQs</Link>
            <Link to="/contact" onClick={() => setMobileOpen(false)} style={mobileNavStyle}>Contact Us</Link>
            <div style={{ padding: '10px 20px', display: 'flex', gap: 8 }}>
              <Link to="/login" onClick={() => setMobileOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '10px', background: 'transparent', color: 'rgba(255,255,255,0.85)', border: '1.5px solid rgba(255,255,255,0.28)', borderRadius: 6, fontSize: 12, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: 1 }}>
                Login
              </Link>
              <Link to="/guidelines" onClick={() => setMobileOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '10px', background: 'linear-gradient(135deg,#FF9933,#e07800)', color: '#fff', borderRadius: 6, fontSize: 12, fontFamily: 'Montserrat,sans-serif', fontWeight: 800, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: 1 }}>
                Register
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── BOTTOM TRICOLOUR STRIP ── */}
      <div style={{ height: 3, background: 'linear-gradient(to right, #FF9933 33.33%, rgba(255,255,255,0.25) 33.33% 66.66%, #138808 66.66%)' }} />
    </header>
  );
}

const mobileNavStyle = {
  display: 'block',
  padding: '12px 24px',
  color: 'rgba(255,255,255,0.85)',
  fontSize: 14,
  fontFamily: 'Montserrat,sans-serif',
  fontWeight: 600,
  textDecoration: 'none',
  borderBottom: '1px solid rgba(255,255,255,0.05)',
  transition: 'color 0.2s',
};
