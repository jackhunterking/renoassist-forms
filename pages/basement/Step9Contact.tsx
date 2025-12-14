import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import StepContainer from '../../components/StepContainer';
import { useBasementForm } from '../../contexts/BasementFormContext';
import { createRenoAssistInquiry, updateXanoSyncStatus } from '../../services/databaseService';
import { submitInquiry } from '../../services/xanoService';

export default function Step9Contact() {
  const navigate = useNavigate();
  const { formData, updateFormData, getXanoAnswers, resetForm, sessionId, isInitialized, trackStepView, completeStep } = useBasementForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Ref to prevent double-firing step view
  const hasTrackedStepView = useRef(false);

  // Track step view on mount
  useEffect(() => {
    if (isInitialized && !hasTrackedStepView.current) {
      hasTrackedStepView.current = true;
      trackStepView(9);
    }
  }, [isInitialized, trackStepView]);

  const isValidPhone = (phone: string) => {
    // Phone should be 10 digits, no dashes or special characters
    return /^\d{10}$/.test(phone.replace(/\D/g, ''));
  };

  const formatPhone = (value: string) => {
    // Remove all non-digits
    return value.replace(/\D/g, '').slice(0, 10);
  };

  const isFormValid = formData.homeownerName.trim() !== '' && isValidPhone(formData.phone);

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const answers = getXanoAnswers();
      
      // Save to Supabase first
      let inquiryId: string | null = null;
      try {
        const inquiry = await createRenoAssistInquiry(formData, answers);
        inquiryId = inquiry?.id ?? null;
      } catch (dbError) {
        console.error('Database save error:', dbError);
        // Continue with Xano even if Supabase fails
      }

      // Send to Xano
      const xanoResult = await submitInquiry(formData, answers);
      
      if (!xanoResult.success) {
        throw new Error(xanoResult.error || 'Failed to submit to Xano');
      }

      // Update Supabase with Xano sync status
      if (inquiryId) {
        await updateXanoSyncStatus(inquiryId, true, xanoResult.data);
      }

      // Track step completion before navigating
      await completeStep(9);

      // Capture user data before reset for confirmation page tracking
      const userData = {
        email: formData.email,
        fullName: formData.homeownerName,
        phone: formData.phone,
        sessionId: sessionId,
      };

      // Clear form and navigate to confirmation with user data
      resetForm();
      navigate('/basement/confirmation', {
        state: userData,
      });
    } catch (err) {
      console.error('Submission error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StepContainer
      currentStep={9}
      totalSteps={9}
      title="Contact details"
      subtitle="Contractors will use this to follow up and confirm project details"
      onNext={handleSubmit}
      nextLabel="Submit"
      isNextDisabled={!isFormValid}
      isSubmitting={isSubmitting}
    >
      <div className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium tracking-wide text-slate-600 mb-2">
            Full name
          </label>
          <input
            type="text"
            value={formData.homeownerName}
            onChange={(e) => updateFormData({ homeownerName: e.target.value })}
            placeholder="Enter your full name"
            className="w-full p-4 rounded-xl border-2 border-slate-200 bg-white focus:border-primary focus:outline-none text-slate-700 placeholder:text-slate-400"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium tracking-wide text-slate-600 mb-2">
            Phone number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => updateFormData({ phone: formatPhone(e.target.value) })}
            placeholder="Enter your phone number"
            className="w-full p-4 rounded-xl border-2 border-slate-200 bg-white focus:border-primary focus:outline-none text-slate-700 placeholder:text-slate-400"
          />
          <p className="text-sm text-accent mt-2 leading-relaxed">
            (Number Format ex: XXXXXXXXXX, no dash or special characters)
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 rounded-xl border border-red-200">
            <p className="text-red-700 text-sm leading-relaxed">{error}</p>
          </div>
        )}

        {/* Terms */}
        <p className="text-sm text-slate-500 leading-relaxed">
          By clicking the submit, you agreed to our{' '}
          <a href="#" className="text-primary underline hover:no-underline">terms and conditions</a>
          {' '}and{' '}
          <a href="#" className="text-primary underline hover:no-underline">privacy policy</a>
        </p>
      </div>
    </StepContainer>
  );
}
