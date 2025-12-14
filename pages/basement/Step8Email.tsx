import React from 'react';
import { useNavigate } from 'react-router-dom';
import StepContainer from '../../components/StepContainer';
import { useBasementForm } from '../../contexts/BasementFormContext';

export default function Step8Email() {
  const navigate = useNavigate();
  const { formData, updateFormData } = useBasementForm();

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleNext = () => {
    if (isValidEmail(formData.email)) {
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
        className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-primary focus:outline-none text-slate-700"
      />
    </StepContainer>
  );
}
