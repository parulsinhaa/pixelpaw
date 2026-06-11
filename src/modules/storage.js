const STORAGE_KEY = 'pixelpaw.profile.v1';

export const defaultProfile = {
  name: 'Pixel',
  skin: 'orange',
  accessory: 'scarf',
  xp: 120,
  level: 3,
  streak: 4,
  friendship: 72,
  mood: 'curious',
  sounds: true,
  pets: [{ id: 'pixel', name: 'Pixel', skin: 'orange', accessory: 'scarf' }]
};

export function loadProfile() {
  try {
    return { ...defaultProfile, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') };
  } catch {
    return { ...defaultProfile };
  }
}

export function saveProfile(profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  return profile;
}

export function addXp(profile, amount) {
  const next = { ...profile, xp: profile.xp + amount, friendship: Math.min(100, profile.friendship + Math.ceil(amount / 8)) };
  const needed = next.level * 100;
  if (next.xp >= needed) {
    next.level += 1;
    next.xp -= needed;
  }
  return saveProfile(next);
}
