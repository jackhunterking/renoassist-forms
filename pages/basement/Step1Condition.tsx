import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import StepContainer from '../../components/StepContainer';
import { useBasementForm } from '../../contexts/BasementFormContext';
import { QUESTION_CONFIG } from '../../types/basement';
import { trackViewContent } from '../../services/metaCapiService';

export default function Step1Condition() {
  const navigate = useNavigate();
  const { formData, updateFormData, sessionId, isInitialized, trackStepView, completeStep } = useBasementForm();
  
  // Refs to prevent double-firing events
  const hasTrackedViewContent = useRef(false);
  const hasTrackedStepView = useRef(false);

  const options = QUESTION_CONFIG.BASEMENT_CONDITION.options;

  // Track step view on mount
  useEffect(() => {
    if (isInitialized && !hasTrackedStepView.current) {
      hasTrackedStepView.current = true;
      trackStepView(1);
    }
  }, [isInitialized, trackStepView]);

  // Track Meta CAPI ViewContent event (fire once per session on funnel start)
  useEffect(() => {
    if (isInitialized && sessionId && !hasTrackedViewContent.current) {
      hasTrackedViewContent.current = true;
      trackViewContent(sessionId, 'basement', 'RenoAssist - Basement Renovation Inquiry');
    }
  }, [isInitialized, sessionId]);

  const handleSelect = (value: string) => {
    updateFormData({ basementCondition: value });
  };

  const handleNext = async () => {
    if (formData.basementCondition) {
      await completeStep(1);
      navigate('/basement/step-2');
    }
  };

  return (
    <StepContainer
      currentStep={1}
      totalSteps={9}
      title="What is the current condition of your basement?"
      onNext={handleNext}
      isNextDisabled={!formData.basementCondition}
      showBack={false}
    >
      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleSelect(option.value)}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
              formData.basementCondition === option.value
                ? 'border-accent bg-accent/5 text-slate-900'
                : 'border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <span className="font-medium">{option.value}</span>
          </button>
        ))}
      </div>
    </StepContainer>
  );
}
