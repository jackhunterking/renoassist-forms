import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import StepContainer from '../../components/StepContainer';
import { useBasementForm } from '../../contexts/BasementFormContext';
import { QUESTION_CONFIG } from '../../types/basement';

export default function Step2Renovate() {
  const navigate = useNavigate();
  const { formData, updateFormData, isInitialized, trackStepView, completeStep } = useBasementForm();
  
  // Ref to prevent double-firing step view
  const hasTrackedStepView = useRef(false);

  const options = QUESTION_CONFIG.RENOVATION_SCOPE.options;

  // Track step view on mount
  useEffect(() => {
    if (isInitialized && !hasTrackedStepView.current) {
      hasTrackedStepView.current = true;
      trackStepView(2);
    }
  }, [isInitialized, trackStepView]);

  const handleToggle = (value: string) => {
    const current = formData.renovationScope;
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFormData({ renovationScope: updated });
  };

  const handleNext = async () => {
    if (formData.renovationScope.length > 0) {
      await completeStep(2);
      navigate('/basement/step-3');
    }
  };

  return (
    <StepContainer
      currentStep={2}
      totalSteps={9}
      title="What are you looking to renovate?"
      subtitle="(Check all that applies)"
      onNext={handleNext}
      isNextDisabled={formData.renovationScope.length === 0}
    >
      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleToggle(option.value)}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
              formData.renovationScope.includes(option.value)
                ? 'border-accent bg-accent/5 text-slate-900'
                : 'border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
              formData.renovationScope.includes(option.value)
                ? 'border-accent bg-accent'
                : 'border-slate-300'
            }`}>
              {formData.renovationScope.includes(option.value) && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="font-medium tracking-wide">{option.value}</span>
          </button>
        ))}
      </div>
    </StepContainer>
  );
}
