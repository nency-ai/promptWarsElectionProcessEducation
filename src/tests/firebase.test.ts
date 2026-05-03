import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.unmock('../firebase');
vi.unmock('firebase/firestore');

import { submitFeedback, logUsageEvent, getRecentFeedback } from '../firebase';
import * as firestore from 'firebase/firestore';

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  addDoc: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  serverTimestamp: vi.fn(),
}));

vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInAnonymously: vi.fn().mockResolvedValue({}),
}));

vi.mock('firebase/performance', () => ({
  getPerformance: vi.fn(),
}));

describe('Firebase Services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('submitFeedback', () => {
    it('should submit feedback successfully', async () => {
      vi.mocked(firestore.addDoc).mockResolvedValueOnce({ id: 'test-id' } as unknown as firestore.DocumentReference);
      const result = await submitFeedback({
        rating: 5,
        comment: 'Great app',
        category: 'General',
        voterStatus: 'registered',
        state: 'Delhi',
      });
      expect(result).toBe('test-id');
      expect(firestore.addDoc).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      vi.mocked(firestore.addDoc).mockRejectedValueOnce(new Error('Network error'));
      const result = await submitFeedback({
        rating: 5,
        comment: 'Great app',
        category: 'General',
        voterStatus: 'registered',
        state: 'Delhi',
      });
      expect(result).toBeNull();
    });
  });

  describe('logUsageEvent', () => {
    it('should log event successfully', async () => {
      vi.mocked(firestore.addDoc).mockResolvedValueOnce({ id: 'event-id' } as unknown as firestore.DocumentReference);
      await expect(logUsageEvent({ eventType: 'test_event' })).resolves.not.toThrow();
      expect(firestore.addDoc).toHaveBeenCalled();
    });
    
    it('should handle errors gracefully', async () => {
      vi.mocked(firestore.addDoc).mockRejectedValueOnce(new Error('Network error'));
      await expect(logUsageEvent({ eventType: 'test_event' })).resolves.not.toThrow();
    });
  });

  describe('getRecentFeedback', () => {
    it('should get recent feedback', async () => {
      vi.mocked(firestore.getDocs).mockResolvedValueOnce({
        docs: [
          { id: '1', data: () => ({ comment: 'test' }) }
        ]
      } as unknown as firestore.QuerySnapshot);
      const result = await getRecentFeedback();
      expect(result).toEqual([{ id: '1', comment: 'test' }]);
    });
    
    it('should handle errors gracefully', async () => {
      vi.mocked(firestore.getDocs).mockRejectedValueOnce(new Error('Network error'));
      const result = await getRecentFeedback();
      expect(result).toEqual([]);
    });
  });
});
