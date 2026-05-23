import { useFocusEffect } from '@react-navigation/native';
import { Tabs, useRouter } from 'expo-router';
import { ClipboardList, Heart, Home, ShoppingBag, Store, UserRound } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { GolivraTabBar } from '@/components/golivra-tab-bar';
import { CartProvider } from '@/contexts/cart-context';
import { LUCIDE_STROKE } from '@/constants/icons';
import { Colors } from '@/constants/theme';
import { useAppColors } from '@/hooks/use-app-colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { fetchAuthMe, prefetchClientCatalog } from '@/lib/client-data';
import { getSessionToken } from '@/lib/auth';
import { isMerchantRole } from '@/lib/roles';
import { VENDOR_HREF } from '@/lib/vendor-nav';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = useAppColors();
  const router = useRouter();
  const [sessionChecked, setSessionChecked] = useState(false);

  const verifySession = useCallback(async () => {
    const token = await getSessionToken();
    if (!token) {
      setSessionChecked(false);
      router.replace('/auth');
      return;
    }
    setSessionChecked(true);
    prefetchClientCatalog();
    try {
      const me = await fetchAuthMe(token);
      if (isMerchantRole(me.role)) {
        router.replace(VENDOR_HREF.root);
      }
    } catch {
      /* si /me échoue, on laisse l’accès client */
    }
  }, [router]);

  useFocusEffect(
    useCallback(() => {
      void verifySession();
    }, [verifySession]),
  );

  if (!sessionChecked) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <CartProvider>
    <Tabs
      tabBar={(props) => <GolivraTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color }) => <Home size={24} color={color} strokeWidth={LUCIDE_STROKE} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Commandes',
          tabBarIcon: ({ color }) => <ClipboardList size={24} color={color} strokeWidth={LUCIDE_STROKE} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Panier',
          tabBarIcon: ({ color }) => <ShoppingBag size={24} color={color} strokeWidth={LUCIDE_STROKE} />,
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          title: 'Marketplace',
          tabBarIcon: ({ color }) => <Store size={24} color={color} strokeWidth={LUCIDE_STROKE} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Compte',
          tabBarIcon: ({ color }) => <UserRound size={24} color={color} strokeWidth={LUCIDE_STROKE} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          href: null,
          title: 'Favoris',
          tabBarIcon: ({ color, focused }) => (
            <Heart
              size={24}
              color={color}
              strokeWidth={LUCIDE_STROKE}
              fill={focused ? color : 'none'}
            />
          ),
        }}
      />
    </Tabs>
    </CartProvider>
  );
}
