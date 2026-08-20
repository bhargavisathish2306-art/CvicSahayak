import type {
  GrievanceStatusResponse,
  IntakeResponse,
  VerifyResponse,
} from '@/types';
import { mockIntake, mockGetStatus, mockVerify } from './mockApi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

export const isMockMode = !API_BASE_URL;

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export async function submitIntake(data: unknown): Promise<IntakeResponse> {
  if (isMockMode) {
    return mockIntake(data);
  }
  return request<IntakeResponse>(`${API_BASE_URL}/intake/web`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getGrievanceStatus(trackingId: string): Promise<GrievanceStatusResponse> {
  if (isMockMode) {
    return mockGetStatus(trackingId);
  }
  return request<GrievanceStatusResponse>(
    `${API_BASE_URL}/grievance/${encodeURIComponent(trackingId)}/status`,
  );
}

export async function verifyGrievance(
  trackingId: string,
  confirmed: boolean,
): Promise<VerifyResponse> {
  if (isMockMode) {
    return mockVerify(trackingId, confirmed);
  }
  return request<VerifyResponse>(
    `${API_BASE_URL}/grievance/${encodeURIComponent(trackingId)}/verify`,
    {
      method: 'POST',
      body: JSON.stringify({ confirmed }),
    },
  );
}
