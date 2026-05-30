import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { EnterprisePublic, ProductPublic } from '@/lib/catalog';
import type { EnterpriseCategory } from '@/lib/enterprise';
import { EnterprisePublicSchema, ProductPublicSchema } from '@/lib/schemas';
import { z } from 'zod';

export function useEnterprises(type: 'restaurant' | 'boutique' | 'all') {
  return useQuery({
    queryKey: ['enterprises', type],
    queryFn: async () => {
      const url = type === 'all' ? '/api/enterprises' : `/api/enterprises?type=${type}`;
      return apiFetch<EnterprisePublic[]>(url, {
        method: 'GET',
        schema: z.array(EnterprisePublicSchema),
      });
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useEnterpriseCategories(type: 'restaurant' | 'boutique') {
  return useQuery({
    queryKey: ['categories', type],
    queryFn: async () => {
      return apiFetch<EnterpriseCategory[]>(`/api/enterprises/categories/${type}`, { method: 'GET' });
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useEnterpriseDetails(id: string) {
  return useQuery({
    queryKey: ['enterprise', id],
    queryFn: async () => {
      return apiFetch<EnterprisePublic>(`/api/enterprises/${id}`, {
        method: 'GET',
        schema: EnterprisePublicSchema,
      });
    },
    staleTime: 1000 * 60 * 3,
    enabled: !!id,
  });
}

export function useEnterpriseProducts(enterpriseId: string) {
  return useQuery({
    queryKey: ['products', enterpriseId],
    queryFn: async () => {
      return apiFetch<ProductPublic[]>(`/api/products/enterprise/${enterpriseId}`, {
        method: 'GET',
        schema: z.array(ProductPublicSchema),
      });
    },
    staleTime: 1000 * 60 * 1.5,
    enabled: !!enterpriseId,
  });
}
