import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'golivra_cart_v1';

type CartListener = () => void;
const cartListeners = new Set<CartListener>();

/** Nombre total d’articles (somme des quantités). */
export function getCartItemCount(cart: CartState | null): number {
  if (!cart?.segments?.length) return 0;
  return cart.segments.reduce(
    (sum, seg) => sum + seg.lines.reduce((lineSum, l) => lineSum + l.quantite, 0),
    0
  );
}

export function subscribeCart(listener: CartListener): () => void {
  cartListeners.add(listener);
  return () => cartListeners.delete(listener);
}

function notifyCartChanged(): void {
  cartListeners.forEach((fn) => fn());
}

export type CartLine = {
  productId: string;
  nom: string;
  prixUnitaire: number;
  quantite: number;
  /** Stock observé au dernier ajout (plafonne les quantités dans le panier). */
  stockSnapshot?: number;
};

export type CartSegment = {
  enterpriseId: string;
  enterpriseNom: string;
  enterpriseType?: 'restaurant' | 'boutique';
  lines: CartLine[];
};

export type CartState = {
  segments: CartSegment[];
};

type LegacyCartV1 = {
  enterpriseId: string;
  enterpriseNom: string;
  lines: unknown;
};

function parseLines(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (l): l is CartLine =>
      typeof l === 'object' &&
      l !== null &&
      typeof (l as CartLine).productId === 'string' &&
      typeof (l as CartLine).nom === 'string' &&
      typeof (l as CartLine).prixUnitaire === 'number' &&
      typeof (l as CartLine).quantite === 'number'
  );
}

function migrateFromV1(o: LegacyCartV1): CartState | null {
  const lines = parseLines(o.lines);
  if (lines.length === 0 || typeof o.enterpriseId !== 'string') return null;
  return {
    segments: [
      {
        enterpriseId: o.enterpriseId,
        enterpriseNom: typeof o.enterpriseNom === 'string' ? o.enterpriseNom : 'Commerce',
        lines,
      },
    ],
  };
}

export async function loadCart(): Promise<CartState | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return null;
    const obj = parsed as Record<string, unknown>;

    if (Array.isArray(obj.segments)) {
      const segments: CartSegment[] = [];
      for (const s of obj.segments) {
        if (!s || typeof s !== 'object') continue;
        const seg = s as Record<string, unknown>;
        if (typeof seg.enterpriseId !== 'string') continue;
        const lines = parseLines(seg.lines);
        if (lines.length === 0) continue;
        const et = seg.enterpriseType;
        segments.push({
          enterpriseId: seg.enterpriseId,
          enterpriseNom: typeof seg.enterpriseNom === 'string' ? seg.enterpriseNom : 'Commerce',
          enterpriseType: et === 'restaurant' || et === 'boutique' ? et : undefined,
          lines,
        });
      }
      if (segments.length === 0) return null;
      return { segments };
    }

    if (typeof obj.enterpriseId === 'string' && Array.isArray(obj.lines)) {
      return migrateFromV1(obj as LegacyCartV1);
    }
    return null;
  } catch {
    return null;
  }
}

export async function saveCart(state: CartState | null): Promise<void> {
  if (!state) {
    await AsyncStorage.removeItem(STORAGE_KEY);
    notifyCartChanged();
    void pushCartToServer(null);
    return;
  }
  const segments = state.segments.filter((s) => s.lines.length > 0);
  if (segments.length === 0) {
    await AsyncStorage.removeItem(STORAGE_KEY);
    notifyCartChanged();
    void pushCartToServer(null);
    return;
  }
  const payload = { segments };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  notifyCartChanged();
  void pushCartToServer(payload);
}

async function pushCartToServer(state: CartState | null): Promise<void> {
  try {
    const { getSessionToken } = await import('@/lib/auth');
    const token = await getSessionToken();
    if (!token) return;
    const { pushRemoteCart, clearRemoteCart } = await import('@/lib/cart-api');
    if (!state?.segments?.length) {
      await clearRemoteCart(token);
    } else {
      await pushRemoteCart(token, state.segments);
    }
  } catch {
    /* panier local reste source de vérité hors ligne */
  }
}

