import { Mail, MapPin, Linkedin, Instagram, Youtube, Twitter, Users } from 'lucide-react';

export default function ContactUs() {
  return (
    <div className="w-full min-h-screen" style={{ background: '#fafafa' }}>
      {/* Header Banner */}
      <section style={{ background: 'linear-gradient(135deg, #07192c 0%, #0f2942 100%)', color: '#fff', padding: '80px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 5, background: 'linear-gradient(to right, #FF9933 33.33%, #ffffff 33.33% 66.66%, #138808 66.66%)' }} />
        <div style={{ position: 'absolute', top: '20%', right: '5%', width: 250, height: 250, background: 'radial-gradient(circle, rgba(255,153,51,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', background: 'rgba(255,153,51,0.12)', border: '1px solid rgba(255,153,51,0.3)', borderRadius: 40, marginBottom: 24 }}>
            <span style={{ fontSize: 14 }}>📬</span>
            <span style={{ color: '#FF9933', fontSize: 12, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>Blockchain Club · VIT Bhopal</span>
          </div>
          <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 900, fontSize: 'clamp(32px,5vw,56px)', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: -1 }}>
            Get In <span style={{ background: 'linear-gradient(90deg,#FF9933,#fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Touch</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, fontFamily: 'Poppins,sans-serif', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
            Have questions about SVH 2026? Reach out to the Blockchain Club, VIT Bhopal organizers.
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
                <a href="mailto:blockchainclub@vitbhopal.ac.in" className="text-base font-bold text-[#0f2942] hover:text-[#FF9933] transition-colors">
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
                <p className="text-sm font-semibold text-[#0f2942]">
                  VIT Bhopal University, Kothri Kalan,<br />Sehore, Madhya Pradesh 466114
                </p>
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
