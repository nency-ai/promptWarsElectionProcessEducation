/* ============================================
   Header Component — Navigation Bar
   ============================================ */

import { useApp } from '../context';
import type { AppView } from '../types';
import './Header.css';

export default function Header() {
  const { state, navigate, getProgress, resetUser } = useApp();
  const { user, currentView } = state;

  if (currentView === 'landing' || currentView === 'onboarding') return null;

  const navItems: { view: AppView; label: string; icon: string }[] = [
    { view: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { view: 'guide', label: 'Step Guide', icon: '🧭' },
    { view: 'eligibility', label: 'Eligibility', icon: '✅' },
    { view: 'myths', label: 'Myths & Facts', icon: '💡' },
    { view: 'deadlines', label: 'Deadlines', icon: '⏰' },
    { view: 'chat', label: 'AI Guide', icon: '🤖' },
  ];

  const progress = getProgress();

  return (
    <header className="header" role="banner">
      <div className="header__container">
        <button 
          className="header__logo" 
          onClick={() => navigate('dashboard')}
          aria-label="Go to dashboard"
          id="header-logo"
        >
          <span className="header__logo-icon">🗳️</span>
          <span className="header__logo-text">Election Companion</span>
        </button>

        <nav className="header__nav" role="navigation" aria-label="Main navigation">
          {navItems.map(item => (
            <button
              key={item.view}
              className={`header__nav-item ${currentView === item.view ? 'header__nav-item--active' : ''}`}
              onClick={() => navigate(item.view)}
              aria-current={currentView === item.view ? 'page' : undefined}
              id={`nav-${item.view}`}
            >
              <span className="header__nav-icon" aria-hidden="true">{item.icon}</span>
              <span className="header__nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="header__right">
          <div className="header__progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Overall voting progress">
            <div className="header__progress-ring">
              <svg viewBox="0 0 36 36" className="header__progress-svg">
                <path
                  className="header__progress-bg"
                  d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="header__progress-fill"
                  strokeDasharray={`${progress}, 100`}
                  d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="header__progress-text">{progress}%</span>
            </div>
          </div>

          {user.name && (
            <div className="header__user">
              <span className="header__user-avatar">
                {user.name.charAt(0).toUpperCase()}
              </span>
              <button 
                className="header__reset-btn"
                onClick={resetUser}
                aria-label="Reset profile and start over"
                id="reset-profile-btn"
                title="Start Over"
              >
                ↺
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      <nav className="header__mobile-nav" role="navigation" aria-label="Mobile navigation">
        {navItems.slice(0, 5).map(item => (
          <button
            key={item.view}
            className={`header__mobile-item ${currentView === item.view ? 'header__mobile-item--active' : ''}`}
            onClick={() => navigate(item.view)}
            aria-current={currentView === item.view ? 'page' : undefined}
            id={`mobile-nav-${item.view}`}
          >
            <span className="header__mobile-icon" aria-hidden="true">{item.icon}</span>
            <span className="header__mobile-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </header>
  );
}
