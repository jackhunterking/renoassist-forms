import React from 'react';
import { useNavigate } from 'react-router-dom';
import StepContainer from '../../components/StepContainer';
import { useBasementForm } from '../../contexts/BasementFormContext';
import { QUESTION_CONFIG } from '../../types/basement';

export default function Step1Condition() {
  const navigate = useNavigate();
  const { formData, updateFormData } = useBasementForm();

  const options = QUESTION_CONFIG.BASEMENT_CONDITION.options;

  const handleSelect = (value: string) => {
    updateFormData({ basementCondition: value });
  };

  const handleNext = () => {
    if (formData.basementCondition) {
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
