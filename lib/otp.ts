import { apiFetch } from '@/lib/api';

export type OtpRequestResult = {
  message: string;
  testMode?: boolean;
  otpCode?: string;
};

export async function requestOtp(telephone: string): Promise<OtpRequestResult> {
  return apiFetch<OtpRequestResult>('/api/otp/request', {
    method: 'POST',
    jsonBody: { telephone },
  });
}

export async function verifyOtp(payload: { telephone: string; code: string }): Promise<{ verified: boolean }> {
  return apiFetch<{ verified: boolean }>('/api/otp/verify', {
    method: 'POST',
    jsonBody: payload,
  });
}
