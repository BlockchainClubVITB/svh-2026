import { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

/* ═══════════════════════════════════════════════
   SHARED UTILITIES (mirrored from Home.jsx)
═══════════════════════════════════════════════ */

function FloatingParticles({ count = 14 }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${(i * 37 + 11) % 95 + 2}%`,
      size: (i % 3) + 2,
      duration: 12 + (i % 7) * 2.5,
      delay: -((i * 3.7) % 12),
      color: i % 3 === 0
        ? 'rgba(255,153,51,0.45)'
        : i % 3 === 1
          ? 'rgba(19,136,8,0.35)'
          : 'rgba(255,255,255,0.2)',
    })), [count]);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute', bottom: '-8px', left: p.left,
          width: p.size, height: p.size, borderRadius: '50%', background: p.color,
          animation: `particle-drift ${p.duration}s linear ${p.delay}s infinite`,
        }} />
      ))}
    </div>
  );
}

function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* Accordion item */
function AccordionItem({ icon, title, children, defaultOpen = false, accentColor = '#FF9933' }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{
      background: '#fff',
      border: `1.5px solid ${open ? accentColor + '50' : 'rgba(0,0,0,0.08)'}`,
      borderRadius: 14,
      overflow: 'hidden',
      transition: 'border-color 0.25s, box-shadow 0.25s',
      boxShadow: open ? `0 8px 32px ${accentColor}18` : '0 2px 10px rgba(0,0,0,0.04)',
      marginBottom: 12,
    }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 22px', background: open ? `${accentColor}08` : 'transparent',
          border: 'none', cursor: 'pointer', textAlign: 'left', gap: 12,
          transition: 'background 0.2s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
          <span style={{
            fontFamily: 'Montserrat,sans-serif', fontWeight: 800, fontSize: 'clamp(14px,2vw,16px)',
            color: open ? accentColor : '#0f2942',
            transition: 'color 0.2s',
          }}>{title}</span>
        </div>
        <div style={{
          width: 28, height: 28, borderRadius: '50%', border: `2px solid ${accentColor}40`,
          background: open ? accentColor : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          transition: 'all 0.25s',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={open ? '#fff' : accentColor} strokeWidth="3"
            style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }}>
            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>
      <div style={{
        maxHeight: open ? '2000px' : 0,
        overflow: 'hidden',
        transition: 'max-height 0.45s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <div style={{ padding: '0 22px 22px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* Rule card */
function RuleCard({ num, title, desc, color = '#FF9933' }) {
  return (
    <div style={{
      display: 'flex', gap: 16, padding: '16px', background: `${color}06`,
      borderRadius: 12, border: `1.5px solid ${color}20`, transition: 'all 0.22s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}55`; e.currentTarget.style.transform = 'translateX(4px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = `${color}20`; e.currentTarget.style.transform = 'none'; }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Montserrat,sans-serif', fontWeight: 900, color: '#fff', fontSize: 13,
        flexShrink: 0,
      }}>{num}</div>
      <div>
        <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, color: '#0f2942', fontSize: 14, marginBottom: 4 }}>{title}</div>
        <div style={{ fontFamily: 'Poppins,sans-serif', color: '#666', fontSize: 13, lineHeight: 1.65 }}>{desc}</div>
      </div>
    </div>
  );
}

/* Criteria tag */
function CriteriaTag({ label, color }) {
  return (
    <span style={{
      display: 'inline-block', padding: '6px 14px',
      background: `${color}10`, border: `1.5px solid ${color}30`,
      borderRadius: 24, fontFamily: 'Montserrat,sans-serif', fontWeight: 700,
      fontSize: 12, color: '#0f2942', transition: 'all 0.18s',
    }}
      onMouseEnter={e => { e.currentTarget.style.background = `${color}22`; e.currentTarget.style.borderColor = color; }}
      onMouseLeave={e => { e.currentTarget.style.background = `${color}10`; e.currentTarget.style.borderColor = `${color}30`; }}>
      {label}
    </span>
  );
}

