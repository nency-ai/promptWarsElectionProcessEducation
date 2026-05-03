/* ============================================
   Election Companion — User Context Provider
   Manages user state with localStorage persistence
   and Firebase analytics integration.
   ============================================ */

import { createContext, useContext, useReducer, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import type { UserProfile, AppView, VoterStatus, UserGoal, ChatMessage } from './types';
import {
  trackNavigation,
  trackStepComplete,
  trackStepUncomplete,
  trackEligibilityCheck,
  trackOnboardingComplete,
  trackProfileReset,
} from './services/analytics';
import { logUsageEvent } from './firebase';

const STORAGE_KEY = 'election-companion-user';

/* Default profile */
const defaultProfile: UserProfile = {
  name: '',
  state: '',
  voterStatus: 'not-registered',
  currentGoal: null,
  completedSteps: [],
  eligibilityChecks: {},
  onboardingComplete: false,
};

/* State shape */
interface AppState {
  user: UserProfile;
  currentView: AppView;
  chatMessages: ChatMessage[];
}



/* Actions */
type AppAction =
  | { type: 'SET_VIEW'; view: AppView }
  | { type: 'SET_NAME'; name: string }
  | { type: 'SET_STATE'; state: string }
  | { type: 'SET_VOTER_STATUS'; status: VoterStatus }
  | { type: 'SET_GOAL'; goal: UserGoal }
  | { type: 'COMPLETE_STEP'; stepId: string }
  | { type: 'UNCOMPLETE_STEP'; stepId: string }
  | { type: 'SET_ELIGIBILITY'; itemId: string; checked: boolean }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'ADD_CHAT_MESSAGE'; message: ChatMessage }
  | { type: 'RESET_USER' }
  | { type: 'LOAD_USER'; user: UserProfile };

/* Helpers */
function sanitizeString(input: string): string {
  return input.replace(/[<>&"'/]/g, '').trim().slice(0, 100);
}

function loadUserFromStorage(): UserProfile {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate the parsed data structure
      if (typeof parsed === 'object' && parsed !== null) {
        return { ...defaultProfile, ...parsed };
      }
    }
  } catch {
    console.warn('Failed to load user data from localStorage');
  }
  return defaultProfile;
}

function saveUserToStorage(user: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {
    console.warn('Failed to save user data to localStorage');
  }
}

/* Reducer */
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, currentView: action.view };
      
    case 'SET_NAME':
      return { ...state, user: { ...state.user, name: sanitizeString(action.name) } };
      
    case 'SET_STATE':
      return { ...state, user: { ...state.user, state: action.state } };
      
    case 'SET_VOTER_STATUS':
      return { ...state, user: { ...state.user, voterStatus: action.status } };
      
    case 'SET_GOAL':
      return { ...state, user: { ...state.user, currentGoal: action.goal } };
      
    case 'COMPLETE_STEP':
      if (state.user.completedSteps.includes(action.stepId)) return state;
      return {
        ...state,
        user: {
          ...state.user,
          completedSteps: [...state.user.completedSteps, action.stepId],
        },
      };
      
    case 'UNCOMPLETE_STEP':
      return {
        ...state,
        user: {
          ...state.user,
          completedSteps: state.user.completedSteps.filter(id => id !== action.stepId),
        },
      };
      
    case 'SET_ELIGIBILITY':
      return {
        ...state,
        user: {
          ...state.user,
          eligibilityChecks: {
            ...state.user.eligibilityChecks,
            [action.itemId]: action.checked,
          },
        },
      };
      
    case 'COMPLETE_ONBOARDING':
      return { ...state, user: { ...state.user, onboardingComplete: true }, currentView: 'dashboard' };
      
    case 'ADD_CHAT_MESSAGE':
      return { ...state, chatMessages: [...state.chatMessages, action.message] };
      
    case 'RESET_USER':
      localStorage.removeItem(STORAGE_KEY);
      return { user: defaultProfile, currentView: 'landing', chatMessages: [] };
      
    case 'LOAD_USER':
      return { ...state, user: action.user };
      
    default:
      return state;
  }
}

