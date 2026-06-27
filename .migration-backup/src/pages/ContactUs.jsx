import { Mail, MapPin, Linkedin, Instagram, Youtube, Twitter, Users } from 'lucide-react';

export default function ContactUs() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#fce4c0]/20 to-white pb-24">
      {/* Header Banner */}
      <section className="bg-[#0f2942] text-white py-16 px-4 text-center relative overflow-hidden border-b-8 border-sih-orange">
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-black font-inter tracking-tight uppercase mb-3">
            Contact Us
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto text-sm md:text-base text-justify">
            Have questions about the registration process, problem statements, or evaluation criteria? Reach out to the organizers.
          </p>
        </div>
      </section>

      {/* Contact Grid */}
      <div className="max-w-4xl mx-auto px-4 mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Contact Info Card */}
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <h2 className="text-2xl font-black font-inter text-[#0f2942] border-b border-gray-100 pb-3 uppercase tracking-tight">
            Official Channels
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#fce4c0] text-[#ea580c] rounded-xl flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Email Address</h4>
                <a href="mailto:blockchainclub@vitbhopal.ac.in" className="text-base font-bold text-[#0f2942] hover:text-[#ea580c] transition-colors text-justify">
                  blockchainclub@vitbhopal.ac.in
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#fce4c0] text-[#ea580c] rounded-xl flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Location</h4>
                <p className="text-base font-bold text-[#0f2942] text-justify">India</p>
              </div>
            </div>

            <div className="flex items-start gap-4 border-t border-gray-100 pt-4">
              <div className="w-10 h-10 bg-[#fce4c0] text-[#ea580c] rounded-xl flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Faculty Coordinator</h4>
                <p className="text-base font-bold text-[#0f2942] text-justify">Dr Hemraj Lamkuche</p>
                <p className="text-xs text-gray-500 text-justify">Blockchain Club Coordinator</p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Connections Card */}
        <div className="bg-[#0f2942] text-white p-8 rounded-2xl shadow-md space-y-6">
          <h2 className="text-2xl font-black font-inter text-sih-orange border-b border-white/10 pb-3 uppercase tracking-tight">
            Follow Our Club
          </h2>
          <p className="text-xs text-gray-300 leading-relaxed text-justify">
            Stay updated with real-time announcements, timeline revisions, guidelines, resources, and expert sessions by following the official handles of the Blockchain Club.
          </p>
          
          <div className="grid grid-cols-2 gap-4 pt-2">
            {[
              { name: "LinkedIn", url: "https://linkedin.com/company/blockchain-club-vitb", icon: <Linkedin className="w-4 h-4" /> },
              { name: "Instagram", url: "https://instagram.com/blockchain.vitb", icon: <Instagram className="w-4 h-4" /> },
              { name: "YouTube", url: "https://youtube.com/@blockchainclubvitb", icon: <Youtube className="w-4 h-4" /> },
              { name: "X (Twitter)", url: "https://x.com/blockchainvitb", icon: <Twitter className="w-4 h-4" /> }
            ].map((soc, idx) => (
              <a 
                key={idx} 
                href={soc.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="text-sih-orange">{soc.icon}</div>
                <span className="text-xs font-bold text-gray-200 text-justify">{soc.name}</span>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
