import { Search, Tag } from 'lucide-react';
import { useState } from 'react';

export default function ProblemStatements() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const statements = [
    {
      id: "SVH-001",
      category: "Blockchain",
      title: "Decentralized Student Verification System",
      org: "VIT Bhopal University",
      desc: "Develop a secure, tamper-proof decentralized identity verification system for student academic records, degrees, and extracurricular certificates using blockchain to prevent academic credential fraud.",
      tech: "Solidity, Ethereum/Polygon, React, Web3.js"
    },
    {
      id: "SVH-002",
      category: "AI/ML",
      title: "AI-Powered Smart Agriculture Yield Predictor",
      org: "Ministry of Agriculture Simulation",
      desc: "Build an AI model that predicts crop yields and recommends optimal crop rotation strategies based on real-time soil chemistry, moisture levels, historic weather data, and geographical parameters.",
      tech: "Python, TensorFlow, Scikit-learn, FastAPI"
    },
    {
      id: "SVH-003",
      category: "Healthcare",
      title: "Secure Electronic Health Records Management",
      org: "Health Department Simulation",
      desc: "Design a cryptographically secure, consent-based medical records sharing system that gives patients complete control over their medical history and allows doctors to access reports seamlessly with permission.",
      tech: "IPFS, Advanced Encryption Standards (AES), React, Node.js"
    },
    {
      id: "SVH-004",
      category: "Smart Cities",
      title: "Automated Traffic Control & Congestion Management",
      org: "Municipal Corporation Simulation",
      desc: "Create an intelligent system that uses real-time CCTV feeds and computer vision algorithms to dynamically adjust traffic light timings at intersections, reducing congestion and vehicle idle time.",
      tech: "OpenCV, Python, IoT Controllers, Raspberry Pi"
    },
    {
      id: "SVH-005",
      category: "Security",
      title: "Real-time Fake News & Deepfake Detection Portal",
      org: "Cyber Security Cell Simulation",
      desc: "Implement a browser extension or portal that uses NLP and computer vision to analyze shared articles, images, and videos, scoring their likelihood of being manipulated, deepfaked, or fabricated.",
      tech: "Python, Transformers, PyTorch, Chrome Extensions API"
    },
    {
      id: "SVH-006",
      category: "IoT",
      title: "Smart Energy Grid Optimization using IoT",
      org: "Power Grid Corporation Simulation",
      desc: "Develop an IoT-based power distribution monitoring dashboard that detects power leaks, high-load anomalies, and automatically balances load distribution across simulated sub-stations.",
      tech: "MQTT, Arduino/ESP32, InfluxDB, Grafana"
    },
    {
      id: "SVH-007",
      category: "Blockchain",
      title: "Decentralized Supply Chain Transparency Platform",
      org: "Logistics Division Simulation",
      desc: "Create a Web3 application that tracks food supply chain logistics from farm to table. Customers scan a QR code to view every transit point, storage temperature log, and quality check.",
      tech: "Hyperledger/Polygon, Solidity, QR Integration, React"
    },
    {
      id: "SVH-008",
      category: "AI/ML",
      title: "AI-Based Disaster Early Warning System",
      org: "National Disaster Relief Simulation",
      desc: "Build a predictive system using satellite imagery and meteorological data feeds to forecast landslides or flash floods, sending automated localized warnings to local authorities.",
      tech: "Geospatial Data, Python, PyTorch, Twilio API"
    },
    {
      id: "SVH-009",
      category: "Smart Cities",
      title: "Decentralized Municipal Waste Management Tracking",
      org: "Clean India Mission Simulation",
      desc: "A mobile application connected to smart bin sensors that optimizes waste collection routes for trucks in real-time, reward points to citizens sorting trash correctly.",
      tech: "Flutter, Google Maps API, Node.js, Firebase"
    },
    {
      id: "SVH-010",
      category: "Blockchain",
      title: "Secure E-Voting Portal using Cryptographic Proofs",
      org: "Governance Board Simulation",
      desc: "Design an online voting system that prevents double voting, ensures voter anonymity, and allows voters to independently audit and verify that their vote was cast and counted correctly.",
      tech: "Zero-Knowledge Proofs, Solidity, Node.js, React"
    },
    {
      id: "SVH-011",
      category: "AI/ML",
      title: "Personalized Student Career Pathway Recommender",
      org: "EdTech Division Simulation",
      desc: "Develop a recommendation engine that analyzes a student's grades, skill tests, projects, and personal interests to suggest tailored study pathways, courses, and job roles.",
      tech: "Collaborative Filtering, Python, Neo4j Graph DB"
    },
    {
      id: "SVH-012",
      category: "IoT",
      title: "Water Quality Monitoring & Filtration Alerts",
      org: "Jal Shakti Simulation",
      desc: "Create an IoT node that measures water pH, turbidity, and dissolved oxygen levels in local water reservoirs, alerting municipal panels when levels cross safe drinking thresholds.",
      tech: "ESP32, pH & Turbidity Sensors, Node-RED, Dashboard"
    }
  ];

  const filtered = statements.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.desc.toLowerCase().includes(search.toLowerCase()) ||
                          item.id.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || item.category === category;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Blockchain', 'AI/ML', 'Healthcare', 'Smart Cities', 'Security', 'IoT'];

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#fce4c0]/20 to-white pb-24">
      {/* Header Banner */}
      <section className="bg-[#0f2942] text-white py-16 px-4 text-center relative overflow-hidden border-b-8 border-sih-orange">
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-black font-inter tracking-tight uppercase mb-3">
            Problem Statements
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto text-sm md:text-base text-justify font-medium">
            Review the 12 official problem statements for SVH 2026. Select up to two statements to submit your technical presentation (PPT) for Round 1.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 mt-12">
        
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-12">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by ID, title, or keyword..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sih-orange transition-colors"
            />
          </div>
          
          {/* Category Badges */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${category === cat ? 'bg-sih-orange text-white' : 'bg-gray-100 text-[#0f2942] hover:bg-gray-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">
            Showing {filtered.length} of {statements.length} Problem Statements
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filtered.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-200 hover:border-sih-orange/50 shadow-sm hover:shadow-lg transition-all p-6 flex flex-col justify-between group relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-sih-orange/5 rounded-bl-full pointer-events-none transition-all group-hover:scale-110"></div>
              
              <div>
                {/* ID & Category */}
                <div className="flex justify-between items-center mb-4">
                  <span className="px-2.5 py-1 bg-sih-navy text-white text-[10px] font-black rounded uppercase tracking-wider">
                    {item.id}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-black text-sih-orange uppercase tracking-wider">
                    <Tag className="w-3.5 h-3.5" />
                    {item.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold font-inter text-[#0f2942] mb-2 leading-tight group-hover:text-sih-orange transition-colors">
                  {item.title}
                </h3>
                
                {/* Organization */}
                <p className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">
                  Organized by: {item.org}
                </p>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed text-justify mb-6 font-medium">
                  {item.desc}
                </p>
              </div>

              {/* Tech Stack */}
              <div className="border-t border-gray-100 pt-4 mt-auto">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-2">Suggested Tech Stack</span>
                <span className="text-xs font-bold text-[#0f2942] font-mono leading-relaxed text-justify">
                  {item.tech}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <p className="text-lg text-gray-500 font-bold">No problem statements match your search criteria.</p>
            <button 
              onClick={() => { setSearch(''); setCategory('All'); }}
              className="mt-4 px-6 py-2 bg-sih-orange text-white text-sm font-bold rounded-xl hover:bg-[#c2410c] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
