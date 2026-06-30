import {
  Search, Tag, Monitor, Cpu, Building2, MapPin,
  Layers, ChevronRight, X, ArrowRight,
} from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { STATEMENTS } from '../data/problemStatements';

/* ── Theme constants (match site palette) ─────── */
const NAVY       = '#0f2942';
const NAVY_DARK  = '#07192c';
const SAFFRON    = '#FF9933';
const GREEN      = '#138808';

/* ── Category meta — single brand palette ─────── */
const CATEGORY_META = {
  'All':      { icon: null,    color: SAFFRON, bg: 'rgba(255,153,51,0.08)'  },
  'Hardware': { icon: Cpu,     color: NAVY,    bg: 'rgba(15,41,66,0.06)'    },
  'Software': { icon: Monitor, color: GREEN,   bg: 'rgba(19,136,8,0.07)'    },
};

const CATEGORIES = ['All', 'Hardware', 'Software'];

/* ── Main Page ─────────────────────────────────── */
export default function ProblemStatements() {
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState(null);

  /* Escape key close */
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') setSelected(null); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  /* Lock body scroll while modal is open */
  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selected]);

  const filtered = useMemo(() =>
    STATEMENTS.filter(item => {
      const q = search.toLowerCase();
      const matchesSearch =
        item.title.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q)  ||
        item.id.toLowerCase().includes(q)    ||
        item.theme.toLowerCase().includes(q);
      const matchesCategory = category === 'All' || item.category === category;
      return matchesSearch && matchesCategory;
    }),
    [search, category]
  );

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#fafafa' }}>

      {/* ── HERO BANNER ─────────────────────────── */}
      <section style={{
        background: `linear-gradient(135deg, ${NAVY_DARK} 0%, ${NAVY} 100%)`,
        color: '#fff', padding: '80px 20px', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Ambient glows */}
        <div style={{ position: 'absolute', top: '20%', left: '5%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(255,153,51,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 280, height: 280, background: 'radial-gradient(circle, rgba(19,136,8,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        {/* Tricolour bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 5, background: 'linear-gradient(to right, #FF9933 33.33%, #ffffff 33.33% 66.66%, #138808 66.66%)' }} />

        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 10 }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', background: 'rgba(255,153,51,0.12)', border: '1px solid rgba(255,153,51,0.3)', borderRadius: 40, marginBottom: 24 }}>
            <span style={{ fontSize: 14 }}>📋</span>
            <span style={{ color: SAFFRON, fontSize: 12, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
              SVH 2026 · {STATEMENTS.length} Problem Statements
            </span>
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 900, fontSize: 'clamp(32px,5vw,56px)', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: -1 }}>
            Problem{' '}
            <span style={{ background: `linear-gradient(90deg,${SAFFRON},#fff)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Statements
            </span>
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, fontFamily: 'Poppins,sans-serif', maxWidth: 580, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Review the {STATEMENTS.length} official problem statements for SVH 2026. Select up to two statements to submit your technical presentation (PPT) for Round 1.
          </p>

          {/* Stat pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            {[
              { label: 'Total Statements', val: STATEMENTS.length },
              { label: 'Hardware',         val: STATEMENTS.filter(s => s.category === 'Hardware').length },
              { label: 'Software',         val: STATEMENTS.filter(s => s.category === 'Software').length },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 20px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 50 }}>
                <span style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 900, fontSize: 20, color: SAFFRON }}>{s.val}</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontFamily: 'Poppins,sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTENT ─────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 mt-12 pb-24">

        {/* Search & Filter bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-10">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, title, theme, or keyword…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sih-orange transition-colors font-poppins bg-gray-50"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map(cat => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all font-montserrat ${
                    active
                      ? 'bg-sih-navy text-white shadow-sm'
                      : 'bg-gray-100 text-sih-navy hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results label */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest font-montserrat">
            Showing <span style={{ color: SAFFRON }}>{filtered.length}</span> of {STATEMENTS.length} statements
          </p>
          {(search || category !== 'All') && (
            <button
              onClick={() => { setSearch(''); setCategory('All'); }}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-500 hover:border-sih-orange hover:text-sih-orange transition-colors"
            >
              <X className="w-3 h-3" /> Clear filters
            </button>
          )}
        </div>

        {/* Cards grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filtered.map((item, idx) => (
              <ProblemCard key={item.id} item={item} idx={idx} onOpen={() => setSelected(item)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-lg text-[#0f2942] font-black font-montserrat mb-2">No results found</p>
            <p className="text-sm text-gray-400 font-medium mb-6">Try adjusting your search or filters.</p>
            <button
              onClick={() => { setSearch(''); setCategory('All'); }}
              className="px-6 py-2.5 bg-sih-orange text-white text-sm font-black rounded-xl hover:bg-saffron-dark transition-colors font-montserrat"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {selected && <DetailModal statement={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

/* ── Card ──────────────────────────────────────── */
function ProblemCard({ item, idx, onOpen }) {
  const [hovered, setHovered] = useState(false);
  const isHardware = item.category === 'Hardware';
  const accentColor = isHardware ? NAVY : GREEN;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col relative overflow-hidden"
      style={{
        transition: 'all 0.25s ease',
        boxShadow: hovered ? '0 12px 40px rgba(15,41,66,0.12)' : '0 2px 8px rgba(15,41,66,0.05)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        borderColor: hovered ? `${accentColor}30` : '#e5e7eb',
        animationName: 'pop-in', animationDuration: '0.45s',
        animationTimingFunction: 'ease', animationDelay: `${idx * 0.04}s`, animationFillMode: 'both',
      }}
    >
      {/* Top accent bar */}
      <div style={{ height: 3, background: isHardware ? `linear-gradient(to right, ${SAFFRON}, ${NAVY})` : `linear-gradient(to right, ${SAFFRON}, ${GREEN})`, borderRadius: '16px 16px 0 0' }} />

      <div className="p-6 flex flex-col grow">
        {/* ID + Category */}
        <div className="flex justify-between items-center mb-3">
          <span className="px-2.5 py-1 bg-sih-navy text-white text-[10px] font-black rounded uppercase tracking-wider font-montserrat">
            {item.id}
          </span>
          <span
            className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider font-montserrat"
            style={{ color: accentColor }}
          >
            {isHardware ? <Cpu className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
            {item.category}
          </span>
        </div>

        {/* Theme */}
        <div className="mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-full text-[10px] font-semibold text-gray-500 font-poppins">
            <Layers className="w-2.5 h-2.5" />
            {item.theme}
          </span>
        </div>

        {/* Title */}
        <h3
          className="text-[15.5px] font-bold font-montserrat leading-snug mb-2 transition-colors"
          style={{ color: hovered ? accentColor : NAVY }}
        >
          {item.title}
        </h3>

        {/* Org + Dept */}
        <div className="flex items-center gap-1.5 mb-1">
          <Building2 className="w-3 h-3 text-gray-400 shrink-0" />
          <span className="text-[11px] font-semibold text-gray-600 font-poppins">{item.org}</span>
        </div>
        <div className="flex items-center gap-1.5 mb-4">
          <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
          <span className="text-[10.5px] text-gray-400 font-poppins leading-tight">{item.dept}</span>
        </div>

        <div className="border-t border-gray-100 mb-4" />

        {/* Description */}
        <p className="text-[13px] text-gray-600 leading-relaxed font-medium font-poppins grow mb-5">
          {item.desc}
        </p>

        {/* CTA Button */}
        <button
          onClick={onOpen}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider font-montserrat transition-all"
          style={{
            background: hovered ? accentColor : 'transparent',
            border: `1.5px solid ${accentColor}`,
            color: hovered ? '#fff' : accentColor,
            cursor: 'pointer',
          }}
        >
          View Details
          <ChevronRight className="w-3.5 h-3.5" style={{ transition: 'transform 0.2s', transform: hovered ? 'translateX(3px)' : 'translateX(0)' }} />
        </button>
      </div>
    </div>
  );
}

/* ── Detail Modal ──────────────────────────────── */
function DetailModal({ statement: s, onClose }) {
  const isHardware = s.category === 'Hardware';
  const accentColor = isHardware ? SAFFRON : GREEN;

  return (
    /* Backdrop */
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(7,25,44,0.75)',
        backdropFilter: 'blur(5px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        animation: 'fade-in 0.2s ease both',
      }}
    >
      {/* Panel */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 24,
          width: '100%',
          maxWidth: 760,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.3)',
          animation: 'pop-in 0.3s ease both',
        }}
      >
        {/* ── Header ── */}
        <div style={{
          background: `linear-gradient(135deg, ${NAVY_DARK} 0%, ${NAVY} 100%)`,
          padding: '28px 32px 24px',
          flexShrink: 0,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Subtle glow */}
          <div style={{ position: 'absolute', top: '-30%', right: '-5%', width: 240, height: 240, background: `radial-gradient(circle, rgba(255,153,51,0.08) 0%, transparent 65%)`, pointerEvents: 'none' }} />
          {/* Tricolour bottom */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(to right, #FF9933 33.33%, #ffffff 33.33% 66.66%, #138808 66.66%)' }} />

          {/* Top row: badges + close */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 18, position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {/* ID */}
              <span style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: 10, fontFamily: 'Montserrat,sans-serif', fontWeight: 800, borderRadius: 8, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                {s.id}
              </span>
              {/* Category */}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', background: `rgba(255,153,51,0.15)`, border: `1px solid rgba(255,153,51,0.3)`, borderRadius: 50, fontSize: 10, fontFamily: 'Montserrat,sans-serif', fontWeight: 800, color: SAFFRON, textTransform: 'uppercase', letterSpacing: 1 }}>
                {isHardware ? <Cpu style={{ width: 11, height: 11 }} /> : <Monitor style={{ width: 11, height: 11 }} />}
                {s.category}
              </span>
              {/* Theme */}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 50, fontSize: 10, fontFamily: 'Poppins,sans-serif', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
                <Layers style={{ width: 10, height: 10 }} />
                {s.theme}
              </span>
            </div>
            {/* Close */}
            <button
              onClick={onClose}
              style={{ flexShrink: 0, width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
            >
              <X style={{ width: 15, height: 15 }} />
            </button>
          </div>

          {/* Title */}
          <h2 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 900, fontSize: 'clamp(17px,2.5vw,24px)', color: '#fff', lineHeight: 1.3, margin: 0, position: 'relative', zIndex: 1 }}>
            {s.title}
          </h2>
        </div>

        {/* ── Meta strip ── */}
        <div style={{ background: '#f8f9fb', borderBottom: '1px solid #e5e7eb', padding: '14px 32px', display: 'flex', flexWrap: 'wrap', gap: 20, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Building2 style={{ width: 14, height: 14, color: SAFFRON, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 9.5, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 1 }}>Organisation</div>
              <div style={{ fontSize: 13, fontFamily: 'Poppins,sans-serif', fontWeight: 600, color: NAVY }}>{s.org}</div>
            </div>
          </div>
          <div style={{ width: 1, background: '#e5e7eb', alignSelf: 'stretch' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <MapPin style={{ width: 14, height: 14, color: SAFFRON, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 9.5, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 1 }}>Department</div>
              <div style={{ fontSize: 12, fontFamily: 'Poppins,sans-serif', fontWeight: 500, color: '#374151' }}>{s.dept}</div>
            </div>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div style={{ overflowY: 'auto', padding: '28px 32px', flexGrow: 1 }}>
          {s.sections.map((sec, i) => (
            <div key={i} style={{ marginBottom: i < s.sections.length - 1 ? 28 : 0 }}>
              {/* Section heading */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 4, height: 18, background: `linear-gradient(180deg, ${SAFFRON}, ${SAFFRON}50)`, borderRadius: 4, flexShrink: 0 }} />
                <h3 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, fontSize: 12, color: NAVY, textTransform: 'uppercase', letterSpacing: 1.2, margin: 0 }}>
                  {sec.heading}
                </h3>
              </div>

              {/* Prose */}
              {sec.body && (
                <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13.5, color: '#374151', lineHeight: 1.8, margin: 0, paddingLeft: 14 }}>
                  {sec.body}
                </p>
              )}

              {/* Bullet list */}
              {sec.items && (
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, paddingLeft: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {sec.items.map((item, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <ArrowRight style={{ width: 13, height: 13, color: SAFFRON, flexShrink: 0, marginTop: 4 }} />
                      <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13.5, color: '#374151', lineHeight: 1.7 }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Section divider */}
              {i < s.sections.length - 1 && (
                <div style={{ height: 1, background: '#f3f4f6', marginTop: 24 }} />
              )}
            </div>
          ))}
        </div>

        {/* ── Footer ── */}
        <div style={{ flexShrink: 0, padding: '14px 32px', borderTop: '1px solid #e5e7eb', background: '#fafafa', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-sih-orange text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-saffron-dark transition-colors font-montserrat"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
