import React from 'react';
import { useNavigate } from 'react-router-dom';
import StepContainer from '../../components/StepContainer';
import { useBasementForm } from '../../contexts/BasementFormContext';

export default function Step6Details() {
  const navigate = useNavigate();
  const { formData, updateFormData } = useBasementForm();

  const handleNext = () => {
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
        className="w-full h-40 p-4 rounded-xl border-2 border-slate-200 focus:border-primary focus:outline-none resize-none text-slate-700"
      />
    </StepContainer>
  );
}
