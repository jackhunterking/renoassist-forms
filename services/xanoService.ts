import { BasementFormData, XanoPayload, XanoAnswer } from '../types/basement';

const XANO_ENDPOINT = 'https://xewg-ezlq-ir6t.n2.xano.io/api:hv7Xacah/projects/create';

/**
 * Sanitize a string to be used as a valid filename
 * Xano uses homeownerName + ".svg" as filename, so we must remove invalid characters
 */
function sanitizeForFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9\s-]/g, '')  // Remove special chars (periods, etc.)
    .replace(/\s+/g, '_')              // Replace spaces with underscores
    .trim();
}

/**
 * Format form data into Xano-compatible payload
 */
export function formatXanoPayload(
  formData: BasementFormData,
  answers: XanoAnswer[]
): XanoPayload {
  return {
    category: 1, // Basement category
    // Sanitize homeownerName for Xano filename compatibility (used as: homeownerName + ".svg")
    homeownerName: sanitizeForFilename(formData.homeownerName),
    email: formData.email,
    phone: formData.phone,
    postalCode: formData.postalCode,
    city: formData.city,
    urgency: formData.urgency || 'asap',
    hasDesign: formData.hasDesign ?? false,
    additionalDetails: formData.additionalDetails || '',
    answers: answers,
    geoPoint: formData.geoPoint || { lat: 0, lng: 0 },
  };
}

/**
 * Send form data to Xano API
 */
export async function sendToXano(payload: XanoPayload): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const response = await fetch(XANO_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Xano API error:', errorText);
      return { success: false, error: `Xano API error: ${response.status}` };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error sending to Xano:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Submit form to both Supabase and Xano
 */
export async function submitInquiry(
  formData: BasementFormData,
  answers: XanoAnswer[]
): Promise<{ success: boolean; error?: string }> {
  const payload = formatXanoPayload(formData, answers);
  
  // Log payload for debugging
  console.log('Submitting to Xano:', JSON.stringify(payload, null, 2));
  
  const result = await sendToXano(payload);
  return result;
}
