import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { BasementFormProvider } from './contexts/BasementFormContext';

// Basement Form Steps
import Step1Condition from './pages/basement/Step1Condition';
import Step2Renovate from './pages/basement/Step2Renovate';
import Step3Entrance from './pages/basement/Step3Entrance';
import Step4Design from './pages/basement/Step4Design';
import Step5Urgency from './pages/basement/Step5Urgency';
import Step6Details from './pages/basement/Step6Details';
import Step7Location from './pages/basement/Step7Location';
import Step8Email from './pages/basement/Step8Email';
import Step9Contact from './pages/basement/Step9Contact';
import Confirmation from './pages/basement/Confirmation';

/**
 * RenoAssist Forms App
 * 
 * Routes:
 * - / : Redirects to basement form step-1
 * - /basement/step-1 → Basement Condition (questionID: 10)
 * - /basement/step-2 → Renovation Scope (questionID: 11)
 * - /basement/step-3 → Separate Entrance (questionID: 13)
 * - /basement/step-4 → Plan/Design (hasDesign)
 * - /basement/step-5 → Project Urgency
 * - /basement/step-6 → Additional Details
 * - /basement/step-7 → Project Location
 * - /basement/step-8 → Email
 * - /basement/step-9 → Contact Details + Submit
 * - /basement/confirmation → Success page
 */
export default function App() {
  return (
    <BasementFormProvider>
      <Routes>
        {/* Root redirects to basement form with fresh start */}
        <Route path="/" element={<Navigate to="/basement/step-1?new=true" replace />} />
        
        {/* Basement Form Steps */}
        <Route path="/basement/step-1" element={<Step1Condition />} />
        <Route path="/basement/step-2" element={<Step2Renovate />} />
        <Route path="/basement/step-3" element={<Step3Entrance />} />
        <Route path="/basement/step-4" element={<Step4Design />} />
        <Route path="/basement/step-5" element={<Step5Urgency />} />
        <Route path="/basement/step-6" element={<Step6Details />} />
        <Route path="/basement/step-7" element={<Step7Location />} />
        <Route path="/basement/step-8" element={<Step8Email />} />
        <Route path="/basement/step-9" element={<Step9Contact />} />
        
        {/* Confirmation */}
        <Route path="/basement/confirmation" element={<Confirmation />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/basement/step-1" replace />} />
      </Routes>
    </BasementFormProvider>
  );
}
