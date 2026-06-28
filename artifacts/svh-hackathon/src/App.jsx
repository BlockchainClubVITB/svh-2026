import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Guidelines from './pages/Guidelines';
import ProblemStatements from './pages/ProblemStatements';
import FAQ from './pages/FAQ';
import ContactUs from './pages/ContactUs';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white font-roboto text-sih-gray-dark flex flex-col">
        {/* Sticky Header Nav */}
        <div className="sticky top-0 z-[100] w-full">
          <Header />
        </div>

        <div className="flex-1 bg-white">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/guidelines" element={<Guidelines />} />
            <Route path="/problem-statements" element={<ProblemStatements />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<ContactUs />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
