import { BookOpen, Users, Award, Layers, Scale, GraduationCap, ArrowRight } from 'lucide-react';

export default function Guidelines() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#fce4c0]/20 to-white pb-24">
      {/* Title Header Banner */}
      <section className="bg-[#0f2942] text-white py-20 px-4 text-center relative overflow-hidden border-b-8 border-sih-orange">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle at 10% 20%, rgba(234, 88, 12, 0.4) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(14, 165, 233, 0.4) 0%, transparent 40%)",
          backgroundSize: "cover"
        }}></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-block px-4 py-1.5 bg-sih-orange text-white text-xs font-black uppercase tracking-widest rounded-full mb-4">
            SVH 2026 Official Handbook
          </span>
          <h1 className="text-4xl md:text-6xl font-black font-inter tracking-tight uppercase mb-4">
            Guidelines & Event Structure
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-medium max-w-2xl mx-auto text-justify">
            A comprehensive guide for teams participating in the Smart VIT Bhopal Hackathon. Understand the event structure, rules, timeline, evaluation criteria, and support systems available.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 mt-16 grid grid-cols-1 xl:grid-cols-3 gap-12">
        
        {/* Left Columns (Col Span 2): Detailed Sections */}
        <div className="xl:col-span-2 space-y-16">
          
          {/* Section 1: Detailed Event Flow */}
          <section className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
              <Layers className="w-8 h-8 text-sih-orange" />
              <h2 className="text-2xl md:text-3xl font-black font-inter text-[#0f2942] uppercase tracking-tight">
                Detailed Event Flow
              </h2>
            </div>
            
            <div className="space-y-10">
              {/* Round 1 */}
              <div className="border-l-4 border-sih-orange pl-6 relative">
                <div className="absolute -left-3 top-0 w-5 h-5 rounded-full bg-sih-orange border-4 border-white"></div>
                <h3 className="text-xl font-bold font-inter text-[#0f2942] mb-3">Round 1 – PPT Submission</h3>
                <p className="text-gray-700 text-sm leading-relaxed mb-4 text-justify">
                  Teams will select and work on one of the available problem statements. Participants must submit a detailed presentation deck explaining their core conceptual solution. The submission must comprehensively address the following points:
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {[
                    "Clear understanding of the chosen problem statement",
                    "Proposed solution approach and core value proposition",
                    "Technical architecture, tech stack, and methodology",
                    "Expected real-world impact, feasibility, and scale",
                    "Step-by-step implementation roadmap and planning"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <ArrowRight className="w-4 h-4 text-sih-orange shrink-0 mt-0.5" />
                      <span className="text-justify">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="bg-[#fce4c0]/20 p-5 rounded-xl border border-[#fce4c0]">
                  <h4 className="text-sm font-black text-[#ea580c] uppercase tracking-wider mb-3">Evaluation Criteria (Round 1)</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Problem Understanding", "Innovation and Creativity", "Feasibility of Solution", "Technical Approach", "Presentation Quality"].map((criteria, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white text-[#0f2942] border border-gray-200 text-xs font-bold rounded-full shadow-sm text-justify">
                        {criteria}
                      </span>
                    ))}
                  </div>
                </div>
                
                <p className="text-[#ea580c] text-xs font-bold mt-4 uppercase tracking-wider text-justify">
                  * Shortlisting: The top five teams from each problem statement will be shortlisted for the Grand Finale.
                </p>
              </div>

              {/* Round 2 */}
              <div className="border-l-4 border-[#0ea5e9] pl-6 relative">
                <div className="absolute -left-3 top-0 w-5 h-5 rounded-full bg-[#0ea5e9] border-4 border-white"></div>
                <h3 className="text-xl font-bold font-inter text-[#0f2942] mb-3">Round 2 – Prototype Development (Grand Finale)</h3>
                <p className="text-gray-700 text-sm leading-relaxed mb-4 text-justify">
                  Shortlisted teams will build and demonstrate a functional prototype based on their submitted proposal. The prototype round is tentatively planned as a two-day offline hackathon consisting of six hours of development each day, resulting in a total of twelve hours of hands-on building time.
                </p>
                
                <div className="bg-sky-50/50 p-5 rounded-xl border border-sky-100 mb-4">
                  <h4 className="text-sm font-black text-[#0ea5e9] uppercase tracking-wider mb-3">Evaluation Criteria (Round 2)</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Technical Implementation", "Functionality & Working Prototype", "Innovation & Scalability", "User Experience", "Final Demonstration & Presentation"].map((criteria, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white text-[#0f2942] border border-sky-100 text-xs font-bold rounded-full shadow-sm text-justify">
                        {criteria}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Rules & Exceptions */}
          <section className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
              <Scale className="w-8 h-8 text-sih-orange" />
              <h2 className="text-2xl md:text-3xl font-black font-inter text-[#0f2942] uppercase tracking-tight">
                Rules & Exceptions
              </h2>
            </div>
            
            <p className="text-gray-700 text-sm leading-relaxed mb-6 text-justify">
              SVH follows the Smart India Hackathon rulebook as the primary framework with the following modifications:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Multiple Problem Statements", desc: "Teams are allowed to select and submit proposals for up to two problem statements to maximize their chances of qualification." },
                { title: "Compressed Format", desc: "The Grand Finale will be conducted in an intensive compressed 12-hour build format (spread across two days) instead of the standard 36-hour SIH duration." },
                { title: "Institutional Approval", desc: "The conduct and participation in the Grand Finale is subject to institute approval for official On-Duty (OD) permissions." },
                { title: "Ad-hoc Announcements", desc: "Additional event-specific rules, guidelines, or amendments may be announced before the start of each round." }
              ].map((rule, idx) => (
                <div key={idx} className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-[#0f2942] text-base mb-2">{rule.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed text-justify">{rule.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Certificates & Recognition */}
          <section className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
              <Award className="w-8 h-8 text-sih-orange" />
              <h2 className="text-2xl md:text-3xl font-black font-inter text-[#0f2942] uppercase tracking-tight">
                Certificates & Recognition
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { title: "Participation", desc: "Participation Certificate for all eligible team members who complete submissions." },
                { title: "Shortlisting", desc: "Shortlisting Certificate for teams advancing to the Grand Finale." },
                { title: "Podium Finish", desc: "Winner and Runner-Up trophies, certificates, and recognition." },
                { title: "Special Awards", desc: "Special recognition for outstanding innovation, scalable execution, and creativity." }
              ].map((cert, idx) => (
                <div key={idx} className="flex flex-col items-center text-center p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-[#fce4c0] text-[#ea580c] rounded-full flex items-center justify-center mb-4">
                    <Award className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-[#0f2942] text-sm mb-2 uppercase tracking-wide">{cert.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed text-justify">{cert.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: Mentorship & Learning Support */}
          <section className="bg-[#0f2942] text-white rounded-2xl p-8 shadow-md relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-12 translate-x-12">
              <GraduationCap className="w-64 h-64 text-white" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <GraduationCap className="w-8 h-8 text-sih-orange" />
                <h2 className="text-2xl md:text-3xl font-black font-inter uppercase tracking-tight">
                  Mentorship & Learning Support
                </h2>
              </div>
              
              <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 text-justify">
                Participants will receive structured guidance from senior club members, experienced SIH national participants, faculty members, and domain experts. Mentorship sessions will focus on:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Idea Validation & Technical feasibility feedback",
                  "Presentation Strategy & Pitching methodologies",
                  "Prototype planning and minimum viable product definition",
                  "Innovation-oriented problem solving under tight timelines"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="w-2 h-2 rounded-full bg-sih-orange"></div>
                    <span className="text-sm text-gray-200 text-justify">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>

        {/* Right Sidebar (Col Span 1): Structure & General Info */}
        <div className="space-y-8">
          
          {/* Structure Sidebar Card */}
          <div className="bg-[#0f2942] text-white rounded-2xl p-6 shadow-md border-2 border-sih-orange/20 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-sih-orange blur-2xl opacity-20"></div>
            
            <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
              <Users className="w-6 h-6 text-sih-orange" />
              <h3 className="text-lg font-black font-inter tracking-tight uppercase">Event Structure</h3>
            </div>
            
            <div className="space-y-6">
              {[
                { label: "Total Problem Statements", val: "12 Statements" },
                { label: "Shortlisted per PS", val: "Top 5 Teams" },
                { label: "Maximum Finalist Teams", val: "60 Teams" },
                { label: "Team Size", val: "6 Members" },
                { label: "Gender Diversity", val: "Min 1 Female Mandatory" },
                { label: "Registration Fee", val: "₹75 / Member (₹450 / Team)" }
              ].map((stat, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{stat.label}</span>
                  <span className="text-sm font-black font-inter text-sih-orange text-right">{stat.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Info / Coordinator Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
              <BookOpen className="w-5 h-5 text-sih-orange" />
              <h3 className="text-sm font-black font-inter text-[#0f2942] uppercase tracking-wider">Faculty Coordinator</h3>
            </div>
            
            <p className="font-bold text-lg text-[#0f2942]">Dr Hemraj Lamkuche</p>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">Blockchain Club Coordinator</p>
            <p className="text-xs text-gray-600 mt-3 leading-relaxed text-justify">
              Oversees the alignment, planning, and evaluation mechanism of SVH 2026 to align with national Smart India Hackathon standards.
            </p>
          </div>

          {/* Special Features Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
              <Award className="w-5 h-5 text-sih-orange" />
              <h3 className="text-sm font-black font-inter text-[#0f2942] uppercase tracking-wider">Special Features</h3>
            </div>
            
            <ul className="space-y-3.5">
              {[
                "Multiple expert-led technical sessions during submission period",
                "Direct mentorship and guidance framework for SIH prep",
                "Hands-on exposure to formal proposal writing and pitching",
                "Practical experience within a highly competitive innovation arena"
              ].map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-sih-orange shrink-0 mt-1"></div>
                  <span className="leading-relaxed text-justify">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
