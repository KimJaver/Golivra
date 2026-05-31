import AsyncStorage from '@react-native-async-storage/async-storage';

import type { AuthSession } from '@/lib/auth';

const SESSION_SNAPSHOT_KEY = 'golivra_session_snapshot_v1';

export type SessionSnapshot = {
  token: string;
  userId: string;
  nom: string | null;
  telephone: string;
  role: string | null;
  roleId: string | number;
  savedAt: string;
};

let memorySnapshot: SessionSnapshot | null = null;
let snapshotHydrated = false;

export function getSessionSnapshotSync(): SessionSnapshot | null {
  return memorySnapshot;
}

export async function hydrateSessionSnapshot(): Promise<SessionSnapshot | null> {
  if (snapshotHydrated) return memorySnapshot;
  try {
    const raw = await AsyncStorage.getItem(SESSION_SNAPSHOT_KEY);
    if (raw) {
      memorySnapshot = JSON.parse(raw) as SessionSnapshot;
    }
  } catch {
    memorySnapshot = null;
  }
  snapshotHydrated = true;
  return memorySnapshot;
}

export async function saveSessionSnapshot(session: AuthSession): Promise<void> {
  const snap: SessionSnapshot = {
    token: session.token,
    userId: session.user.id,
    nom: session.user.nom,
    telephone: session.user.telephone,
    role: session.user.role ?? null,
    roleId: session.user.roleId,
    savedAt: new Date().toISOString(),
  };
  memorySnapshot = snap;
  snapshotHydrated = true;
  await AsyncStorage.setItem(SESSION_SNAPSHOT_KEY, JSON.stringify(snap));
}

export async function clearSessionSnapshot(): Promise<void> {
  memorySnapshot = null;
  snapshotHydrated = true;
  try {
    await AsyncStorage.removeItem(SESSION_SNAPSHOT_KEY);
  } catch {
    /* ignore */
  }
}
