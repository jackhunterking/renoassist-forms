import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import StepContainer from '../../components/StepContainer';
import { useBasementForm } from '../../contexts/BasementFormContext';
import { loadGoogleMapsScript, isGoogleMapsLoaded } from '../../services/googleMapsLoader';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

export default function Step7Location() {
  const navigate = useNavigate();
  const { formData, updateFormData, isInitialized, trackStepView, completeStep } = useBasementForm();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const hasTrackedStepView = useRef(false);
  const hasInitialized = useRef(false);

  // Track step view on mount
  useEffect(() => {
    if (isInitialized && !hasTrackedStepView.current) {
      hasTrackedStepView.current = true;
      trackStepView(7);
    }
  }, [isInitialized, trackStepView]);

  // Pre-fill input when location is already selected (e.g., user returns to this step)
  useEffect(() => {
    if (inputRef.current && formData.city && formData.postalCode && !isLoading) {
      inputRef.current.value = `${formData.city}, ${formData.postalCode}`;
    }
  }, [formData.city, formData.postalCode, isLoading]);

  // Load Google Maps and initialize Autocomplete
  useEffect(() => {
    if (hasInitialized.current) return;
    
    if (!GOOGLE_MAPS_API_KEY) {
      setError('Google Maps API key is not configured');
      setIsLoading(false);
      return;
    }

    const initAutocomplete = async () => {
      try {
        await loadGoogleMapsScript(GOOGLE_MAPS_API_KEY);
        
        // Small delay to ensure DOM is ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (inputRef.current && isGoogleMapsLoaded()) {
          hasInitialized.current = true;
          
          // Create Autocomplete instance
          // Using 'geocode' type to allow both addresses and postal code searches
          autocompleteRef.current = new google.maps.places.Autocomplete(
            inputRef.current,
            {
              componentRestrictions: { country: 'ca' },
              fields: ['address_components', 'geometry', 'formatted_address'],
              types: ['geocode'],
            }
          );

          // Listen for place selection
          autocompleteRef.current.addListener('place_changed', handlePlaceChanged);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load Google Maps:', err);
        setError('Failed to load location services');
        setIsLoading(false);
      }
    };

    initAutocomplete();
  }, []);

  // Handle place selection from autocomplete
  const handlePlaceChanged = () => {
    if (!autocompleteRef.current) return;
    
    const place = autocompleteRef.current.getPlace();
    
    if (!place.geometry || !place.address_components) {
      console.log('No geometry or address_components in place result');
      return;
    }
    
    let city = '';
    let postalCode = '';
    
    // Extract city and postal code from address components
    for (const component of place.address_components) {
      const types = component.types;
      
      if (types.includes('locality')) {
        city = component.long_name;
      } else if (types.includes('sublocality_level_1') && !city) {
        city = component.long_name;
      } else if (types.includes('administrative_area_level_3') && !city) {
        city = component.long_name;
      }
      
      if (types.includes('postal_code')) {
        postalCode = component.long_name;
      }
    }
    
    // Get geo coordinates
    const geoPoint = place.geometry.location ? {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    } : null;
    
    console.log('Place selected:', { city, postalCode, geoPoint });
    
    // Update form data
    updateFormData({
      city,
      postalCode,
      geoPoint,
    });
    
    // Update input value to show selected location
    if (inputRef.current && city && postalCode) {
      inputRef.current.value = `${city}, ${postalCode}`;
    }
  };

  const handleNext = async () => {
    if (formData.postalCode && formData.city && formData.geoPoint) {
      await completeStep(7);
      navigate('/basement/step-8');
    }
  };

  const isValid = formData.postalCode && formData.city && formData.geoPoint;

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
        {error ? (
          <div className="p-4 bg-red-50 rounded-xl border border-red-200">
            <p className="text-red-700">{error}</p>
          </div>
        ) : (
          <>
            <input
              ref={inputRef}
              type="text"
              placeholder={isLoading ? "Loading..." : "Start typing your address..."}
              disabled={isLoading}
              className="w-full p-4 rounded-xl border-2 border-slate-200 bg-white focus:border-primary focus:outline-none text-slate-700 placeholder:text-slate-400 disabled:bg-slate-100"
            />
            
            {isLoading && (
              <p className="text-sm text-slate-500">Loading location services...</p>
            )}
          </>
        )}
      </div>
    </StepContainer>
  );
}
