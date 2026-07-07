import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/"                   element={<Home />} />
            <Route path="/guidelines"         element={<Guidelines />} />
            <Route path="/problem-statements" element={<ProblemStatements />} />
            <Route path="/faq"                element={<FAQ />} />
            <Route path="/contact"            element={<ContactUs />} />
            <Route path="/login"              element={<Login />} />
            <Route path="/dashboard"          element={<Dashboard />} />
            <Route path="/leader-dashboard"   element={<LeaderDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
