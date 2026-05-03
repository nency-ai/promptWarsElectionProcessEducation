/* ============================================
   Onboarding Flow — Multi-step Setup
   ============================================ */

import { useState, useCallback } from 'react';
import { useApp } from '../context';
import { INDIAN_STATES, GOAL_OPTIONS } from '../data';
import type { VoterStatus } from '../types';
import './Onboarding.css';

type OnboardingStep = 'name' | 'state' | 'status' | 'goal';

const STEPS: OnboardingStep[] = ['name', 'state', 'status', 'goal'];

const STATUS_OPTIONS: { value: VoterStatus; label: string; icon: string; desc: string }[] = [
  { value: 'not-registered', label: 'Not Registered', icon: '📋', desc: 'I haven\'t registered to vote yet' },
  { value: 'registered', label: 'Registered', icon: '✅', desc: 'I\'m registered but haven\'t voted recently' },
  { value: 'ready', label: 'Ready to Vote', icon: '🗳️', desc: 'I\'m registered and ready for this election' },
  { value: 'voted', label: 'Already Voted', icon: '🎉', desc: 'I\'ve already cast my ballot' },
];

export default function Onboarding() {
  const { state, setName, setState, setVoterStatus, setGoal, completeOnboarding, navigate } = useApp();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('name');
  const [localName, setLocalName] = useState(state.user.name);
  const [searchState, setSearchState] = useState('');

  const stepIndex = STEPS.indexOf(currentStep);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  const goNext = useCallback(() => {
    const nextIndex = stepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex]);
    } else {
      completeOnboarding();
    }
  }, [stepIndex, completeOnboarding]);

  const goBack = useCallback(() => {
    if (stepIndex > 0) {
      setCurrentStep(STEPS[stepIndex - 1]);
    } else {
      navigate('landing');
    }
  }, [stepIndex, navigate]);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localName.trim()) {
      setName(localName.trim());
      goNext();
    }
  };

  const handleStateSelect = (code: string) => {
    setState(code);
    goNext();
  };

  const handleStatusSelect = (status: VoterStatus) => {
    setVoterStatus(status);
    goNext();
  };

  const handleGoalSelect = (goal: typeof GOAL_OPTIONS[number]['id']) => {
    setGoal(goal);
    completeOnboarding();
  };

  const filteredStates = INDIAN_STATES.filter(s =>
    s.name.toLowerCase().includes(searchState.toLowerCase()) ||
    s.code.toLowerCase().includes(searchState.toLowerCase())
  );

  return (
    <main className="onboarding" role="main">
      <div className="onboarding__bg" aria-hidden="true">
        <div className="onboarding__orb onboarding__orb--1" />
        <div className="onboarding__orb onboarding__orb--2" />
      </div>

      <div className="onboarding__container">
        {/* Progress */}
        <div className="onboarding__header">
          <button 
            className="onboarding__back" 
            onClick={goBack}
            aria-label="Go back"
            id="onboarding-back-btn"
          >
            ← Back
          </button>
          <div className="onboarding__progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Onboarding progress">
            <div className="onboarding__progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <span className="onboarding__step-label">
            Step {stepIndex + 1} of {STEPS.length}
          </span>
        </div>

        {/* Step Content */}
        <div className="onboarding__content animate-fade-in-up" key={currentStep}>
          
          {/* Step 1: Name */}
          {currentStep === 'name' && (
            <div className="onboarding__step">
              <div className="onboarding__step-icon" aria-hidden="true">👋</div>
              <h2 className="onboarding__step-title" id="onboarding-name-title">What's your name?</h2>
              <p className="onboarding__step-desc">
                We'll use this to personalize your voting guide experience.
              </p>
              <form onSubmit={handleNameSubmit} className="onboarding__form">
                <div className="onboarding__input-wrapper">
                  <input
                    type="text"
                    className="onboarding__input"
                    value={localName}
                    onChange={e => setLocalName(e.target.value)}
                    placeholder="Enter your first name"
                    maxLength={50}
                    required
                    autoFocus
                    autoComplete="given-name"
                    aria-labelledby="onboarding-name-title"
                    id="onboarding-name-input"
                  />
                </div>
                <button
                  type="submit"
                  className="onboarding__next-btn"
                  disabled={!localName.trim()}
                  id="onboarding-name-submit"
                >
                  Continue →
                </button>
              </form>
            </div>
          )}

          {/* Step 2: State */}
          {currentStep === 'state' && (
            <div className="onboarding__step">
              <div className="onboarding__step-icon" aria-hidden="true">📍</div>
              <h2 className="onboarding__step-title" id="onboarding-state-title">
                Where are you located, {state.user.name}?
              </h2>
              <p className="onboarding__step-desc">
                Voting rules vary by state. We'll tailor guidance to your location.
              </p>
              <div className="onboarding__search-wrapper">
                <input
                  type="text"
                  className="onboarding__search"
                  value={searchState}
                  onChange={e => setSearchState(e.target.value)}
                  placeholder="Search for your state..."
                  autoFocus
                  aria-label="Search states"
                  id="onboarding-state-search"
                />
              </div>
              <div className="onboarding__state-grid" role="listbox" aria-labelledby="onboarding-state-title">
                {filteredStates.map(s => (
                  <button
                    key={s.code}
                    className={`onboarding__state-btn ${state.user.state === s.code ? 'onboarding__state-btn--selected' : ''}`}
                    onClick={() => handleStateSelect(s.code)}
                    role="option"
                    aria-selected={state.user.state === s.code}
                    id={`state-${s.code}`}
                  >
                    <span className="onboarding__state-code">{s.code}</span>
                    <span className="onboarding__state-name">{s.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Voter Status */}
          {currentStep === 'status' && (
            <div className="onboarding__step">
              <div className="onboarding__step-icon" aria-hidden="true">📊</div>
              <h2 className="onboarding__step-title" id="onboarding-status-title">
                What's your voter status?
              </h2>
              <p className="onboarding__step-desc">
                This helps us figure out where you are in the voting journey.
              </p>
              <div className="onboarding__options" role="radiogroup" aria-labelledby="onboarding-status-title">
                {STATUS_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    className={`onboarding__option-card ${state.user.voterStatus === opt.value ? 'onboarding__option-card--selected' : ''}`}
                    onClick={() => handleStatusSelect(opt.value)}
                    role="radio"
                    aria-checked={state.user.voterStatus === opt.value}
                    id={`status-${opt.value}`}
                  >
                    <span className="onboarding__option-icon" aria-hidden="true">{opt.icon}</span>
                    <div className="onboarding__option-text">
                      <span className="onboarding__option-label">{opt.label}</span>
                      <span className="onboarding__option-desc">{opt.desc}</span>
                    </div>
                    <span className="onboarding__option-check" aria-hidden="true">
                      {state.user.voterStatus === opt.value ? '●' : '○'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Goal */}
          {currentStep === 'goal' && (
            <div className="onboarding__step">
              <div className="onboarding__step-icon" aria-hidden="true">🎯</div>
              <h2 className="onboarding__step-title" id="onboarding-goal-title">
                What would you like to do?
              </h2>
              <p className="onboarding__step-desc">
                Pick your primary goal and we'll guide you through it.
              </p>
              <div className="onboarding__goal-grid" role="radiogroup" aria-labelledby="onboarding-goal-title">
                {GOAL_OPTIONS.map(goal => (
                  <button
                    key={goal.id}
                    className="onboarding__goal-card"
                    onClick={() => handleGoalSelect(goal.id)}
                    role="radio"
                    aria-checked={state.user.currentGoal === goal.id}
                    id={`goal-${goal.id}`}
                    style={{ '--goal-color': goal.color } as React.CSSProperties}
                  >
                    <span className="onboarding__goal-icon" aria-hidden="true">{goal.icon}</span>
                    <span className="onboarding__goal-title">{goal.title}</span>
                    <span className="onboarding__goal-desc">{goal.description}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
