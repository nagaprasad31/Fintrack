import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: '🔐',
    title: 'Secure Auth',
    desc: 'JWT-based authentication keeps your financial data protected and private.',
    color: '#6c63ff',
  },
  {
    icon: '📊',
    title: 'Visual Analytics',
    desc: 'Interactive charts let you see where every rupee goes at a glance.',
    color: '#00d4aa',
  },
  {
    icon: '🏷️',
    title: 'Smart Categories',
    desc: 'Clearer finances through smarter categorization',
    color: '#f72585',
  },
  {
    icon: '💰',
    title: 'Income Tracking',
    desc: 'Track both income and expenses to get the full financial picture.',
    color: '#fbbf24',
  },
  {
    icon: '📥',
    title: 'Export Reports',
    desc: 'Download detailed CSV or TXT reports for accounting and tax records.',
    color: '#34d399',
  },
  {
    icon: '📱',
    title: 'Fully Responsive',
    desc: 'Works beautifully on desktop, tablet, and mobile — any screen, any time.',
    color: '#a78bfa',
  },
];

export default function Home() {
  return (
    <div style={{ minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{ padding: 'clamp(64px, 10vw, 120px) 24px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Ambient blobs */}
        <div style={{
          position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)',
          width: '700px', height: '700px',
          background: 'radial-gradient(circle, rgba(108,99,255,.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: '760px', margin: '0 auto' }}>
          {/* Badge */}
          <div className="animate-fade-in-up" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px',
            background: 'rgba(108,99,255,.12)',
            border: '1px solid rgba(108,99,255,.3)',
            borderRadius: '999px',
            fontSize: '12.5px', fontWeight: '600', color: '#a78bfa',
            marginBottom: '28px',
            letterSpacing: '0.04em',
          }}>
            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#6c63ff', animation: 'pulse-glow 2s infinite' }} />
            Smart Financial Management
          </div>

          <h1 className="animate-fade-in-up delay-100" style={{
            fontSize: 'clamp(36px, 6vw, 72px)',
            fontWeight: '900',
            letterSpacing: '-0.04em',
            lineHeight: '1.05',
            marginBottom: '24px',
          }}>
            Take Control of{' '}
            <span className="text-gradient">Your Finances</span>
          </h1>

          <p className="animate-fade-in-up delay-200" style={{
            fontSize: 'clamp(15px, 2vw, 19px)',
            color: '#8892a4',
            maxWidth: '560px',
            margin: '0 auto 48px',
            lineHeight: '1.65',
          }}>
            Track income and expenses effortlessly. Visualize your spending patterns, export reports, and make smarter money decisions.
          </p>

          <div className="animate-fade-in-up delay-300" style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '15px', borderRadius: '14px' }}>
              Get Started Free
            </Link>
            <Link to="/login" className="btn btn-ghost" style={{ padding: '14px 32px', fontSize: '15px', borderRadius: '14px' }}>
              Sign In →
            </Link>
          </div>

          {/* Stats strip */}
          <div className="animate-fade-in-up delay-400" style={{
            display: 'flex', gap: '40px', justifyContent: 'center', flexWrap: 'wrap',
            marginTop: '64px',
            paddingTop: '40px',
            borderTop: '1px solid rgba(255,255,255,.07)',
          }}>
            {[
            ].map(({ value, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: '800', letterSpacing: '-0.03em', background: 'linear-gradient(135deg, #a78bfa, #00d4aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {value}
                </div>
                <div style={{ fontSize: '12.5px', color: '#4a5568', fontWeight: '500', marginTop: '4px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '0 24px 100px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '12px' }}>
            Everything you need to{' '}
            <span className="text-gradient">stay on budget</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {features.map(({ icon, title, desc, color }, i) => (
            <div
              key={title}
              className={`glass-card animate-fade-in-up delay-${(i % 5 + 1) * 100}`}
              style={{ padding: '28px', cursor: 'default' }}
            >
              <div style={{
                width: '48px', height: '48px',
                borderRadius: '12px',
                background: `${color}18`,
                border: `1px solid ${color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px', marginBottom: '18px',
              }}>
                {icon}
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>{title}</h3>
              <p style={{ color: '#8892a4', fontSize: '14px', lineHeight: '1.65' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '0 24px 100px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <div className="glass-card-elevated" style={{ padding: 'clamp(40px, 6vw, 72px)' }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 42px)', fontWeight: '900', letterSpacing: '-0.03em', marginBottom: '16px' }}>
            Ready to take{' '}
            <span className="text-gradient-2">financial control?</span>
          </h2>
          <p style={{ color: '#8892a4', fontSize: '15px', marginBottom: '36px', lineHeight: '1.65' }}>
            Track expenses, set budgets, and save smarter—join for free.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-accent" style={{ padding: '14px 36px', fontSize: '15px', borderRadius: '14px' }}>
              Create Free Account
            </Link>
            <Link to="/login" className="btn btn-ghost" style={{ padding: '14px 28px', fontSize: '15px', borderRadius: '14px' }}>
              Already have an account?
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
