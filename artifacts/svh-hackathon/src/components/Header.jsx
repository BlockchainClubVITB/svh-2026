import { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import svhLogo from '../assets/svh_logo.png';


export default function Header() {
  const { hash, pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openSubDropdown, setOpenSubDropdown] = useState(null);

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else if (pathname !== '/') {
      window.scrollTo(0, 0);
    }
  }, [hash, pathname]);

  // Close dropdowns when clicking outside
  const navRef = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
        setOpenSubDropdown(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const pastEditions = [
    { label: 'SVH 2026', path: '/' },
  ];

  const guidelinesItems = [
    { label: 'For Institutes/Universities', path: '/guidelines' },
    { label: 'Idea PPT Template', path: '/guidelines' },
  ];

  const aboutItems = [
    { label: 'SVH Process Flow', path: '/#process-timeline' },
    { label: 'SVH Themes', path: '/#sihthemes' },
    { label: 'Implementation Team', path: '/contact' },
  ];

  return (
    <>
      {/* ── MAIN NAVBAR (mimics SIH's #main_navbar) ── */}
      <header
        ref={navRef}
        className="w-full bg-white border-b border-gray-200 relative z-50 shadow-sm"
        style={{ fontFamily: "'Poppins', 'Montserrat', sans-serif" }}
      >
        <div className="max-w-[1600px] mx-auto px-4 flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src={svhLogo} alt="SVH Logo" className="h-10 w-10 object-contain" />
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-[11px] font-black text-[#0f2942] uppercase tracking-tight">Smart VIT Hackathon</span>
              <span className="text-[10px] font-bold text-[#f97316] uppercase tracking-widest">2026</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0">
            {/* Home */}
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `nav-item px-4 py-4 text-[13px] font-semibold transition-colors border-b-2 ${isActive ? 'border-[#f97316] text-[#f97316]' : 'border-transparent text-[#0f2942] hover:text-[#f97316] hover:border-[#f97316]'}`
              }
            >
              Home
            </NavLink>

            {/* About SVH dropdown */}
            <div className="relative group">
              <button
                className="nav-item px-4 py-4 text-[13px] font-semibold text-[#0f2942] hover:text-[#f97316] transition-colors border-b-2 border-transparent hover:border-[#f97316] flex items-center gap-1"
                onClick={() => setOpenDropdown(openDropdown === 'about' ? null : 'about')}
              >
                About SVH
                <svg className="w-3 h-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openDropdown === 'about' && (
                <div className="absolute top-full left-0 bg-white border border-gray-200 rounded shadow-lg py-1 min-w-[200px] z-50">
                  {aboutItems.map((item, i) => (
                    <a
                      key={i}
                      href={item.path}
                      className="block px-4 py-2 text-sm text-[#0f2942] hover:bg-[#f97316] hover:text-white transition-colors"
                      onClick={() => setOpenDropdown(null)}
                    >
                      {item.label}
                    </a>
                  ))}
                  {/* Past Editions sub-dropdown */}
                  <div className="relative">
                    <button
                      className="w-full flex items-center justify-between px-4 py-2 text-sm text-[#0f2942] hover:bg-[#f97316] hover:text-white transition-colors"
                      onClick={() => setOpenSubDropdown(openSubDropdown === 'past' ? null : 'past')}
                    >
                      SVH Past Editions
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    {openSubDropdown === 'past' && (
                      <div className="absolute left-full top-0 bg-white border border-gray-200 rounded shadow-lg py-1 min-w-[160px] z-50">
                        {pastEditions.map((e, i) => (
                          <Link
                            key={i}
                            to={e.path}
                            className="block px-4 py-2 text-sm text-[#0f2942] hover:bg-[#f97316] hover:text-white transition-colors"
                            onClick={() => { setOpenDropdown(null); setOpenSubDropdown(null); }}
                          >
                            {e.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Guidelines dropdown */}
            <div className="relative">
              <button
                className="nav-item px-4 py-4 text-[13px] font-semibold text-[#0f2942] hover:text-[#f97316] transition-colors border-b-2 border-transparent hover:border-[#f97316] flex items-center gap-1"
                onClick={() => setOpenDropdown(openDropdown === 'guidelines' ? null : 'guidelines')}
              >
                Guidelines
                <svg className="w-3 h-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openDropdown === 'guidelines' && (
                <div className="absolute top-full left-0 bg-white border border-gray-200 rounded shadow-lg py-1 min-w-[240px] z-50">
                  {guidelinesItems.map((item, i) => (
                    <Link
                      key={i}
                      to={item.path}
                      className="block px-4 py-2 text-sm text-[#0f2942] hover:bg-[#f97316] hover:text-white transition-colors"
                      onClick={() => setOpenDropdown(null)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Problem Statements */}
            <NavLink
              to="/problem-statements"
              className={({ isActive }) =>
                `nav-item px-4 py-4 text-[13px] font-semibold transition-colors border-b-2 ${isActive ? 'border-[#f97316] text-[#f97316]' : 'border-transparent text-[#0f2942] hover:text-[#f97316] hover:border-[#f97316]'}`
              }
            >
              Problem Statements
            </NavLink>

            {/* FAQs */}
            <NavLink
              to="/faq"
              className={({ isActive }) =>
                `nav-item px-4 py-4 text-[13px] font-semibold transition-colors border-b-2 ${isActive ? 'border-[#f97316] text-[#f97316]' : 'border-transparent text-[#0f2942] hover:text-[#f97316] hover:border-[#f97316]'}`
              }
            >
              FAQs
            </NavLink>

            {/* Contact */}
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `nav-item px-4 py-4 text-[13px] font-semibold transition-colors border-b-2 ${isActive ? 'border-[#f97316] text-[#f97316]' : 'border-transparent text-[#0f2942] hover:text-[#f97316] hover:border-[#f97316]'}`
              }
            >
              Contact Us
            </NavLink>
          </nav>

          {/* Right: Login button */}
          <div className="flex items-center gap-3 ml-4">
            <Link
              to="/contact"
              className="hidden sm:flex items-center gap-1.5 text-xs font-black px-5 py-2 bg-[#f97316] text-white rounded hover:bg-[#ea6b10] transition-colors uppercase tracking-wider shadow-sm"
            >
              <img src="https://sih.gov.in/img1/login.png" alt="" className="w-4 h-4 rounded-full" />
              SVH Login
            </Link>

            {/* Hamburger for mobile */}
            <button
              className="lg:hidden p-2 text-[#0f2942]"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="flex flex-col py-2">
              <Link to="/" className="px-6 py-3 text-sm font-semibold text-[#0f2942] hover:bg-gray-50 border-b border-gray-100" onClick={() => setMobileOpen(false)}>Home</Link>
              <a href="/#process-timeline" className="px-6 py-3 text-sm font-semibold text-[#0f2942] hover:bg-gray-50 border-b border-gray-100" onClick={() => setMobileOpen(false)}>SVH Process Flow</a>
              <a href="/#sihthemes" className="px-6 py-3 text-sm font-semibold text-[#0f2942] hover:bg-gray-50 border-b border-gray-100" onClick={() => setMobileOpen(false)}>SVH Themes</a>
              <Link to="/guidelines" className="px-6 py-3 text-sm font-semibold text-[#0f2942] hover:bg-gray-50 border-b border-gray-100" onClick={() => setMobileOpen(false)}>Guidelines</Link>
              <Link to="/problem-statements" className="px-6 py-3 text-sm font-semibold text-[#0f2942] hover:bg-gray-50 border-b border-gray-100" onClick={() => setMobileOpen(false)}>Problem Statements</Link>
              <Link to="/faq" className="px-6 py-3 text-sm font-semibold text-[#0f2942] hover:bg-gray-50 border-b border-gray-100" onClick={() => setMobileOpen(false)}>FAQs</Link>
              <Link to="/contact" className="px-6 py-3 text-sm font-semibold text-[#0f2942] hover:bg-gray-50 border-b border-gray-100" onClick={() => setMobileOpen(false)}>Contact Us</Link>
              <Link to="/contact" className="mx-6 my-3 text-center text-sm font-black px-5 py-2.5 bg-[#f97316] text-white rounded hover:bg-[#ea6b10] transition-colors uppercase tracking-wider" onClick={() => setMobileOpen(false)}>SVH Login</Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
