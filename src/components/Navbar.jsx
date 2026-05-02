import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/dashboard',    label: 'Dashboard' },
    { to: '/add-expense',  label: 'Add Transaction' },
    { to: '/reports',      label: 'Reports' },
  ];

  return (
    <nav className="navbar">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px',
              background: 'linear-gradient(135deg, #6c63ff, #00d4aa)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px',
              boxShadow: '0 4px 16px rgba(108,99,255,.4)',
            }}>
              💎
            </div>
            <span style={{
              fontWeight: '800',
              fontSize: '18px',
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #a78bfa, #00d4aa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              FinTrack
            </span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="desktop-nav">
            {isAuthenticated && navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`nav-link ${isActive(to) ? 'active' : ''}`}
                style={isActive(to) ? {
                  color: '#f0f4ff',
                  background: 'rgba(108,99,255,.18)',
                  fontWeight: '600',
                } : {}}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isAuthenticated ? (
              <>
                {/* User chip */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '6px 12px',
                  background: 'rgba(255,255,255,.05)',
                  border: '1px solid rgba(255,255,255,.08)',
                  borderRadius: '999px',
                }} className="user-chip">
                  <div style={{
                    width: '26px', height: '26px',
                    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: '700', color: '#fff',
                  }}>
                    {(user?.name || user?.email || 'U')[0].toUpperCase()}
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '500', color: '#8892a4', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.name || user?.email}
                  </span>
                </div>

                <button onClick={handleLogout} className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '13px' }}>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Sign In</Link>
                <Link to="/register" className="btn btn-primary" style={{ padding: '9px 20px', fontSize: '13.5px' }}>
                  Get Started
                </Link>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="btn-icon mobile-menu-btn"
              aria-label="Toggle menu"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                {mobileOpen
                  ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                  : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div style={{
            borderTop: '1px solid rgba(255,255,255,.06)',
            padding: '16px 0 20px',
            display: 'flex', flexDirection: 'column', gap: '4px',
          }}>
            {isAuthenticated ? (
              <>
                {navLinks.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className="nav-link"
                    style={{ display: 'block', padding: '10px 14px', fontSize: '14.5px' }}
                  >
                    {label}
                  </Link>
                ))}
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,.06)' }}>
                  <button onClick={handleLogout} className="btn btn-danger" style={{ width: '100%' }}>
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="nav-link" style={{ display: 'block', padding: '10px 14px' }}>Sign In</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn btn-primary" style={{ marginTop: '8px' }}>Get Started</Link>
              </>
            )}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .user-chip   { display: none !important; }
          .mobile-menu-btn { display: inline-flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
