import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const SIH = 'https://sih.gov.in';

const slides = [
  { img: `${SIH}/img1/slider2026/sih2026-Coming-Soon.png`,          href: '#' },
  { img: `${SIH}/img1/slider/sih2025-slider-banner-PM-Banner2.png`, href: '#' },
  { img: `${SIH}/img1/slider/sih2025-Statistics.png`,               href: '/problem-statements' },
];

function HeroCarousel() {
  const [active, setActive] = useState(0);
  const total = slides.length;
  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % total), 5000);
    return () => clearInterval(t);
  }, [total]);
  return (
    <div id="demo" style={{ position: 'relative', width: '100%', overflow: 'hidden', background: '#000', minHeight: 220 }}>
      {slides.map((s, i) => (
        <a key={i} href={s.href} style={{ display: i === active ? 'block' : 'none' }}>
          <img src={s.img} alt=""
            style={{ width: '100%', objectFit: 'cover', maxHeight: 520 }}
            onError={e => { e.currentTarget.parentElement.style.display = 'none'; }} />
        </a>
      ))}
      <button onClick={() => setActive(a => (a - 1 + total) % total)}
        style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 10, width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', fontSize: 22, cursor: 'pointer' }}>‹</button>
      <button onClick={() => setActive(a => (a + 1) % total)}
        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 10, width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', fontSize: 22, cursor: 'pointer' }}>›</button>
      <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 10 }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => setActive(i)}
            style={{ width: 12, height: 12, borderRadius: '50%', border: '1px solid #fff', background: i === active ? '#f75700' : 'rgba(0,0,36,0.7)', cursor: 'pointer' }} />
        ))}
      </div>
    </div>
  );
}

function NewsTicker() {
  return (
    <div style={{ background: '#000', color: '#fff', fontFamily: "'Book Antiqua',Palatino,serif", fontWeight: 'bold', padding: '10px 0 5px', overflow: 'hidden' }}>
      <div
        style={{ display: 'inline-block', whiteSpace: 'nowrap', animation: 'sih-marquee 40s linear infinite' }}
        onMouseEnter={e => { e.currentTarget.style.animationPlayState = 'paused'; }}
        onMouseLeave={e => { e.currentTarget.style.animationPlayState = 'running'; }}
      >
        &nbsp;&nbsp;&nbsp;
        🔔 SVH 2026 Registration opens <strong>1–20 July 2026</strong>&nbsp;|&nbsp;
        Teams of 6 members (min. 1 female)&nbsp;|&nbsp;
        Registration fee: <strong>₹75/member (₹450/team)</strong>&nbsp;|&nbsp;
        PPT Submission: <strong>20 July – 5 Aug 2026</strong>&nbsp;|&nbsp;
        Grand Finale: <strong>24–25 Aug 2026</strong> (tentative)&nbsp;|&nbsp;
        Organized by <strong>Blockchain Club, VIT Bhopal</strong>
        &nbsp;&nbsp;&nbsp;
      </div>
    </div>
  );
}

