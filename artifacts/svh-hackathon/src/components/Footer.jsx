export default function Footer() {
  const currentYear = new Date().getFullYear();
  const iconStyle = { width: 18, height: 18, fill: 'currentColor', verticalAlign: 'middle' };
  return (
    <footer style={{ paddingTop: 30, background: '#0a1b3f', color: '#fff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px', padding: '20px 15px' }}>
            <div className="follow-box">
              <h3 style={{ fontFamily: 'Montserrat,sans-serif', color: '#f75700', fontSize: 18, fontWeight: 700, margin: '0 0 12px' }}>Follow Us</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: 10 }}>
                {[
                  { href: 'https://www.facebook.com/blockchainclubvitb/', label: 'Facebook', path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
                  { href: 'https://www.instagram.com/blockchain.vitb/', label: 'Instagram', path: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z' },
                  { href: 'https://x.com/SIH2025', label: 'Twitter / X', path: 'M4 4l5.5 7.2L4 20h2.5l4.3-5.5 3.7 5.5H20l-6-8.3L19 4h-2.5l-4 5.2L9.5 4H4z' },
                  { href: 'https://in.linkedin.com/company/blockchain-club-vitb', label: 'LinkedIn', path: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' },
                ].map((s, i) => (
                  <li key={i}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,.1)', color: '#ccc', textDecoration: 'none', transition: 'all .2s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#f75700'; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.1)'; e.currentTarget.style.color = '#ccc'; }}>
                      <svg style={iconStyle} viewBox="0 0 24 24"><path d={s.path} /></svg>
                    </a>
                  </li>
                ))}
              </ul>
              <p style={{ marginTop: 15, fontFamily: 'Montserrat,sans-serif', fontSize: 13, color: 'rgba(255,255,255,.6)' }}>&copy; {currentYear} Smart VIT Hackathon. All rights reserved</p>
            </div>
          </div>
          <div style={{ flex: '1 1 300px', padding: '20px 15px' }}>
            <div className="follow-box flo-box">
              <h3 style={{ fontFamily: 'Montserrat,sans-serif', color: '#f75700', fontSize: 18, fontWeight: 700, margin: '0 0 12px' }}>Contact Us</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: 10, fontFamily: 'Montserrat,sans-serif', fontSize: 13, color: 'rgba(255,255,255,.6)' }}>
                  <svg style={{ ...iconStyle, marginRight: 8 }} viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" fill="none" stroke="currentColor" strokeWidth={2} /></svg>
                  <a href="tel:+91 11 29581239" style={{ color: 'rgba(255,255,255,.6)', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color = '#f75700'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.6)'}>+91 11 29581239</a>,{' '}
                  <a href="tel:+91 11 29581235" style={{ color: 'rgba(255,255,255,.6)', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color = '#f75700'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.6)'}>+91 11 29581235</a>
                </li>
                <li style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 13, color: 'rgba(255,255,255,.6)' }}>
                  <svg style={{ ...iconStyle, marginRight: 8 }} viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" fill="none" stroke="currentColor" strokeWidth={2} /><polyline points="22,6 12,13 2,6" fill="none" stroke="currentColor" strokeWidth={2} /></svg>
                  <a href="mailto:SVH@aicte-india.org" style={{ color: 'rgba(255,255,255,.6)', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color = '#f75700'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.6)'}>SVH@aicte-india.org</a>,{' '}
                  <a href="mailto:hackathon@aicte-india.org" style={{ color: 'rgba(255,255,255,.6)', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color = '#f75700'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.6)'}>hackathon@aicte-india.org</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
