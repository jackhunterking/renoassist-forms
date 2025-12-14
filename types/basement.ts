// RenoAssist Basement Form Types
// These match the Xano API structure exactly

export interface XanoAnswer {
  answer: string | string[];
  credit: number;
  questionID: number;
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface BasementFormData {
  // Step 1: Basement Condition (questionID: 10)
  basementCondition: string | null;
  
  // Step 2: Renovation Scope (questionID: 11)
  renovationScope: string[];
  
  // Step 3: Separate Entrance (questionID: 13)
  separateEntrance: string | null;
  
  // Step 4: Plan/Design
  hasDesign: boolean | null;
  
  // Step 5: Urgency
  urgency: string | null;
  
  // Step 6: Additional Details
  additionalDetails: string;
  
  // Step 7: Location
  city: string;
  postalCode: string;
  geoPoint: GeoPoint | null;
  
  // Step 8: Email
  email: string;
  
  // Step 9: Contact
  homeownerName: string;
  phone: string;
}

export interface XanoPayload {
  category: number;
  homeownerName: string;
  email: string;
  phone: string;
  postalCode: string;
  city: string;
  urgency: string;
  hasDesign: boolean;
  additionalDetails: string;
  answers: XanoAnswer[];
  geoPoint: GeoPoint;
}

export interface RenoAssistInquiry {
  id: string;
  created_at: string;
  updated_at: string;
  homeowner_name: string;
  email: string;
  phone: string;
  city: string;
  postal_code: string;
  geo_lat: number | null;
  geo_lng: number | null;
  answers: XanoAnswer[];
  urgency: string;
  has_design: boolean;
  additional_details: string | null;
  category: number;
  xano_synced: boolean;
  xano_response: any | null;
  status: string;
}

// Question configurations with exact values for Xano
export const QUESTION_CONFIG = {
  BASEMENT_CONDITION: {
    questionID: 10,
    options: [
      { value: 'Fully Finished', credit: 0 },
      { value: 'Partially Finished', credit: 0 },
      { value: 'Unfinished', credit: 2 },
    ],
  },
  RENOVATION_SCOPE: {
    questionID: 11,
    options: [
      { value: 'Full Basement Remodel', credit: 1 },
      { value: 'Basement Bathroom Addition', credit: 1 },
      { value: 'Flooring & Carpeting', credit: 0 },
      { value: 'Drywall & Insulation', credit: 0 },
      { value: 'Separate Entrance Addition', credit: 0 },
      { value: 'Other', credit: 0 },
    ],
  },
  SEPARATE_ENTRANCE: {
    questionID: 13,
    options: [
      { value: 'Yes', credit: 1 },
      { value: 'No', credit: 0 },
      { value: 'Not, sure', credit: 0 },
    ],
  },
};

export const URGENCY_OPTIONS = [
  { label: 'I need it done ASAP', value: 'asap' },
  { label: 'Planning in the next 1-3 months', value: '1_3_months' },
];

export const DESIGN_OPTIONS = [
  { label: 'Yes, I already have plans/designs', value: true },
  { label: 'No, I need design help', value: false },
];
