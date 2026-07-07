import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';

import svhLogo from '../assets/svh.jpeg';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null); // for mobile accordion
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('#svh-nav')) {
        setOpenDropdown(null);
        setMobileOpen(false);
        setMobileExpanded(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
        setMobileExpanded(null);
      }
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const aboutDropdown = [
    { label: 'SVH Process Flow', href: '/#process-flow' },
    { label: 'Event Structure', href: '/#event-structure' },
    { label: 'Organizers', href: '/#organizers' },
  ];

  const guidelinesDropdown = [
    { label: 'General Rules', href: '/guidelines#general-rules' },
    { label: 'PPT Submission Guidelines', href: '/guidelines#ppt-submission' },
  ];

  const handleAnchorNav = (href) => {
    setOpenDropdown(null);
    setMobileOpen(false);
    setMobileExpanded(null);
    const [path, hash] = href.split('#');
    navigate(path || '/');
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const navLinks = [
    { label: 'Problem Statements', to: '/problem-statements' },
    { label: 'FAQs', to: '/faq' },
    { label: 'Contact Us', to: '/contact' },
  ];

  const dropdownStyle = {
    position: 'absolute',
    top: '100%',
    left: 0,
    background: '#0a1d35',
    border: '1px solid rgba(255,153,51,0.2)',
    borderRadius: 10,
    minWidth: 220,
    overflow: 'hidden',
    boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
    zIndex: 200,
    animation: 'fadeInDown 0.18s ease',
  };

  return (
    <>
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes mobileSlideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .nav-link-hover:hover { color: #FF9933 !important; }
        .dropdown-item:hover { background: rgba(255,153,51,0.12) !important; color: #FF9933 !important; padding-left: 24px !important; }
      `}</style>

      <header id="svh-nav" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>

        {/* ── MAIN NAV ── */}
        <nav style={{
          background: scrolled ? 'rgba(7,25,44,0.97)' : '#0f2942',
          backdropFilter: scrolled ? 'blur(14px)' : 'none',
          borderBottom: '1px solid rgba(255,153,51,0.18)',
          transition: 'all 0.3s ease',
          boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.35)' : 'none',
        }}>
          <div style={{
            maxWidth: 1400, margin: '0 auto',
            padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            height: 60,
          }}>

            {/* Brand */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
              <img src={svhLogo} alt="SVH 2026" style={{ height: 36, width: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #FF9933' }} />
              <div style={{ lineHeight: 1.15 }}>
                <div style={{ color: '#fff', fontSize: 12, fontFamily: 'Montserrat,sans-serif', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  Smart VIT Hackathon
                </div>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <span style={{ width: 8, height: 3, background: '#FF9933', borderRadius: 1 }} />
                  <span style={{ color: '#FF9933', fontSize: 9, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, letterSpacing: 3 }}>SVH 2026</span>
                  <span style={{ width: 8, height: 3, background: '#138808', borderRadius: 1 }} />
                </div>
              </div>
            </Link>

            {/* Desktop nav */}
            <div style={{ display: 'none', alignItems: 'center', gap: 2 }} className="desktop-nav">

              {/* About SVH dropdown */}
              <DesktopDropdown
                label="About SVH"
                items={aboutDropdown}
                isOpen={openDropdown === 'about'}
                onToggle={() => setOpenDropdown(openDropdown === 'about' ? null : 'about')}
                onItemClick={handleAnchorNav}
              />

              {/* Guidelines dropdown */}
              <DesktopDropdown
                label="Guidelines"
                items={guidelinesDropdown}
                isOpen={openDropdown === 'guidelines'}
                onToggle={() => setOpenDropdown(openDropdown === 'guidelines' ? null : 'guidelines')}
                onItemClick={handleAnchorNav}
              />

              {navLinks.map((link, i) => (
                <NavLink key={i} to={link.to}
                  style={({ isActive }) => ({
                    padding: '20px 14px',
                    color: isActive ? '#FF9933' : 'rgba(255,255,255,0.85)',
                    fontSize: 13, fontFamily: 'Montserrat,sans-serif', fontWeight: 600,
                    textDecoration: 'none', transition: 'all 0.2s',
                    borderBottom: isActive ? '2px solid #FF9933' : '2px solid transparent',
                    display: 'block', whiteSpace: 'nowrap',
                  })}
                  className="nav-link-hover"
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Right buttons + Hamburger */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

              {/* Login — hidden on mobile */}
              <Link to="/login"
                style={{
                  padding: '7px 16px',
                  background: 'transparent',
                  color: 'rgba(255,255,255,0.85)',
                  borderRadius: 6,
                  fontSize: 11,
                  fontFamily: 'Montserrat,sans-serif',
                  fontWeight: 700,
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  border: '1.5px solid rgba(255,255,255,0.28)',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
                className="desktop-btn"
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF9933'; e.currentTarget.style.color = '#FF9933'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}
              >
                Login
              </Link>

              {/* Register Now — hidden on mobile */}
              <a href="https://forms.gle/zYNYkjygKYfbAjhy6"
                target="_blank" rel="noopener noreferrer"
                style={{
                  padding: '8px 18px',
                  background: 'linear-gradient(135deg, #FF9933, #e07800)',
                  color: '#fff',
                  borderRadius: 6,
                  fontSize: 11,
                  fontFamily: 'Montserrat,sans-serif',
                  fontWeight: 800,
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  boxShadow: '0 4px 14px rgba(255,153,51,0.35)',
                  transition: 'all 0.25s',
                  whiteSpace: 'nowrap',
                }}
                className="desktop-btn"
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,153,51,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(255,153,51,0.35)'; }}
              >
                Register
              </a>
              
              {/* Hamburger — shown only on mobile */}
              <button
                className="hamburger-btn"
                onClick={() => { setMobileOpen(v => !v); setMobileExpanded(null); }}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px', display: 'none', alignItems: 'center', justifyContent: 'center' }}
                aria-label="Toggle menu"
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  {mobileOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  }
                </svg>
              </button>
            </div>
          </div>

          {/* ── MOBILE MENU ── */}
          {mobileOpen && (
            <div style={{
              background: '#07192c',
              borderTop: '1px solid rgba(255,153,51,0.18)',
              maxHeight: 'calc(100vh - 64px)',
              overflowY: 'auto',
              animation: 'mobileSlideDown 0.22s ease',
            }} className="mobile-menu">

              {/* About SVH mobile accordion */}
              <MobileAccordion
                label="About SVH"
                items={aboutDropdown}
                isOpen={mobileExpanded === 'about'}
                onToggle={() => setMobileExpanded(mobileExpanded === 'about' ? null : 'about')}
                onItemClick={handleAnchorNav}
              />

              {/* Guidelines mobile accordion */}
              <MobileAccordion
                label="Guidelines"
                items={guidelinesDropdown}
                isOpen={mobileExpanded === 'guidelines'}
                onToggle={() => setMobileExpanded(mobileExpanded === 'guidelines' ? null : 'guidelines')}
                onItemClick={handleAnchorNav}
              />

              {navLinks.map((link, i) => (
                <NavLink key={i} to={link.to}
                  onClick={() => setMobileOpen(false)}
                  style={({ isActive }) => ({
                    ...mobileNavStyle,
                    color: isActive ? '#FF9933' : 'rgba(255,255,255,0.85)',
                    borderLeft: isActive ? '3px solid #FF9933' : '3px solid transparent',
                    paddingLeft: isActive ? 20 : 22,
                  })}
                >
                  {link.label}
                </NavLink>
              ))}

              {/* Mobile CTA buttons */}
              <div style={{ padding: '12px 16px', display: 'flex', gap: 10, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <Link to="/login" onClick={() => setMobileOpen(false)}
                  style={{ flex: 1, textAlign: 'center', padding: '11px 10px', background: 'transparent', color: 'rgba(255,255,255,0.85)', border: '1.5px solid rgba(255,255,255,0.28)', borderRadius: 7, fontSize: 12, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Login
                </Link>
                <a href="https://forms.gle/zYNYkjygKYfbAjhy6"
                  target="_blank" rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  style={{ flex: 1, textAlign: 'center', padding: '11px 10px', background: 'linear-gradient(135deg,#FF9933,#e07800)', color: '#fff', borderRadius: 7, fontSize: 12, fontFamily: 'Montserrat,sans-serif', fontWeight: 800, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: 1, boxShadow: '0 4px 12px rgba(255,153,51,0.35)' }}>
                  Register
                </a>
              </div>
            </div>
          )}
        </nav>

        {/* Tricolour strip */}
        <div style={{ height: 3, background: 'linear-gradient(to right, #FF9933 33.33%, rgba(255,255,255,0.25) 33.33% 66.66%, #138808 66.66%)' }} />

        {/* Responsive CSS */}
        <style>{`
          @media (min-width: 1024px) {
            .desktop-nav { display: flex !important; }
            .desktop-btn { display: block !important; }
            .hamburger-btn { display: none !important; }
            .mobile-menu { display: none !important; }
          }
          @media (max-width: 1023px) {
            .desktop-nav { display: none !important; }
            .desktop-btn { display: none !important; }
            .hamburger-btn { display: flex !important; }
          }
        `}</style>
      </header>
    </>
  );
}

/* Desktop dropdown component */
function DesktopDropdown({ label, items, isOpen, onToggle, onItemClick }) {
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={onToggle}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '20px 14px',
          color: isOpen ? '#FF9933' : 'rgba(255,255,255,0.85)',
          fontSize: 13, fontFamily: 'Montserrat,sans-serif', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 4, transition: 'color 0.2s',
          borderBottom: isOpen ? '2px solid #FF9933' : '2px solid transparent',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#FF9933'}
        onMouseLeave={e => e.currentTarget.style.color = isOpen ? '#FF9933' : 'rgba(255,255,255,0.85)'}
      >
        {label}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {isOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0,
          background: '#0a1d35',
          border: '1px solid rgba(255,153,51,0.2)',
          borderRadius: 10, minWidth: 220, overflow: 'hidden',
          boxShadow: '0 16px 40px rgba(0,0,0,0.4)', zIndex: 200,
          animation: 'fadeInDown 0.18s ease',
        }}>
          {items.map((item, i) => (
            <button key={i}
              onClick={() => onItemClick(item.href)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '10px 18px',
                color: 'rgba(255,255,255,0.8)',
                fontSize: 13, fontFamily: 'Montserrat,sans-serif', fontWeight: 600,
                textDecoration: 'none', background: 'transparent', border: 'none', cursor: 'pointer',
                borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,153,51,0.12)'; e.currentTarget.style.color = '#FF9933'; e.currentTarget.style.paddingLeft = '24px'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; e.currentTarget.style.paddingLeft = '18px'; }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* Mobile accordion item */
function MobileAccordion({ label, items, isOpen, onToggle, onItemClick }) {
  return (
    <div>
      <button
        onClick={onToggle}
        style={{
          ...mobileNavStyle,
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderLeft: isOpen ? '3px solid #FF9933' : '3px solid transparent',
          paddingLeft: isOpen ? 20 : 22,
          color: isOpen ? '#FF9933' : 'rgba(255,255,255,0.85)',
        }}
      >
        <span>{label}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0, marginRight: 4 }}>
          <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {isOpen && (
        <div style={{ background: 'rgba(255,153,51,0.04)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          {items.map((item, i) => (
            <button key={i}
              onClick={() => onItemClick(item.href)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '10px 16px 10px 34px',
                color: 'rgba(255,255,255,0.7)',
                fontSize: 13, fontFamily: 'Montserrat,sans-serif', fontWeight: 500,
                background: 'transparent', border: 'none', cursor: 'pointer',
                borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#FF9933'; e.currentTarget.style.paddingLeft = '40px'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.paddingLeft = '34px'; }}
            >
              <span style={{ marginRight: 8, color: '#FF9933', fontSize: 10 }}>›</span>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const mobileNavStyle = {
  display: 'block',
  padding: '13px 22px',
  color: 'rgba(255,255,255,0.85)',
  fontSize: 14,
  fontFamily: 'Montserrat,sans-serif',
  fontWeight: 600,
  textDecoration: 'none',
  borderBottom: '1px solid rgba(255,255,255,0.05)',
  transition: 'all 0.18s',
  borderLeft: '3px solid transparent',
};
