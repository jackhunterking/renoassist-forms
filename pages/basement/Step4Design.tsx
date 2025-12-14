import React from 'react';
import { useNavigate } from 'react-router-dom';
import StepContainer from '../../components/StepContainer';
import { useBasementForm } from '../../contexts/BasementFormContext';
import { DESIGN_OPTIONS } from '../../types/basement';

export default function Step4Design() {
  const navigate = useNavigate();
  const { formData, updateFormData } = useBasementForm();

  const handleSelect = (value: boolean) => {
    updateFormData({ hasDesign: value });
  };

  const handleNext = () => {
    if (formData.hasDesign !== null) {
      navigate('/basement/step-5');
    }
  };

  return (
    <StepContainer
      currentStep={4}
      totalSteps={9}
      title="Do you already have a plan/design?"
      onNext={handleNext}
      isNextDisabled={formData.hasDesign === null}
    >
      <div className="space-y-3">
        {DESIGN_OPTIONS.map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() => handleSelect(option.value)}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
              formData.hasDesign === option.value
                ? 'border-accent bg-accent/5 text-slate-900'
                : 'border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <span className="font-medium">{option.label}</span>
          </button>
        ))}
      </div>
    </StepContainer>
  );
}
