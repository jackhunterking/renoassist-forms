import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import StepContainer from '../../components/StepContainer';
import { useBasementForm } from '../../contexts/BasementFormContext';

export default function Step8Email() {
  const navigate = useNavigate();
  const { formData, updateFormData, isInitialized, trackStepView, completeStep } = useBasementForm();
  
  // Ref to prevent double-firing step view
  const hasTrackedStepView = useRef(false);

  // Track step view on mount
  useEffect(() => {
    if (isInitialized && !hasTrackedStepView.current) {
      hasTrackedStepView.current = true;
      trackStepView(8);
    }
  }, [isInitialized, trackStepView]);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleNext = async () => {
    if (isValidEmail(formData.email)) {
      await completeStep(8);
      navigate('/basement/step-9');
    }
  };

  return (
    <StepContainer
      currentStep={8}
      totalSteps={9}
      title="Email address"
      subtitle="Your quotations will be sent to your email address"
      onNext={handleNext}
      isNextDisabled={!isValidEmail(formData.email)}
    >
      <input
        type="email"
        value={formData.email}
        onChange={(e) => updateFormData({ email: e.target.value })}
        placeholder="Enter your email address"
        className="w-full p-4 rounded-xl border-2 border-slate-200 bg-white focus:border-primary focus:outline-none text-slate-700 placeholder:text-slate-400"
      />
    </StepContainer>
  );
}
