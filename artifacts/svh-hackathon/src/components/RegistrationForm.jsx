import { ExternalLink } from 'lucide-react';

export default function RegistrationForm() {
  return (
    <section id="register" className="py-24 w-full bg-[#f8f9fa] border-t border-gray-200">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black font-inter text-sih-navy uppercase tracking-tight mb-4">
            REGISTRATION & PORTAL UPLOAD
          </h2>
          <p className="text-gray-600 font-roboto text-lg">Platform to submit Phase 1 architecture PPTs and secure your spot.</p>
        </div>

        {/* Form Container Wrapper */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
           {/* Top utility bar inside the container */}
           <div className="bg-sih-navy px-6 py-3 flex items-center justify-between text-white">
              <span className="font-bold font-inter text-sm tracking-widest uppercase">Smart VIT Bhopal Portal</span>
              <a href="#" className="flex items-center gap-2 text-xs font-bold hover:text-sih-orange transition-colors">
                Open Full Screen <ExternalLink className="w-3 h-3" />
              </a>
           </div>

           {/* The actual iframe embed */}
           <div className="w-full h-[650px] relative bg-gray-50 flex items-center justify-center">
              <iframe 
                src="https://docs.google.com/forms/d/e/1FAIpQLSe/viewform?embedded=true" 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                marginHeight={0} 
                marginWidth={0}
                className="hidden md:block relative z-10"
                title="SVH 2026 Registration"
              >
                Loading…
              </iframe>

              {/* Mobile Fallback */}
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-white md:hidden">
                <p className="text-sih-navy font-bold font-inter mb-6 text-center px-6">Access the SVH Dashboard directly on your device.</p>
                <button className="px-8 py-3 bg-sih-orange text-white font-bold rounded-full uppercase tracking-wider text-sm shadow-md">
                   Launch Dashboard
                </button>
              </div>
           </div>
        </div>

      </div>
    </section>
  );
}
