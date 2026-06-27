import { HelpCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function FAQ() {
  const faqs = [
    {
      q: "What is SVH 2026?",
      a: "SVH 2026 (Smart VIT Hackathon) is an internal collegiate hackathon organized by the Blockchain Club, VIT Bhopal. It is designed to emulate the structure, judging criteria, and standards of the prestigious national-level Smart India Hackathon (SIH), acting as a preparatory crucible for students."
    },
    {
      q: "What is the team size and composition requirement?",
      a: "Each team must consist of exactly 6 members. To promote gender diversity and align strictly with SIH rules, including at least one female team member is mandatory."
    },
    {
      q: "What is the registration fee?",
      a: "The registration fee is ₹75 per participant, which translates to a total of ₹450 per team of six members."
    },
    {
      q: "Can a team apply for more than one problem statement?",
      a: "Yes. Teams are permitted to select and submit PPT proposals for up to two problem statements. However, if qualified, a team will build a prototype for only one chosen problem statement in the Grand Finale."
    },
    {
      q: "How many teams will be shortlisted for the Grand Finale?",
      a: "An internal evaluation panel will evaluate all PPT submissions. The top 5 teams from each of the 12 problem statements will qualify. This means a maximum of 60 finalist teams will compete in the Grand Finale."
    },
    {
      q: "What is the structure of the Grand Finale?",
      a: "The Grand Finale is a two-day offline prototype development sprint. Unlike the standard 36-hour SIH, the SVH Grand Finale is conducted in a compressed format consisting of 6 hours of coding per day, totaling 12 hours of hands-on building time."
    },
    {
      q: "Are On-Duty (OD) permissions provided?",
      a: "The prototype development round is subject to institutional approval for official On-Duty (OD) permissions. Detailed announcements regarding OD policies will be made closer to the event."
    }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#fce4c0]/20 to-white pb-24">
      {/* Header Banner */}
      <section className="bg-[#0f2942] text-white py-16 px-4 text-center relative overflow-hidden border-b-8 border-sih-orange">
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-black font-inter tracking-tight uppercase mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto text-sm md:text-base text-justify">
            Find answers to common queries regarding team formation, registration fees, evaluation rounds, and event schedules.
          </p>
        </div>
      </section>

      {/* FAQ Grid */}
      <div className="max-w-3xl mx-auto px-4 mt-16 space-y-4">
        {faqs.map((faq, idx) => (
          <FAQItem key={idx} question={faq.q} answer={faq.a} />
        ))}
      </div>
    </div>
  );
}

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-350">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left font-bold font-inter text-[#0f2942] hover:text-sih-orange transition-colors"
      >
        <span className="flex items-center gap-3 text-justify">
          <HelpCircle className="w-5 h-5 text-sih-orange shrink-0" />
          {question}
        </span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-60 border-t border-gray-100' : 'max-h-0'}`}>
        <p className="p-5 text-sm text-gray-700 leading-relaxed text-justify font-medium">
          {answer}
        </p>
      </div>
    </div>
  );
}
