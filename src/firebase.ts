/* ============================================
   Firebase Configuration & Services
   Provides Firestore, Analytics, and
   helper utilities for the application.
   ============================================ */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp, type Firestore } from 'firebase/firestore';
import { getAnalytics, type Analytics } from 'firebase/analytics';
import { getAuth, type Auth } from 'firebase/auth';
import { getPerformance, type FirebasePerformance } from 'firebase/performance';

const firebaseConfig = {
  projectId: "prompt-wars-493105",
  // Other keys would be populated via environment variables in production
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "mock-api-key",
  authDomain: "prompt-wars-493105.firebaseapp.com",
  storageBucket: "prompt-wars-493105.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);

// Services that need window check
export const analytics: Analytics | null = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const perf: FirebasePerformance | null = typeof window !== 'undefined' ? getPerformance(app) : null;

/* ── Firestore Collections ── */

const FEEDBACK_COLLECTION = 'user_feedback';
const ANALYTICS_COLLECTION = 'usage_analytics';

/**
 * Submit user feedback to Firestore.
 * Stores anonymized feedback for improving the election guide.
 */
export async function submitFeedback(feedback: {
  rating: number;
  comment: string;
  category: string;
  voterStatus: string;
  state: string;
}): Promise<string | null> {
  try {
    const docRef = await addDoc(collection(db, FEEDBACK_COLLECTION), {
      ...feedback,
      // Sanitize inputs before storing
      comment: feedback.comment.slice(0, 500).replace(/<[^>]*>/g, ''),
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.warn('Failed to submit feedback to Firestore:', error);
    return null;
  }
}

/**
 * Log a usage analytics event to Firestore.
 * Used for aggregated feature usage tracking.
 */
export async function logUsageEvent(event: {
  eventType: string;
  metadata?: Record<string, string | number | boolean>;
}): Promise<void> {
  try {
    await addDoc(collection(db, ANALYTICS_COLLECTION), {
      eventType: event.eventType,
      metadata: event.metadata || {},
      timestamp: serverTimestamp(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 200) : 'unknown',
    });
  } catch {
    // Fail silently — analytics is non-critical
  }
}

/**
 * Retrieve recent feedback entries from Firestore (admin/debug use).
 * Limited to the 20 most recent entries.
 */
export async function getRecentFeedback(): Promise<Array<Record<string, unknown>>> {
  try {
    const q = query(
      collection(db, FEEDBACK_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.warn('Failed to retrieve feedback from Firestore:', error);
    return [];
  }
}
