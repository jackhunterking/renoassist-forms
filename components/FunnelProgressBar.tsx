import React from 'react';

interface FunnelProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function FunnelProgressBar({ currentStep, totalSteps }: FunnelProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-slate-500 tracking-wide">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm font-semibold text-primary tabular-nums">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-accent rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
