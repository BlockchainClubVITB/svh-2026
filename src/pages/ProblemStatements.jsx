import { Search, Building2, ArrowLeft } from 'lucide-react';
import { useState, useMemo } from 'react';
import { STATEMENTS } from '../data/problemStatements';

const NAVY    = '#0f2942';
const SAFFRON = '#FF9933';
const GREEN   = '#138808';

const CATEGORIES = ['All', 'Hardware', 'Software'];

export default function ProblemStatements() {
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('All');
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey]   = useState(null);
  const [sortDir, setSortDir]   = useState('asc');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    let rows = STATEMENTS.filter(item => {
      const q = search.toLowerCase();
      const matchesSearch =
        item.title.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q)  ||
        item.id.toLowerCase().includes(q)    ||
        item.org.toLowerCase().includes(q)   ||
        item.theme.toLowerCase().includes(q);
      const matchesCategory = category === 'All' || item.category === category;
      return matchesSearch && matchesCategory;
    });

    if (sortKey) {
      rows = [...rows].sort((a, b) => {
        const av = a[sortKey]?.toLowerCase?.() ?? a[sortKey];
        const bv = b[sortKey]?.toLowerCase?.() ?? b[sortKey];
        if (av < bv) return sortDir === 'asc' ? -1 : 1;
        if (av > bv) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return rows;
  }, [search, category, sortKey, sortDir]);

  const visible = filtered.slice(0, pageSize);

  const toggleSort = key => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  if (selected) {
    return <DetailTable statement={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#fff', padding: '32px 20px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, fontSize: 24, color: NAVY, marginBottom: 20 }}>
          Problem Statements
        </h1>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '6px 16px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 700,
                fontFamily: 'Montserrat,sans-serif',
                border: `1px solid ${category === cat ? NAVY : '#ddd'}`,
                background: category === cat ? NAVY : '#fff',
                color: category === cat ? '#fff' : NAVY,
                cursor: 'pointer',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Top controls: show entries + search */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 12, fontFamily: 'Poppins,sans-serif', fontSize: 13, color: '#444',
          flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            Show
            <select
              value={pageSize}
              onChange={e => setPageSize(Number(e.target.value))}
              style={{ border: '1px solid #ddd', borderRadius: 6, padding: '4px 8px' }}
            >
              {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            entries
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            Search:
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: '#999' }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  border: '1px solid #ddd', borderRadius: 6, padding: '6px 8px 6px 28px',
                  fontSize: 13, width: 200,
                }}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: 10 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Poppins,sans-serif', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8f9fb', borderBottom: '2px solid #e5e7eb' }}>
                <Th label="S.No" />
                <Th label="Organization" onClick={() => toggleSort('org')} active={sortKey === 'org'} dir={sortDir} />
                <Th label="Problem Statement Title" onClick={() => toggleSort('title')} active={sortKey === 'title'} dir={sortDir} />
                <Th label="Category" onClick={() => toggleSort('category')} active={sortKey === 'category'} dir={sortDir} />
                <Th label="PS Number" onClick={() => toggleSort('id')} active={sortKey === 'id'} dir={sortDir} />
                <Th label="Theme" onClick={() => toggleSort('theme')} active={sortKey === 'theme'} dir={sortDir} />
              </tr>
            </thead>
            <tbody>
              {visible.map((item, i) => (
                <tr
                  key={item.id}
                  style={{ borderBottom: '1px solid #eee', background: i % 2 ? '#fafbfc' : '#fff' }}
                >
                  <Td>{i + 1}</Td>
                  <Td>{item.org}</Td>
                  <Td>
                    <button
                      onClick={() => setSelected(item)}
                      style={{ color: '#2563eb', fontWeight: 600, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      {item.title}
                    </button>
                  </Td>
                  <Td>{item.category}</Td>
                  <Td>{item.id}</Td>
                  <Td>{item.theme}</Td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 24, color: '#999' }}>
                    No matching records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p style={{ fontSize: 12, color: '#888', marginTop: 10, fontFamily: 'Poppins,sans-serif' }}>
          Showing {visible.length} of {filtered.length} entries
        </p>
      </div>
    </div>
  );
}

function Th({ label, onClick, active, dir }) {
  return (
    <th
      onClick={onClick}
      style={{
        padding: '10px 14px', textAlign: 'left', fontFamily: 'Montserrat,sans-serif',
        fontWeight: 700, fontSize: 12, color: NAVY, cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none', whiteSpace: 'nowrap',
      }}
    >
      {label} {onClick && <span style={{ color: active ? SAFFRON : '#ccc', fontSize: 10 }}>{active ? (dir === 'asc' ? '▲' : '▼') : '⇅'}</span>}
    </th>
  );
}

function Td({ children }) {
  return <td style={{ padding: '10px 14px', verticalAlign: 'top', color: '#333' }}>{children}</td>;
}

/* ── Detail table view ─────────────────────────── */
function DetailTable({ statement: s, onBack }) {
  // Flatten sections back into a single description block, like image 2
  const descriptionBody = s.sections
    .map(sec => {
      const items = sec.items ? sec.items.map(it => `· ${it}`).join('\n') : '';
      return `${sec.heading}\n${sec.body ?? ''}${items}`;
    })
    .join('\n\n');

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#fff', padding: '32px 20px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16,
            background: 'none', border: 'none', color: NAVY, fontWeight: 700,
            fontFamily: 'Montserrat,sans-serif', fontSize: 13, cursor: 'pointer',
          }}
        >
          <ArrowLeft style={{ width: 14, height: 14 }} /> Back to list
        </button>

        <h2 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, fontSize: 18, color: NAVY, marginBottom: 16 }}>
          Problem Statement Details
        </h2>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Poppins,sans-serif', fontSize: 13.5, border: '1px solid #e5e7eb' }}>
          <tbody>
            <Row label="Problem Statement ID" value={s.id} />
            <Row label="Problem Statement Title" value={s.title} />
            <Row label="Description" value={descriptionBody} pre />
            <Row label="Organization" value={s.org} />
            <Row label="Department" value={s.dept} />
            <Row label="Category" value={s.category} />
            <Row label="Theme" value={s.theme} />
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Row({ label, value, pre }) {
  return (
    <tr style={{ borderBottom: '1px solid #eee' }}>
      <td style={{
        width: 200, padding: '14px 16px', background: '#fafbfc',
        fontWeight: 700, color: NAVY, fontFamily: 'Montserrat,sans-serif',
        fontSize: 12, verticalAlign: 'top', borderRight: '1px solid #eee',
      }}>
        {label}
      </td>
      <td style={{
        padding: '14px 16px', color: '#333', lineHeight: 1.7,
        whiteSpace: pre ? 'pre-wrap' : 'normal',
      }}>
        {value}
      </td>
    </tr>
  );
}