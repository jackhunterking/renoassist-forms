import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import StepContainer from '../../components/StepContainer';
import { useBasementForm } from '../../contexts/BasementFormContext';
import { URGENCY_OPTIONS } from '../../types/basement';

export default function Step5Urgency() {
  const navigate = useNavigate();
  const { formData, updateFormData, isInitialized, trackStepView, completeStep } = useBasementForm();
  
  // Ref to prevent double-firing step view
  const hasTrackedStepView = useRef(false);

  // Track step view on mount
  useEffect(() => {
    if (isInitialized && !hasTrackedStepView.current) {
      hasTrackedStepView.current = true;
      trackStepView(5);
    }
  }, [isInitialized, trackStepView]);

  const handleSelect = (value: string) => {
    updateFormData({ urgency: value });
  };

  const handleNext = async () => {
    if (formData.urgency) {
      await completeStep(5);
      navigate('/basement/step-6');
    }
  };

  return (
    <StepContainer
      currentStep={5}
      totalSteps={9}
      title="Project urgency"
      onNext={handleNext}
      isNextDisabled={!formData.urgency}
    >
      <div className="space-y-3">
        {URGENCY_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleSelect(option.value)}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
              formData.urgency === option.value
                ? 'border-accent bg-accent/5 text-slate-900'
                : 'border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <span className="font-medium tracking-wide">{option.label}</span>
          </button>
        ))}
      </div>
    </StepContainer>
  );
}
