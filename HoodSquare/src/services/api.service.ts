// src/services/api.service.ts
import { authService } from './auth.service';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

// For JSON requests (Skills, Claim, Alerts)
export const authHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${authService.getToken()}`,
});

// For multipart requests (Lost & Found image, Alert image)
// Do NOT include Content-Type — let browser set boundary
export const authMultipartHeaders = (): HeadersInit => ({
  Authorization: `Bearer ${authService.getToken()}`,
});

export { BASE_URL };