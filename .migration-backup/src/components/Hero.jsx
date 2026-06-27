import { Search, Users, Building, Laptop, ChevronRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="w-full bg-[#f8f9fa] relative overflow-hidden pb-12 border-b-4 border-sih-orange">
      {/* Background Graphic Pattern mimicking SIH's geometric/abstract shapes */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle at 10% 20%, rgba(14, 165, 233, 0.1) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(249, 115, 22, 0.1) 0%, transparent 40%)",
        backgroundSize: "cover"
      }}></div>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 pt-8 relative z-10 flex flex-col xl:flex-row gap-6">

        {/* Left Side: Massive Banner Ad style */}
        <div className="flex-1 rounded-2xl bg-white shadow-xl overflow-hidden border border-gray-200 flex flex-col relative">

          <div className="px-10 py-12 relative z-10">
            <span className="inline-block px-4 py-1.5 bg-[#fce4c0] text-[#ea580c] text-xs font-black uppercase tracking-widest rounded-full mb-6">
              Blockchain Club, VIT Bhopal
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-sih-navy tracking-tight leading-none mb-4 font-inter uppercase">
              Smart VIT <br className="hidden md:inline" />Hackathon 2026
            </h1>
            <h2 className="text-xl md:text-2xl font-bold text-gray-600 mb-8 font-inter leading-relaxed text-justify">
              An Internal Hackathon Modelled on Smart India Hackathon (SIH)
            </h2>

            <div className="inline-block border-2 border-dashed border-gray-300 rounded-2xl p-4 bg-white/80 backdrop-blur-sm mb-10">
              <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl">
                <span className="text-xs uppercase tracking-[0.2em] font-black text-gray-500 mb-2">Internal Hackathon Model</span>
                <span className="text-sih-navy text-6xl font-black font-inter text-center">SVH <span className="block text-4xl mt-2 text-sih-orange">2026</span></span>
              </div>
            </div>
          </div>

          {/* Banner Graphic Elements overlaying right side of the left panel */}
          <div className="hidden lg:block absolute bottom-0 right-10 w-[400px] h-[300px] z-0">
            {/* Abstract geometric shapes mimicking the stock photos on SIH */}
            <div className="absolute bottom-10 right-20 w-32 h-64 bg-sih-green/20 rounded-t-sm rotate-6 transform origin-bottom border border-sih-green/30"></div>
            <div className="absolute bottom-10 right-40 w-24 h-48 bg-[#0ea5e9]/20 rounded-t-sm -rotate-3 transform origin-bottom border border-[#0ea5e9]/30"></div>
            <div className="absolute bottom-10 right-10 w-20 h-72 bg-sih-orange/20 rounded-t-sm rotate-12 transform origin-bottom border border-sih-orange/30"></div>
          </div>

          {/* Embedded Stat Counters (The pill boxes from the screenshot) */}
          <div className="w-full bg-white border-t border-gray-200 p-6 flex flex-col gap-4 relative z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
            <h3 className="text-sih-orange text-3xl font-black font-inter tracking-tight">Internal Hackathons</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Stat 1 */}
              <div className="flex items-center justify-between bg-sih-navy rounded-full pl-6 pr-4 py-2 border-4 border-sih-blue">
                <div className="flex flex-col">
                  <span className="text-white text-3xl font-black font-inter">12</span>
                  <span className="text-gray-300 text-xs font-bold uppercase tracking-wider">Problem Statements</span>
                </div>
                <Search className="w-10 h-10 text-sih-blue opacity-50" />
              </div>

              {/* Stat 2 */}
              <div className="flex items-center justify-between bg-sih-navy rounded-full pl-6 pr-4 py-2 border-4 border-sih-green">
                <div className="flex flex-col">
                  <span className="text-white text-3xl font-black font-inter flex items-baseline gap-1">6 <span className="text-xs font-normal">Members/Team</span></span>
                  <span className="text-gray-300 text-xs font-bold uppercase tracking-wider">Total Teams: 60 </span>
                </div>
                <Users className="w-10 h-10 text-sih-green opacity-50" />
              </div>

              {/* Stat 3 */}
              <div className="flex items-center justify-between bg-sih-navy rounded-full pl-6 pr-4 py-2 border-4 border-sih-orange">
                <div className="flex flex-col">
                  <span className="text-white text-3xl font-black font-inter">₹75</span>
                  <span className="text-gray-300 text-xs font-bold uppercase tracking-wider">Per Member Fee</span>
                </div>
                <Building className="w-10 h-10 text-sih-orange opacity-50" />
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Quick Action Vertical Layout */}
        <div className="w-full xl:w-80 flex flex-col gap-4">
          {[
            { title: "Team Leader Login", icon: <Users className="w-6 h-6 text-white" />, color: "bg-sih-navy" },
            { title: "Submit PPT / Phase 1", icon: <Search className="w-6 h-6 text-white" />, color: "bg-sih-orange" },
            { title: "Judges & SPOC Portal", icon: <Laptop className="w-6 h-6 text-white" />, color: "bg-sih-green" }
          ].map((action, idx) => (
            <a key={idx} href="#register" className={`${action.color} text-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-between group`}>
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  {action.icon}
                </div>
                <span className="font-bold font-inter text-lg">{action.title}</span>
              </div>
              <ChevronRight className="w-6 h-6 text-white opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </a>
          ))}

          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col justify-center gap-2 mt-auto">
            <h3 className="font-bold text-sih-navy text-sm uppercase tracking-wider mb-2 border-b border-gray-100 pb-2">Important Notice</h3>
            <p className="text-xs text-gray-600 leading-relaxed font-semibold text-justify">
              Phase 2 Prototype Finale is a <span className="text-sih-orange font-bold">compressed 12-hour format</span> over 2 days (6 hours/day). Subject to institutional OD clearance.
            </p>
            <div className="w-full bg-red-50 text-red-700 text-[10px] uppercase tracking-widest font-bold py-1.5 px-2 rounded border border-red-200 mt-2 text-center">
              Strictly 6 Members | Min 1 Female
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
