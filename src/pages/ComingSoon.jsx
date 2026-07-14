import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

/* Floating Particles for background effect */
function FloatingParticles({ count = 18 }) {
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
          willChange: 'transform',
        }} />
      ))}
    </div>
  );
}

export default function ComingSoon() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const animationStyle = (delay) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(30px)',
    transition: `all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}ms`,
  });

  return (
    <section style={{
      position: 'relative', minHeight: 'calc(100vh - 60px)',
      background: 'linear-gradient(160deg, #07192c 0%, #0f2942 45%, #07192c 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', padding: '60px 20px',
    }}>
      <FloatingParticles count={25} />

      {/* Ambient glows */}
      <div style={{ position: 'absolute', top: '30%', left: '20%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(255,153,51,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '30%', right: '20%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(19,136,8,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(16px)',
        padding: '60px 40px',
        borderRadius: '24px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        maxWidth: '500px',
        width: '100%',
      }}>
        <div style={{ ...animationStyle(100), fontSize: '64px', marginBottom: '20px' }}>
          🚀
        </div>
        
        <h1 style={{ 
          ...animationStyle(200),
          fontFamily: 'Montserrat, sans-serif', 
          fontWeight: 900, 
          color: '#fff', 
          fontSize: '42px', 
          margin: '0 0 16px', 
          letterSpacing: '-1px' 
        }}>
          Coming Soon
        </h1>
        

        
        <div style={{ ...animationStyle(400) }}>
          <Link to="/" style={{
            display: 'inline-block',
            padding: '14px 32px',
            background: 'linear-gradient(135deg, #FF9933, #e07800)',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 700,
            boxShadow: '0 8px 24px rgba(255,153,51,0.3)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}>
            Return Home
          </Link>
        </div>

        {/* Tricolour footer strip */}
        <div style={{ ...animationStyle(500), display: 'flex', justifyContent: 'center', marginTop: 40 }}>
          <div style={{ height: 3, width: 40, background: '#FF9933', borderRadius: 2 }} />
          <div style={{ height: 3, width: 20, background: '#fff', borderRadius: 2, margin: '0 6px' }} />
          <div style={{ height: 3, width: 40, background: '#138808', borderRadius: 2 }} />
        </div>
      </div>
    </section>
  );
}
