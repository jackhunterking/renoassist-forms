import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import StepContainer from '../../components/StepContainer';
import { useBasementForm } from '../../contexts/BasementFormContext';

export default function Step6Details() {
  const navigate = useNavigate();
  const { formData, updateFormData, isInitialized, trackStepView, completeStep } = useBasementForm();
  
  // Ref to prevent double-firing step view
  const hasTrackedStepView = useRef(false);

  // Track step view on mount
  useEffect(() => {
    if (isInitialized && !hasTrackedStepView.current) {
      hasTrackedStepView.current = true;
      trackStepView(6);
    }
  }, [isInitialized, trackStepView]);

  const handleNext = async () => {
    await completeStep(6);
    navigate('/basement/step-7');
  };

  return (
    <StepContainer
      currentStep={6}
      totalSteps={9}
      title="Additional project details"
      onNext={handleNext}
      isNextDisabled={false}
    >
      <textarea
        value={formData.additionalDetails}
        onChange={(e) => updateFormData({ additionalDetails: e.target.value })}
        placeholder="Enter your project details, vision, or any special requests (optional)"
        className="w-full h-40 p-4 rounded-xl border-2 border-slate-200 bg-white focus:border-primary focus:outline-none resize-none text-slate-700 placeholder:text-slate-400"
      />
    </StepContainer>
  );
}
