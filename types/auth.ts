// src/types/auth.ts
export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  asesor_id: string;
}

export interface AsesorInfo {
  _id?: string;
  email: string;
  full_name: string;
  is_active: boolean;
  role?: string;
}

export interface RegisterAsesorRequest {
  email: string;
  password: string;
  full_name: string;
  role?: "asesor" | "admin";
}

export interface RegisterAsesorResponse {
  message: string;
  asesor_id: string;
  email: string;
  full_name: string;
  role: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}
