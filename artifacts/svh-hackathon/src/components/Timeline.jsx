import { Megaphone, FileImage, ShieldCheck, CheckSquare, Award } from 'lucide-react';

export default function Timeline() {
  const steps = [
    {
      date: "Jun-Jul 2026",
      title: "Registration of SPOCs & Teams",
      bgColor: "bg-sih-navy",
      arrowRight: "text-sih-navy",
      icon: <Megaphone className="w-8 h-8 text-white/50" />
    },
    {
      date: "20 Jul-Aug 2026",
      title: "Internal PPT Submission",
      bgColor: "bg-[#0ea5e9]",
      arrowRight: "text-[#0ea5e9]",
      icon: <FileImage className="w-8 h-8 text-white/50" />
    },
    {
      date: "5-10 Aug 2026",
      title: "SVH PPT Evaluation",
      bgColor: "bg-sih-navy",
      arrowRight: "text-sih-navy",
      icon: <ShieldCheck className="w-8 h-8 text-white/50" />
    },
    {
      date: "Post 10 Aug",
      title: "Result Publication",
      bgColor: "bg-sih-orange",
      arrowRight: "text-sih-orange",
      icon: <CheckSquare className="w-8 h-8 text-white/50" />
    },
    {
      date: "24-25 Aug 2026",
      title: "SVH Grand Finale",
      bgColor: "bg-red-600",
      arrowRight: "text-red-600",
      icon: <Award className="w-8 h-8 text-white/50" />
    }
  ];

  return (
    <section className="py-24 w-full bg-white relative z-10 border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        
        <div className="text-center mb-20 flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-black font-inter text-sih-orange uppercase tracking-tight mb-10">
            SVH PROCESS FLOW AND TIMELINE
          </h2>
          {/* Mock Logo beside header similar to SIH diagram */}
          <div className="flex items-center gap-3">
             <div className="flex flex-col text-left">
                <span className="text-2xl font-black text-sih-navy tracking-tight leading-none uppercase font-inter">SMART VIT BHOPAL</span>
                <span className="text-xl font-bold text-sih-navy tracking-tight leading-none uppercase font-inter">HACKATHON 2026</span>
             </div>
          </div>
        </div>

        {/* Chevron Process Flow - Desktop */}
        <div className="hidden lg:flex flex-row items-center justify-center w-full px-10">
          {steps.map((step, idx) => (
             <div key={idx} className="relative flex flex-col items-center w-1/5 group">
                {/* Visual Connector / Chevron Body */}
                <div className={`relative w-[110%] h-14 ${step.bgColor} flex items-center justify-center text-white font-bold font-inter text-sm z-10 shadow-md ${idx === 0 ? 'rounded-l-lg' : ''} ${idx === steps.length - 1 ? 'rounded-r-lg' : ''}`}>
                   {/* Left Chevron Point Inverse (if not first) */}
                   {idx !== 0 && (
                      <div className="absolute left-0 top-0 w-0 h-0 border-t-[28px] border-t-white border-b-[28px] border-b-white border-l-[20px] border-l-transparent"></div>
                   )}
                   {/* Date Text inside */}
                   <span className="relative z-20 pl-4">{step.date}</span>

                   {/* Right Chevron Point (if not last) */}
                   {idx !== steps.length - 1 && (
                      <div className={`absolute -right-5 top-0 w-0 h-0 border-t-[28px] border-t-transparent border-b-[28px] border-b-transparent border-l-[20px] border-l-current ${step.arrowRight} z-30 drop-shadow-md`}></div>
                   )}
                </div>

                {/* Info Text Box Alternating Top/Bottom */}
                <div className={`absolute w-full px-6 text-center ${idx % 2 === 0 ? 'top-20' : 'bottom-20'} flex flex-col items-center`}>
                   {step.icon}
                   <p className={`mt-3 font-bold font-inter text-[15px] ${idx % 2 === 0 ? 'text-sih-navy' : 'text-[#0ea5e9]'}`}>{step.title}</p>
                </div>
             </div>
          ))}
        </div>

        {/* Vertical Stepper - Mobile Fallback */}
        <div className="lg:hidden flex flex-col gap-8 max-w-sm mx-auto">
          {steps.map((step, idx) => (
            <div key={idx} className="flex gap-4">
              <div className={`w-2 rounded-full ${step.bgColor}`}></div>
              <div className="bg-white p-4 shadow-sm border border-gray-200 rounded-lg flex-1">
                <span className={`text-xs font-bold ${step.arrowRight.replace('text-', 'text-')}`}>{step.date}</span>
                <p className="font-bold text-sih-navy mt-1">{step.title}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
