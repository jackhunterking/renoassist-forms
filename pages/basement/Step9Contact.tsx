import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepContainer from '../../components/StepContainer';
import { useBasementForm } from '../../contexts/BasementFormContext';
import { createRenoAssistInquiry, updateXanoSyncStatus } from '../../services/databaseService';
import { submitInquiry } from '../../services/xanoService';

export default function Step9Contact() {
  const navigate = useNavigate();
  const { formData, updateFormData, getXanoAnswers, resetForm } = useBasementForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      // Clear form and navigate to confirmation
      resetForm();
      navigate('/basement/confirmation');
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
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Full name
          </label>
          <input
            type="text"
            value={formData.homeownerName}
            onChange={(e) => updateFormData({ homeownerName: e.target.value })}
            placeholder="Enter your full name"
            className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-primary focus:outline-none text-slate-700"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Phone number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => updateFormData({ phone: formatPhone(e.target.value) })}
            placeholder="Enter your phone number"
            className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-primary focus:outline-none text-slate-700"
          />
          <p className="text-sm text-accent mt-2">
            (Number Format ex: XXXXXXXXXX, no dash or special characters)
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 rounded-xl border border-red-200">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Terms */}
        <p className="text-sm text-slate-500">
          By clicking the submit, you agreed to our{' '}
          <a href="#" className="text-primary underline">terms and conditions</a>
          {' '}and{' '}
          <a href="#" className="text-primary underline">privacy policy</a>
        </p>
      </div>
    </StepContainer>
  );
}
