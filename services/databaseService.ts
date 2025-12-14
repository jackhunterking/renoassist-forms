import { supabase } from './supabaseClient';
import { BasementFormData, XanoAnswer, RenoAssistInquiry } from '../types/basement';

/**
 * Save a RenoAssist basement inquiry to Supabase
 */
export async function createRenoAssistInquiry(
  formData: BasementFormData,
  answers: XanoAnswer[]
): Promise<RenoAssistInquiry | null> {
  if (!supabase) {
    console.warn('Supabase not configured, returning null');
    return null;
  }

  const { data, error } = await supabase
    .from('renoassist_inquiries')
    .insert({
      homeowner_name: formData.homeownerName,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      postal_code: formData.postalCode,
      geo_lat: formData.geoPoint?.lat ?? null,
      geo_lng: formData.geoPoint?.lng ?? null,
      answers: answers,
      urgency: formData.urgency,
      has_design: formData.hasDesign ?? false,
      additional_details: formData.additionalDetails || null,
      category: 1,
      xano_synced: false,
      status: 'submitted',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating RenoAssist inquiry:', error);
    throw new Error(`Failed to save inquiry: ${error.message}`);
  }

  return data as RenoAssistInquiry;
}

/**
 * Update the Xano sync status after successful API call
 */
export async function updateXanoSyncStatus(
  inquiryId: string,
  success: boolean,
  response?: any
): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase
    .from('renoassist_inquiries')
    .update({
      xano_synced: success,
      xano_response: response ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', inquiryId);

  if (error) {
    console.error('Error updating Xano sync status:', error);
  }
}
