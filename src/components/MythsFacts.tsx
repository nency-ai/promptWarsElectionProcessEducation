/* ============================================
   Myths & Facts — Interactive Cards
   ============================================ */

import { useState, useMemo } from 'react';
import { MYTHS_AND_FACTS } from '../data';
import './MythsFacts.css';

type Category = 'all' | 'registration' | 'voting' | 'general' | 'security';

const CATEGORIES: { value: Category; label: string; icon: string }[] = [
  { value: 'all', label: 'All', icon: '📋' },
  { value: 'registration', label: 'Registration', icon: '📝' },
  { value: 'voting', label: 'Voting', icon: '🗳️' },
  { value: 'general', label: 'General', icon: '📚' },
  { value: 'security', label: 'Security', icon: '🔒' },
];

export default function MythsFacts() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  const filteredMyths = useMemo(() => {
    if (activeCategory === 'all') return MYTHS_AND_FACTS;
    return MYTHS_AND_FACTS.filter(m => m.category === activeCategory);
  }, [activeCategory]);

  const toggleCard = (id: string) => {
    setFlippedCards(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <main className="myths" role="main">
      <div className="myths__container">
        <header className="myths__header animate-fade-in-up">
          <h1 id="myths-heading" className="myths__title">
            <span className="myths__title-icon" aria-hidden="true">💡</span>
            Myth vs Fact
          </h1>
          <p className="myths__subtitle">
            Click any card to reveal the truth. Separate fact from fiction about the voting process.
          </p>
        </header>

        {/* Category Filter */}
        <div className="myths__filters animate-fade-in-up stagger-1" role="tablist" aria-label="Filter myths by category">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              className={`myths__filter ${activeCategory === cat.value ? 'myths__filter--active' : ''}`}
              onClick={() => setActiveCategory(cat.value)}
              role="tab"
              aria-selected={activeCategory === cat.value}
              id={`myth-filter-${cat.value}`}
            >
              <span aria-hidden="true">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="myths__grid" role="list" aria-label="Myth and fact cards">
          {filteredMyths.map((item, i) => {
            const isFlipped = flippedCards.has(item.id);
            return (
              <div
                key={item.id}
                className={`myths__card-wrapper animate-fade-in-up stagger-${Math.min(i % 4 + 2, 6)}`}
                role="listitem"
              >
                <button
                  className={`myths__card ${isFlipped ? 'myths__card--flipped' : ''}`}
                  onClick={() => toggleCard(item.id)}
                  aria-label={isFlipped ? `Fact: ${item.fact}` : `Myth: ${item.myth}. Click to reveal fact.`}
                  id={`myth-card-${item.id}`}
                >
                  {/* Front - Myth */}
                  <div className="myths__card-front">
                    <div className="myths__card-badge myths__card-badge--myth">
                      <span aria-hidden="true">❌</span> Myth
                    </div>
                    <span className="myths__card-icon" aria-hidden="true">{item.icon}</span>
                    <p className="myths__card-text">{item.myth}</p>
                    <span className="myths__card-hint">Tap to reveal the truth →</span>
                  </div>

                  {/* Back - Fact */}
                  <div className="myths__card-back">
                    <div className="myths__card-badge myths__card-badge--fact">
                      <span aria-hidden="true">✅</span> Fact
                    </div>
                    <p className="myths__card-text">{item.fact}</p>
                    <span className="myths__card-hint">← Tap to see myth</span>
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {filteredMyths.length === 0 && (
          <div className="myths__empty">
            <p>No myths found for this category.</p>
          </div>
        )}
      </div>
    </main>
  );
}
