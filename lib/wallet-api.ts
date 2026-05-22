import { apiFetch } from '@/lib/api';

export type WalletDashboard = {
  solde_fcfa: number;
  transactions: Array<{
    id: string;
    type: string;
    montant: number;
    description?: string | null;
    created_at: string;
  }>;
  retraits: Array<{
    id: string;
    montant: number;
    statut: string;
    methode: string;
    created_at: string;
  }>;
};

export async function fetchMyWallet(token: string): Promise<WalletDashboard> {
  return apiFetch<WalletDashboard>('/api/wallet/me', { method: 'GET', token });
}

export async function requestWithdrawal(
  token: string,
  payload: { montant: number; methode: string; numero_compte: string },
): Promise<unknown> {
  return apiFetch('/api/wallet/retraits', {
    method: 'POST',
    token,
    jsonBody: payload,
  });
}
