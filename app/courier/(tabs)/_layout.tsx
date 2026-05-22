import { Tabs, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Bike, ClipboardList, User } from 'lucide-react-native';

import { CourierTabBar } from '@/components/courier/courier-tab-bar';
import { LUCIDE_STROKE } from '@/constants/icons';
import { apiFetch } from '@/lib/api';
import { getSessionToken } from '@/lib/auth';
import { useCourierPalette } from '@/lib/courier-theme';
import { homeHrefForRole, isCourierRole } from '@/lib/roles';

type Me = { role?: string | null };

export default function CourierTabsLayout() {
  const router = useRouter();
  const palette = useCourierPalette();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const token = await getSessionToken();
      if (!token) {
        router.replace('/auth');
        return;
      }
      try {
        const me = await apiFetch<Me>('/api/auth/me', { method: 'GET', token });
        if (!alive) return;
        if (!isCourierRole(me.role)) {
          router.replace(homeHrefForRole(me.role));
          return;
        }
        setOk(true);
      } catch {
        if (!alive) return;
        router.replace('/auth');
      }
    })();
    return () => {
      alive = false;
    };
  }, [router]);

  if (!ok) {
    return (
      <View style={[styles.loader, { backgroundColor: palette.bg }]}>
        <ActivityIndicator size="large" color={palette.primary} />
      </View>
    );
  }

  return (
    <Tabs
      tabBar={(props) => <CourierTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.tabBarInactive,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color }) => <Bike size={22} color={color} strokeWidth={LUCIDE_STROKE} />,
        }}
      />
      <Tabs.Screen
        name="missions"
        options={{
          title: 'Courses',
          tabBarIcon: ({ color }) => <ClipboardList size={22} color={color} strokeWidth={LUCIDE_STROKE} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <User size={22} color={color} strokeWidth={LUCIDE_STROKE} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
