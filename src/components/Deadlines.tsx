/* ============================================
   Deadlines — Timeline View
   ============================================ */

import { useMemo } from 'react';
import { DEADLINES } from '../data';
import './Deadlines.css';

export default function Deadlines() {
  const categorizedDeadlines = useMemo(() => {
    const now = new Date();
    return DEADLINES.map(d => {
      const date = new Date(d.date);
      const diff = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const isPast = diff < 0;
      return { ...d, daysLeft: diff, isPast };
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, []);

  const getUrgencyClass = (days: number, isPast: boolean) => {
    if (isPast) return 'deadlines__card--past';
    if (days <= 7) return 'deadlines__card--critical';
    if (days <= 30) return 'deadlines__card--soon';
    return '';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'registration': return 'var(--color-accent-primary)';
      case 'voting': return 'var(--color-accent-secondary)';
      case 'results': return 'var(--color-accent-tertiary)';
      default: return 'var(--color-text-accent)';
    }
  };

  return (
    <main className="deadlines" role="main">
      <div className="deadlines__container">
        <header className="deadlines__header animate-fade-in-up">
          <h1 id="deadlines-heading" className="deadlines__title">
            <span className="deadlines__title-icon" aria-hidden="true">⏰</span>
            Important Deadlines
          </h1>
          <p className="deadlines__subtitle">
            Key dates you need to know. Never miss a deadline on your voting journey.
          </p>
        </header>

        {/* Legend */}
        <div className="deadlines__legend animate-fade-in-up stagger-1" aria-label="Deadline categories">
          <div className="deadlines__legend-item">
            <span className="deadlines__legend-dot" style={{ background: 'var(--color-accent-primary)' }} />
            <span>Registration</span>
          </div>
          <div className="deadlines__legend-item">
            <span className="deadlines__legend-dot" style={{ background: 'var(--color-accent-secondary)' }} />
            <span>Voting</span>
          </div>
          <div className="deadlines__legend-item">
            <span className="deadlines__legend-dot" style={{ background: 'var(--color-accent-tertiary)' }} />
            <span>Results</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="deadlines__timeline" role="list" aria-label="Election deadlines timeline">
          {categorizedDeadlines.map((deadline, i) => (
            <div
              key={deadline.id}
              className={`deadlines__card ${getUrgencyClass(deadline.daysLeft, deadline.isPast)} animate-fade-in-up stagger-${Math.min(i + 2, 6)}`}
              role="listitem"
              style={{ '--category-color': getCategoryColor(deadline.category) } as React.CSSProperties}
            >
              <div className="deadlines__card-accent" aria-hidden="true" />

              <div className="deadlines__card-left">
                <span className="deadlines__card-icon" aria-hidden="true">{deadline.icon}</span>
                <div className="deadlines__card-date-block">
                  <span className="deadlines__card-month">
                    {new Date(deadline.date).toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span className="deadlines__card-day">
                    {new Date(deadline.date).getDate()}
                  </span>
                </div>
              </div>

              <div className="deadlines__card-content">
                <div className="deadlines__card-header">
                  <h3 className="deadlines__card-title">{deadline.title}</h3>
                  {deadline.urgent && !deadline.isPast && (
                    <span className="deadlines__urgent-badge" aria-label="Urgent">⚡ Important</span>
                  )}
                </div>
                <p className="deadlines__card-desc">{deadline.description}</p>
                <span className="deadlines__card-full-date">
                  {new Date(deadline.date).toLocaleDateString('en-US', { 
                    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' 
                  })}
                </span>
              </div>

              <div className="deadlines__card-countdown">
                {deadline.isPast ? (
                  <span className="deadlines__past-badge">Passed</span>
                ) : (
                  <>
                    <span className="deadlines__days-number">{deadline.daysLeft}</span>
                    <span className="deadlines__days-label">days left</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="deadlines__note animate-fade-in-up">
          <span aria-hidden="true">📌</span>
          <p>
            Deadlines vary by state. These are general dates — always verify with your 
            state's official election website for exact deadlines.
          </p>
        </div>
      </div>
    </main>
  );
}
