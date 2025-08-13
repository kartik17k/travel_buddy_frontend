/// <reference types="vite/client" />
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  ItineraryRequest, 
  ItineraryResponse,
  ItinerariesResponse
} from '../types';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;


class ApiError extends Error {
  constructor(public status: number, public message: string, public details?: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  
  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.message || `HTTP error! status: ${response.status}`,
      data.detail
    );
  }
  
  return data;
}

// Helper function to get auth headers
function getAuthHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
}

export const authApi = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(credentials),
    });
    
    return handleResponse<AuthResponse>(response);
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    
    return handleResponse<AuthResponse>(response);
  },
};

export const itineraryApi = {
  async generate(request: ItineraryRequest, token?: string): Promise<ItineraryResponse> {
    const response = await fetch(`${API_BASE_URL}/generate_itinerary`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(request),
    });
    
    return handleResponse<ItineraryResponse>(response);
  },

  async getMyItineraries(token: string): Promise<ItinerariesResponse> {
    const response = await fetch(`${API_BASE_URL}/my-itineraries`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    
    return handleResponse<ItinerariesResponse>(response);
  },

  async getItinerary(id: string, token: string): Promise<ItineraryResponse> {
    const response = await fetch(`${API_BASE_URL}/itinerary/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    
    return handleResponse<ItineraryResponse>(response);
  },

  async deleteItinerary(id: string, token: string): Promise<{ status: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/itinerary/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    
    return handleResponse<{ status: string; message: string }>(response);
  },
};

export const healthApi = {
  async check(): Promise<{ status: string; timestamp: string; version: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    return handleResponse(response);
  },
};