export interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  data: {
    access_token: string;
    token_type: string;
    expires_in: number;
    user: User;
  };
}

export interface ItineraryRequest {
  from_location: string;
  to_location: string;
  budget: number;
  dates: string;
  model: 'openai' | 'groq' | 'local';
}

export interface ItineraryDay {
  theme: string;
  morning: string;
  afternoon: string;
  evening: string;
  budget: number;
}

export interface ItinerarySummary {
  total_estimated_cost: number;
  remaining_budget: number;
}

export interface TravelItinerary {
  from_location: string;
  to_location: string;
  dates: string;
  budget: number;
}

export interface Itinerary {
  id?: string;
  travel_itinerary: TravelItinerary;
  days: ItineraryDay[];
  summary: ItinerarySummary;
  tips: string[];
  created_at?: string;
  model_used?: string;
}

export interface ItineraryResponse {
  status: string;
  message: string;
  data: Itinerary;
}

export interface ItinerariesResponse {
  status: string;
  message: string;
  data: {
    itineraries: Itinerary[];
    total: number;
  };
}

export interface ApiError {
  status: string;
  message: string;
  detail?: string;
}