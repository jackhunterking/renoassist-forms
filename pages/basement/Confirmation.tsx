import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackLead } from '../../services/metaCapiService';
import { completeFunnelSession, clearFunnelData } from '../../services/funnelSessionService';

interface LocationState {
  email?: string;
  fullName?: string;
  phone?: string;
  sessionId?: string;
}

export default function Confirmation() {
  const location = useLocation();
  const state = location.state as LocationState | null;
  
  // Extract user data from navigation state
  const email = state?.email || '';
  const fullName = state?.fullName || '';
  const phone = state?.phone || '';
  const sessionId = state?.sessionId || '';
  
  // Ref to ensure Lead event only fires once
  const hasTrackedLead = useRef(false);

  // Track Lead event on confirmation page load
  useEffect(() => {
    if (sessionId && email && !hasTrackedLead.current) {
      hasTrackedLead.current = true;
      
      // Parse name into first/last
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || undefined;
      
      // Track Lead event with full user data
      trackLead(
        sessionId,
        'basement',
        {
          email,
          phone: phone || undefined,
          firstName: firstName || undefined,
          lastName,
        },
        'RenoAssist - Basement Renovation Complete'
      );
      
      // Finalize the funnel session after tracking
      completeFunnelSession(sessionId);
      clearFunnelData('basement');
    }
  }, [sessionId, email, fullName, phone]);

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

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-lg w-full text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-4">
            Thank You!
          </h1>

          {/* Message */}
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Your basement renovation inquiry has been submitted successfully. 
            Our contractors will review your project and get back to you shortly.
          </p>

          {/* What's Next Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-left mb-8">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 mb-4">What happens next?</h2>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">Project Review</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">Our team will review your project details and requirements.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">Contractor Matching</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">We'll match you with qualified contractors in your area.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">Get Your Quotes</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">Receive competitive quotes from verified professionals.</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <a 
            href="https://renoassist.io" 
            className="inline-block px-8 py-4 bg-primary text-white font-medium tracking-wide rounded-xl hover:bg-secondary transition-colors"
          >
            Return to RenoAssist
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 px-6 border-t border-slate-200 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} RenoAssist. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
