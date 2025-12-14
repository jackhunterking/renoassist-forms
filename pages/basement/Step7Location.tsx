import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepContainer from '../../components/StepContainer';
import { useBasementForm } from '../../contexts/BasementFormContext';

export default function Step7Location() {
  const navigate = useNavigate();
  const { formData, updateFormData } = useBasementForm();
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddressChange = async (value: string) => {
    setAddress(value);
    
    // Extract postal code from input (Canadian format: A1A 1A1 or A1A1A1)
    const postalCodeMatch = value.match(/[A-Za-z]\d[A-Za-z][\s]?\d[A-Za-z]\d/i);
    if (postalCodeMatch) {
      const postalCode = postalCodeMatch[0].toUpperCase();
      updateFormData({ postalCode });
      
      // Try to geocode and get city
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&countrycodes=ca&postalcode=${encodeURIComponent(postalCode)}&limit=1`
        );
        const data = await response.json();
        
        if (data && data.length > 0) {
          const result = data[0];
          const cityMatch = result.display_name.split(',');
          const city = cityMatch[1]?.trim() || cityMatch[0]?.trim() || '';
          
          updateFormData({
            city: city,
            geoPoint: {
              lat: parseFloat(result.lat),
              lng: parseFloat(result.lon),
            },
          });
        }
      } catch (error) {
        console.error('Geocoding error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleNext = () => {
    if (formData.postalCode && formData.city) {
      navigate('/basement/step-8');
    }
  };

  const isValid = formData.postalCode && formData.city;

  return (
    <StepContainer
      currentStep={7}
      totalSteps={9}
      title="Project location"
      subtitle="We use this to check contractor coverage"
      onNext={handleNext}
      isNextDisabled={!isValid}
    >
      <div className="space-y-4">
        <input
          type="text"
          value={address}
          onChange={(e) => handleAddressChange(e.target.value)}
          placeholder="Enter your postal code (e.g., M4S 1A1)"
          className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-primary focus:outline-none text-slate-700"
        />
        
        {isLoading && (
          <p className="text-sm text-slate-500">Looking up location...</p>
        )}
        
        {formData.city && formData.postalCode && (
          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
            <p className="text-green-800 font-medium">
              📍 {formData.city}, {formData.postalCode}
            </p>
          </div>
        )}
      </div>
    </StepContainer>
  );
}
