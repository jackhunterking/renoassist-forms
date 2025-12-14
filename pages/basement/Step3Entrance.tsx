import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import StepContainer from '../../components/StepContainer';
import { useBasementForm } from '../../contexts/BasementFormContext';
import { QUESTION_CONFIG } from '../../types/basement';

export default function Step3Entrance() {
  const navigate = useNavigate();
  const { formData, updateFormData, isInitialized, trackStepView, completeStep } = useBasementForm();
  
  // Ref to prevent double-firing step view
  const hasTrackedStepView = useRef(false);

  const options = QUESTION_CONFIG.SEPARATE_ENTRANCE.options;

  // Track step view on mount
  useEffect(() => {
    if (isInitialized && !hasTrackedStepView.current) {
      hasTrackedStepView.current = true;
      trackStepView(3);
    }
  }, [isInitialized, trackStepView]);

  const handleSelect = (value: string) => {
    updateFormData({ separateEntrance: value });
  };

  const handleNext = async () => {
    if (formData.separateEntrance) {
      await completeStep(3);
      navigate('/basement/step-4');
    }
  };

  return (
    <StepContainer
      currentStep={3}
      totalSteps={9}
      title="Do you need a separate entrance?"
      onNext={handleNext}
      isNextDisabled={!formData.separateEntrance}
    >
      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleSelect(option.value)}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
              formData.separateEntrance === option.value
                ? 'border-accent bg-accent/5 text-slate-900'
                : 'border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <span className="font-medium tracking-wide">{option.value}</span>
          </button>
        ))}
      </div>
    </StepContainer>
  );
}
