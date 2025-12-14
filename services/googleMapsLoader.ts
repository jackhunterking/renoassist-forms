// Google Maps Script Loader
// Dynamically loads the Google Maps JavaScript API with Places library

declare global {
  interface Window {
    google: typeof google;
  }
}

let loadPromise: Promise<void> | null = null;

/**
 * Load the Google Maps JavaScript API with Places library
 * Only loads once, subsequent calls return the same promise
 */
export function loadGoogleMapsScript(apiKey: string): Promise<void> {
  // Return existing promise if already loading/loaded
  if (loadPromise) {
    return loadPromise;
  }

  // If already loaded, resolve immediately
  if (window.google?.maps?.places) {
    return Promise.resolve();
  }

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      resolve();
    };
    
    script.onerror = () => {
      loadPromise = null; // Reset so it can be retried
      reject(new Error('Failed to load Google Maps script'));
    };
    
    document.head.appendChild(script);
  });

  return loadPromise;
}

/**
 * Check if Google Maps is loaded
 */
export function isGoogleMapsLoaded(): boolean {
  return !!(window.google?.maps?.places);
}
