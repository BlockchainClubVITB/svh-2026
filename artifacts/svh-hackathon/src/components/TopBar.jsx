import { Link } from 'react-router-dom';
import bcLogo from '../assets/Blockchain Club Logo (Circle).png';

export default function TopBar() {
  return (
    <div className="w-full relative z-40 bg-white">
      {/* Absolute top utility containing logos to the left and Registration CTA to the right */}
      <div className="bg-[#f8f9fa] border-b border-gray-200 h-20 flex items-center justify-between px-4 md:px-8">
        
        <div className="flex items-center gap-3 h-full">
           {/* Blockchain Club Logo */}
           <img src={bcLogo} alt="Blockchain Club Logo" className="h-12 w-12 rounded-full object-cover shadow-sm border border-gray-200" />
           <div className="flex flex-col text-left">
             <span className="text-[10px] text-sih-orange font-black tracking-widest uppercase">Blockchain Club</span>
             <span className="text-xs font-black font-inter text-sih-navy tracking-tight leading-none uppercase">VIT Bhopal University</span>
           </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Top Level Registration Button */}
          <Link to="/" className="text-sm font-black px-6 py-2.5 bg-[#ea580c] text-white rounded-md hover:bg-[#c2410c] transition-colors uppercase tracking-wider shadow-sm">
             Register Now
          </Link>
        </div>
      </div>
    </div>
  );
}