function AboutHackathon() {
  return (
    <section style={{ background: '#fff6ee', padding: '60px 0', position: 'relative' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', margin: '20px 0 30px' }}>
          <h3 style={{ fontFamily: 'Montserrat,sans-serif', color: '#f75700', fontSize: 34, fontWeight: 700, letterSpacing:'0.04em', margin: 0 }}>WHAT IS SVH?</h3>
        </div>
        <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: 30 }}>
          <div style={{ flex: '1 1 500px' }}>
            <p style={{ color: '#002449', fontSize: 16, lineHeight: '25px', margin: '0 0 16px', fontFamily: 'Montserrat,sans-serif', textAlign: 'justify' }}>
              Smart VIT Hackathon (SVH) is a premier VIT Bhopal initiative designed to engage students in solving some of the most pressing challenges faced in everyday life. Launched to foster a culture of innovation and practical problem-solving, SVH provides a dynamic platform for students to develop and showcase their creative solutions to real-world problems. By encouraging participants to think critically and innovatively, the hackathon aims to bridge the gap between academic knowledge and practical application.
            </p>
            <p style={{ color: '#002449', fontSize: 16, lineHeight: '25px', margin: '0 0 16px', fontFamily: 'Montserrat,sans-serif', textAlign: 'justify' }}>
              Since its inception, SVH has garnered significant success in promoting out-of-the-box thinking among young minds, particularly engineering students from across VIT Bhopal. Each edition has built on the previous one, refining its approach and expanding its impact. The hackathon not only offers students an opportunity to showcase their skills but also encourages collaboration with industry experts, government agencies, and other stakeholders.
            </p>
          </div>

        </div>

        {/* Read More area — always visible */}
        <div style={{ width: '100%' }}>
          <div style={{ background: 'rgb(28,23,119)', borderRadius: 12, overflow: 'hidden', padding: '30px' }}>
            <div style={{ display: 'flex', gap: 30, flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 300px' }}>
                <div style={{ marginBottom: 24 }}>
                  <h4 style={{ color: '#f75700', fontFamily: 'Montserrat,sans-serif', fontSize: 18, fontWeight: 700, textTransform: 'uppercase', margin: '0 0 12px' }}>Overview</h4>
                  <p style={{ color: 'rgba(255,255,255,.9)', fontFamily: 'Montserrat,sans-serif', fontSize: 14, lineHeight: '22px', margin: 0 }}>
                    Smart VIT Hackathon (SVH) is a VIT Bhopal initiative to provide students a platform to solve some of the pressing problems we face in our daily lives, and thus inculcate a culture of product innovation and a mindset of problem solving.
                  </p>
                </div>
                <div>
                  <h4 style={{ color: '#f75700', fontFamily: 'Montserrat,sans-serif', fontSize: 18, fontWeight: 700, textTransform: 'uppercase', margin: '0 0 12px' }}>Who can participate?</h4>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ background: 'rgba(255,255,255,.1)', borderRadius: 8, padding: '20px', flex: '1 1 140px', textAlign: 'center' }}>
                      <h3 style={{ color: '#fff', fontFamily: 'Montserrat,sans-serif', fontSize: 16, fontWeight: 700, margin: '0 0 4px' }}>SVH Senior</h3>
                      <p style={{ color: 'rgba(255,255,255,.7)', fontFamily: 'Montserrat,sans-serif', fontSize: 12, margin: 0 }}>All VIT Bhopal Students from all years</p>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ flex: '1 1 300px' }}>
                <div style={{ background: 'rgba(255,255,255,.08)', borderRadius: 8, padding: 16, textAlign: 'center' }}>
                  <iframe width="100%" height="200" src="https://www.youtube.com/embed/0ZYG_zz2aoI" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="PM Quote"></iframe>
                  <p style={{ color: '#fff', fontFamily: 'Montserrat,sans-serif', fontSize: 14, fontWeight: 600, margin: '12px 0 2px' }}>Dr. G. Viswanathan</p>
                  <p style={{ color: 'rgba(255,255,255,.6)', fontFamily: 'Montserrat,sans-serif', fontSize: 12, margin: 0 }}>Founder & Chancellor, VIT</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', margin: '20px 0 30px' }}>
            <h3 style={{ fontFamily: 'Montserrat,sans-serif', color: '#f75700', fontSize: 34, fontWeight: 700, letterSpacing:'0.04em', margin: 0 }}>Why join SVH 2026?</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 30 }}>
            {[
              { img: `${SIH}/img1/innovative-solutions.png`, title: 'Innovative Solutions', desc: 'Get innovative solutions to your problems in cost effective ways Opportunity to be a part of Campus Innovation and to brand your company.' },
              { img: `${SIH}/img1/recognition.png`, title: 'Recognition and visibility', desc: 'Recognition and visibility for your organisation across VIT Bhopal and partner institutions' },
              { img: `${SIH}/img1/out-of-box.png`, title: 'Out-of-the-box solutions', desc: 'Talented students from across VIT Bhopal offer out-of-the-box solutions to your problems' },
              { img: `${SIH}/img1/opportunity.png`, title: 'Innovation Movement Opportunity', desc: "Be part of VIT's Open Innovation Movement and work with some of the best talents across the university" },
            ].map((b, i) => (
              <div key={i} style={{ textAlign: 'center', borderBottom: '3px solid rgb(216,82,23)', height: 280 }}>
                <div style={{ padding: '20px 16px' }}>
                  <img src={b.img} alt={b.title} style={{ height: '25%', margin: '0 auto', display: 'block', objectFit: 'contain' }}
                    onError={e => { e.currentTarget.style.display = 'none'; }} />
                  <h4 style={{ fontFamily: 'Montserrat,sans-serif', color: 'rgb(0,48,120)', fontSize: 22, fontWeight: 700, margin: '20px 0 10px', textTransform:'capitalize' }}>{b.title}</h4>
                  <p style={{ fontFamily: 'Montserrat,sans-serif', color: '#002449', fontSize: 15, lineHeight: '20px', margin: '0 0 30px' }}>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   JR / SENIOR SECTION (video + hackathon process)
   ───────────────────────────────────────────── */
function JrSeniorSection() {
  return (
    <section style={{ background: '#fff', padding: '70px 20px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position:'absolute', top:80, left:0, width:182, height:500, background:`url(${SIH}/img1/participate-overview-left.png) left top no-repeat`, backgroundSize:'100%', zIndex:0, pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:80, right:0, width:182, height:500, background:`url(${SIH}/img1/participate-overview-right.png) left top no-repeat`, backgroundSize:'100%', zIndex:0, pointerEvents:'none' }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'center', position:'relative', zIndex:11 }}>
        <div style={{ flex: '1 1 500px', position:'relative', zIndex:11 }}>
          <div style={{ position:'absolute', left:0, top:-13, width:223, height:176, background:`url(${SIH}/img1/video-left-top.png) left top no-repeat`, backgroundSize:'100% 100%', zIndex:-1, pointerEvents:'none' }} />
          <div style={{ position:'absolute', right:0, bottom:0, width:223, height:176, background:`url(${SIH}/img1/video-left-bottom.png) right top no-repeat`, backgroundSize:'100% 100%', zIndex:-1, pointerEvents:'none' }} />
          <iframe width="100%" height="470" src="https://www.youtube.com/embed/znMbKz6ZPno" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="SVH Video"
            style={{ borderRadius:20 }} />
        </div>
        <div style={{ flex: '1 1 400px', textAlign: 'center', position:'relative', zIndex:11 }}>
          <img src={`${SIH}/img1/hackathon-process-logo.png`} alt="Hackathon Process"
            style={{ maxWidth:'100%', height:'auto' }}
            onError={e => { e.currentTarget.style.display = 'none'; }} />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PROCESS FLOW
   ───────────────────────────────────────────── */
const processSteps = [
  { num: 1, title: 'Problem Statement Publication',        text: 'SVH releases curated problem statements across domains. Teams review and select up to 2 of interest from the published list.' },
  { num: 2, title: 'Registration (1–20 July 2026)',         text: 'Teams of 6 register. Min. 1 female member mandatory. Fee: ₹75/member (₹450/team).' },
  { num: 3, title: 'Round 1: PPT Submission (20 Jul–5 Aug)', text: 'Teams submit a presentation covering problem, solution, technical architecture, impact, and roadmap.' },
  { num: 4, title: 'Round 1: PPT Evaluation (5–10 Aug)',    text: 'Internal panel reviews submissions. Top 5 teams per problem statement advance to the Grand Finale.' },
  { num: 5, title: 'Results Announcement',                  text: 'Shortlisted finalists are officially announced across internal channels and notice boards.' },
  { num: 6, title: 'Round 2: Grand Finale (24–25 Aug)',     text: 'Finalists build and demo a functional prototype. 2-day, 12-hour hackathon. Subject to OD approvals.' },
];
const stepImgs = Array.from({ length: 6 }, (_, i) => `${SIH}/img1/process/step${i + 1}.png`);

function ProcessStep({ s, img, showArrow }) {
  return (
    <div style={{ textAlign: 'center', padding: '0 20px', position: 'relative', borderRight: showArrow ? '1px dashed #ccc' : 'none' }}>
      <img src={img} alt={s.title}
        style={{ width: 80, height: 80, margin: '0 auto 16px', display: 'block', objectFit: 'contain' }}
        onError={e => { e.currentTarget.style.display = 'none'; }} />
      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: '50%', background: '#f75700', color: '#fff', fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 14, marginBottom: 10 }}>
        {s.num}
      </div>
      <h4 style={{ fontFamily: 'Montserrat,sans-serif', color: '#002449', fontSize: 15, fontWeight: 700, margin: '0 0 8px', textTransform: 'none' }}>{s.title}</h4>
      <p style={{ color: '#002449', fontFamily: 'Montserrat,sans-serif', fontSize: 13, lineHeight: '18px', textAlign: 'center', margin: 0 }}>{s.text}</p>
      {showArrow && (
        <div style={{ position: 'absolute', right: -7, top: 40, width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '14px solid #676767' }} />
      )}
    </div>
  );
}

function ProcessFlow() {
  return (
    <section style={{ background: '#fff', padding: '80px 20px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <p style={{ margin: 0, fontWeight: 700, color: '#f75700', fontSize: 18, fontFamily: 'Montserrat,sans-serif' }}>SVH Software Edition</p>
          <h3 style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 36, margin: 0, color: '#002449', textTransform: 'uppercase', fontWeight: 700 }}>Process Flow</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0, marginBottom: 60 }}>
          {processSteps.slice(0, 3).map((s, i) => (
            <ProcessStep key={i} s={s} img={stepImgs[i]} showArrow={i < 2} />
          ))}
        </div>
        <div style={{ borderBottom: '2px dotted #676767', margin: '0 0 60px', position: 'relative', textAlign: 'center' }}>
          <span style={{ background: '#fff', padding: '0 16px', position: 'relative', top: 12, fontFamily: 'Montserrat,sans-serif', color: '#676767', fontSize: 14, letterSpacing: 4 }}>▼ CONTINUED ▼</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0 }}>
          {processSteps.slice(3).map((s, i) => (
            <ProcessStep key={i} s={s} img={stepImgs[i + 3]} showArrow={i < 2} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   THEMES CAROUSEL
   ───────────────────────────────────────────── */
const themes = [
  { icon: `${SIH}/img/icon_communication.png`, title: 'Smart Automation',              desc: 'Ideas focused on the intelligent use of resources for transforming and advancements of technology with combining the artificial intelligence to explore more various sources and get valuable insights.' },
  { icon: `${SIH}/img/icon_sport.png`,         title: 'Fitness & Sports',              desc: 'Ideas that can boost fitness activities and assist in keeping fit.' },
  { icon: `${SIH}/img/icon_drone.png`,         title: 'Space Technology',              desc: 'For use in travel or activities beyond Earth\'s atmosphere, for purposes such as spaceflight or space exploration.' },
  { icon: `${SIH}/img/icon_heritage.png`,      title: 'Heritage & Culture',            desc: 'Ideas that showcase the rich cultural heritage and traditions of India.' },
  { icon: `${SIH}/img/icon_healthcare.png`,    title: 'MedTech/BioTech/ HealthTech',   desc: 'Cutting-edge technology in these sectors continues to be in demand. Recent shifts in healthcare trends, growing populations also present an array of opportunities for innovation.' },
  { icon: `${SIH}/img/icon_technology.png`,    title: 'Agriculture, FoodTech & Rural Development', desc: 'Developing solutions, keeping in mind the need to enhance the primary sector of India - Agriculture and to manage and process our agriculture produce.' },
  { icon: `${SIH}/img/icon_automobiles.png`,   title: 'Smart Vehicles',                desc: 'Creating intelligent devices to improve commutation sector.' },
  { icon: `${SIH}/img/icon_agriculture.png`,   title: 'Transportation & Logistics',    desc: 'Submit your ideas to address the growing pressures on the city\'s resources, transport networks, and logistic infrastructure.' },
  { icon: `${SIH}/img/icon_drone.png`,         title: 'Robotics and Drones',           desc: 'There is a need to design drones and robots that can solve some of the pressing challenges of India such as handling medical emergencies, search and rescue operations, etc.' },
  { icon: `${SIH}/img/icon_waste.png`,         title: 'Clean & Green Technology',      desc: 'Solutions could be in the form of waste segregation, disposal, and improve sanitization system.' },
  { icon: `${SIH}/img/icon_tourism.png`,       title: 'Tourism',                       desc: 'A solution/idea that can boost the current situation of the tourism industries including hotels, travel and others.' },
  { icon: `${SIH}/img/icon_renewable.png`,     title: 'Renewable/ Sustainable Energy', desc: 'Innovative ideas that help manage and generate renewable /sustainable sources more efficiently.' },
  { icon: `${SIH}/img/icon_security.png`,      title: 'Blockchain & Cybersecurity',    desc: 'Provide ideas in a decentralized and distributed ledger technology used to store digital information that powers cryptocurrencies and NFTs and can radically change multiple sectors.' },
  { icon: `${SIH}/img/smart-education.png`,    title: 'Smart Education',               desc: 'Smart education, a concept that describes learning in digital age. It enables learners to learn more effectively, efficiently, flexibly and comfortably.' },
  { icon: `${SIH}/img/disaster-management.png`, title: 'Disaster Management',           desc: 'Disaster management includes ideas related to risk mitigation, Planning and management before, after or during a disaster.' },
  { icon: `${SIH}/img/toys-theme.png`,         title: 'Games & Toys',                  desc: 'Challenge your creative mind to conceptualize and develop unique toys and games based on our civilization, history, and culture etc.' },
  { icon: `${SIH}/img/icon_education.png`,     title: 'Miscellaneous',                 desc: 'Technology ideas in tertiary sectors like Hospitality, Entertainment and Retail.' },
  { icon: `${SIH}/img/icon_education.png`,     title: 'Fintech',                       desc: 'Challenges related to the financial services.' },
];

function ThemeCard({ theme }) {
  const [imgFailed, setImgFailed] = useState(false);
  return (
    <Link to="/problem-statements" style={{ textDecoration: 'none', display: 'block', textAlign: 'center', padding: '30px', background: 'rgb(255, 248, 237)', borderRadius: 9, height: 370, border: '1.20762px solid rgb(246, 121, 11)', boxShadow: 'rgba(255,255,255,0.44) -6.44062px -7.24569px 11.2711px, rgba(0,0,0,0.07) 7.24569px 6.44062px 24.9574px' }}>
      {imgFailed ? (
        <div style={{ fontSize: 48, marginBottom: 12, color: '#ccc' }}>⚙️</div>
      ) : (
        <img src={theme.icon} alt={theme.title}
          style={{ width: '40%', margin: '0 auto', padding: '0 0 30px', display: 'block' }}
          onError={() => setImgFailed(true)} />
      )}
      <h3 style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 15, color: 'rgb(0,48,120)', margin: '0 0 8px', fontWeight: 700 }}>{theme.title}</h3>
      <p style={{ fontFamily: 'Montserrat,sans-serif', color: '#002449', fontSize: 15, lineHeight: '22px', margin: 0 }}>{theme.desc}</p>
    </Link>
  );
}

function ThemesSection() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const checkScroll = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };
  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      return () => el.removeEventListener('scroll', checkScroll);
    }
  }, []);
  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const cardW = 280 + 20;
    scrollRef.current.scrollBy({ left: dir * cardW * 2, behavior: 'smooth' });
    setTimeout(checkScroll, 350);
  };
  return (
    <section id="sihthemes" style={{ backgroundImage: `url(${SIH}/img1/theme-bg.png)`, backgroundSize: '100% 100%', padding: '50px 20px 0', position: 'relative' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <h2 style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 34, margin: '0 0 8px', color: '#002449', textTransform: 'uppercase', fontWeight: 700 }}>THEMES</h2>
          <span style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 16, color: '#333', display: 'block', fontWeight: 700 }}>No problem is too big... No idea is too small</span>
        </div>
        <div style={{ position: 'relative', marginBottom: 24 }}>
          {canScrollLeft && (
            <button onClick={() => scroll(-1)}
              style={{ position: 'absolute', left: -16, top: '50%', transform: 'translateY(-50%)', zIndex: 10, width: 40, height: 40, borderRadius: '50%', background: '#f75700', color: '#fff', border: 'none', fontSize: 22, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,.2)' }}>‹</button>
          )}
          {canScrollRight && (
            <button onClick={() => scroll(1)}
              style={{ position: 'absolute', right: -16, top: '50%', transform: 'translateY(-50%)', zIndex: 10, width: 40, height: 40, borderRadius: '50%', background: '#f75700', color: '#fff', border: 'none', fontSize: 22, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,.2)' }}>›</button>
          )}
          <div ref={scrollRef}
            style={{ display: 'flex', gap: 20, overflowX: 'auto', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none', padding: '4px 0' }}>
            {themes.map((t, i) => (
              <div key={i} style={{ flex: '0 0 300px', scrollSnapAlign: 'start' }}>
                <ThemeCard theme={t} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: '#f75700', padding: '16px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ margin: 0, fontFamily: 'Montserrat,sans-serif', color: '#fff', fontSize: 22 }}>Explore all SVH themes and problem statements</p>
          <Link to="/problem-statements"
            style={{ background: '#fff', padding: '14px 60px', borderRadius: 50, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, color: '#002449', fontSize: 14, letterSpacing: 1, border: '1px solid #fff', textDecoration: 'none' }}>
            VIEW THEMES
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   TIMELINE
   ───────────────────────────────────────────── */
function TimelineSection() {
  return (
    <section id="process-timeline" style={{ background: '#fff', padding: '50px 20px', borderBottom: '1px solid #e9ecef' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ marginBottom: 30 }}>
          <h3 style={{ fontFamily: 'Montserrat,sans-serif', color: '#002449', fontSize: 28, fontWeight: 700, margin: 0 }}>SVH process flow and Timeline</h3>
        </div>
        <img src={`${SIH}/img1/SIH26_Process_Flow.png`} alt="SVH Process Flow"
          style={{ maxWidth: '100%', height: 'auto' }}
          onError={e => { e.currentTarget.style.display = 'none'; }} />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   WHY SVH IS IMPORTANT (second benefits section)
   ───────────────────────────────────────────── */
const benefits2 = [
  { img: `${SIH}/img/inovative-solution-1.png`, title: 'Innovative Solutions', desc: 'Get innovative solutions to your problems in cost effective ways Opportunity to be a part of Campus Innovation and to brand your company.' },
  { img: `${SIH}/img/recog-visiblity-1.png`, title: 'Recognition and visibility', desc: 'Recognition and visibility for your organisation across VIT Bhopal and partner institutions' },
  { img: `${SIH}/img/out-of-box-solution-1.png`, title: 'Out-of-the-box solutions', desc: 'Talented students from across VIT Bhopal offer out-of-the-box solutions to your problems' },
  { img: `${SIH}/img/inno-move-opert-1.png`, title: 'Innovation Movement Opportunity', desc: 'Be part of World\'s biggest Open Innovation Movement Opportunity to work with some of the best talents in the country' },
];

function BenefitsSection2() {
  return (
    <section style={{ background: '#f8f9fa', padding: '50px 20px', borderBottom: '1px solid #e9ecef' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h3 style={{ fontFamily: 'Montserrat,sans-serif', color: '#002449', fontSize: 28, fontWeight: 700, margin: 0 }}>Why SVH is important for Government department and Corporate department</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          {benefits2.map((b, i) => (
            <div key={i} style={{ textAlign: 'center', background: '#fff', borderRadius: 8, padding: '30px 16px', boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
              <img src={b.img} alt={b.title} style={{ height: 60, marginBottom: 16, objectFit: 'contain' }}
                onError={e => { e.currentTarget.style.display = 'none'; }} />
              <h4 style={{ fontFamily: 'Montserrat,sans-serif', color: '#002449', fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>{b.title}</h4>
              <p style={{ fontFamily: 'Montserrat,sans-serif', color: '#666', fontSize: 13, lineHeight: '18px', margin: 0 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   COUNTER / MILESTONES
   ───────────────────────────────────────────── */
function CounterSection() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: .3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const counters = [
    { val: '18,04,218+', label: 'Participating Students' },
    { val: '12,800+',    label: 'SVH Alumni Network' },
    { val: '9,406',      label: 'Participating Institutes' },
    { val: '3,158',      label: 'Total Problem Statements' },
    { val: '150+',       label: 'Startups Details Submitted' },
  ];
  return (
    <section ref={ref} style={{ background: '#002449', padding: '50px 20px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <h3 style={{ fontFamily: 'Montserrat,sans-serif', color: '#f75700', fontSize: 28, fontWeight: 700, textTransform: 'uppercase', margin: '0 0 30px' }}>SVH Milestones</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20 }}>
          {counters.map((c, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,.06)', borderRadius: 8, padding: '20px 10px', border: '1px solid rgba(255,255,255,.08)' }}>
              <h4 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: '0 0 6px', fontFamily: 'Montserrat,sans-serif' }}>
                {inView ? c.val : '0'}
              </h4>
              <p style={{ color: 'rgba(255,255,255,.8)', fontSize: 14, lineHeight: '18px', fontWeight: 300, fontFamily: 'Montserrat,sans-serif', margin: 0 }}>{c.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   COMMITTEE
   ───────────────────────────────────────────── */
const committeeMembers = [
  { img: `${SIH}/img/people/3.jpg`,                name: 'Dr. G. Viswanathan',     role: 'Founder & Chancellor, VIT',                     section: 'patron' },
  { img: `${SIH}/img/people/m1_new.png`,            name: 'Dr. G. R. C. Reddy',      role: 'Vice Chancellor, VIT Bhopal',                   section: 'patron' },
  { img: `${SIH}/img/people/Dr-Sukanta-Majumdar.jpg`, name: 'Dr. M. Sivakumar',       role: 'Registrar, VIT Bhopal',                         section: 'copatron' },
  { img: `${SIH}/img/people/Jayant-Chaudhary.jpg`,  name: 'Dr. Sanjeev Shrivastava', role: 'Dean Academic Affairs',                         section: 'copatron' },
  { img: `${SIH}/img/people/Vineet-Joshi.jpg`,      name: 'Dr. S. S. Mahapatra',     role: 'Dean Research & Innovation',                    section: 'copatron' },
  { img: `${SIH}/img/people/Abhay-Jere.jpg`,         name: 'Dr. Hemraj Lamkuche',     role: 'Coordinator, Blockchain Club',                   section: 'executive' },
  { img: `${SIH}/img/people/Rajive-Kumar.jpg`,       name: 'Prof. A. K. Saxena',      role: 'Head, School of CSE',                           section: 'executive' },
  { img: `${SIH}/img/people/Gaurav-Singh.jpg`,       name: 'Dr. R. K. Sharma',        role: 'Dean Student Welfare',                          section: 'executive' },
  { img: `${SIH}/img/people/Yogesh-Brahmankar.jpg`,  name: 'Blockchain Club Core',    role: 'Event Organization & Management',                section: 'executive' },
  { img: `${SIH}/img/people/Pratap-Sanap.jpg`,       name: 'Technical Committee',     role: 'Problem Statement Curation',                    section: 'executive' },
  { img: `${SIH}/img/people/Puneet-Sharma.jpg`,      name: 'Evaluation Panel',        role: 'Faculty & Industry Experts',                    section: 'executive' },
  { img: `${SIH}/img/people/Pradeep-Dhage.jpg`,      name: 'Mentorship Board',        role: 'Senior Club Members & Alumni',                  section: 'executive' },
  { img: `${SIH}/img/people/Ankush-Sharma.jpg`,      name: 'Logistics Team',          role: 'Club Coordinators & Volunteers',                section: 'executive' },
  { img: `${SIH}/img/people/Sarim-Moin.jpg`,         name: 'Media & Outreach',        role: 'Design & Communications Team',                  section: 'executive' },
  { img: `${SIH}/img/people/Sourabh-Nirmale.jpg`,    name: 'Sponsorship Team',        role: 'Industry Relations Team',                       section: 'executive' },
];

function CommitteeMember({ m }) {
  const [failed, setFailed] = useState(false);
  return (
    <div style={{ textAlign: 'center', padding: '20px 10px' }}>
      <div style={{ width: 120, height: 120, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 12px', border: '3px solid #13768f', background: '#e0e0e0' }}>
        {failed ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#666', fontWeight: 700, fontFamily: 'Montserrat,sans-serif' }}>
            {m.name.split(' ').filter(n => !n.includes('.')).map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase()}
          </div>
        ) : (
          <img src={m.img} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={() => setFailed(true)} />
        )}
      </div>
      <h4 style={{ fontFamily: 'Montserrat,sans-serif', color: '#002449', fontSize: 14, fontWeight: 700, margin: '0 0 4px' }}>{m.name}</h4>
      <p style={{ fontFamily: 'Montserrat,sans-serif', color: '#666', fontSize: 12, margin: 0 }}>{m.role}</p>
    </div>
  );
}

function CommitteeSection() {
  const [tab, setTab] = useState('organizing');
  const executive = committeeMembers.filter(m => m.section === 'executive');
  return (
    <section style={{ background: '#f8f9fa', padding: '50px 20px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px', display: 'flex', justifyContent: 'center', gap: 4, borderBottom: '1px solid #dee2e6' }}>
          <li style={{ margin: 0 }}>
            <button onClick={() => setTab('organizing')}
              style={{ padding: '10px 24px', fontFamily: 'Montserrat,sans-serif', fontSize: 14, fontWeight: 600, background: 'none', color: tab === 'organizing' ? '#f75700' : '#002449', border: 'none', borderBottom: tab === 'organizing' ? '3px solid #f75700' : '3px solid transparent', cursor: 'pointer' }}>
              Organizing Committee
            </button>
          </li>
          <li style={{ margin: 0, display: 'none' }}>
            <button onClick={() => setTab('executive')}
              style={{ padding: '10px 24px', fontFamily: 'Montserrat,sans-serif', fontSize: 14, fontWeight: 600, background: 'none', color: tab === 'executive' ? '#f75700' : '#002449', border: 'none', borderBottom: tab === 'executive' ? '3px solid #f75700' : '3px solid transparent', cursor: 'pointer' }}>
              Executive Committee
            </button>
          </li>
        </ul>

        {tab === 'organizing' && (
          <>
            <div style={{ borderBottom: '1px solid #dee2e6', marginBottom: 24 }}>
              <h3 style={{ fontFamily: 'Montserrat,sans-serif', color: '#f75700', fontSize: 18, fontWeight: 700, textTransform: 'uppercase', textAlign: 'center', margin: '0 0 16px' }}>Patron</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
                {committeeMembers.filter(m => m.section === 'patron').map((m, i) => (
                  <CommitteeMember key={i} m={m} />
                ))}
              </div>
            </div>
            <div>
              <h3 style={{ fontFamily: 'Montserrat,sans-serif', color: '#f75700', fontSize: 18, fontWeight: 700, textTransform: 'uppercase', textAlign: 'center', margin: '0 0 16px' }}>Co-Patrons</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
                {committeeMembers.filter(m => m.section === 'copatron').map((m, i) => (
                  <CommitteeMember key={i} m={m} />
                ))}
              </div>
            </div>
          </>
        )}

        {tab === 'executive' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
            {executive.map((m, i) => (
              <CommitteeMember key={i} m={m} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FOOTER CTA
   ───────────────────────────────────────────── */
function FooterCTA() {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ background: '#002449', padding: '60px 20px', textAlign: 'center' }}>
      <h2 style={{ fontFamily: 'Montserrat,sans-serif', color: '#fff', fontSize: 36, margin: '0 0 40px', fontWeight: 300, textTransform: 'none' }}>
        Ready to innovate?{' '}
        <span style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, color: '#f75700' }}>Register for SVH 2026</span>
      </h2>
      <Link to="/guidelines"
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{ background: hov ? '#f75700' : '#fff', padding: '14px 70px', borderRadius: 50, textTransform: 'uppercase', fontFamily: 'Montserrat,sans-serif', fontWeight: 700, color: hov ? '#fff' : '#002449', fontSize: 14, letterSpacing: 2, border: `1px solid ${hov ? '#f75700' : '#fff'}`, textDecoration: 'none', display: 'inline-block', transition: 'all .2s' }}>
        Download Guidelines
      </Link>
    </div>
  );
}

export default function Home() {
  return (
    <div className="w-full">
      <NewsTicker />
      <AboutHackathon />
      <ProcessFlow />
      <JrSeniorSection />
      <ThemesSection />
      <TimelineSection />
      <BenefitsSection2 />
      <CounterSection />
      <CommitteeSection />
      <FooterCTA />
      <style>{`
        @keyframes sih-marquee {
          from { transform: translateX(100vw); }
          to   { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
