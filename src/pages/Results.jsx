import { useState, useEffect, useMemo } from 'react';
import { STATEMENTS } from '../data/problemStatements';
import { STATIC_RESULTS } from '../data/staticResults';

export default function Results() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPsFilter, setSelectedPsFilter] = useState('ALL');

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  // Compute matched data list directly from static results
  const resultsList = useMemo(() => {
    return STATIC_RESULTS;
  }, []);

  // Filter list by selected problem statement and search query
  const filteredResults = useMemo(() => {
    let list = resultsList;

    if (selectedPsFilter !== 'ALL') {
      list = list.filter(r => r.problemCode === selectedPsFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(r =>
        r.teamId.toLowerCase().includes(q) ||
        r.teamName.toLowerCase().includes(q) ||
        r.problemCode.toLowerCase().includes(q) ||
        r.leaderName.toLowerCase().includes(q)
      );
    }

    // Sort alphabetically by problemCode (Problem ID) first, and then by teamName
    return [...list].sort((a, b) => {
      const psCompare = a.problemCode.localeCompare(b.problemCode);
      if (psCompare !== 0) return psCompare;
      return a.teamName.localeCompare(b.teamName);
    });
  }, [resultsList, selectedPsFilter, searchQuery]);

  // Dynamically find problem statements that actually have shortlisted teams
  const activePsFilters = useMemo(() => {
    const codes = [...new Set(resultsList.map(r => r.problemCode))];
    return codes.map(code => {
      const stmt = STATEMENTS.find(s => s.id === code);
      return {
        id: code,
        title: stmt ? stmt.title : 'Unknown Statement'
      };
    }).sort((a, b) => a.id.localeCompare(b.id));
  }, [resultsList]);

  return (
    <section style={{
      minHeight: '85vh',
      background: 'radial-gradient(circle at top, #0f2942 0%, #071728 80%)',
      color: '#e2e8f0',
      padding: '40px 16px',
      fontFamily: 'Poppins, sans-serif'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Banner Headers */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span style={{
            background: 'rgba(255,153,51,0.12)',
            color: '#FF9933',
            fontSize: 12,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            padding: '6px 16px',
            borderRadius: 30,
            border: '1px solid rgba(255,153,51,0.25)',
            display: 'inline-block',
            marginBottom: 12,
            fontFamily: 'Montserrat, sans-serif'
          }}>
            Smart VIT Hackathon 2026
          </span>
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: 900,
            color: '#fff',
            fontFamily: 'Montserrat, sans-serif',
            margin: '0 0 10px 0',
            letterSpacing: -0.5
          }}>
            Grand Finale Shortlist
          </h1>
          <p style={{
            fontSize: 15,
            color: 'rgba(255,255,255,0.6)',
            maxWidth: 600,
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Congratulations to all the selected teams! Below is the list of teams shortlisted to present their innovations at the Smart VIT Hackathon 2026 Grand Finale.
          </p>
        </div>

        {/* Filter Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          background: 'rgba(15,41,66,0.5)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 14,
          padding: '16px 20px',
          marginBottom: 24,
          flexWrap: 'wrap'
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', fontFamily: 'Montserrat, sans-serif' }}>
              Shortlisted Teams ({filteredResults.length})
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              value={selectedPsFilter}
              onChange={e => setSelectedPsFilter(e.target.value)}
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.12)',
                background: '#071728',
                color: 'white',
                fontSize: 13,
                outline: 'none',
                cursor: 'pointer',
                minWidth: 200
              }}
            >
              <option value="ALL">All Problem Statements</option>
              {activePsFilters.map(s => (
                <option key={s.id} value={s.id} style={{ color: 'white' }}>
                  {s.id} - {s.title.substring(0, 30)}...
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Search by Team ID, Name, Leader..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                padding: '10px 16px',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.12)',
                background: '#071728',
                color: '#fff',
                outline: 'none',
                fontSize: 13,
                width: 250
              }}
            />
          </div>
        </div>

        {/* Results Data Table */}
        <div style={{
          background: 'rgba(10,29,51,0.7)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16,
          padding: 16,
          boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
          overflowX: 'auto'
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{
                width: 40,
                height: 40,
                border: '3px solid rgba(255,153,51,0.2)',
                borderTop: '3px solid #FF9933',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px auto'
              }}></div>
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Loading shortlist records from secure database...</p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
              No shortlisted teams found matching the filters.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: 'rgba(255,255,255,0.6)' }}>
                  <th style={{ padding: '14px 16px', color: '#FF9933', fontWeight: 700 }}>Problem Statement</th>
                  <th style={{ padding: '14px 16px', color: '#FF9933', fontWeight: 700 }}>Problem ID</th>
                  <th style={{ padding: '14px 16px', fontWeight: 700 }}>Theme</th>
                  <th style={{ padding: '14px 16px', fontWeight: 700 }}>Team Name</th>
                  <th style={{ padding: '14px 16px', fontWeight: 700 }}>Team ID</th>
                  <th style={{ padding: '14px 16px', fontWeight: 700 }}>Team Leader</th>
                  <th style={{ padding: '14px 16px', fontWeight: 700, textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((row, idx) => (
                  <tr key={idx} style={{
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    transition: 'background 0.15s ease',
                    background: idx % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent'
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent'}
                  >
                    <td style={{ padding: '14px 16px', fontWeight: 600, maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {row.problemStatement}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 800, fontFamily: 'Courier New, monospace', color: '#FF9933' }}>
                      {row.problemCode}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.8)' }}>
                      {row.theme}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 700 }}>
                      {row.teamName}
                    </td>
                    <td style={{ padding: '14px 16px', fontFamily: 'Courier New, monospace', color: 'rgba(255,255,255,0.7)' }}>
                      {row.teamId}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>
                      {row.leaderName}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <span style={{
                        background: 'rgba(74,222,128,0.15)',
                        color: '#4ade80',
                        fontSize: 11,
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: 6,
                        border: '1px solid rgba(74,222,128,0.3)',
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                        display: 'inline-block'
                      }}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </section>

  );
}
