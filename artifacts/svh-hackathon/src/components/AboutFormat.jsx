import { FileText, Cpu, ArrowRight } from 'lucide-react';

export default function AboutFormat() {
  return (
    <section className="py-24 px-4 relative z-10 bg-space-900/50 border-y border-space-800">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16 md:flex items-center gap-10">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl md:text-5xl font-black font-inter text-white mb-6 leading-tight">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-vibrant-emerald">Mechanism</span>
            </h2>
            <p className="text-lg text-gray-400 font-inter leading-relaxed">
              SVH is an internal blueprint of SIH designed strictly to groom and identify top-tier talent representing VIT Bhopal on the national stage. We simulate the intense pressure and scale of the grand finale.
            </p>
          </div>
          <div className="md:w-1/2">
            <div className="glass-card p-6 border-l-4 border-l-vibrant-emerald">
              <h4 className="text-white font-bold mb-2">Goal</h4>
              <p className="text-sm text-gray-400">Filter the strongest 60 teams dynamically across multiple domains to build the ultimate contingent for Smart India Hackathon 2026.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-1 bg-space-700 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-electric-blue to-vibrant-emerald opacity-50"></div>
          </div>
          <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-space-900 p-2 rounded-full border border-space-700">
            <ArrowRight className="w-6 h-6 text-gray-500" />
          </div>

          {/* Round 1 */}
          <div className="glass-card p-8 md:p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
              <FileText className="w-32 h-32 text-electric-blue" />
            </div>
            <div className="relative z-10">
              <span className="text-electric-blue font-cyber font-bold tracking-widest text-sm mb-2 block">ROUND 1</span>
              <h3 className="text-2xl font-bold font-inter text-white mb-4">PPT Submission</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Teams pick 1-2 Problem Statements and submit a detailed architectural and solution PPT. Thoroughly research and design your system.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-electric-blue mt-1.5 shrink-0"></div>
                  <span>Up to 60 teams shortlisted total</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-electric-blue mt-1.5 shrink-0"></div>
                  <span>Top 5 teams per Problem Statement advance</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Round 2 */}
          <div className="glass-card p-8 md:p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
              <Cpu className="w-32 h-32 text-vibrant-emerald" />
            </div>
            <div className="relative z-10">
               <span className="text-vibrant-emerald font-cyber font-bold tracking-widest text-sm mb-2 block">ROUND 2</span>
              <h3 className="text-2xl font-bold font-inter text-white mb-4">Grand Finale (Prototype)</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                A 2-day compressed hackathon model. Active building and evaluation by technical panels.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-vibrant-emerald mt-1.5 shrink-0"></div>
                  <span>6 hours/day (12 hours total coding)</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-vibrant-emerald mt-1.5 shrink-0"></div>
                  <span className="italic text-gray-400">*Progression subject to institutional OD approval</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
