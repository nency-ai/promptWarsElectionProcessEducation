/* ============================================
   Step Guide — Interactive Step-by-Step
   ============================================ */

import { useMemo, useState } from 'react';
import { useApp } from '../context';
import { ELECTION_STEPS } from '../data';
import './StepGuide.css';

export default function StepGuide() {
  const { state, completeStep, uncompleteStep } = useApp();
  const { user } = state;
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const relevantSteps = useMemo(() => {
    return ELECTION_STEPS.filter(step =>
      step.forStatus.includes(user.voterStatus)
    );
  }, [user.voterStatus]);

  const completedCount = useMemo(() => {
    return relevantSteps.filter(s => user.completedSteps.includes(s.id)).length;
  }, [relevantSteps, user.completedSteps]);

  const toggleExpand = (stepId: string) => {
    setExpandedStep(prev => prev === stepId ? null : stepId);
  };

  const toggleStep = (stepId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (user.completedSteps.includes(stepId)) {
      uncompleteStep(stepId);
    } else {
      completeStep(stepId);
    }
  };

  return (
    <main className="guide" role="main">
      <div className="guide__container">
        <header className="guide__header animate-fade-in-up">
          <h1 id="guide-heading" className="guide__title">
            <span className="guide__title-icon" aria-hidden="true">🧭</span>
            Your Voting Journey
          </h1>
          <p className="guide__subtitle">
            Follow these steps to complete your voting process. Check off each step as you go.
          </p>
          <div className="guide__stats">
            <span className="guide__stat-completed">{completedCount} of {relevantSteps.length} completed</span>
            <div className="guide__stat-bar" role="progressbar" aria-valuenow={completedCount} aria-valuemax={relevantSteps.length}>
              <div 
                className="guide__stat-fill" 
                style={{ width: `${(completedCount / relevantSteps.length) * 100}%` }} 
              />
            </div>
          </div>
        </header>

        <div className="guide__timeline" role="list" aria-label="Voting steps">
          {relevantSteps.map((step, index) => {
            const isCompleted = user.completedSteps.includes(step.id);
            const isExpanded = expandedStep === step.id;
            const isPrevDone = index === 0 || user.completedSteps.includes(relevantSteps[index - 1].id);

            return (
              <div 
                key={step.id} 
                className={`guide__step ${isCompleted ? 'guide__step--completed' : ''} ${isExpanded ? 'guide__step--expanded' : ''} ${!isPrevDone && !isCompleted ? 'guide__step--locked' : ''}`}
                role="listitem"
              >
                {/* Connector */}
                {index > 0 && (
                  <div className={`guide__connector ${isCompleted ? 'guide__connector--done' : ''}`} aria-hidden="true" />
                )}

                {/* Step Card */}
                <div className="guide__step-card" onClick={() => toggleExpand(step.id)}>
                  <div className="guide__step-number">
                    <button
                      className={`guide__check ${isCompleted ? 'guide__check--done' : ''}`}
                      onClick={(e) => toggleStep(step.id, e)}
                      aria-label={`${isCompleted ? 'Unmark' : 'Mark'} "${step.title}" as complete`}
                      id={`step-check-${step.id}`}
                    >
                      {isCompleted ? (
                        <svg viewBox="0 0 24 24" className="guide__check-svg" aria-hidden="true">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/>
                        </svg>
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </button>
                  </div>

                  <div className="guide__step-body">
                    <div className="guide__step-header">
                      <div className="guide__step-info">
                        <span className="guide__step-emoji" aria-hidden="true">{step.icon}</span>
                        <h3 className="guide__step-title">{step.title}</h3>
                      </div>
                      <button 
                        className={`guide__expand-btn ${isExpanded ? 'guide__expand-btn--open' : ''}`}
                        aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                        aria-expanded={isExpanded}
                        onClick={(e) => { e.stopPropagation(); toggleExpand(step.id); }}
                      >
                        ▾
                      </button>
                    </div>
                    <p className="guide__step-desc">{step.description}</p>

                    {/* Substeps */}
                    {isExpanded && step.substeps && (
                      <div className="guide__substeps animate-fade-in-down">
                        <h4 className="guide__substeps-title">How to do this:</h4>
                        <ol className="guide__substeps-list">
                          {step.substeps.map((sub, i) => (
                            <li key={i} className="guide__substep">
                              <span className="guide__substep-num">{i + 1}</span>
                              <span>{sub}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {completedCount === relevantSteps.length && (
          <div className="guide__complete-banner animate-scale-in">
            <span className="guide__complete-icon" aria-hidden="true">🎉</span>
            <h2 className="guide__complete-title">All Steps Complete!</h2>
            <p className="guide__complete-desc">
              You've completed all the steps for your current status. Great job being an informed voter!
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
