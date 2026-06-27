import bcLogo from '../assets/Blockchain Club Logo (Circle).png';
import vitLogo from '../assets/vitblogo.png';

export default function Organizers() {
  return (
    <section className="bg-white pt-24 pb-12 w-full border-t border-gray-200">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">

        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black font-inter text-[#0f2942] uppercase tracking-tight">
            ORGANISERS
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-24 opacity-90 pb-8">

          <div className="flex items-center gap-4 group">
            <img src={vitLogo} alt="VIT Logo" className="h-12 w-12 object-contain" />
            <div className="flex flex-col text-center md:text-left">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Organizing Institute</span>
              <span className="text-lg font-black font-inter text-[#0f2942] uppercase">VIT Bhopal University</span>
            </div>
          </div>

          {/* Blockchain Club - analogous to SBI Foundation */}
          <div className="flex items-center gap-4 group">
            <img src={bcLogo} alt="Blockchain Club" className="h-24 w-24 object-cover rounded-full shadow-sm" />
            <div className="flex flex-col text-left">
              <span className="text-xs text-sih-orange font-bold uppercase tracking-wider mb-0.5">Primary Club</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black font-inter text-[#0f2942] uppercase tracking-tighter">BLOCKCHAIN</span>
                <span className="text-2xl font-black font-inter text-[#0ea5e9] uppercase tracking-tighter">CLUB</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
