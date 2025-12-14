import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { BasementFormData, XanoAnswer, QUESTION_CONFIG } from '../types/basement';
import { 
  initFunnelSession, 
  trackStepEvent, 
  updateFunnelProgress,
  updateFunnelEmail,
  clearFunnelData,
  FunnelType 
} from '../services/funnelSessionService';

// Step names for funnel tracking
const STEP_NAMES: Record<number, string> = {
  1: 'Basement Condition',
  2: 'Renovation Scope',
  3: 'Separate Entrance',
  4: 'Plan/Design',
  5: 'Project Urgency',
  6: 'Additional Details',
  7: 'Project Location',
  8: 'Email',
  9: 'Contact Details',
};

interface BasementFormContextType {
  formData: BasementFormData;
  updateFormData: (updates: Partial<BasementFormData>) => void;
  resetForm: () => void;
  getXanoAnswers: () => XanoAnswer[];
  isStepComplete: (step: number) => boolean;
  getCompletedStep: () => number;
  // Funnel tracking
  sessionId: string | null;
  isInitialized: boolean;
  trackStepView: (step: number) => void;
  completeStep: (step: number) => Promise<void>;
}

const initialFormData: BasementFormData = {
  basementCondition: null,
  renovationScope: [],
  separateEntrance: null,
  hasDesign: null,
  urgency: null,
  additionalDetails: '',
  city: '',
  postalCode: '',
  geoPoint: null,
  email: '',
  homeownerName: '',
  phone: '',
};

const STORAGE_KEY = 'renoassist_basement_form';
const FUNNEL_TYPE: FunnelType = 'basement';

const BasementFormContext = createContext<BasementFormContextType | undefined>(undefined);

export function BasementFormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<BasementFormData>(() => {
    // Try to load from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return { ...initialFormData, ...JSON.parse(saved) };
        } catch {
          return initialFormData;
        }
      }
    }
    return initialFormData;
  });

  // Funnel session state
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize funnel session on mount
  useEffect(() => {
    const initSession = async () => {
      try {
        const id = await initFunnelSession(FUNNEL_TYPE);
        setSessionId(id);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize funnel session:', error);
        // Still mark as initialized even if session creation fails
        setIsInitialized(true);
      }
    };

    initSession();
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData]);

  // Update funnel email when email changes
  useEffect(() => {
    if (sessionId && formData.email) {
      updateFunnelEmail(sessionId, formData.email);
    }
  }, [sessionId, formData.email]);

  const updateFormData = (updates: Partial<BasementFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    // Clear funnel data and reset session
    clearFunnelData(FUNNEL_TYPE);
  };

  // Track step view event
  const trackStepView = useCallback((step: number) => {
    if (sessionId) {
      trackStepEvent(
        sessionId,
        FUNNEL_TYPE,
        step,
        STEP_NAMES[step] || `Step ${step}`,
        'view'
      );
    }
  }, [sessionId]);

  // Complete a step (track completion and update progress)
  const completeStep = useCallback(async (step: number) => {
    if (sessionId) {
      // Track step completion event
      await trackStepEvent(
        sessionId,
        FUNNEL_TYPE,
        step,
        STEP_NAMES[step] || `Step ${step}`,
        'complete'
      );
      // Update funnel progress in database
      await updateFunnelProgress(sessionId, step, formData, FUNNEL_TYPE);
    }
  }, [sessionId, formData]);

  // Convert form data to Xano-compatible answers array
  const getXanoAnswers = (): XanoAnswer[] => {
    const answers: XanoAnswer[] = [];

    // Question 10: Basement Condition
    if (formData.basementCondition) {
      const option = QUESTION_CONFIG.BASEMENT_CONDITION.options.find(
        o => o.value === formData.basementCondition
      );
      answers.push({
        answer: formData.basementCondition,
        credit: option?.credit ?? 0,
        questionID: QUESTION_CONFIG.BASEMENT_CONDITION.questionID,
      });
    }

    // Question 11: Renovation Scope (multi-select - answer is array)
    if (formData.renovationScope.length > 0) {
      // Calculate total credit from selected options
      const totalCredit = formData.renovationScope.reduce((sum, selected) => {
        const option = QUESTION_CONFIG.RENOVATION_SCOPE.options.find(o => o.value === selected);
        return sum + (option?.credit ?? 0);
      }, 0);
      
      answers.push({
        answer: formData.renovationScope,
        credit: totalCredit,
        questionID: QUESTION_CONFIG.RENOVATION_SCOPE.questionID,
      });
    }

    // Question 13: Separate Entrance
    if (formData.separateEntrance) {
      const option = QUESTION_CONFIG.SEPARATE_ENTRANCE.options.find(
        o => o.value === formData.separateEntrance
      );
      answers.push({
        answer: formData.separateEntrance,
        credit: option?.credit ?? 0,
        questionID: QUESTION_CONFIG.SEPARATE_ENTRANCE.questionID,
      });
    }

    return answers;
  };

  const isStepComplete = (step: number): boolean => {
    switch (step) {
      case 1: return formData.basementCondition !== null;
      case 2: return formData.renovationScope.length > 0;
      case 3: return formData.separateEntrance !== null;
      case 4: return formData.hasDesign !== null;
      case 5: return formData.urgency !== null;
      case 6: return true; // Additional details is optional
      case 7: return formData.city !== '' && formData.postalCode !== '';
      case 8: return formData.email !== '';
      case 9: return formData.homeownerName !== '' && formData.phone !== '';
      default: return false;
    }
  };

  const getCompletedStep = (): number => {
    for (let i = 1; i <= 9; i++) {
      if (!isStepComplete(i)) return i - 1;
    }
    return 9;
  };

  return (
    <BasementFormContext.Provider
      value={{
        formData,
        updateFormData,
        resetForm,
        getXanoAnswers,
        isStepComplete,
        getCompletedStep,
        // Funnel tracking
        sessionId,
        isInitialized,
        trackStepView,
        completeStep,
      }}
    >
      {children}
    </BasementFormContext.Provider>
  );
}

export function useBasementForm() {
  const context = useContext(BasementFormContext);
  if (!context) {
    throw new Error('useBasementForm must be used within a BasementFormProvider');
  }
  return context;
}
