/* ============================================
   Dashboard — Main Hub
   ============================================ */

import { useMemo } from 'react';
import { useApp } from '../context';
import { ELECTION_STEPS, DEADLINES } from '../data';
import { INDIAN_STATES } from '../data';
import './Dashboard.css';

export default function Dashboard() {
  const { state, navigate, getProgress } = useApp();
  const { user } = state;
  const progress = getProgress();

  const stateName = useMemo(() => {
    return INDIAN_STATES.find(s => s.code === user.state)?.name || user.state;
  }, [user.state]);

  const relevantSteps = useMemo(() => {
    return ELECTION_STEPS.filter(step =>
      step.forStatus.includes(user.voterStatus)
    );
  }, [user.voterStatus]);

  const nextStep = useMemo(() => {
    return relevantSteps.find(step => !user.completedSteps.includes(step.id));
  }, [relevantSteps, user.completedSteps]);

  const upcomingDeadlines = useMemo(() => {
    const now = new Date();
    return DEADLINES
      .filter(d => new Date(d.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
  }, []);

  const getDaysUntil = (dateStr: string) => {
    const target = new Date(dateStr);
    const now = new Date();
    const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getStatusBadge = () => {
    switch (user.voterStatus) {
      case 'not-registered': return { label: 'Not Registered', color: 'var(--color-accent-tertiary)', icon: '📋' };
      case 'registered': return { label: 'Registered', color: 'var(--color-accent-info)', icon: '✅' };
      case 'ready': return { label: 'Ready to Vote', color: 'var(--color-accent-success)', icon: '🗳️' };
      case 'voted': return { label: 'Voted!', color: 'var(--color-accent-success)', icon: '🎉' };
    }
  };

  const statusBadge = getStatusBadge();

  const quickActions = [
    { icon: '🧭', label: 'Step Guide', desc: 'Follow your personalized path', view: 'guide' as const, color: 'var(--color-accent-primary)' },
    { icon: '✅', label: 'Eligibility', desc: 'Check your voting eligibility', view: 'eligibility' as const, color: 'var(--color-accent-success)' },
    { icon: '💡', label: 'Myths & Facts', desc: 'Learn the truth about voting', view: 'myths' as const, color: 'var(--color-accent-tertiary)' },
    { icon: '🤖', label: 'AI Guide', desc: 'Get personalized assistance', view: 'chat' as const, color: 'var(--color-accent-secondary)' },
  ];

  return (
    <main className="dashboard" role="main">
      <div className="dashboard__container">
        
        {/* Welcome Section */}
        <section className="dashboard__welcome animate-fade-in-up" aria-labelledby="welcome-heading">
          <div className="dashboard__welcome-text">
            <h1 id="welcome-heading" className="dashboard__greeting">
              Welcome back, <span className="dashboard__name-gradient">{user.name}</span> 👋
            </h1>
            <p className="dashboard__greeting-sub">
              Here's your voting journey overview for <strong>{stateName}</strong>
            </p>
          </div>
          <div className="dashboard__status-badge" style={{ '--badge-color': statusBadge.color } as React.CSSProperties}>
            <span aria-hidden="true">{statusBadge.icon}</span>
            <span>{statusBadge.label}</span>
          </div>
        </section>

        {/* Progress Card */}
        <section className="dashboard__progress-card animate-fade-in-up stagger-1" aria-labelledby="progress-heading">
          <div className="dashboard__progress-header">
            <h2 id="progress-heading" className="dashboard__section-title">Your Progress</h2>
            <span className="dashboard__progress-percent">{progress}%</span>
          </div>
          <div className="dashboard__progress-bar-wrapper" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
            <div className="dashboard__progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <div className="dashboard__progress-steps">
            {relevantSteps.map((step, i) => {
              const isCompleted = user.completedSteps.includes(step.id);
              const isCurrent = step.id === nextStep?.id;
              return (
                <div 
                  key={step.id} 
                  className={`dashboard__progress-step ${isCompleted ? 'dashboard__progress-step--done' : ''} ${isCurrent ? 'dashboard__progress-step--current' : ''}`}
                  title={step.title}
                >
                  <div className="dashboard__progress-dot">
                    {isCompleted ? '✓' : i + 1}
                  </div>
                  <span className="dashboard__progress-label">{step.title}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Next Step CTA */}
        {nextStep && (
          <section className="dashboard__next-step animate-fade-in-up stagger-2" aria-labelledby="next-step-heading">
            <div className="dashboard__next-step-glow" aria-hidden="true" />
            <div className="dashboard__next-step-content">
              <span className="dashboard__next-step-badge">Next Step</span>
              <h2 id="next-step-heading" className="dashboard__next-step-title">
                <span className="dashboard__next-step-icon" aria-hidden="true">{nextStep.icon}</span>
                {nextStep.title}
              </h2>
              <p className="dashboard__next-step-desc">{nextStep.description}</p>
              <button 
                className="dashboard__next-step-btn"
                onClick={() => navigate('guide')}
                id="next-step-action-btn"
                aria-label={`Start: ${nextStep.title}`}
              >
                Start This Step →
              </button>
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <section className="dashboard__actions animate-fade-in-up stagger-3" aria-labelledby="actions-heading">
          <h2 id="actions-heading" className="dashboard__section-title">Quick Actions</h2>
          <div className="dashboard__actions-grid">
            {quickActions.map(action => (
              <button
                key={action.view}
                className="dashboard__action-card"
                onClick={() => navigate(action.view)}
                style={{ '--action-color': action.color } as React.CSSProperties}
                id={`action-${action.view}`}
                aria-label={`${action.label}: ${action.desc}`}
              >
                <span className="dashboard__action-icon" aria-hidden="true">{action.icon}</span>
                <span className="dashboard__action-label">{action.label}</span>
                <span className="dashboard__action-desc">{action.desc}</span>
                <span className="dashboard__action-arrow" aria-hidden="true">→</span>
              </button>
            ))}
          </div>
        </section>

        {/* Upcoming Deadlines */}
        {upcomingDeadlines.length > 0 && (
          <section className="dashboard__deadlines animate-fade-in-up stagger-4" aria-labelledby="deadlines-heading">
            <div className="dashboard__deadlines-header">
              <h2 id="deadlines-heading" className="dashboard__section-title">Upcoming Deadlines</h2>
              <button 
                className="dashboard__see-all"
                onClick={() => navigate('deadlines')}
                id="see-all-deadlines-btn"
              >
                See All →
              </button>
            </div>
            <div className="dashboard__deadlines-list">
              {upcomingDeadlines.map(deadline => {
                const daysLeft = getDaysUntil(deadline.date);
                return (
                  <div key={deadline.id} className={`dashboard__deadline-card ${deadline.urgent ? 'dashboard__deadline-card--urgent' : ''}`}>
                    <span className="dashboard__deadline-icon" aria-hidden="true">{deadline.icon}</span>
                    <div className="dashboard__deadline-info">
                      <span className="dashboard__deadline-title">{deadline.title}</span>
                      <span className="dashboard__deadline-date">
                        {new Date(deadline.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className={`dashboard__deadline-countdown ${daysLeft <= 30 ? 'dashboard__deadline-countdown--soon' : ''}`}>
                      <span className="dashboard__deadline-days">{daysLeft}</span>
                      <span className="dashboard__deadline-unit">days</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Tips */}
        <section className="dashboard__tips animate-fade-in-up stagger-5" aria-labelledby="tips-heading">
          <h2 id="tips-heading" className="sr-only">Quick Tips</h2>
          <div className="dashboard__tip-card">
            <span className="dashboard__tip-icon" aria-hidden="true">💡</span>
            <div className="dashboard__tip-content">
              <strong>Did you know?</strong> You can bring notes about your choices into the voting booth in most states. 
              Research your ballot ahead of time to save time on Election Day!
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
