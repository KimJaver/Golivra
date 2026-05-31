import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useMemo, useRef, useState } from 'react';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import { useAppColors } from '@/hooks/use-app-colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  getBiometricLockEnabled,
  promptBiometricUnlock,
} from '@/lib/biometric-lock';
import { markOnboardingComplete, resolveBootstrapTarget } from '@/lib/app-bootstrap';
import { UX_ONBOARDING } from '@/lib/ux-copy';

export default function LandingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const colors = useAppColors();
  const isDark = useColorScheme() === 'dark';
  const [isCheckingFirstLaunch, setIsCheckingFirstLaunch] = useState(true);
  const [slideIndex, setSlideIndex] = useState(0);
  const slideIndexRef = useRef(0);
  const pageRef = useRef(1);
  const scrollRef = useRef<ScrollView>(null);
  const compact = height < 760;
  const heroHeight = Math.min(Math.max(height * 0.52, 320), 430);
  const carouselWidth = Math.max(width - 32, 280);
  const slides = useMemo(
    () => [
      require('@/assets/images/Image1.png'),
      require('@/assets/images/Image2.png'),
      require('@/assets/images/Image3.png'),
    ],
    []
  );
  const loopSlides = useMemo(() => [slides[slides.length - 1], ...slides, slides[0]], [slides]);

  const handleNext = async () => {
    await markOnboardingComplete();
    router.replace('/auth');
  };

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      try {
        const target = await resolveBootstrapTarget();
        if (!isMounted) return;

        if (target.kind === 'home') {
          const bio = await getBiometricLockEnabled();
          if (bio) {
            const ok = await promptBiometricUnlock('Déverrouiller GoLivra');
            if (!ok) {
              router.replace('/auth');
              return;
            }
          }
          router.replace(target.href);
          return;
        }

        if (target.kind === 'auth') {
          router.replace('/auth');
          return;
        }

        setIsCheckingFirstLaunch(false);
      } catch {
        if (isMounted) setIsCheckingFirstLaunch(false);
      }
    };

    void bootstrap();

    return () => {
      isMounted = false;
    };
  }, [router]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ x: carouselWidth, animated: false });
  }, [carouselWidth]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => {
        const nextIndex = (prev + 1) % slides.length;
        slideIndexRef.current = nextIndex;
        pageRef.current = nextIndex + 1;
        scrollRef.current?.scrollTo({ x: (nextIndex + 1) * carouselWidth, animated: true });
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [carouselWidth, slides.length]);

  if (isCheckingFirstLaunch) {
    return <ThemedView style={styles.container} />;
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: Math.max(insets.top, 8), paddingBottom: Math.max(insets.bottom + 8, 12) }]}>
      <View style={styles.logoSection}>
        <Image source={require('@/assets/images/logo.png')} style={styles.logoTop} contentFit="contain" />
      </View>

      <View style={[styles.heroCard, { height: heroHeight }]}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          decelerationRate="normal"
          showsHorizontalScrollIndicator={false}
          bounces={false}
          contentOffset={{ x: carouselWidth, y: 0 }}
          onMomentumScrollEnd={(event) => {
            const xOffset = event.nativeEvent.contentOffset.x;
            const page = Math.round(xOffset / carouselWidth);

            if (page === 0) {
              scrollRef.current?.scrollTo({ x: slides.length * carouselWidth, animated: false });
              pageRef.current = slides.length;
              slideIndexRef.current = slides.length - 1;
              setSlideIndex(slides.length - 1);
              return;
            }

            if (page === slides.length + 1) {
              scrollRef.current?.scrollTo({ x: carouselWidth, animated: false });
              pageRef.current = 1;
              slideIndexRef.current = 0;
              setSlideIndex(0);
              return;
            }

            pageRef.current = page;
            slideIndexRef.current = page - 1;
            setSlideIndex(page - 1);
          }}>
          {loopSlides.map((slide, index) => (
            <View key={index} style={[styles.slide, { width: carouselWidth }]}>
              <View style={styles.slideClip}>
                <Image
                  source={slide}
                  style={styles.heroImage}
                  contentFit="contain"
                  contentPosition="center"
                  transition={950}
                />
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View key={index} style={[styles.dot, index === slideIndex ? { width: 26, backgroundColor: colors.primary } : { backgroundColor: colors.textMuted }]} />
        ))}
      </View>

      <View style={styles.content}>
        <ThemedText type="title" style={[styles.title, { color: isDark ? colors.primaryBright : colors.primaryDeep }, compact ? styles.titleCompact : undefined]}>
          {UX_ONBOARDING[slideIndex]?.title ?? UX_ONBOARDING[0].title}
        </ThemedText>
        <ThemedText style={[styles.subtitle, { color: colors.textSecondary }, compact ? styles.subtitleCompact : undefined]}>
          {UX_ONBOARDING[slideIndex]?.subtitle ?? UX_ONBOARDING[0].subtitle}
        </ThemedText>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={[styles.startButton, { backgroundColor: colors.primary }]}
          onPress={handleNext}
          android_ripple={{ color: 'rgba(255,255,255,0.15)', borderless: false }}>
          <View style={[styles.startIconWrap, { backgroundColor: colors.surface }]}>
            <MaterialIcons name="bolt" size={20} color={colors.primary} />
          </View>
          <ThemedText style={styles.startText}>Commencer</ThemedText>
          <MaterialIcons name="keyboard-double-arrow-right" size={22} color="#FFFFFF" style={styles.chevrons} />
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  logoTop: {
    width: 208,
    height: 72,
  },
  heroCard: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  slide: {
    height: '100%',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  slideClip: {
    flex: 1,
    borderRadius: 28,
    overflow: 'hidden',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    marginBottom: 10,
    justifyContent: 'center',
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 99,
  },
  dotActive: {
    width: 26,
  },
  content: {
    gap: 8,
    marginTop: 14,
    alignItems: 'center',
  },
  title: {
    lineHeight: 40,
    fontSize: 44,
    fontWeight: '800',
    textAlign: 'center',
    fontFamily: Fonts.rounded,
  },
  titleCompact: {
    fontSize: 38,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 18,
    textTransform: 'uppercase',
    letterSpacing: 0.45,
    textAlign: 'center',
    fontFamily: Fonts.sans,
  },
  subtitleCompact: {
    fontSize: 13,
    lineHeight: 16,
  },
  actions: {
    marginTop: 'auto',
    paddingTop: 0,
    paddingBottom: 2,
  },
  startButton: {
    minHeight: 58,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 6px 10px rgba(11,107,69,0.18)',
    elevation: 5,
  },
  startIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  startText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  chevrons: {
    paddingRight: 8,
  },
});
