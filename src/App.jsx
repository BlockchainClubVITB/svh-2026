import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Guidelines from './pages/Guidelines';
import ProblemStatements from './pages/ProblemStatements';
import FAQ from './pages/FAQ';
import ContactUs from './pages/ContactUs';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LeaderDashboard from './pages/LeaderDashboard';
import EvaluatorDashboard from './pages/EvaluatorDashboard';
import SuperEvaluatorDashboard from './pages/AdminDashboard';
import TestEmail from './pages/TestEmail';
import ComingSoon from './pages/ComingSoon';
import IDCard from './components/IDCard';

function AppContent() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname === '/leader-dashboard' || location.pathname === '/evaluator-dashboard' || location.pathname === '/super-admin-dashboard';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {!isDashboard && <Header />}

      {/* Floating Download Materials Menu */}
      {!isDashboard && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
          {menuOpen && (
            <div style={{
              background: '#0f2942',
              border: '1px solid rgba(255,153,51,0.3)',
              borderRadius: 12,
              padding: '12px 8px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              boxShadow: '0 10px 32px rgba(0,0,0,0.5)',
              minWidth: 220,
              animation: 'fadeInDown 0.2s ease',
            }}>
              {[
                { label: '📝 PPT Template', url: 'https://docs.google.com/presentation/d/17MCZsoHCGdJTqVKxhuHExweQI1M-0w59/edit?usp=drive_link&ouid=105509570291334746986&rtpof=true&sd=true' },
                { label: '❓ FAQs', url: 'https://drive.google.com/file/d/1uArUM1izOY9tYd3Vkfu-JEwU575jz2yD/view?usp=drive_link' },
                { label: '⚖️ Rules', url: 'https://drive.google.com/file/d/1bHVw_gNub44fYBw_mBqQ_f99ymqzUhHs/view?usp=drive_link' },
                { label: '📊 Problem Statements', url: 'https://drive.google.com/file/d/18qqRV16SGclaXetUdcRS6GcrDV-o-esD/view?usp=drive_link' },
                { label: '👤 ID Card', url: '', route: "/id-card" }
              ].map((item, idx) => {
                if (item.route) {
                  return (<Link
                  key={idx}
                  to={item.route}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#fff',
                    textDecoration: 'none',
                    fontFamily: 'Poppins,sans-serif',
                    fontSize: 13,
                    padding: '8px 12px',
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,153,51,0.15)'; e.currentTarget.style.color = '#FF9933'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff'; }}
                >
                  {item.label}
                </Link>)
                }
                return <a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#fff',
                    textDecoration: 'none',
                    fontFamily: 'Poppins,sans-serif',
                    fontSize: 13,
                    padding: '8px 12px',
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,153,51,0.15)'; e.currentTarget.style.color = '#FF9933'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff'; }}
                >
                  {item.label}
                </a>
              })}
            </div>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'linear-gradient(135deg, #FF9933, #e07800)',
              color: '#fff',
              padding: '12px 20px',
              borderRadius: 30,
              fontFamily: 'Montserrat,sans-serif',
              fontWeight: 800,
              fontSize: 14,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(255,153,51,0.4)',
              transition: 'all 0.3s ease',
              outline: 'none',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(255,153,51,0.6)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(255,153,51,0.4)'; }}
          >
            <span style={{ fontSize: 18 }}>{menuOpen ? '❌' : '📥'}</span>
            <span>Download Materials</span>
          </button>
        </div>
      )}

      <main style={{ flex: 1, paddingTop: isDashboard ? 0 : 90 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/guidelines" element={<Guidelines />} />
          <Route path="/problem-statements" element={<ProblemStatements />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leader-dashboard" element={<LeaderDashboard />} />
          <Route path="/evaluator-dashboard" element={<EvaluatorDashboard />} />
          <Route path="/super-admin-dashboard" element={<SuperEvaluatorDashboard />} />
          <Route path="/test-email" element={<TestEmail />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/id-card" element={<IDCard />} />
        </Routes>
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
