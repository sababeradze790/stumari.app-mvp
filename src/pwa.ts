import { registerSW } from 'virtual:pwa-register';

// Register the Service Worker safely (guarding against dev environments with HMR disabled)
export const updateSW = (() => {
  try {
    if (import.meta.env.DEV) {
      return () => Promise.resolve();
    }
    return registerSW({
      immediate: true,
      onNeedRefresh() {
        console.log('Stumari PWA: New content available, auto-updating service worker.');
      },
      onOfflineReady() {
        console.log('Stumari PWA: App ready to work offline. Guest guidebook cached locally.');
      },
      onRegisterError(error) {
        console.warn('Stumari PWA: Service worker registration error:', error);
      }
    });
  } catch (err) {
    console.warn('Stumari PWA: Skipped SW registration in dev environment:', err);
    return () => Promise.resolve();
  }
})();

export function sanitizeCachedGuidebookProperty(property: any) {
  if (!property || typeof property !== 'object') return null;
  const safeProperty = {
    ...property,
    wifiNetwork: '',
    wifiPassword: '',
    doorKeypadCode: '',
    lockboxCode: '',
    arrivalDirections: '',
    parkingInstructions: '',
    address: '',
    hostPhone: '',
    hostWhatsApp: '',
    emergencyContact: '',
  };
  delete safeProperty.accessToken;
  return safeProperty;
}

// Cache a guidebook property model explicitly in localStorage (excluding all sensitive credentials and private contact info)
export function cacheGuidebookLocally(property: any) {
  try {
    if (!property?.slug) return false;
    const key = `stumari_offline_guide_${property.slug}`;
    const safeProperty = sanitizeCachedGuidebookProperty(property);
    localStorage.setItem(key, JSON.stringify({
      property: safeProperty,
      cachedAt: new Date().toISOString()
    }));

    // Also prime browser image cache by prefetching cover image
    if (property.coverImage) {
      const img = new Image();
      img.src = property.coverImage;
    }
    if (property.hostAvatar) {
      const avatar = new Image();
      avatar.src = property.hostAvatar;
    }
    return true;
  } catch (err) {
    console.error('Failed to cache guidebook offline', err);
    return false;
  }
}

export function getCachedGuidebook(slug: string) {
  try {
    const key = `stumari_offline_guide_${slug}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      const data = JSON.parse(raw);
      return sanitizeCachedGuidebookProperty(data.property);
    }
  } catch (err) {
    console.error('Failed to read cached guidebook', err);
  }
  return null;
}
