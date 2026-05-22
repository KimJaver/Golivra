import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { apiFetch } from '@/lib/api';
import {
  fetchCourierMissions,
  fetchCourierProfile,
  setCourierAvailability,
  type CourierMission,
  type CourierProfile,
} from '@/lib/courier-api';

type AuthMeLivreur = {
  id: string;
  nom: string | null;
  telephone: string | null;
  email?: string | null;
  imageUrl?: string | null;
  role?: string | null;
  livreur?: CourierProfile['livreur'] | null;
  entreprise_logistique?: CourierProfile['entreprise'] | null;
};

type CourierContextValue = {
  profile: CourierProfile | null;
  missions: CourierMission[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  setDisponible: (value: boolean) => Promise<void>;
};

const CourierContext = createContext<CourierContextValue | null>(null);

function profileFromAuthMe(me: AuthMeLivreur): CourierProfile | null {
  if (!me.livreur) return null;
  return {
    livreur: me.livreur,
    utilisateur: {
      id: me.id,
      nom: me.nom,
      telephone: me.telephone,
      email: me.email ?? null,
      imageUrl: me.imageUrl ?? null,
    },
    entreprise: me.entreprise_logistique ?? null,
    resume: {
      missions_actives: 0,
      missions_aujourdhui: 0,
      total_historique: Number(me.livreur.nb_livraisons_total ?? 0),
      reussies_historique: Number(me.livreur.nb_livraisons_reussies ?? 0),
    },
  };
}

export function CourierProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<CourierProfile | null>(null);
  const [missions, setMissions] = useState<CourierMission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    const { getSessionToken } = await import('@/lib/auth');
    const token = await getSessionToken();
    if (!token) throw new Error('Session expirée.');

    let prof: CourierProfile | null = null;
    try {
      prof = await fetchCourierProfile(token);
    } catch (e) {
      const me = await apiFetch<AuthMeLivreur>('/api/auth/me', { method: 'GET', token });
      prof = profileFromAuthMe(me);
      if (!prof) {
        throw e instanceof Error ? e : new Error('Profil livreur introuvable.');
      }
    }

    let rows: CourierMission[] = [];
    try {
      rows = await fetchCourierMissions(token);
    } catch {
      rows = [];
    }

    const active = rows.filter((m) => m.statut !== 'livree' && m.statut !== 'annulee');
    prof = {
      ...prof,
      resume: {
        missions_actives: active.length,
        missions_aujourdhui: rows.filter((m) => {
          const d = new Date();
          d.setHours(0, 0, 0, 0);
          return m.created_at >= d.toISOString();
        }).length,
        total_historique: Number(prof.livreur.nb_livraisons_total ?? prof.resume?.total_historique ?? 0),
        reussies_historique: Number(prof.livreur.nb_livraisons_reussies ?? prof.resume?.reussies_historique ?? 0),
      },
    };

    setProfile(prof);
    setMissions(rows);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Chargement impossible.');
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  const setDisponible = useCallback(
    async (value: boolean) => {
      const { getSessionToken } = await import('@/lib/auth');
      const token = await getSessionToken();
      if (!token) throw new Error('Session expirée.');
      await setCourierAvailability(token, value);
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              livreur: { ...prev.livreur, est_disponible: value },
            }
          : prev,
      );
    },
    [],
  );

  const value = useMemo(
    () => ({
      profile,
      missions,
      loading,
      error,
      refresh: async () => {
        setLoading(true);
        try {
          await refresh();
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Erreur.');
          throw e;
        } finally {
          setLoading(false);
        }
      },
      setDisponible,
    }),
    [profile, missions, loading, error, refresh, setDisponible],
  );

  useEffect(() => {
    void load();
  }, [load]);

  return <CourierContext.Provider value={value}>{children}</CourierContext.Provider>;
}

export function useCourier() {
  const ctx = useContext(CourierContext);
  if (!ctx) throw new Error('useCourier doit être utilisé dans CourierProvider');
  return ctx;
}