/* Context */
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  navigate: (view: AppView) => void;
  setName: (name: string) => void;
  setState: (state: string) => void;
  setVoterStatus: (status: VoterStatus) => void;
  setGoal: (goal: UserGoal) => void;
  completeStep: (stepId: string) => void;
  uncompleteStep: (stepId: string) => void;
  setEligibility: (itemId: string, checked: boolean) => void;
  completeOnboarding: () => void;
  addChatMessage: (message: ChatMessage) => void;
  resetUser: () => void;
  getProgress: () => number;
}

const AppContext = createContext<AppContextType | null>(null);

/* Provider */
export function AppProvider({ children }: { children: ReactNode }) {
  const savedUser = loadUserFromStorage();
  const initialView: AppView = savedUser.onboardingComplete ? 'dashboard' : 'landing';
  
  const [state, dispatch] = useReducer(appReducer, {
    user: savedUser,
    currentView: initialView,
    chatMessages: [],
  });

  // Persist user data on changes
  useEffect(() => {
    saveUserToStorage(state.user);
  }, [state.user]);

  const navigate = useCallback((view: AppView) => {
    const from = state.currentView;
    dispatch({ type: 'SET_VIEW', view });
    trackNavigation(from, view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [state.currentView]);

  const setName = useCallback((name: string) => {
    dispatch({ type: 'SET_NAME', name });
  }, []);

  const setState = useCallback((stateCode: string) => {
    dispatch({ type: 'SET_STATE', state: stateCode });
  }, []);

  const setVoterStatus = useCallback((status: VoterStatus) => {
    dispatch({ type: 'SET_VOTER_STATUS', status });
  }, []);

  const setGoal = useCallback((goal: UserGoal) => {
    dispatch({ type: 'SET_GOAL', goal });
  }, []);

  const completeStep = useCallback((stepId: string) => {
    dispatch({ type: 'COMPLETE_STEP', stepId });
    trackStepComplete(stepId);
    logUsageEvent({ eventType: 'step_complete', metadata: { stepId } });
  }, []);

  const uncompleteStep = useCallback((stepId: string) => {
    dispatch({ type: 'UNCOMPLETE_STEP', stepId });
    trackStepUncomplete(stepId);
  }, []);

  const setEligibility = useCallback((itemId: string, checked: boolean) => {
    dispatch({ type: 'SET_ELIGIBILITY', itemId, checked });
    trackEligibilityCheck(itemId, checked);
  }, []);

  const completeOnboarding = useCallback(() => {
    dispatch({ type: 'COMPLETE_ONBOARDING' });
    trackOnboardingComplete(state.user.state, state.user.voterStatus, state.user.currentGoal);
    logUsageEvent({
      eventType: 'onboarding_complete',
      metadata: {
        state: state.user.state,
        voterStatus: state.user.voterStatus,
        goal: state.user.currentGoal ?? 'none',
      },
    });
  }, [state.user.state, state.user.voterStatus, state.user.currentGoal]);

  const addChatMessage = useCallback((message: ChatMessage) => {
    dispatch({ type: 'ADD_CHAT_MESSAGE', message });
  }, []);

  const resetUser = useCallback(() => {
    dispatch({ type: 'RESET_USER' });
    trackProfileReset();
  }, []);

  const getProgress = useCallback(() => {
    const totalSteps = 8;
    const completed = state.user.completedSteps.length;
    return Math.round((completed / totalSteps) * 100);
  }, [state.user.completedSteps]);

  const value: AppContextType = useMemo(() => ({
    state,
    dispatch,
    navigate,
    setName,
    setState,
    setVoterStatus,
    setGoal,
    completeStep,
    uncompleteStep,
    setEligibility,
    completeOnboarding,
    addChatMessage,
    resetUser,
    getProgress,
  }), [
    state,
    navigate,
    setName,
    setState,
    setVoterStatus,
    setGoal,
    completeStep,
    uncompleteStep,
    setEligibility,
    completeOnboarding,
    addChatMessage,
    resetUser,
    getProgress,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/* Hook */
export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
