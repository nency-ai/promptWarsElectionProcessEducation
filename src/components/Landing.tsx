/* ============================================
   Landing Page — Hero Section
   ============================================ */

import { useApp } from '../context';
import './Landing.css';

export default function Landing() {
  const { navigate, state } = useApp();

  const handleGetStarted = () => {
    if (state.user.onboardingComplete) {
      navigate('dashboard');
    } else {
      navigate('onboarding');
    }
  };

  return (
    <main className="landing" role="main">
      {/* Animated background */}
      <div className="landing__bg" aria-hidden="true">
        <div className="landing__orb landing__orb--1" />
        <div className="landing__orb landing__orb--2" />
        <div className="landing__orb landing__orb--3" />
        <div className="landing__grid" />
      </div>

      {/* Hero */}
      <section className="landing__hero" aria-labelledby="landing-heading">
        <div className="landing__hero-content animate-fade-in-up">
          <div className="landing__badge">
            <span className="landing__badge-dot" aria-hidden="true" />
            <span>Your Personal Voting Guide</span>
          </div>

          <h1 id="landing-heading" className="landing__title">
            Navigate the <span className="landing__title-gradient">Election Process</span> with Confidence
          </h1>

          <p className="landing__subtitle">
            A step-by-step AI companion that guides you from registration to results. 
            Non-partisan, personalized, and always up-to-date.
          </p>

          <div className="landing__cta-group">
            <button
              className="landing__cta-primary"
              onClick={handleGetStarted}
              id="get-started-btn"
              aria-label="Get started with Election Companion"
            >
              <span>Get Started</span>
              <span className="landing__cta-arrow" aria-hidden="true">→</span>
            </button>
            <button
              className="landing__cta-secondary"
              onClick={() => navigate('onboarding')}
              id="learn-more-btn"
              aria-label="Learn more about Election Companion"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="landing__features animate-fade-in-up stagger-2">
          {[
            { icon: '🧭', title: 'Personalized Guide', desc: 'Step-by-step instructions based on your situation' },
            { icon: '✅', title: 'Eligibility Check', desc: 'Quick verification of your voting eligibility' },
            { icon: '⏰', title: 'Deadline Alerts', desc: 'Never miss an important election deadline' },
            { icon: '💡', title: 'Myth Busting', desc: 'Separate fact from fiction about voting' },
          ].map((feature, i) => (
            <div key={i} className={`landing__feature-card stagger-${i + 2}`}>
              <div className="landing__feature-icon" aria-hidden="true">{feature.icon}</div>
              <h3 className="landing__feature-title">{feature.title}</h3>
              <p className="landing__feature-desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="landing__stats animate-fade-in-up stagger-4" aria-label="Platform statistics">
        <div className="landing__stat">
          <span className="landing__stat-number">8</span>
          <span className="landing__stat-label">Guided Steps</span>
        </div>
        <div className="landing__stat-divider" aria-hidden="true" />
        <div className="landing__stat">
          <span className="landing__stat-number">50+</span>
          <span className="landing__stat-label">States Covered</span>
        </div>
        <div className="landing__stat-divider" aria-hidden="true" />
        <div className="landing__stat">
          <span className="landing__stat-number">10</span>
          <span className="landing__stat-label">Myths Busted</span>
        </div>
        <div className="landing__stat-divider" aria-hidden="true" />
        <div className="landing__stat">
          <span className="landing__stat-number">100%</span>
          <span className="landing__stat-label">Non-Partisan</span>
        </div>
      </section>

      {/* Trust Badge */}
      <div className="landing__trust animate-fade-in stagger-5">
        <span className="landing__trust-icon" aria-hidden="true">🔒</span>
        <span className="landing__trust-text">Non-political • No candidate suggestions • Official information only</span>
      </div>
    </main>
  );
}
