/* ============================================
   Tests — data.ts (Election Data Layer)
   ============================================ */
import { describe, it, expect } from 'vitest';
import {
  INDIAN_STATES,
  ELECTION_STEPS,
  DEADLINES,
  MYTHS_AND_FACTS,
  ELIGIBILITY_ITEMS,
  GOAL_OPTIONS,
  CHAT_RESPONSES,
} from '../data';

describe('INDIAN_STATES', () => {
  it('should contain at least 28 states and UTs', () => {
    expect(INDIAN_STATES.length).toBeGreaterThanOrEqual(28);
  });

  it('should have code and name for every entry', () => {
    INDIAN_STATES.forEach(state => {
      expect(state.code).toBeTruthy();
      expect(state.name).toBeTruthy();
    });
  });

  it('should not contain any US states like CA, TX, NY', () => {
    const codes = INDIAN_STATES.map(s => s.code);
    expect(codes).not.toContain('CA');
    expect(codes).not.toContain('TX');
    expect(codes).not.toContain('NY');
  });

  it('should contain Maharashtra and Uttar Pradesh', () => {
    const names = INDIAN_STATES.map(s => s.name);
    expect(names).toContain('Maharashtra');
    expect(names).toContain('Uttar Pradesh');
  });
});

describe('ELECTION_STEPS', () => {
  it('should contain at least 5 steps', () => {
    expect(ELECTION_STEPS.length).toBeGreaterThanOrEqual(5);
  });

  it('each step should have required fields', () => {
    ELECTION_STEPS.forEach(step => {
      expect(step.id).toBeTruthy();
      expect(step.title).toBeTruthy();
      expect(step.description).toBeTruthy();
      expect(step.icon).toBeTruthy();
      expect(Array.isArray(step.forStatus)).toBe(true);
    });
  });

  it('should include Indian-specific content like EPIC or Form 6 or ECI', () => {
    const allText = ELECTION_STEPS.map(s => s.title + s.description).join(' ');
    const hasIndianContent = (
      allText.includes('EPIC') ||
      allText.includes('Form 6') ||
      allText.includes('ECI') ||
      allText.includes('Electoral') ||
      allText.includes('NVSP') ||
      allText.includes('EVM')
    );
    expect(hasIndianContent).toBe(true);
  });
});

describe('DEADLINES', () => {
  it('should have at least 3 deadlines', () => {
    expect(DEADLINES.length).toBeGreaterThanOrEqual(3);
  });

  it('each deadline should have a valid category', () => {
    const validCategories = ['registration', 'voting', 'results'];
    DEADLINES.forEach(d => {
      expect(validCategories).toContain(d.category);
    });
  });
});

describe('MYTHS_AND_FACTS', () => {
  it('should have at least 4 myths', () => {
    expect(MYTHS_AND_FACTS.length).toBeGreaterThanOrEqual(4);
  });

  it('each entry should have myth, fact, icon and category', () => {
    MYTHS_AND_FACTS.forEach(item => {
      expect(item.myth).toBeTruthy();
      expect(item.fact).toBeTruthy();
      expect(item.icon).toBeTruthy();
      expect(item.category).toBeTruthy();
    });
  });

  it('should address EVM-related myths (Indian context)', () => {
    const allMyths = MYTHS_AND_FACTS.map(m => m.myth + m.fact).join(' ');
    const hasEVMContent = (
      allMyths.includes('EVM') ||
      allMyths.includes('voter ID') ||
      allMyths.includes('NOTA') ||
      allMyths.includes('Voter ID') ||
      allMyths.includes('EPIC')
    );
    expect(hasEVMContent).toBe(true);
  });
});

describe('ELIGIBILITY_ITEMS', () => {
  it('should list citizenship and age as requirements', () => {
    const labels = ELIGIBILITY_ITEMS.map(e => e.label.toLowerCase()).join(' ');
    expect(labels).toMatch(/citizen|citizenship/);
    expect(labels).toMatch(/18|age/);
  });
});

describe('GOAL_OPTIONS', () => {
  it('should have 6 goal options', () => {
    expect(GOAL_OPTIONS.length).toBe(6);
  });

  it('each goal should have id, title, description, icon, and color', () => {
    GOAL_OPTIONS.forEach(goal => {
      expect(goal.id).toBeTruthy();
      expect(goal.title).toBeTruthy();
      expect(goal.description).toBeTruthy();
      expect(goal.icon).toBeTruthy();
      expect(goal.color).toBeTruthy();
    });
  });
});

describe('CHAT_RESPONSES', () => {
  it('should contain a default fallback response', () => {
    expect(CHAT_RESPONSES['default']).toBeDefined();
    expect(Array.isArray(CHAT_RESPONSES['default'])).toBe(true);
  });

  it('should reference ECI or NVSP in at least one response', () => {
    const allResponses = Object.values(CHAT_RESPONSES).flat().join(' ');
    const hasIndianRef = (
      allResponses.includes('ECI') ||
      allResponses.includes('NVSP') ||
      allResponses.includes('voters.eci') ||
      allResponses.includes('Form 6')
    );
    expect(hasIndianRef).toBe(true);
  });
});
