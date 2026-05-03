/* ============================================
   Election Companion — Type Definitions
   ============================================ */

export type VoterStatus = 'not-registered' | 'registered' | 'ready' | 'voted';

export type UserGoal = 
  | 'register' 
  | 'learn' 
  | 'find-booth' 
  | 'check-results'
  | 'verify-registration'
  | 'understand-ballot';

export type ElectionStep = {
  id: string;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  substeps?: string[];
  forStatus: VoterStatus[];
};

export type Deadline = {
  id: string;
  title: string;
  date: string;
  description: string;
  icon: string;
  category: 'registration' | 'voting' | 'results';
  urgent?: boolean;
};

export type MythFact = {
  id: string;
  myth: string;
  fact: string;
  category: 'registration' | 'voting' | 'general' | 'security';
  icon: string;
};

export type EligibilityItem = {
  id: string;
  label: string;
  description: string;
  checked: boolean;
};

export type StateInfo = {
  code: string;
  name: string;
};

export type UserProfile = {
  name: string;
  state: string;
  voterStatus: VoterStatus;
  currentGoal: UserGoal | null;
  completedSteps: string[];
  eligibilityChecks: Record<string, boolean>;
  onboardingComplete: boolean;
};

export type AppView = 
  | 'landing'
  | 'onboarding' 
  | 'dashboard' 
  | 'guide' 
  | 'eligibility' 
  | 'myths' 
  | 'deadlines'
  | 'chat';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}
