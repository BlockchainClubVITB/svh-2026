import { useState, useEffect } from 'react';
import { finaleSchedule } from '../data/finaleSchedule';

export default function GrandFinaleSchedule({ dark = false, showHeader = true, id = "finale-schedule" }) {
  const [activeTab, setActiveTab] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Determine active session based on current time
  const isItemActive = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return currentTime >= start && currentTime < end;
  };

  const isDayActive = (dateStr) => {
    // Check if today matches the day (e.g. 5 Sep 2026 or 6 Sep 2026)
    const isDay1 = currentTime.getDate() === 5 && currentTime.getMonth() === 8 && currentTime.getFullYear() === 2026;
    const isDay2 = currentTime.getDate() === 6 && currentTime.getMonth() === 8 && currentTime.getFullYear() === 2026;
    if (dateStr.includes('5 September') && isDay1) return true;
    if (dateStr.includes('6 September') && isDay2) return true;
    return false;
  };

  const currentDayData = finaleSchedule[activeTab];

  return (
    <div id={id} style={{
      maxWidth: 1100,
      margin: '0 auto',
      padding: showHeader ? '40px 16px 60px' : '10px 0',
      fontFamily: 'Poppins, sans-serif'
    }}>
      {showHeader && (
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 16px',
            background: 'rgba(255, 153, 51, 0.1)',
            border: '1px solid rgba(255, 153, 51, 0.3)',
            borderRadius: 30,
            marginBottom: 12,
          }}>
            <span style={{ fontSize: 13 }}>⏱️</span>
            <span style={{
              color: '#FF9933',
              fontSize: 11,
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 800,
              letterSpacing: 2.5,
              textTransform: 'uppercase'
            }}>
              Grand Finale Schedule
            </span>
          </div>
          <h2 style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 'clamp(26px, 4vw, 38px)',
            fontWeight: 900,
            color: dark ? '#fff' : '#0f2942',
            margin: '0 0 10px'
          }}>
            Smart VIT Hackathon 2026 Timeline
          </h2>
          <p style={{
            color: dark ? 'rgba(255,255,255,0.7)' : '#64748b',
            fontSize: 15,
            maxWidth: 640,
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Official 2-Day offline Grand Finale timeline with venue coordinates, mentor sync, evaluation rounds, and key milestones.
          </p>
        </div>
      )}

      {/* Day Selector Tabs */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 28,
        flexWrap: 'wrap'
      }}>
        {finaleSchedule.map((day, idx) => {
          const isSelected = activeTab === idx;
          const live = isDayActive(day.date);
          return (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 24px',
                borderRadius: 12,
                border: isSelected ? `2px solid ${day.color}` : (dark ? '1px solid rgba(255,255,255,0.12)' : '1px solid #e2e8f0'),
                background: isSelected
                  ? (dark ? `linear-gradient(135deg, ${day.color}25, rgba(15,41,66,0.9))` : `linear-gradient(135deg, ${day.color}18, #ffffff)`)
                  : (dark ? 'rgba(15,41,66,0.5)' : '#f8fafc'),
                color: isSelected ? (dark ? '#fff' : '#0f2942') : (dark ? 'rgba(255,255,255,0.6)' : '#64748b'),
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: isSelected ? `0 8px 24px ${day.color}30` : 'none',
              }}
            >
              <span style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: day.color,
                boxShadow: `0 0 10px ${day.color}`
              }} />
              <span>{day.day}: {day.date}</span>
              {live && (
                <span style={{
                  fontSize: 10,
                  fontWeight: 800,
                  background: '#ef4444',
                  color: '#fff',
                  padding: '2px 6px',
                  borderRadius: 6,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  animation: 'pulse 2s infinite'
                }}>
                  TODAY
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Venue Banner Card */}
      <div style={{
        background: dark ? 'rgba(15,41,66,0.7)' : 'linear-gradient(135deg, #07192c, #0f2942)',
        border: `1.5px solid ${currentDayData.color}40`,
        borderRadius: 16,
        padding: '20px 24px',
        marginBottom: 24,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
        boxShadow: dark ? '0 12px 32px rgba(0,0,0,0.4)' : '0 10px 30px rgba(7,25,44,0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 46,
            height: 46,
            borderRadius: 12,
            background: `${currentDayData.color}20`,
            border: `1px solid ${currentDayData.color}60`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22
          }}>
            📍
          </div>
          <div>
            <div style={{ color: currentDayData.color, fontSize: 11, fontWeight: 800, fontFamily: 'Montserrat, sans-serif', letterSpacing: 2, textTransform: 'uppercase' }}>
              OFFICIAL VENUE
            </div>
            <div style={{ color: '#fff', fontSize: 'clamp(16px, 2.5vw, 20px)', fontWeight: 800, fontFamily: 'Montserrat, sans-serif' }}>
              {currentDayData.venue}
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(255,255,255,0.08)',
          padding: '8px 16px',
          borderRadius: 30,
          border: '1px solid rgba(255,255,255,0.15)',
          color: '#fff',
          fontSize: 13,
          fontWeight: 600,
          fontFamily: 'Montserrat, sans-serif'
        }}>
          <span>📅</span> {currentDayData.date}
        </div>
      </div>

      {/* Schedule Table / Cards List */}
      <div style={{
        display: 'grid',
        gap: 12,
      }}>
        {currentDayData.items.map((item, idx) => {
          const active = isItemActive(item.startTime, item.endTime);
          return (
            <div
              key={idx}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(180px, 220px) minmax(200px, 260px) 1fr',
                gap: 16,
                alignItems: 'center',
                padding: '18px 22px',
                borderRadius: 14,
                background: active
                  ? (dark ? `linear-gradient(90deg, ${currentDayData.color}30, rgba(15,41,66,0.85))` : `linear-gradient(90deg, ${currentDayData.color}15, #f8fafc)`)
                  : (dark ? 'rgba(15,41,66,0.45)' : '#ffffff'),
                border: active
                  ? `2px solid ${currentDayData.color}`
                  : (dark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #edf2f7'),
                boxShadow: active
                  ? `0 6px 24px ${currentDayData.color}30`
                  : (dark ? 'none' : '0 2px 10px rgba(0,0,0,0.03)'),
                transition: 'all 0.25s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              className="schedule-row"
            >
              {active && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: 5,
                  background: currentDayData.color,
                  boxShadow: `0 0 12px ${currentDayData.color}`
                }} />
              )}

              {/* Time column */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  background: active ? currentDayData.color : (dark ? 'rgba(255,255,255,0.08)' : '#f1f5f9'),
                  color: active ? '#fff' : (dark ? '#e2e8f0' : '#334155'),
                  fontSize: 12,
                  fontWeight: 800,
                  fontFamily: 'Montserrat, sans-serif',
                  padding: '6px 12px',
                  borderRadius: 8,
                  whiteSpace: 'nowrap',
                  letterSpacing: 0.5,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  <span>🕒</span> {item.time}
                </div>
              </div>

              {/* Session Column */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <div>
                  <div style={{
                    fontSize: 15,
                    fontWeight: 800,
                    fontFamily: 'Montserrat, sans-serif',
                    color: active ? currentDayData.color : (dark ? '#fff' : '#0f2942')
                  }}>
                    {item.session}
                  </div>
                  {active && (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 10,
                      fontWeight: 800,
                      color: currentDayData.color,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      marginTop: 2
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: currentDayData.color, animation: 'pulse 1.5s infinite' }} />
                      HAPPENING NOW
                    </span>
                  )}
                </div>
              </div>

              {/* Details Column */}
              <div style={{
                fontSize: 13,
                color: dark ? 'rgba(255,255,255,0.7)' : '#64748b',
                lineHeight: 1.5
              }}>
                {item.details}
              </div>
            </div>
          );
        })}
      </div>

      {/* Slogan Footer Strip */}
      <div style={{
        marginTop: 28,
        padding: '14px 20px',
        background: dark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
        borderRadius: 12,
        border: dark ? '1px dashed rgba(255,255,255,0.1)' : '1px dashed #cbd5e1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          color: dark ? 'rgba(255,255,255,0.6)' : '#64748b',
          fontSize: 12,
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 700,
          letterSpacing: 1.5
        }}>
          <span>⚡</span>
          <span>INNOVATE. COLLABORATE. CREATE IMPACT.</span>
        </div>
        <div style={{
          fontSize: 11,
          fontWeight: 700,
          color: '#FF9933',
          fontFamily: 'Montserrat, sans-serif'
        }}>
          PAGE 1-2 • SVH 2026 FINALE
        </div>
      </div>

      {/* Responsive layout styles */}
      <style>{`
        @media (max-width: 768px) {
          .schedule-row {
            grid-template-columns: 1fr !important;
            gap: 8px !important;
          }
        }
      `}</style>
    </div>
  );
}
