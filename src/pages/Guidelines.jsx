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

            {/* ══ GENERAL RULES ══ */}
            <section id="general-rules" ref={generalRef} style={{
              marginBottom: 48,
              opacity: generalVisible ? 1 : 0,
              transform: generalVisible ? 'none' : 'translateY(32px)',
              transition: 'all 0.65s ease',
            }}>
              <SectionHeading badge="Foundation" title="General" highlight="Rules" />

              <AccordionItem icon="👥" title="Team Composition" defaultOpen={true} accentColor="#FF9933">
                <div style={{ display: 'grid', gap: 10, marginTop: 8 }}>
                  <RuleCard num="01" title="Team Size" desc="Each team must consist of exactly 6 members — no more, no less." color="#FF9933" />
                  <RuleCard num="02" title="Gender Diversity (Mandatory)" desc="A minimum of 1 female team member is mandatory for team registration. This strictly aligns SVH with SIH norms." color="#FF9933" />
                  <RuleCard num="03" title="College Affiliation" desc="All team members must be currently enrolled students of VIT Bhopal University." color="#FF9933" />
                </div>
              </AccordionItem>

              <AccordionItem icon="💰" title="Registration Details" accentColor="#138808">
                <div style={{ display: 'grid', gap: 10, marginTop: 8 }}>
                  <RuleCard num="01" title="Registration Period" desc="Registration is open from 1 July – 20 July 2026 (20 days)." color="#138808" />
                  <RuleCard num="02" title="Registration Fee" desc="₹75 per participant · ₹450 per team of 6 members. Fee is non-refundable." color="#138808" />
                  <RuleCard num="03" title="Portal Registration" desc="Teams must register through the official SVH 2026 portal. All members must be listed at the time of registration." color="#138808" />
                </div>
              </AccordionItem>

              <AccordionItem icon="📝" title="Problem Statement Rules" accentColor="#06038D">
                <div style={{ display: 'grid', gap: 10, marginTop: 8 }}>
                  <RuleCard num="01" title="Maximum 2 Problem Statements" desc="Teams may select and submit proposals for up to 2 different problem statements to maximize their chances." color="#06038D" />
                  <RuleCard num="02" title="Total Problem Statements" desc="SVH 2026 features 12 problem statements: 10 Software-based and 2 Hardware-based." color="#06038D" />
                  <RuleCard num="03" title="Grand Finale Focus" desc="If shortlisted, a team will build a prototype for only one chosen problem statement at the Grand Finale." color="#06038D" />
                </div>
              </AccordionItem>

              <AccordionItem icon="⚖️" title="Event Rules & Exceptions" accentColor="#FF9933">
                <div style={{ display: 'grid', gap: 10, marginTop: 8 }}>
                  <RuleCard num="01" title="SIH Rulebook as Base" desc="SVH follows the Smart India Hackathon rulebook as the primary governance framework." color="#FF9933" />
                  <RuleCard num="02" title="Compressed Format" desc="The Grand Finale uses a 12-hour compressed format (6 hrs/day × 2 days) instead of standard 36-hour SIH." color="#FF9933" />
                  <RuleCard num="03" title="OD Approval Required" desc="Participation in the Grand Finale is subject to institute approval for official On-Duty (OD) permissions." color="#FF9933" />
                  <RuleCard num="04" title="Additional Rules" desc="Event-specific guidelines or amendments may be announced before the start of each round. Stay updated." color="#FF9933" />
                </div>
              </AccordionItem>
            </section>

            {/* ══ PPT SUBMISSION ══ */}
            <section id="ppt-submission" ref={pptRef} style={{
              marginBottom: 48,
              opacity: pptVisible ? 1 : 0,
              transform: pptVisible ? 'none' : 'translateY(32px)',
              transition: 'all 0.65s ease',
            }}>
              <SectionHeading badge="Round 1" title="PPT Submission" highlight="Guidelines" badgeColor="#FF9933" highlightColor="#FF9933" />

              {/* Round overview card */}
              <div style={{
                background: 'linear-gradient(135deg, #0f2942, #07192c)',
                borderRadius: 18, padding: '28px', marginBottom: 24,
                border: '1.5px solid rgba(255,153,51,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
              }}>
                <div>
                  <div style={{ color: '#FF9933', fontSize: 10, fontFamily: 'Montserrat,sans-serif', fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>Round 1 — PPT Submission</div>
                  <div style={{ color: '#fff', fontSize: 'clamp(18px,3vw,24px)', fontFamily: 'Montserrat,sans-serif', fontWeight: 900 }}>Online Evaluation Phase</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontFamily: 'Poppins,sans-serif', marginTop: 4 }}>20 July – 5 August 2026 (16 days)</div>
                </div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center', padding: '12px 20px', background: 'rgba(255,153,51,0.12)', border: '1px solid rgba(255,153,51,0.3)', borderRadius: 12 }}>
                    <div style={{ color: '#FF9933', fontSize: 22, fontWeight: 900, fontFamily: 'Montserrat,sans-serif' }}>5</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: 'Poppins,sans-serif' }}>Teams/PS</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '12px 20px', background: 'rgba(19,136,8,0.12)', border: '1px solid rgba(19,136,8,0.3)', borderRadius: 12 }}>
                    <div style={{ color: '#138808', fontSize: 22, fontWeight: 900, fontFamily: 'Montserrat,sans-serif' }}>60</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: 'Poppins,sans-serif' }}>Max Finalists</div>
                  </div>
                </div>
              </div>

              <AccordionItem icon="📊" title="What Your PPT Must Include" defaultOpen={true} accentColor="#FF9933">
                <p style={{ color: '#666', fontSize: 14, fontFamily: 'Poppins,sans-serif', lineHeight: 1.75, marginBottom: 18, marginTop: 8 }}>
                  Your presentation must comprehensively address all of the following points. Incomplete submissions will be penalized in evaluation.
                </p>
                <div style={{ display: 'grid', gap: 10 }}>
                  {[
                    { num: '01', title: 'Problem Understanding', desc: 'A clear, well-researched explanation of the problem statement. Define the root cause, the affected stakeholders, and the scope of the challenge.' },
                    { num: '02', title: 'Proposed Solution Approach', desc: 'Describe your solution concept, its core value proposition, and how it addresses the problem differently or better than existing solutions.' },
                    { num: '03', title: 'Technical Architecture & Methodology', desc: 'Include your tech stack, system design diagrams, data flow, APIs or integrations, and the methodology you will follow (e.g., Agile, iterative).' },
                    { num: '04', title: 'Expected Impact & Feasibility', desc: 'Quantify the expected benefits, scalability potential, and demonstrate that your solution is realistically achievable within the hackathon scope.' },
                    { num: '05', title: 'Implementation Roadmap', desc: 'A step-by-step plan for building and deploying the solution — covering milestones, team roles, and a timeline aligned with the hackathon schedule.' },
                  ].map(item => <RuleCard key={item.num} {...item} color="#FF9933" />)}
                </div>
              </AccordionItem>

              <AccordionItem icon="⚖️" title="Evaluation Criteria — Round 1" accentColor="#FF9933">
                <p style={{ color: '#666', fontSize: 13, fontFamily: 'Poppins,sans-serif', lineHeight: 1.7, marginBottom: 16, marginTop: 8 }}>
                  Submissions are evaluated by an expert panel on the following criteria. Each criterion carries equal weight.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {['Problem Understanding', 'Innovation & Creativity', 'Feasibility of Solution', 'Technical Approach', 'Presentation Quality'].map((c, i) => (
                    <CriteriaTag key={i} label={c} color="#FF9933" />
                  ))}
                </div>
                <div style={{ marginTop: 20, padding: '14px 18px', background: 'rgba(255,153,51,0.06)', borderRadius: 10, border: '1px solid rgba(255,153,51,0.2)' }}>
                  <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, color: '#FF9933', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Outcome</div>
                  <div style={{ fontFamily: 'Poppins,sans-serif', color: '#555', fontSize: 13, lineHeight: 1.65 }}>
                    The <strong>top 5 teams</strong> from each problem statement will be shortlisted for the Grand Finale — a maximum of <strong>60 finalist teams</strong> across all 12 problem statements.
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem icon="💡" title="Tips for a Strong Submission" accentColor="#138808">
                <div style={{ marginTop: 8, display: 'grid', gap: 10 }}>
                  {[
                    { num: '✓', title: 'Research the domain deeply', desc: 'Understand the real-world context of your problem statement. Panels reward teams who show genuine domain knowledge.' },
                    { num: '✓', title: 'Show, don\'t just tell', desc: 'Use diagrams, wireframes, and architecture charts. A visual representation of your solution is far more impactful than text.' },
                    { num: '✓', title: 'Be realistic about scope', desc: 'Choose a solution that your 6-person team can realistically prototype in 12 hours. Grandiose ideas with no feasibility hurt your score.' },
                    { num: '✓', title: 'Attend expert sessions', desc: 'SVH 2026 hosts multiple expert-led sessions during the submission window. Attend them to refine your approach.' },
                  ].map(item => <RuleCard key={item.num} {...item} color="#138808" />)}
                </div>
              </AccordionItem>
            </section>

            {/* ══ GRAND FINALE ══ */}
            <section id="grand-finale" ref={finaleRef} style={{
              marginBottom: 48,
              opacity: finaleVisible ? 1 : 0,
              transform: finaleVisible ? 'none' : 'translateY(32px)',
              transition: 'all 0.65s ease',
            }}>
              <SectionHeading badge="Round 2" title="Grand Finale" highlight="Guidelines" badgeColor="#138808" highlightColor="#138808" />

              {/* Round 2 hero card */}
              <div style={{
                background: 'linear-gradient(135deg, #07192c, #0f2942)',
                borderRadius: 18, padding: '28px', marginBottom: 24,
                border: '1.5px solid rgba(19,136,8,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
              }}>
                <div>
                  <div style={{ color: '#138808', fontSize: 10, fontFamily: 'Montserrat,sans-serif', fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>Round 2 — Grand Finale</div>
                  <div style={{ color: '#fff', fontSize: 'clamp(18px,3vw,24px)', fontFamily: 'Montserrat,sans-serif', fontWeight: 900 }}>Prototype Development Sprint</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontFamily: 'Poppins,sans-serif', marginTop: 4 }}>24 – 25 August 2026 (Tentative) · VIT Bhopal University</div>
                </div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  {[{ v: '2', l: 'Days' }, { v: '12', l: 'Hours Total' }, { v: '60', l: 'Max Teams' }].map((s, i) => (
                    <div key={i} style={{ textAlign: 'center', padding: '12px 18px', background: 'rgba(19,136,8,0.12)', border: '1px solid rgba(19,136,8,0.3)', borderRadius: 12 }}>
                      <div style={{ color: '#138808', fontSize: 22, fontWeight: 900, fontFamily: 'Montserrat,sans-serif' }}>{s.v}</div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: 'Poppins,sans-serif' }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>

              <AccordionItem icon="🚀" title="What Finalists Will Do" defaultOpen={true} accentColor="#138808">
                <p style={{ color: '#666', fontSize: 14, fontFamily: 'Poppins,sans-serif', lineHeight: 1.75, marginBottom: 16, marginTop: 8 }}>
                  Shortlisted finalist teams will build and demonstrate a fully functional prototype based on their PPT submission. The Grand Finale is an offline, in-person event at VIT Bhopal University.
                </p>
                <div style={{ display: 'grid', gap: 10 }}>
                  {[
                    { num: '01', title: 'Build a Working Prototype', desc: '6 hours of development per day × 2 days = 12 hours total. Teams will code, build, and integrate their solution from scratch on-site.' },
                    { num: '02', title: 'Live Demonstration', desc: 'Present a working demo of your prototype to the expert evaluation panel at the end of Day 2.' },
                    { num: '03', title: 'Technical Q&A', desc: 'Panel members will conduct an in-depth Q&A session on your technical decisions, scalability, and real-world applicability.' },
                    { num: '04', title: 'Final Pitch Presentation', desc: 'Deliver a structured final pitch to the judging committee covering your solution, prototype demo, and future roadmap.' },
                  ].map(item => <RuleCard key={item.num} {...item} color="#138808" />)}
                </div>
              </AccordionItem>

              <AccordionItem icon="⚖️" title="Evaluation Criteria — Round 2" accentColor="#138808">
                <p style={{ color: '#666', fontSize: 13, fontFamily: 'Poppins,sans-serif', lineHeight: 1.7, marginBottom: 16, marginTop: 8 }}>
                  The Grand Finale is judged on the quality, functionality, and presentation of your working prototype.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {['Technical Implementation', 'Functionality & Working Prototype', 'Innovation & Scalability', 'User Experience', 'Final Demonstration & Presentation'].map((c, i) => (
                    <CriteriaTag key={i} label={c} color="#138808" />
                  ))}
                </div>
                <div style={{ marginTop: 20, padding: '14px 18px', background: 'rgba(19,136,8,0.06)', borderRadius: 10, border: '1px solid rgba(19,136,8,0.25)' }}>
                  <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, color: '#138808', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Awards</div>
                  <div style={{ fontFamily: 'Poppins,sans-serif', color: '#555', fontSize: 13, lineHeight: 1.65 }}>
                    <strong>Winner</strong>, <strong>Runner-Up</strong>, and <strong>Special Innovation Recognition</strong> awards will be presented to top-performing teams.
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem icon="📌" title="Important Notes for Finalists" accentColor="#FF9933">
                <div style={{ marginTop: 8, display: 'grid', gap: 10 }}>
                  <RuleCard num="!" title="OD Approval" desc="The Grand Finale requires official On-Duty (OD) approval from the institute. Coordinate with your faculty advisor well in advance." color="#FF9933" />
                  <RuleCard num="!" title="Bring Your Devices" desc="Teams are expected to bring their own laptops and required development tools. Details will be shared closer to the event date." color="#FF9933" />
                  <RuleCard num="!" title="Subject to Schedule" desc="The Grand Finale dates (24–25 Aug 2026) are tentative and subject to institute academic calendar confirmation." color="#FF9933" />
                </div>
              </AccordionItem>
            </section>

            {/* ══ CERTIFICATES ══ */}
            <section id="certificates" ref={certRef} style={{
              marginBottom: 48,
              opacity: certVisible ? 1 : 0,
              transform: certVisible ? 'none' : 'translateY(32px)',
              transition: 'all 0.65s ease',
            }}>
              <SectionHeading badge="Recognition" title="Certificates &" highlight="Awards" badgeColor="#06038D" highlightColor="#06038D" />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 20 }}>
                {[
                  { icon: '📄', title: 'Participation Certificate', desc: 'All eligible participants who complete their PPT submission will receive a participation certificate.', color: '#FF9933', delay: 0 },
                  { icon: '🎯', title: 'Shortlisting Certificate', desc: 'Teams shortlisted for the Grand Finale receive a special shortlisting certificate recognizing their achievement.', color: '#138808', delay: 0.1 },
                  { icon: '🏆', title: 'Winner & Runner-Up', desc: 'Trophy, certificate, and special recognition for the winning and runner-up teams at the Grand Finale.', color: '#06038D', delay: 0.2 },
                  { icon: '⭐', title: 'Special Innovation Award', desc: 'Recognition for outstanding innovation, scalable execution, and creativity beyond the standard winner categories.', color: '#FF9933', delay: 0.3 },
                ].map((cert, i) => (
                  <div key={i} style={{
                    background: '#fff', borderRadius: 16, padding: '28px 22px', textAlign: 'center',
                    border: `1.5px solid ${cert.color}20`,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                    transition: 'all 0.28s',
                    opacity: certVisible ? 1 : 0,
                    transform: certVisible ? 'none' : 'translateY(20px)',
                    transitionDelay: `${cert.delay + 0.1}s`,
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = cert.color; e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = `0 16px 40px ${cert.color}20`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = `${cert.color}20`; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.05)'; }}>
                    <div style={{ width: 60, height: 60, borderRadius: '50%', background: `${cert.color}12`, border: `2px solid ${cert.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 26 }}>{cert.icon}</div>
                    <h3 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, color: '#0f2942', fontSize: 14, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>{cert.title}</h3>
                    <p style={{ fontFamily: 'Poppins,sans-serif', color: '#777', fontSize: 12.5, lineHeight: 1.7, margin: 0 }}>{cert.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ══ MENTORSHIP ══ */}
            <section id="mentorship" ref={mentorRef} style={{
              opacity: mentorVisible ? 1 : 0,
              transform: mentorVisible ? 'none' : 'translateY(32px)',
              transition: 'all 0.65s ease',
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #0f2942 0%, #07192c 100%)',
                borderRadius: 20, padding: '40px 32px', position: 'relative', overflow: 'hidden',
                border: '1.5px solid rgba(255,153,51,0.15)',
              }}>
                {/* Decorative circle */}
                <div style={{ position: 'absolute', right: -40, bottom: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,153,51,0.06)', border: '1px solid rgba(255,153,51,0.1)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', right: -10, bottom: -10, width: 100, height: 100, borderRadius: '50%', background: 'rgba(19,136,8,0.06)', border: '1px solid rgba(19,136,8,0.1)', pointerEvents: 'none' }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <span style={{ display: 'inline-block', padding: '4px 14px', background: 'rgba(255,153,51,0.15)', border: '1px solid rgba(255,153,51,0.3)', borderRadius: 20, color: '#FF9933', fontSize: 11, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>
                    Support System
                  </span>
                  <h2 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 900, color: '#fff', fontSize: 'clamp(22px,3vw,32px)', margin: '0 0 14px' }}>
                    Mentorship & <span style={{ color: '#FF9933' }}>Learning Support</span>
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.68)', fontSize: 14, fontFamily: 'Poppins,sans-serif', lineHeight: 1.8, marginBottom: 28, maxWidth: 680 }}>
                    Participants will receive structured guidance from senior club members, experienced SIH national participants, faculty members, and domain experts throughout the submission period.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 14 }}>
                    {[
                      { icon: '💡', title: 'Idea Validation', desc: 'Get technical feasibility feedback from SIH alumni and domain experts.' },
                      { icon: '🎤', title: 'Presentation Strategy', desc: 'Learn pitching methodologies and structuring your presentation for maximum impact.' },
                      { icon: '🔧', title: 'Prototype Planning', desc: 'Guidance on defining an achievable MVP and building within time constraints.' },
                      { icon: '🧠', title: 'Problem-Solving Workshops', desc: 'Innovation-oriented sessions to help you tackle challenges under tight timelines.' },
                    ].map((m, i) => (
                      <div key={i} style={{ display: 'flex', gap: 14, padding: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.borderColor = 'rgba(255,153,51,0.3)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
                        <span style={{ fontSize: 22, flexShrink: 0 }}>{m.icon}</span>
                        <div>
                          <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, color: '#fff', fontSize: 14, marginBottom: 4 }}>{m.title}</div>
                          <div style={{ fontFamily: 'Poppins,sans-serif', color: 'rgba(255,255,255,0.55)', fontSize: 12.5, lineHeight: 1.6 }}>{m.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ══ CTA (Ready to Register) ══ */}
            <div style={{ background: 'linear-gradient(135deg, #FF9933, #e07800)', borderRadius: 16, padding: '36px', textAlign: 'center', marginTop: 48, boxShadow: '0 8px 30px rgba(255,153,51,0.25)' }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>🚀</div>
              <h3 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 900, color: '#fff', fontSize: 24, marginBottom: 12 }}>Ready to Register?</h3>
              <p style={{ fontFamily: 'Poppins,sans-serif', color: 'rgba(255,255,255,0.9)', fontSize: 14, lineHeight: 1.6, marginBottom: 24, maxWidth: 500, margin: '0 auto 24px' }}>Registration opens 1 July 2026. Form your team of 6 and get started!</p>
              <Link to="/problem-statements" style={{
                display: 'inline-block', padding: '14px 28px', background: '#fff',
                color: '#e07800', borderRadius: 8, fontFamily: 'Montserrat,sans-serif',
                fontWeight: 800, fontSize: 14, textDecoration: 'none', textTransform: 'uppercase',
                letterSpacing: 1, transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                View Problem Statements
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