/** Charge le panier serveur et fusionne avec le local (après connexion). */
export async function syncCartWithServer(): Promise<void> {
  try {
    const { getSessionToken } = await import('@/lib/auth');
    const token = await getSessionToken();
    if (!token) return;
    const { fetchRemoteCart } = await import('@/lib/cart-api');
    const { mergeCartStates } = await import('@/lib/cart-api');
    const local = await loadCart();
    const remote = await fetchRemoteCart(token);
    const merged = mergeCartStates(local, remote.segments?.length ? { segments: remote.segments } : null);
    if (merged) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      notifyCartChanged();
      await pushCartToServer(merged);
    } else if (local) {
      await pushCartToServer(local);
    }
  } catch {
    /* ignore */
  }
}

export function segmentSubtotal(seg: CartSegment): number {
  return seg.lines.reduce((sum, l) => sum + l.prixUnitaire * l.quantite, 0);
}

export function cartTotal(state: CartState): number {
  return state.segments.reduce((sum, s) => sum + segmentSubtotal(s), 0);
}

function mergeOrIncrement(
  lines: CartLine[],
  productId: string,
  nom: string,
  prixUnitaire: number,
  stockAvailable: number
): CartLine[] {
  const cap = Math.max(0, Math.floor(stockAvailable));
  const idx = lines.findIndex((l) => l.productId === productId);
  if (idx >= 0) {
    if (cap <= 0) return lines;
    const next = [...lines];
    next[idx] = {
      ...next[idx],
      quantite: Math.min(next[idx].quantite + 1, cap),
      stockSnapshot: stockAvailable,
    };
    return next;
  }
  if (cap <= 0) return lines;
  return [...lines, { productId, nom, prixUnitaire, quantite: 1, stockSnapshot: stockAvailable }];
}

/** Ajoute une unité au panier (plusieurs commerces autorisés : un segment par entreprise). */
export function addProductToCartPrompt(params: {
  enterpriseId: string;
  enterpriseNom: string;
  enterpriseType?: 'restaurant' | 'boutique';
  productId: string;
  nom: string;
  prixUnitaire: number;
  stockAvailable: number;
  onDone: () => void;
}): void {
  const { enterpriseId, enterpriseNom, enterpriseType, productId, nom, prixUnitaire, stockAvailable, onDone } = params;

  void (async () => {
    const existing = await loadCart();
    const segments: CartSegment[] = existing?.segments ? existing.segments.map((s) => ({ ...s, lines: [...s.lines] })) : [];
    const idx = segments.findIndex((s) => s.enterpriseId === enterpriseId);
    const prevLines = idx >= 0 ? segments[idx].lines : [];
    const lines = mergeOrIncrement(prevLines, productId, nom, prixUnitaire, stockAvailable);
    if (lines.length === 0) {
      onDone();
      return;
    }
    if (idx >= 0) {
      segments[idx] = {
        ...segments[idx],
        lines,
        enterpriseNom,
        enterpriseType: enterpriseType ?? segments[idx].enterpriseType,
      };
    } else {
      segments.push({ enterpriseId, enterpriseNom, enterpriseType, lines });
    }
    await saveCart({ segments });
    onDone();
  })();
}

export async function updateLineQuantity(
  cart: CartState,
  enterpriseId: string,
  productId: string,
  quantite: number,
  stockAvailable: number
): Promise<void> {
  const q = Math.max(0, Math.min(Math.floor(quantite), Math.max(0, stockAvailable)));
  const segments = cart.segments.map((seg) => {
    if (seg.enterpriseId !== enterpriseId) return seg;
    const lines = seg.lines
      .map((l) => (l.productId === productId ? { ...l, quantite: q } : l))
      .filter((l) => l.quantite > 0);
    return { ...seg, lines };
  });
  const nonEmpty = segments.filter((s) => s.lines.length > 0);
  if (nonEmpty.length === 0) await saveCart(null);
  else await saveCart({ segments: nonEmpty });
}

export async function removeProductLine(cart: CartState, enterpriseId: string, productId: string): Promise<void> {
  const segments = cart.segments.map((seg) => {
    if (seg.enterpriseId !== enterpriseId) return seg;
    return { ...seg, lines: seg.lines.filter((l) => l.productId !== productId) };
  });
  const nonEmpty = segments.filter((s) => s.lines.length > 0);
  if (nonEmpty.length === 0) await saveCart(null);
  else await saveCart({ segments: nonEmpty });
}