/* Section heading — matches Home style */
function SectionHeading({ badge, badgeColor = '#FF9933', title, highlight, highlightColor = '#FF9933' }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 48 }}>
      <span style={{
        display: 'inline-block', padding: '4px 16px', borderRadius: 20, marginBottom: 14,
        background: `${badgeColor}18`, border: `1px solid ${badgeColor}30`,
        color: badgeColor, fontSize: 11, fontFamily: 'Montserrat,sans-serif',
        fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase',
      }}>{badge}</span>
      <h2 style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 'clamp(26px,4vw,38px)', fontWeight: 900, color: '#0f2942', margin: 0 }}>
        {title} {highlight && <span style={{ color: highlightColor }}>{highlight}</span>}
      </h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 14 }}>
        <div style={{ height: 3, width: 40, background: '#FF9933', borderRadius: 2 }} />
        <div style={{ height: 3, width: 20, background: '#e8e8e8', borderRadius: 2 }} />
        <div style={{ height: 3, width: 40, background: '#138808', borderRadius: 2 }} />
      </div>
    </div>
  );
}

/* Quick nav pill */
function QuickNavPill({ href, label, color }) {
  return (
    <a href={href} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '7px 18px', background: `${color}10`, border: `1.5px solid ${color}30`,
      borderRadius: 30, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 12,
      color: '#fff', textDecoration: 'none', transition: 'all 0.2s', whiteSpace: 'nowrap',
    }}
      onMouseEnter={e => { e.currentTarget.style.background = color; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 6px 18px ${color}40`; }}
      onMouseLeave={e => { e.currentTarget.style.background = `${color}10`; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = `${color}30`; e.currentTarget.style.boxShadow = 'none'; }}>
      {label}
    </a>
  );
}

/* ═══════════════════════════════════════════════
   GUIDELINES PAGE
═══════════════════════════════════════════════ */
export default function Guidelines() {
  const [heroMounted, setHeroMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setHeroMounted(true), 80); return () => clearTimeout(t); }, []);

  const [generalRef, generalVisible] = useInView(0.08);
  const [pptRef, pptVisible] = useInView(0.08);
  const [finaleRef, finaleVisible] = useInView(0.08);
  const [certRef, certVisible] = useInView(0.08);
  const [mentorRef, mentorVisible] = useInView(0.08);
  const [sidebarRef, sidebarVisible] = useInView(0.08);

  const a = (delay) => ({
    opacity: heroMounted ? 1 : 0,
    transform: heroMounted ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  return (
    <div style={{ width: '100%', background: '#f8f9fb' }}>

      {/* ── HERO ── */}
      <section style={{
        position: 'relative',
        background: 'linear-gradient(160deg, #07192c 0%, #0f2942 55%, #07192c 100%)',
        padding: '80px 20px 90px',
        overflow: 'hidden',
      }}>
        <FloatingParticles count={16} />

        {/* Ambient glows */}
        <div style={{ position: 'absolute', top: '10%', left: '3%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(255,153,51,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: '5%', right: '3%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(19,136,8,0.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

        {/* Tricolour strip bottom */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(to right, #FF9933 33.33%, #fff 33.33% 66.66%, #138808 66.66%)' }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>

          {/* Badge */}
          <div style={{ ...a(80), display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', background: 'rgba(255,153,51,0.12)', border: '1px solid rgba(255,153,51,0.3)', borderRadius: 40, marginBottom: 24 }}>
            <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 1.5, width: 14 }}>
              <span style={{ height: 3, background: '#FF9933', borderRadius: 1, display: 'block' }} />
              <span style={{ height: 3, background: '#fff', borderRadius: 1, display: 'block' }} />
              <span style={{ height: 3, background: '#138808', borderRadius: 1, display: 'block' }} />
            </span>
            <span style={{ color: '#FF9933', fontSize: 11, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase' }}>
              SVH 2026 Official Handbook
            </span>
          </div>

          {/* Title */}
          <h1 style={{ ...a(200), margin: '0 0 16px', fontFamily: 'Montserrat,sans-serif', fontWeight: 900, fontSize: 'clamp(32px,5.5vw,60px)', color: '#fff', lineHeight: 1.05, letterSpacing: -1 }}>
            Guidelines{' '}
            <span style={{ background: 'linear-gradient(90deg, #FF9933 0%, #ffffff 50%, #138808 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              & Event Structure
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{ ...a(360), color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(14px,2vw,17px)', fontFamily: 'Poppins,sans-serif', maxWidth: 660, margin: '0 auto 40px', lineHeight: 1.75 }}>
            Everything you need to know about SVH 2026 — rules, submission process, evaluation criteria, and what to expect at each stage.
          </p>

          {/* Quick nav pills */}
          <div style={{ ...a(480), display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            <QuickNavPill href="#general-rules" label="📋 General Rules" color="#FF9933" />
            <QuickNavPill href="#ppt-submission" label="📊 PPT Submission" color="#FF9933" />
            <QuickNavPill href="#grand-finale" label="🚀 Grand Finale" color="#138808" />
            <QuickNavPill href="#certificates" label="🏆 Certificates" color="#06038D" />
            <QuickNavPill href="#mentorship" label="🎓 Mentorship" color="#138808" />
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '56px 16px 80px' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 36,
          alignItems: 'stretch',
        }}>

          {/* ── CONTENT ── */}
          <div>

            <section id="general-rules" ref={generalRef} style={{
              marginBottom: 48,
              opacity: generalVisible ? 1 : 0,
              transform: generalVisible ? 'none' : 'translateY(32px)',
              transition: 'all 0.65s ease',
            }}>
              <SectionHeading badge="Handbook" title="Rules &" highlight="Eligibility" />
              <p style={{ textAlign: 'center', color: '#666', fontFamily: 'Poppins,sans-serif', marginBottom: 24, fontSize: 14 }}>
                Smart VIT Hackathon · Blockchain Club, VIT Bhopal
              </p>

              <AccordionItem icon="👥" title="Eligibility & Team Formation" defaultOpen={true} accentColor="#FF9933">
                <div style={{ display: 'grid', gap: 10, marginTop: 8 }}>
                  <RuleCard num="01" title="Strict Team Size" desc="Your team must have exactly 6 members, or you will be disqualified." color="#FF9933" />
                  <RuleCard num="02" title="Gender Diversity" desc="At least one team member must be female to register." color="#FF9933" />
                </div>
              </AccordionItem>

              <AccordionItem icon="💰" title="Registration" accentColor="#138808">
                <div style={{ display: 'grid', gap: 10, marginTop: 8 }}>
                  <RuleCard num="01" title="Registration Window" desc="The window for registration remains open from 1st July to 20th July 2026." color="#138808" />
                  <RuleCard num="02" title="Participation Fee" desc="A participation fee of ₹75 per person (₹450 per team) is required to confirm your slot." color="#138808" />
                  <RuleCard num="03" title="How to Register" desc={<>Registration will be managed through the official Google form link: <a href="https://forms.gle/zYNYkjygKYfbAjhy6" target="_blank" rel="noreferrer" style={{ color: '#138808', fontWeight: 600 }}>https://forms.gle/zYNYkjygKYfbAjhy6</a></>} color="#138808" />
                  <RuleCard num="04" title="Details Required" desc="Team leader needs to enter: Team name, names/gender/email/phone of leader and all 5 members." color="#138808" />
                  <RuleCard num="05" title="Idea Submission" desc="Idea submission will be done on the official website of the SVH between 20th July to 5th August." color="#138808" />
                </div>
              </AccordionItem>
            </section>

            <section id="ppt-submission" ref={pptRef} style={{
              marginBottom: 48,
              opacity: pptVisible ? 1 : 0,
              transform: pptVisible ? 'none' : 'translateY(32px)',
              transition: 'all 0.65s ease',
            }}>
              <SectionHeading badge="Round 1" title="PPT" highlight="Submission" badgeColor="#06038D" highlightColor="#06038D" />

              <AccordionItem icon="📊" title="Round 1 Rules" defaultOpen={true} accentColor="#06038D">
                <div style={{ display: 'grid', gap: 10, marginTop: 8 }}>
                  <RuleCard num="01" title="Problem Statements" desc={<>Participants can choose from a selection of 10 released problem statements. Check out PS here: <Link to="/problem-statements" style={{ color: '#06038D', fontWeight: 600 }}>https://svh-2026.vercel.app/problem-statements</Link> (8 software + 2 hardware)</>} color="#06038D" />
                  <RuleCard num="02" title="Submission Detail" desc="Teams must submit a PPT detailing their solution architecture, feasibility, and implementation roadmap." color="#06038D" />
                  <RuleCard num="03" title="Strict Guidelines" desc="PPT Guidelines must be followed strictly. Shortlisting criteria include innovation, technical approach, and quality of the presentation." color="#06038D" />
                  <RuleCard num="04" title="Outcome" desc="Only the top 5 teams per problem statement will qualify for the final stage." color="#06038D" />
                  <RuleCard num="05" title="Shortlisted Announcement" desc="Result of the 1st round (PPT round) will be available on the team dashboard on the website and will be sent to the email of the team leader. Any announcement will be available on the WhatsApp group in advance." color="#06038D" />
                </div>
              </AccordionItem>

              <AccordionItem icon="📝" title="PPT Guidelines" accentColor="#FF9933">
                <div style={{ display: 'grid', gap: 10, marginTop: 8 }}>
                  <RuleCard num="!" title="Download Template" desc="DOWNLOAD PPT FORMAT FROM HERE [DRIVE LINK]" color="#FF9933" />
                  <RuleCard num="01" title="Strict 6-Slide Limit" desc="Your entire presentation must contain exactly or under 6 slides, which includes your mandatory title slide." color="#FF9933" />
                  <RuleCard num="02" title="PDF Format Only" desc="Save and export your final file explicitly as a PDF. The SIH portal completely rejects standard .pptx, .docx, or Word formats." color="#FF9933" />
                  <RuleCard num="03" title="Official Template Integrity" desc="Download the official presentation deck from the SIH Official Portal. You must never alter the pre-defined titles or pointers on the slides." color="#FF9933" />
                  <RuleCard num="04" title="Text Minimization" desc="Avoid chunks of paragraphs completely. Present everything using brief, crisp bullet points, graphical data, or visual infographics." color="#FF9933" />
                  <h4 style={{ margin: '16px 0 8px', fontSize: 14, fontFamily: 'Montserrat,sans-serif', fontWeight: 800, color: '#0f2942' }}>Slide-by-Slide Content Structure</h4>
                  <RuleCard num="S1" title="Title & Team Details" desc="Problem ID, exact Problem Title, Team Info (name, college, leader, members), Category (SW/HW)." color="#FF9933" />
                  <RuleCard num="S2" title="Problem & Domain Understanding" desc="Core Problem, Pain Points (bottlenecks, user challenges), Target Audience." color="#FF9933" />
                  <RuleCard num="S3" title="Proposed Solution" desc="Core Idea, Problem Resolution (how it answers S2), Novelty (UVP)." color="#FF9933" />
                  <RuleCard num="S4" title="Technical Approach" desc="Process Flow Diagram, Technology Stack, Product Status (keep prototype under 30-40% capacity)." color="#FF9933" />
                  <RuleCard num="S5" title="Feasibility & Business Viability" desc="Feasibility Blocks, Potential Risks, Mitigation Strategy." color="#FF9933" />
                  <RuleCard num="S6" title="Impact & References" desc="Overall Impact (social, economic), Research Links (academic citations, reports)." color="#FF9933" />
                </div>
              </AccordionItem>

              <AccordionItem icon="⚖️" title="SIH Presentation Judging Criteria" accentColor="#138808">
                <div style={{ display: 'grid', gap: 10, marginTop: 8 }}>
                  <RuleCard num="01" title="Problem-Solution Alignment" desc="Direct capability of the proposed idea to resolve every edge case of the official ministry problem statement." color="#138808" />
                  <RuleCard num="02" title="Innovation & Uniqueness" desc="Novelty of your Unique Value Proposition (UVP) compared to current market solutions, avoiding basic clone concepts." color="#138808" />
                  <RuleCard num="03" title="Technical Feasibility" desc="Logical correctness of the technical architecture diagram and the maturity of your listed technology stack." color="#138808" />
                  <RuleCard num="04" title="Scalability & Practicality" desc="Practical viability to deploy, sustain, and scale the solution effectively at a pan-India level." color="#138808" />
                  <RuleCard num="05" title="Template & Format Compliance" desc="Strict adherence to the 6-slide ceiling, PDF file format, and untouched official header titles." color="#138808" />
                </div>
              </AccordionItem>
            </section>

            <section id="grand-finale" ref={finaleRef} style={{
              marginBottom: 48,
              opacity: finaleVisible ? 1 : 0,
              transform: finaleVisible ? 'none' : 'translateY(32px)',
              transition: 'all 0.65s ease',
            }}>
              <SectionHeading badge="Round 2" title="Grand" highlight="Finale" badgeColor="#06038D" highlightColor="#06038D" />

              <AccordionItem icon="🚀" title="Round 2 Rules" defaultOpen={true} accentColor="#06038D">
                <div style={{ display: 'grid', gap: 10, marginTop: 8 }}>
                  <RuleCard num="01" title="Shortlist" desc="A maximum of 5 teams will be shortlisted from each problem statement." color="#06038D" />
                  <RuleCard num="02" title="Prototype" desc="Qualifiers must develop and present a functional working prototype of their proposed idea." color="#06038D" />
                  <RuleCard num="03" title="Format" desc="The finale spans 12 development hours over 2 days, differing from the 36-hour SIH format." color="#06038D" />
                  <RuleCard num="04" title="Schedule" desc="The event schedule (tentatively 24–25 Aug) is subject to official institute OD approval." color="#06038D" />
                  <RuleCard num="05" title="Evaluation" desc="Final evaluation focuses on functionality, technical scalability, and user experience. Detailed info will be shared later." color="#06038D" />
                </div>
              </AccordionItem>

              <AccordionItem icon="🏆" title="Prizes" accentColor="#FF9933">
                <div style={{ display: 'grid', gap: 10, marginTop: 8 }}>
                  <RuleCard num="01" title="Real-World Exposure" desc="All the problem statements are from previous SIH therefore providing real world problems and exposure to SIH like environment." color="#FF9933" />
                  <RuleCard num="02" title="One Winner per PS" desc="There will be only one single winning team per Problem statement." color="#FF9933" />
                  <RuleCard num="03" title="Innovation Encouraged" desc="Teams are encouraged to make innovative projects and think out of the box." color="#FF9933" />
                </div>
              </AccordionItem>

              <AccordionItem icon="📌" title="General Rules" accentColor="#138808">
                <div style={{ display: 'grid', gap: 10, marginTop: 8 }}>
                  <RuleCard num="01" title="Rulebook Override" desc="SVH 2026 follows SIH guidelines, though SVH-specific rules override SIH defaults where specified." color="#138808" />
                  <RuleCard num="02" title="Organizers' Discretion" desc="Organizers reserve the right to share additional clarifications with registered teams beforehand." color="#138808" />
                </div>
              </AccordionItem>
            </section>

            {/* ══ CTA (Ready to Register) ══ */}
            <div style={{ background: 'linear-gradient(135deg, #FF9933, #e07800)', borderRadius: 16, padding: '36px', textAlign: 'center', marginTop: 48, boxShadow: '0 8px 30px rgba(255,153,51,0.25)' }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>🚀</div>
              <h3 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 900, color: '#fff', fontSize: 24, marginBottom: 12 }}>Ready to Register?</h3>
              <p style={{ fontFamily: 'Poppins,sans-serif', color: 'rgba(255,255,255,0.9)', fontSize: 14, lineHeight: 1.6, marginBottom: 24, maxWidth: 500, margin: '0 auto 24px' }}>Registration opens 1 July 2026. Form your team of 6 and get started!</p>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="https://forms.gle/zYNYkjygKYfbAjhy6"
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'inline-block', padding: '14px 28px', background: '#fff',
                    color: '#e07800', borderRadius: 8, fontFamily: 'Montserrat,sans-serif',
                    fontWeight: 800, fontSize: 14, textDecoration: 'none', textTransform: 'uppercase',
                    letterSpacing: 1, transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                  Register via Google Form
                </a>
              </div>
              <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
                <a href="https://chat.whatsapp.com/L7lXF9VZQRDCx0aXXwBhGw?s=sw&p=a&mlu=2" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#fff', textDecoration: 'none', fontSize: 13, fontFamily: 'Poppins,sans-serif' }}>
                  <span style={{ fontSize: 18 }}>📲</span> Join Official WhatsApp Group
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
