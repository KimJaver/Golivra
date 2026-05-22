import { Platform } from 'react-native';

/** Espace sous le contenu pour la barre d’onglets vendeur (4 onglets, sans FAB). */
export const VENDOR_TAB_BAR_PADDING_BOTTOM = Platform.OS === 'android' ? 88 : 84;
