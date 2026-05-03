/* ============================================
   Eligibility Checker Component
   ============================================ */

import { useMemo } from 'react';
import { useApp } from '../context';
import { ELIGIBILITY_ITEMS } from '../data';
import './Eligibility.css';

export default function Eligibility() {
  const { state, setEligibility } = useApp();
  const { user } = state;

  const items = useMemo(() => {
    return ELIGIBILITY_ITEMS.map(item => ({
      ...item,
      checked: user.eligibilityChecks[item.id] ?? false,
    }));
  }, [user.eligibilityChecks]);

  const checkedCount = items.filter(i => i.checked).length;
  const allChecked = checkedCount === items.length;
  const noneChecked = checkedCount === 0;

  const handleToggle = (id: string) => {
    const current = user.eligibilityChecks[id] ?? false;
    setEligibility(id, !current);
  };

  return (
    <main className="eligibility" role="main">
      <div className="eligibility__container">
        <header className="eligibility__header animate-fade-in-up">
          <h1 id="eligibility-heading" className="eligibility__title">
            <span className="eligibility__title-icon" aria-hidden="true">✅</span>
            Eligibility Checker
          </h1>
          <p className="eligibility__subtitle">
            Check each requirement to verify your voting eligibility. All criteria must be met.
          </p>
        </header>

        {/* Progress Ring */}
        <div className="eligibility__progress animate-fade-in-up stagger-1" aria-label={`${checkedCount} of ${items.length} requirements met`}>
          <div className="eligibility__ring">
            <svg viewBox="0 0 100 100" className="eligibility__ring-svg">
              <circle cx="50" cy="50" r="42" className="eligibility__ring-bg" />
              <circle 
                cx="50" cy="50" r="42" 
                className="eligibility__ring-fill"
                style={{
                  strokeDasharray: `${(checkedCount / items.length) * 264} 264`,
                }}
              />
            </svg>
            <div className="eligibility__ring-center">
              <span className="eligibility__ring-count">{checkedCount}</span>
              <span className="eligibility__ring-total">/ {items.length}</span>
            </div>
          </div>
          <span className={`eligibility__status ${allChecked ? 'eligibility__status--pass' : ''}`}>
            {allChecked ? '✅ Eligible!' : noneChecked ? 'Start checking below' : `${items.length - checkedCount} remaining`}
          </span>
        </div>

        {/* Checklist */}
        <div className="eligibility__list" role="group" aria-labelledby="eligibility-heading">
          {items.map((item, i) => (
            <div 
              key={item.id}
              className={`eligibility__item ${item.checked ? 'eligibility__item--checked' : ''} animate-fade-in-up stagger-${Math.min(i + 2, 6)}`}
            >
              <button
                className={`eligibility__checkbox ${item.checked ? 'eligibility__checkbox--checked' : ''}`}
                onClick={() => handleToggle(item.id)}
                role="checkbox"
                aria-checked={item.checked}
                aria-describedby={`eligibility-desc-${item.id}`}
                id={`eligibility-${item.id}`}
              >
                {item.checked && (
                  <svg viewBox="0 0 24 24" className="eligibility__check-icon" aria-hidden="true">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/>
                  </svg>
                )}
              </button>
              <div className="eligibility__item-content">
                <span className="eligibility__item-label">{item.label}</span>
                <span className="eligibility__item-desc" id={`eligibility-desc-${item.id}`}>{item.description}</span>
              </div>
              <div className={`eligibility__badge ${item.checked ? 'eligibility__badge--pass' : 'eligibility__badge--pending'}`}>
                {item.checked ? 'Met' : 'Pending'}
              </div>
            </div>
          ))}
        </div>

        {/* Result Banner */}
        {allChecked && (
          <div className="eligibility__result animate-scale-in">
            <div className="eligibility__result-icon" aria-hidden="true">🎉</div>
            <h2 className="eligibility__result-title">You're Eligible to Vote!</h2>
            <p className="eligibility__result-desc">
              You meet all the basic requirements. The next step is to register (if you haven't already) 
              and prepare for Election Day.
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="eligibility__disclaimer">
          <span className="eligibility__disclaimer-icon" aria-hidden="true">ℹ️</span>
          <p>
            This is a general eligibility overview. Requirements may vary by state. 
            Always check your state's official election website for specific requirements.
          </p>
        </div>
      </div>
    </main>
  );
}
