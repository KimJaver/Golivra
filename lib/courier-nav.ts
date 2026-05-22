import type { Href } from 'expo-router';

export const COURIER_HREF = {
  root: '/courier' as Href,
  missionsTab: '/courier/missions' as Href,
  profileTab: '/courier/profile' as Href,
  settings: '/courier/settings' as Href,
} as const;

export function hrefCourierMission(id: string): Href {
  return { pathname: '/courier/mission/[id]', params: { id } };
}
