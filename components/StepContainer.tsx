import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import FunnelProgressBar from './FunnelProgressBar';

interface StepContainerProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  onNext?: () => void;
  onBack?: () => void;
  nextLabel?: string;
  backLabel?: string;
  isNextDisabled?: boolean;
  showBack?: boolean;
  isSubmitting?: boolean;
}

export default function StepContainer({
  children,
  currentStep,
  totalSteps,
  title,
  subtitle,
  onNext,
  onBack,
  nextLabel = 'Next',
  backLabel = 'Back',
  isNextDisabled = false,
  showBack = true,
  isSubmitting = false,
}: StepContainerProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header with Logo */}
      <header className="w-full bg-white border-b border-slate-200 py-4 px-6">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <img 
            src="/assets/logomark.png" 
            alt="RenoAssist" 
            className="h-10 w-auto"
          />
          <span className="text-xl font-semibold tracking-tight text-primary">RenoAssist</span>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full max-w-2xl mx-auto px-6 pt-6">
        <FunnelProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          {/* Title */}
          <h1 className="text-2xl md:text-[28px] font-semibold tracking-tight text-slate-900 mb-2 leading-tight">
            {title}
          </h1>
          
          {/* Subtitle */}
          {subtitle && (
            <p className="text-slate-500 mb-8 leading-relaxed">{subtitle}</p>
          )}

          {/* Form Content */}
          <div className="mb-8">
            {children}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            {showBack && currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 py-4 px-6 rounded-xl border-2 border-slate-300 text-slate-700 font-medium tracking-wide hover:bg-slate-50 transition-colors"
              >
                {backLabel}
              </button>
            )}
            
            {onNext && (
              <button
                type="button"
                onClick={onNext}
                disabled={isNextDisabled || isSubmitting}
                className={`flex-1 py-4 px-6 rounded-xl font-medium tracking-wide transition-all ${
                  isNextDisabled || isSubmitting
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-secondary'
                }`}
              >
                {isSubmitting ? 'Submitting...' : nextLabel}
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 px-6 border-t border-slate-200 bg-white">
        <div className="max-w-2xl mx-auto text-center space-y-2">
          <a 
            href="/basement/step-1?new=true" 
            className="text-slate-400 text-sm hover:text-primary transition-colors"
          >
            Start Over
          </a>
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} RenoAssist. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
