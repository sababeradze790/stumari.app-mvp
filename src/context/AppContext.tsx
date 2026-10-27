import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  Property, 
  PropertyPrivateAccess,
  HostUser, 
  AppRoute, 
  StumariGem, 
  StayFeedback, 
  StayMoment, 
  GemMood, 
  GemExperience,
  GuestRequest,
  ArrivalScheduleItem,
  RequestStatus,
  PropertyTemplate,
  ApplianceGuide
} from '../types';
import { INITIAL_PROPERTIES, MOCK_HOST_USER, MOCK_STAY_FEEDBACKS, MOCK_GUEST_REQUESTS, MOCK_TODAY_ARRIVALS } from '../data/mockData';
import { TBILISI_GEMS_LIBRARY } from '../data/stumariGemsData';
import { DEFAULT_PROPERTY_TEMPLATES, DEFAULT_INSTRUCTION_LIBRARY } from '../data/templateData';
import { Language, SUPPORTED_LANGUAGES } from '../i18n/types';
import { translations, Translations } from '../i18n/translations';
import { getLocalizedProperty } from '../data/localizedProperties';
import { 
  doc, 
  setDoc, 
  deleteDoc, 
  deleteField,
  onSnapshot, 
  collection,
  query,
  where,
  getDocs,
  getDoc,
  limit
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  signInWithPopup, 
  GoogleAuthProvider, 
  updateProfile, 
  sendPasswordResetEmail, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { db, auth, handleFirestoreError, OperationType, cleanFirestoreData, uploadMediaFile } from '../firebase';

const OFFICIAL_DEMO_IDS = new Set(['prop-1', 'prop-2', 'prop-3', 'prop-4', 'prop-5']);
const OFFICIAL_DEMO_SLUGS = new Set([
  'old-tbilisi-apartment',
  'sunny-sololaki',
  'batumi-sea-view',
  'kazbegi-cabin',
  'vake-garden-house'
]);

function isOfficialDemoProperty(prop?: Partial<Property> | null): boolean {
  if (!prop) return false;
  return Boolean(
    prop.isDemo ||
    (prop.id && OFFICIAL_DEMO_IDS.has(prop.id)) ||
    (prop.slug && OFFICIAL_DEMO_SLUGS.has(prop.slug)) ||
    prop.ownerId === 'demo-host-uid'
  );
}

/**
 * Validates that a token meets the strict length and character format required by Firestore rules.
 */
export function isValidCapabilityToken(token?: string | null): token is string {
  return Boolean(
    token &&
    typeof token === 'string' &&
    token.length >= 32 &&
    token.length <= 128 &&
    /^[a-zA-Z0-9_-]{32,128}$/.test(token)
  );
}

/**
 * Generates a 192-bit (48-hex-character) cryptographically strong capability token.
 * Fails safely if Web Crypto API CSPRNG is unavailable.
 */
function generateCapabilityToken(): string {
  const cryptoObj = typeof globalThis !== 'undefined' ? globalThis.crypto : undefined;
  if (!cryptoObj || typeof cryptoObj.getRandomValues !== 'function') {
    throw new Error('Secure random number generator (crypto.getRandomValues) is unavailable.');
  }
  const bytes = new Uint8Array(24);
  cryptoObj.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Extracts a capability token from a raw token string, query string, or full URL.
 */
export function extractCapabilityToken(input?: string | null): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Check if input contains query parameters (?k= or ?key= or ?token=)
  if (trimmed.includes('?')) {
    const queryPart = trimmed.split('?').slice(1).join('?');
    const params = new URLSearchParams(queryPart);
    const paramToken = (params.get('k') || params.get('key') || params.get('token') || '').trim();
    if (isValidCapabilityToken(paramToken)) {
      return paramToken;
    }
  }

  // Otherwise check if the string itself is a valid high-entropy token
  if (isValidCapabilityToken(trimmed)) {
    return trimmed;
  }
  return null;
}

function getUrlCapabilityToken(): string | null {
  if (typeof window === 'undefined') return null;
  return (
    extractCapabilityToken(window.location.hash) ||
    extractCapabilityToken(window.location.search)
  );
}

/**
 * Removes ?k=... from the visible browser URL bar once the capability token
 * has been verified and retained in sessionStorage for the current guest session.
 */
function scrubTokenFromVisibleUrl(slug: string): void {
  if (typeof window === 'undefined' || !slug) return;
  try {
    const hash = window.location.hash || '';
    const search = window.location.search || '';
    if (hash.includes('?') || search.includes('k=') || search.includes('key=') || search.includes('token=')) {
      const cleanUrl = `${window.location.pathname}#/g/${encodeURIComponent(slug)}`;
      window.history.replaceState({}, '', cleanUrl);
    }
  } catch {
    // ignore history replace errors
  }
}

function splitPropertyPublicAndPrivate(prop: Property): {
  publicDoc: Property;
  privateAccess: PropertyPrivateAccess;
  accessToken: string;
} {
  const accessToken = isValidCapabilityToken(prop.accessToken)
    ? prop.accessToken
    : generateCapabilityToken();

  const privateAccess: PropertyPrivateAccess = {
    wifiNetwork: prop.wifiNetwork || '',
    wifiPassword: prop.wifiPassword || '',
    doorKeypadCode: prop.doorKeypadCode || '',
    lockboxCode: prop.lockboxCode || '',
    arrivalDirections: prop.arrivalDirections || '',
    parkingInstructions: prop.parkingInstructions || '',
    address: prop.address || '',
    hostPhone: prop.hostPhone || '',
    hostWhatsApp: prop.hostWhatsApp || '',
    emergencyContact: prop.emergencyContact || '',
    updatedAt: prop.updatedAt || new Date().toISOString().split('T')[0]
  };

  const hasPrivateCredentials = Boolean(
    privateAccess.wifiPassword.trim() ||
    privateAccess.doorKeypadCode.trim() ||
    privateAccess.lockboxCode.trim() ||
    privateAccess.wifiNetwork.trim() ||
    privateAccess.arrivalDirections.trim() ||
    privateAccess.parkingInstructions.trim() ||
    (privateAccess.address || '').trim() ||
    (privateAccess.hostPhone || '').trim() ||
    (privateAccess.hostWhatsApp || '').trim() ||
    (privateAccess.emergencyContact || '').trim()
  );

  const publicDoc: Property = {
    ...prop,
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
    hasPrivateCredentials
  };
  delete publicDoc.accessToken;

  return { publicDoc, privateAccess, accessToken };
}

/**
 * Builds a Firestore write payload for /properties/{propertyId} that explicitly clears
 * all sensitive fields and removes any legacy top-level accessToken using deleteField().
 */
function buildPublicPropertyFirestorePayload(fields: Record<string, any>): Record<string, any> {
  const cleaned = cleanFirestoreData(fields);
  return {
    ...cleaned,
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
    accessToken: deleteField()
  };
}

function stripPublicPropertyCredentials(prop: Property): Property {
  if (isOfficialDemoProperty(prop)) return prop;
  const hadCredentials = Boolean(
    prop.hasPrivateCredentials ||
    prop.wifiPassword ||
    prop.doorKeypadCode ||
    prop.lockboxCode ||
    prop.wifiNetwork ||
    prop.arrivalDirections ||
    prop.parkingInstructions ||
    prop.address ||
    prop.hostPhone ||
    prop.hostWhatsApp ||
    prop.emergencyContact
  );
  const sanitized: Property = {
    ...prop,
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
    hasPrivateCredentials: hadCredentials
  };
  delete sanitized.accessToken;
  return sanitized;
}

/**
 * Deterministically merges a public /properties/{id} snapshot with cached hostSecrets
 * and existing in-memory property state so public snapshots never overwrite hydrated secrets.
 */
function mergeHostSecretsIntoProperty(
  publicSnap: Property,
  prevInMemory?: Property,
  cachedSecret?: Partial<Property>
): Property {
  const pickField = (
    secretVal?: string,
    memVal?: string,
    snapVal?: string
  ): string => {
    if (secretVal !== undefined && secretVal !== '') return secretVal;
    if (memVal !== undefined && memVal !== '') return memVal;
    if (snapVal !== undefined && snapVal !== '') return snapVal;
    if (secretVal !== undefined) return secretVal;
    if (memVal !== undefined) return memVal;
    return snapVal || '';
  };

  const resolvedToken =
    (isValidCapabilityToken(cachedSecret?.accessToken) ? cachedSecret!.accessToken : undefined) ||
    (isValidCapabilityToken(prevInMemory?.accessToken) ? prevInMemory!.accessToken : undefined) ||
    (isValidCapabilityToken(publicSnap.accessToken) ? publicSnap.accessToken : undefined);

  return {
    ...publicSnap,
    wifiNetwork: pickField(cachedSecret?.wifiNetwork, prevInMemory?.wifiNetwork, publicSnap.wifiNetwork),
    wifiPassword: pickField(cachedSecret?.wifiPassword, prevInMemory?.wifiPassword, publicSnap.wifiPassword),
    doorKeypadCode: pickField(cachedSecret?.doorKeypadCode, prevInMemory?.doorKeypadCode, publicSnap.doorKeypadCode),
    lockboxCode: pickField(cachedSecret?.lockboxCode, prevInMemory?.lockboxCode, publicSnap.lockboxCode),
    arrivalDirections: pickField(cachedSecret?.arrivalDirections, prevInMemory?.arrivalDirections, publicSnap.arrivalDirections),
    parkingInstructions: pickField(cachedSecret?.parkingInstructions, prevInMemory?.parkingInstructions, publicSnap.parkingInstructions),
    address: pickField(cachedSecret?.address, prevInMemory?.address, publicSnap.address),
    hostPhone: pickField(cachedSecret?.hostPhone, prevInMemory?.hostPhone, publicSnap.hostPhone),
    hostWhatsApp: pickField(cachedSecret?.hostWhatsApp, prevInMemory?.hostWhatsApp, publicSnap.hostWhatsApp),
    emergencyContact: pickField(cachedSecret?.emergencyContact, prevInMemory?.emergencyContact, publicSnap.emergencyContact),
    accessToken: resolvedToken
  };
}

function areHydratedPropertiesEqual(a?: Property, b?: Property): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return (
    a.id === b.id &&
    a.slug === b.slug &&
    a.status === b.status &&
    a.updatedAt === b.updatedAt &&
    a.title === b.title &&
    a.wifiNetwork === b.wifiNetwork &&
    a.wifiPassword === b.wifiPassword &&
    a.doorKeypadCode === b.doorKeypadCode &&
    a.lockboxCode === b.lockboxCode &&
    a.arrivalDirections === b.arrivalDirections &&
    a.parkingInstructions === b.parkingInstructions &&
    a.address === b.address &&
    a.hostPhone === b.hostPhone &&
    a.hostWhatsApp === b.hostWhatsApp &&
    a.emergencyContact === b.emergencyContact &&
    a.accessToken === b.accessToken &&
    a.hasPrivateCredentials === b.hasPrivateCredentials
  );
}

function upsertPropertyIfChanged(prev: Property[], nextProp: Property): Property[] {
  const idx = prev.findIndex(p => p.id === nextProp.id);
  if (idx === -1) {
    return [nextProp, ...prev];
  }
  if (areHydratedPropertiesEqual(prev[idx], nextProp)) {
    return prev;
  }
  const copy = [...prev];
  copy[idx] = nextProp;
  return copy;
}

interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'info';
}

export type ThemeMode = 'dark' | 'light';

export type PropertyTab = 'overview' | 'guide' | 'gems' | 'reviews' | 'preview' | 'qr' | 'analytics' | 'settings';
export type GuideSectionKey = 
  | 'welcome' 
  | 'checkin' 
  | 'wifi' 
  | 'how-it-works' 
  | 'rules' 
  | 'recommendations' 
  | 'transport' 
  | 'checkout' 
  | 'contact' 
  | 'emergency';

interface AppContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  currentRoute: AppRoute;
  setCurrentRoute: (route: AppRoute) => void;
  propertySubTab: PropertyTab;
  setPropertySubTab: (tab: PropertyTab) => void;
  guideActiveSection: GuideSectionKey;
  setGuideActiveSection: (section: GuideSectionKey) => void;
  properties: Property[];
  currentProperty: Property;
  setCurrentPropertyId: (id: string) => void;
  updateProperty: (updated: Property) => Promise<void>;
  createProperty: (partial?: Partial<Property>) => Promise<Property>;
  duplicateProperty: (id: string) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  togglePublishProperty: (id: string) => void;
  rotatePropertyAccessToken: (propertyId: string) => Promise<string | null>;
  unlockGuestPropertyAccess: (slugOrId: string, tokenOrUrlInput: string) => Promise<boolean>;
  isPropertyAccessUnlocked: (prop?: Property | null) => boolean;
  getGuestCheckInUrl: (prop: Property, includeAccessKey?: boolean) => string;
  currentUser: HostUser;
  updateCurrentUser: (user: Partial<HostUser>) => void;
  toast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'info') => void;
  activeGuestSlug: string;
  navigateToGuestGuide: (slugOrId: string) => void;
  fetchGuestProperty: (slugOrId: string, explicitKey?: string) => Promise<Property | null>;
  navigateToPropertyHub: (propId: string, subTab?: PropertyTab) => void;
  navigateTo: (route: AppRoute) => void;
  getLocalizedProperty: (prop: Property) => Property;

  // Stumari Gems & Stay Moments
  gems: StumariGem[];
  togglePropertyGem: (propertyId: string, gemId: string) => void;
  addCustomGem: (gem: StumariGem, propertyId?: string) => void;
  activeMood: GemMood | 'all';
  setActiveMood: (mood: GemMood | 'all') => void;
  activeExperience: GemExperience | 'all';
  setActiveExperience: (exp: GemExperience | 'all') => void;
  activeMoment: StayMoment;
  setActiveMoment: (moment: StayMoment) => void;

  // Review Engine & Stay Feedback
  feedbacks: StayFeedback[];
  addStayFeedback: (feedback: Omit<StayFeedback, 'id' | 'createdAt' | 'status'>) => void;
  resolveFeedback: (id: string) => void;
  isFeedbackModalOpen: boolean;
  setIsFeedbackModalOpen: (open: boolean) => void;

  // Guest Requests & Issues (Stage 1 Operations)
  requests: GuestRequest[];
  addGuestRequest: (req: Omit<GuestRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateRequestStatus: (id: string, status: RequestStatus) => void;

  // Arrivals Schedule (Stage 1 Operational)
  todayArrivals: ArrivalScheduleItem[];
  markArrivalCheckedIn: (id: string) => void;

  // Reusable Property Templates & Instruction Library
  templates: PropertyTemplate[];
  addTemplate: (tmpl: Omit<PropertyTemplate, 'id' | 'createdAt'>) => PropertyTemplate;
  updateTemplate: (tmpl: PropertyTemplate) => void;
  deleteTemplate: (id: string) => void;
  applyTemplateToProperty: (
    propertyId: string, 
    templateId: string, 
    options?: { rules?: boolean; appliances?: boolean; checkout?: boolean; departureChecklist?: boolean }
  ) => void;
  instructionLibrary: ApplianceGuide[];
  saveInstructionToLibrary: (guide: ApplianceGuide) => void;
  deleteInstructionFromLibrary: (id: string) => void;

  // Guest Saved Favorites
  guestFavorites: string[];
  toggleGuestFavorite: (spotId: string, spotTitle?: string) => void;
  isGuestFavorite: (spotId: string) => boolean;
  guestFavoritesCount: number;

  // Unified Add Property Modal
  isAddPropertyModalOpen: boolean;
  openAddPropertyModal: () => void;
  closeAddPropertyModal: () => void;

  // Firebase Auth
  firebaseUser: User | null;
  isAuthLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  openAuthModal: (mode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, displayName?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOutHost: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loginAsDemoHost: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Firebase Auth State
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  // Maps propertyId -> verified capability token for the current guest session
  const [unlockedPropertyTokens, setUnlockedPropertyTokens] = useState<Record<string, string>>({});

  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);
  const openAddPropertyModal = () => setIsAddPropertyModalOpen(true);
  const closeAddPropertyModal = () => setIsAddPropertyModalOpen(false);

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };
  const prevAuthUidRef = useRef<string | null>(null);
  // Retains hydrated hostSecrets/config per propertyId so public /properties snapshots never overwrite secrets
  const hostSecretsMapRef = useRef<Record<string, Partial<Property>>>({});

  const hasSavedAuthSession = (): boolean => {
    try {
      const savedUser = localStorage.getItem('stumari_mvp_user_v2');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        return Boolean(parsed?.id && parsed.id !== 'host-user-1');
      }
    } catch {}
    return false;
  };

  const loadDemoProperties = (): Property[] => {
    try {
      const saved = localStorage.getItem('stumari_mvp_properties_v2');
      if (saved) {
        const parsed: Property[] = JSON.parse(saved);
        const demoOnly = parsed.filter(
          p => p.isDemo || !p.ownerId || p.ownerId === 'demo-host-uid' || INITIAL_PROPERTIES.some(init => init.id === p.id)
        );
        if (demoOnly.length > 0) {
          return demoOnly.map(p => {
            const starter = INITIAL_PROPERTIES.find(init => init.id === p.id);
            if (!starter) return p;
            return {
              ...p,
              gemIds: p.gemIds !== undefined ? p.gemIds : starter.gemIds,
              photos: p.photos !== undefined ? p.photos : starter.photos
            };
          });
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_PROPERTIES;
  };

  const [properties, setProperties] = useState<Property[]>(() => {
    if (hasSavedAuthSession()) return [];
    return loadDemoProperties();
  });

  const propertiesRef = useRef<Property[]>(properties);
  propertiesRef.current = properties;

  const unlockedPropertyTokensRef = useRef<Record<string, string>>(unlockedPropertyTokens);
  unlockedPropertyTokensRef.current = unlockedPropertyTokens;

  const [currentPropertyId, setCurrentPropertyId] = useState<string>(() => {
    return properties[0]?.id || '';
  });

  const [propertySubTab, setPropertySubTab] = useState<PropertyTab>('overview');
  const [guideActiveSection, setGuideActiveSection] = useState<GuideSectionKey>('welcome');

  const [currentUser, setCurrentUser] = useState<HostUser>(() => {
    try {
      const saved = localStorage.getItem('stumari_mvp_user_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return MOCK_HOST_USER;
  });

  // Stumari Gems State & Filters (always merges TBILISI_GEMS_LIBRARY with any saved custom gems)
  const [gems, setGems] = useState<StumariGem[]>(() => {
    const map = new Map<string, StumariGem>();
    TBILISI_GEMS_LIBRARY.forEach(g => map.set(g.id, g));
    try {
      const saved = localStorage.getItem('stumari_gems_v1');
      if (saved) {
        const parsed: StumariGem[] = JSON.parse(saved);
        parsed.forEach(g => map.set(g.id, g));
      }
    } catch {
      // ignore
    }
    return Array.from(map.values());
  });

  const [activeMood, setActiveMood] = useState<GemMood | 'all'>('all');
  const [activeExperience, setActiveExperience] = useState<GemExperience | 'all'>('all');
  const [activeMoment, setActiveMoment] = useState<StayMoment>('during_stay');

  // Stay Feedback & Review Engine State
  const [feedbacks, setFeedbacks] = useState<StayFeedback[]>(() => {
    if (hasSavedAuthSession()) return [];
    try {
      const saved = localStorage.getItem('stumari_feedbacks_v1');
      if (saved) {
        const parsed: StayFeedback[] = JSON.parse(saved);
        const demoOnly = parsed.filter(f => !f.hostId || f.hostId === 'demo-host-uid');
        if (demoOnly.length > 0) return demoOnly;
      }
    } catch {
      // ignore
    }
    return MOCK_STAY_FEEDBACKS;
  });

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Guest Requests & Issues State (Stage 1 Operational)
  const [requests, setRequests] = useState<GuestRequest[]>(() => {
    if (hasSavedAuthSession()) return [];
    try {
      const saved = localStorage.getItem('stumari_requests_v1');
      if (saved) {
        const parsed: GuestRequest[] = JSON.parse(saved);
        const demoOnly = parsed.filter(r => !r.hostId || r.hostId === 'demo-host-uid');
        if (demoOnly.length > 0) return demoOnly;
      }
    } catch {
      // ignore
    }
    return MOCK_GUEST_REQUESTS;
  });

  const [todayArrivals, setTodayArrivals] = useState<ArrivalScheduleItem[]>(() => {
    if (hasSavedAuthSession()) return [];
    try {
      const saved = localStorage.getItem('stumari_arrivals_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return MOCK_TODAY_ARRIVALS;
  });

  useEffect(() => {
    if (firebaseUser || isAuthLoading) return;
    try {
      const demoRequests = requests.filter(r => !r.hostId || r.hostId === 'demo-host-uid');
      localStorage.setItem('stumari_requests_v1', JSON.stringify(demoRequests));
    } catch {
      // ignore
    }
  }, [requests, firebaseUser, isAuthLoading]);

  useEffect(() => {
    if (firebaseUser || isAuthLoading) return;
    try {
      localStorage.setItem('stumari_arrivals_v1', JSON.stringify(todayArrivals));
    } catch {
      // ignore
    }
  }, [todayArrivals, firebaseUser, isAuthLoading]);

  // Reusable Property Templates State
  const [templates, setTemplates] = useState<PropertyTemplate[]>(() => {
    try {
      const saved = localStorage.getItem('stumari_templates_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_PROPERTY_TEMPLATES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('stumari_templates_v1', JSON.stringify(templates));
    } catch {}
  }, [templates]);

  // Reusable Instruction Library State
  const [instructionLibrary, setInstructionLibrary] = useState<ApplianceGuide[]>(() => {
    try {
      const saved = localStorage.getItem('stumari_instructions_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_INSTRUCTION_LIBRARY;
  });

  useEffect(() => {
    try {
      localStorage.setItem('stumari_instructions_v1', JSON.stringify(instructionLibrary));
    } catch {}
  }, [instructionLibrary]);

  // Guest Saved Favorites (persisted in localStorage across sessions)
  const [guestFavorites, setGuestFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('stumari_guest_favorites_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  const toggleGuestFavorite = (spotId: string, spotTitle?: string) => {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(10);
      }
    } catch {}

    setGuestFavorites(prev => {
      const isFav = prev.includes(spotId);
      const next = isFav ? prev.filter(id => id !== spotId) : [...prev, spotId];
      try {
        localStorage.setItem('stumari_guest_favorites_v1', JSON.stringify(next));
      } catch {
        // ignore
      }

      if (isFav) {
        showToast(
          language === 'ka' 
            ? 'წაიშალა რჩეულებიდან' 
            : language === 'ru' 
            ? 'Удалено из избранного' 
            : 'Removed from favorites'
        );
      } else {
        showToast(
          language === 'ka' 
            ? `❤️ ${spotTitle || 'ადგილი'} შენახულია რჩეულებში!` 
            : language === 'ru' 
            ? `❤️ ${spotTitle || 'Место'} сохранено в избранное!` 
            : `❤️ ${spotTitle || 'Spot'} saved to your favorites!`
        );
      }
      return next;
    });
  };

  const isGuestFavorite = (spotId: string) => {
    return guestFavorites.includes(spotId);
  };

  useEffect(() => {
    try {
      localStorage.setItem('stumari_gems_v1', JSON.stringify(gems));
    } catch {
      // ignore
    }
  }, [gems]);

  useEffect(() => {
    if (firebaseUser || isAuthLoading) return;
    try {
      const demoFeedbacks = feedbacks.filter(f => !f.hostId || f.hostId === 'demo-host-uid');
      localStorage.setItem('stumari_feedbacks_v1', JSON.stringify(demoFeedbacks));
    } catch {
      // ignore
    }
  }, [feedbacks, firebaseUser, isAuthLoading]);

  /**
   * Resolves a host property's full credentials and accessToken deterministically by merging
   * in-memory state, hostSecretsMapRef, and (if not yet loaded) /properties/{id}/hostSecrets/config.
   */
  const resolveHostPropertyWithSecrets = useCallback(async (baseProp: Property): Promise<Property> => {
    let cachedSecret = hostSecretsMapRef.current[baseProp.id];
    if (!cachedSecret || !isValidCapabilityToken(cachedSecret.accessToken)) {
      try {
        const secretSnap = await getDoc(doc(db, 'properties', baseProp.id, 'hostSecrets', 'config'));
        if (secretSnap.exists()) {
          cachedSecret = secretSnap.data() as Partial<Property>;
          hostSecretsMapRef.current[baseProp.id] = cachedSecret;
        }
      } catch {
        // ignore if hostSecrets/config does not exist yet on a legacy property
      }
    }
    return mergeHostSecretsIntoProperty(baseProp, baseProp, cachedSecret);
  }, []);

  /**
   * Safely persists a host property update (full or partial) by ensuring hostSecrets/config and
   * privateAccess/{accessToken} are written first, and /properties/{id} has all sensitive fields
   * cleared and accessToken removed via deleteField().
   */
  const persistHostPropertySafely = useCallback(async (
    targetProp: Property,
    explicitCredentialEdit = false
  ): Promise<Property> => {
    const activeUid = auth.currentUser?.uid || firebaseUser?.uid;
    if (!activeUid || targetProp.ownerId !== activeUid || targetProp.isDemo) {
      return targetProp;
    }

    const baseForSplit = explicitCredentialEdit
      ? {
          ...targetProp,
          accessToken:
            (isValidCapabilityToken(targetProp.accessToken) ? targetProp.accessToken : undefined) ||
            (isValidCapabilityToken(hostSecretsMapRef.current[targetProp.id]?.accessToken)
              ? hostSecretsMapRef.current[targetProp.id]!.accessToken
              : undefined)
        }
      : await resolveHostPropertyWithSecrets(targetProp);

    // If still no accessToken on a legacy property, check hostSecrets/config once before generating
    if (!isValidCapabilityToken(baseForSplit.accessToken)) {
      try {
        const secretSnap = await getDoc(doc(db, 'properties', targetProp.id, 'hostSecrets', 'config'));
        if (secretSnap.exists()) {
          const sData = secretSnap.data();
          if (isValidCapabilityToken(sData?.accessToken)) {
            baseForSplit.accessToken = sData.accessToken;
          }
        }
      } catch {}
    }

    const { publicDoc, privateAccess, accessToken } = splitPropertyPublicAndPrivate(baseForSplit as Property);

    hostSecretsMapRef.current[targetProp.id] = {
      ...privateAccess,
      accessToken
    };

    const inMemoryProp: Property = {
      ...(baseForSplit as Property),
      accessToken,
      hasPrivateCredentials: publicDoc.hasPrivateCredentials
    };

    await setDoc(
      doc(db, 'properties', targetProp.id, 'hostSecrets', 'config'),
      cleanFirestoreData({
        ...privateAccess,
        accessToken,
        ownerId: activeUid
      }),
      { merge: true }
    );
    await setDoc(
      doc(db, 'properties', targetProp.id, 'privateAccess', accessToken),
      cleanFirestoreData(privateAccess),
      { merge: true }
    );
    await setDoc(
      doc(db, 'properties', targetProp.id),
      buildPublicPropertyFirestorePayload(publicDoc),
      { merge: true }
    );

    return inMemoryProp;
  }, [firebaseUser, resolveHostPropertyWithSecrets]);

  // Firestore Real-Time Listeners & Seeding (Scoped to authenticated host or public content)
  useEffect(() => {
    let unsubProps: (() => void) | undefined;
    let unsubFeedbacks: (() => void) | undefined;
    let unsubGems: (() => void) | undefined;
    let unsubRequests: (() => void) | undefined;

    // Public Gems directory listener (merges TBILISI_GEMS_LIBRARY with remote custom gems)
    try {
      unsubGems = onSnapshot(collection(db, 'gems'), (snapshot) => {
        if (!snapshot.empty) {
          const remoteList: StumariGem[] = [];
          snapshot.forEach(docSnap => {
            const data = docSnap.data();
            remoteList.push({ id: docSnap.id, ...data } as StumariGem);
          });
          setGems(prev => {
            const map = new Map<string, StumariGem>();
            TBILISI_GEMS_LIBRARY.forEach(g => map.set(g.id, g));
            prev.forEach(g => map.set(g.id, g));
            remoteList.forEach(g => map.set(g.id, g));
            return Array.from(map.values());
          });
        }
      }, (err) => {
        handleFirestoreError(err, OperationType.GET, 'gems');
      });
    } catch (e) {
      console.warn('Gems listener initialisation:', e);
    }

    // Scoped Host Listeners (only active when authenticated with Firebase Auth)
    if (firebaseUser) {
      const hostUid = firebaseUser.uid;

      // Immediately purge any stale demo or foreign-host records before snapshots resolve
      setProperties(prev => prev.filter(p => p.ownerId === hostUid && !p.isDemo));
      setFeedbacks(prev => prev.filter(f => f.hostId === hostUid));
      setRequests(prev => prev.filter(r => r.hostId === hostUid));
      setTodayArrivals([]);

      try {
        // Query strictly this host's owned properties
        const propsQuery = query(
          collection(db, 'properties'),
          where('ownerId', '==', hostUid)
        );
        unsubProps = onSnapshot(propsQuery, (snapshot) => {
          const rawRemoteList: Property[] = [];
          snapshot.forEach(docSnap => {
            const data = docSnap.data();
            rawRemoteList.push({ id: docSnap.id, ...data } as Property);
          });

          // Preserve already-hydrated credentials & accessToken in memory when public snapshots arrive
          setProperties(prev => {
            return rawRemoteList.map(propItem => {
              const prevInMemory = prev.find(p => p.id === propItem.id);
              const cachedSecret = hostSecretsMapRef.current[propItem.id];
              return mergeHostSecretsIntoProperty(propItem, prevInMemory, cachedSecret);
            });
          });

          setCurrentPropertyId(prev => {
            if (rawRemoteList.length === 0) return '';
            return rawRemoteList.some(p => p.id === prev) ? prev : rawRemoteList[0].id;
          });

          // Read-only hydration of owner-only /hostSecrets/config for each owned property
          // (Never automatically mutates or migrates live documents on login/load)
          rawRemoteList.forEach(propItem => {
            getDoc(doc(db, 'properties', propItem.id, 'hostSecrets', 'config'))
              .then(secretSnap => {
                if (secretSnap.exists()) {
                  const secretData = secretSnap.data() as Partial<Property>;
                  hostSecretsMapRef.current[propItem.id] = secretData;
                  setProperties(currentList => {
                    const target = currentList.find(p => p.id === propItem.id);
                    if (!target) return currentList;
                    const merged = mergeHostSecretsIntoProperty(target, target, secretData);
                    return upsertPropertyIfChanged(currentList, merged);
                  });
                } else if (!hostSecretsMapRef.current[propItem.id]) {
                  // Legacy property without hostSecrets/config yet: retain legacy fields in memory cache
                  hostSecretsMapRef.current[propItem.id] = {
                    wifiNetwork: propItem.wifiNetwork,
                    wifiPassword: propItem.wifiPassword,
                    doorKeypadCode: propItem.doorKeypadCode,
                    lockboxCode: propItem.lockboxCode,
                    arrivalDirections: propItem.arrivalDirections,
                    parkingInstructions: propItem.parkingInstructions,
                    address: propItem.address,
                    hostPhone: propItem.hostPhone,
                    hostWhatsApp: propItem.hostWhatsApp,
                    emergencyContact: propItem.emergencyContact,
                    accessToken: propItem.accessToken
                  };
                }
              })
              .catch(() => {
                // Ignore if hostSecrets/config does not exist yet on legacy properties
              });
          });
        }, (err) => {
          handleFirestoreError(err, OperationType.GET, `properties?ownerId=${hostUid}`);
        });

        // Query strictly this host's stay feedback
        const feedbacksQuery = query(
          collection(db, 'feedbacks'),
          where('hostId', '==', hostUid)
        );
        unsubFeedbacks = onSnapshot(feedbacksQuery, (snapshot) => {
          const remoteList: StayFeedback[] = [];
          snapshot.forEach(docSnap => {
            const data = docSnap.data();
            remoteList.push({ id: docSnap.id, ...data } as StayFeedback);
          });
          setFeedbacks(remoteList);
        }, (err) => {
          handleFirestoreError(err, OperationType.GET, `feedbacks?hostId=${hostUid}`);
        });

        // Query strictly this host's guest requests
        const requestsQuery = query(
          collection(db, 'requests'),
          where('hostId', '==', hostUid)
        );
        unsubRequests = onSnapshot(requestsQuery, (snapshot) => {
          const remoteList: GuestRequest[] = [];
          snapshot.forEach(docSnap => {
            const data = docSnap.data();
            remoteList.push({ id: docSnap.id, ...data } as GuestRequest);
          });
          setRequests(remoteList);
        }, (err) => {
          handleFirestoreError(err, OperationType.GET, `requests?hostId=${hostUid}`);
        });
      } catch (e) {
        console.warn('Scoped Firestore listeners initialisation:', e);
      }
    } else if (!isAuthLoading) {
      // Unauthenticated / Demo Mode: restore demo data when not authenticated
      setProperties(prev => {
        const demoExisting = prev.filter(p => p.isDemo || !p.ownerId || p.ownerId === 'demo-host-uid');
        if (demoExisting.length > 0) return demoExisting;
        return loadDemoProperties();
      });
      setFeedbacks(prev => {
        const demoExisting = prev.filter(f => !f.hostId || f.hostId === 'demo-host-uid');
        return demoExisting.length > 0 ? demoExisting : MOCK_STAY_FEEDBACKS;
      });
      setRequests(prev => {
        const demoExisting = prev.filter(r => !r.hostId || r.hostId === 'demo-host-uid');
        return demoExisting.length > 0 ? demoExisting : MOCK_GUEST_REQUESTS;
      });
      setTodayArrivals(prev => (prev.length > 0 ? prev : MOCK_TODAY_ARRIVALS));
      setCurrentPropertyId(prev => prev || INITIAL_PROPERTIES[0]?.id || 'prop-1');
    }

    return () => {
      if (unsubProps) unsubProps();
      if (unsubFeedbacks) unsubFeedbacks();
      if (unsubGems) unsubGems();
      if (unsubRequests) unsubRequests();
    };
  }, [firebaseUser, isAuthLoading]);

  // Firebase Auth State Listener & User Profile Synchronization
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = onAuthStateChanged(auth, (user) => {
        const previousUid = prevAuthUidRef.current;
        const nextUid = user?.uid || null;

        // If switching accounts or signing in/out, immediately clear previous state
        if (previousUid !== nextUid) {
          hostSecretsMapRef.current = {};
          if (nextUid) {
            setProperties(prev => prev.filter(p => p.ownerId === nextUid && !p.isDemo));
            setFeedbacks(prev => prev.filter(f => f.hostId === nextUid));
            setRequests(prev => prev.filter(r => r.hostId === nextUid));
            setTodayArrivals([]);
            setCurrentPropertyId('');
            try {
              localStorage.removeItem('stumari_mvp_properties_v2');
              localStorage.removeItem('stumari_feedbacks_v1');
              localStorage.removeItem('stumari_requests_v1');
              localStorage.removeItem('stumari_arrivals_v1');
              if (previousUid && previousUid !== nextUid) {
                sessionStorage.removeItem('stumari_onboarding_draft_v1');
              }
            } catch {}
          } else if (previousUid !== null) {
            // Transitioned from authenticated user to signed-out
            try {
              localStorage.removeItem('stumari_mvp_user_v2');
              localStorage.removeItem('stumari_mvp_properties_v2');
              localStorage.removeItem('stumari_feedbacks_v1');
              localStorage.removeItem('stumari_requests_v1');
              localStorage.removeItem('stumari_arrivals_v1');
              sessionStorage.removeItem('stumari_onboarding_draft_v1');
            } catch {}
            setProperties(INITIAL_PROPERTIES);
            setFeedbacks(MOCK_STAY_FEEDBACKS);
            setRequests(MOCK_GUEST_REQUESTS);
            setTodayArrivals(MOCK_TODAY_ARRIVALS);
            setCurrentPropertyId(INITIAL_PROPERTIES[0]?.id || 'prop-1');
            setActiveGuestSlug(INITIAL_PROPERTIES[0]?.slug || 'old-tbilisi-apartment');
            setCurrentUser(MOCK_HOST_USER);
          }
          prevAuthUidRef.current = nextUid;
        }

        setFirebaseUser(user);
        setIsAuthLoading(false);
        if (user) {
          const hostProfile: HostUser = {
            id: user.uid,
            name: user.displayName || user.email?.split('@')[0] || 'Host',
            email: user.email || '',
            avatar: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            plan: 'pro',
            billingCycle: 'monthly',
            joinedDate: 'Joined recently',
            propertyCount: 0,
            status: 'active'
          };
          setCurrentUser(hostProfile);
          try {
            localStorage.setItem('stumari_mvp_user_v2', JSON.stringify(hostProfile));
            setDoc(doc(db, 'users', user.uid), {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              lastLogin: new Date().toISOString()
            }, { merge: true }).catch(() => {});
          } catch {}
        }
      });
    } catch (e) {
      console.warn('Auth listener init error:', e);
      setIsAuthLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const signInWithEmail = async (emailStr: string, pass: string) => {
    const cleanEmail = emailStr.trim();
    const res = await signInWithEmailAndPassword(auth, cleanEmail, pass);
    showToast(`Welcome back, ${res.user.displayName || res.user.email}!`);
    setCurrentRoute('/app');
  };

  const signUpWithEmail = async (emailStr: string, pass: string, name?: string) => {
    const cleanEmail = emailStr.trim();
    const res = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
    if (name) {
      await updateProfile(res.user, { displayName: name });
    }
    showToast('Host account created! Welcome to Stumari.');
    setCurrentRoute('/app');
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    showToast(`Signed in as ${res.user.displayName || res.user.email}`);
    setCurrentRoute('/app');
  };

  const signOutHost = async () => {
    prevAuthUidRef.current = null;
    hostSecretsMapRef.current = {};
    try {
      localStorage.removeItem('stumari_mvp_user_v2');
      localStorage.removeItem('stumari_mvp_properties_v2');
      localStorage.removeItem('stumari_feedbacks_v1');
      localStorage.removeItem('stumari_requests_v1');
      localStorage.removeItem('stumari_arrivals_v1');
      sessionStorage.removeItem('stumari_onboarding_draft_v1');
    } catch {}
    setUnlockedPropertyTokens({});
    setProperties(INITIAL_PROPERTIES);
    setFeedbacks(MOCK_STAY_FEEDBACKS);
    setRequests(MOCK_GUEST_REQUESTS);
    setTodayArrivals(MOCK_TODAY_ARRIVALS);
    setCurrentPropertyId(INITIAL_PROPERTIES[0]?.id || 'prop-1');
    setActiveGuestSlug(INITIAL_PROPERTIES[0]?.slug || 'old-tbilisi-apartment');
    setFirebaseUser(null);
    setCurrentUser(MOCK_HOST_USER);
    await firebaseSignOut(auth);
    showToast('Signed out successfully.');
    setCurrentRoute('/');
  };

  const resetPassword = async (emailStr: string) => {
    const cleanEmail = emailStr.trim();
    await sendPasswordResetEmail(auth, cleanEmail);
    showToast('Password reset link sent to your email.');
  };

  const loginAsDemoHost = () => {
    setCurrentUser(MOCK_HOST_USER);
    localStorage.setItem('stumari_mvp_user_v2', JSON.stringify(MOCK_HOST_USER));
    showToast('Logged in as Demo Host: Saba Beradze (Tbilisi Superhost) ✨');
    setCurrentRoute('/app');
  };

  const addStayFeedback = (feedbackData: Omit<StayFeedback, 'id' | 'createdAt' | 'status'>) => {
    const targetProp = properties.find(p => p.id === feedbackData.propertyId) || properties.find(p => p.slug === activeGuestSlug) || currentProperty;
    const effectiveHostId = feedbackData.hostId || targetProp?.ownerId || 'demo-host-uid';
    const newFeedback: StayFeedback = {
      id: `fb-${Date.now()}`,
      createdAt: new Date().toLocaleString(),
      status: 'new',
      hostId: effectiveHostId,
      ...feedbackData
    };
    setFeedbacks(prev => [newFeedback, ...prev]);

    // Persist to Firestore (cleanFirestoreData strips undefined fields like optional comment)
    try {
      const sanitizedFeedback = cleanFirestoreData(newFeedback);
      setDoc(doc(db, 'feedbacks', newFeedback.id), sanitizedFeedback).catch(() => {
        // Local session/storage fallback already applied above
      });
    } catch {
      // local fallback handled
    }

    if (feedbackData.sentiment === 'amazing' || feedbackData.sentiment === 'good') {
      showToast(
        language === 'ka'
          ? 'დიდი მადლობა! თქვენი ჩანაწერი დაემატა სტუმრების წიგნაკს ❤️'
          : language === 'ru'
          ? 'Большое спасибо! Ваша запись добавлена в гостевую книгу ❤️'
          : 'Thank you! Your note has been added to the guestbook ❤️'
      );
    } else {
      showToast(
        language === 'ka'
          ? 'პირადი შეტყობინება გაეგზავნა მასპინძელს. მადლობა!'
          : language === 'ru'
          ? 'Личное сообщение отправлено хозяину. Спасибо!'
          : 'Private feedback delivered directly to your host. Thank you!'
      );
    }
  };

  const resolveFeedback = (id: string) => {
    setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status: f.status === 'resolved' ? 'reviewed' : 'resolved' } : f));
    try {
      setDoc(doc(db, 'feedbacks', id), { status: 'resolved' }, { merge: true }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `feedbacks/${id}`);
      });
    } catch (e) {}
    showToast('Feedback item updated');
  };

  const addGuestRequest = (reqData: Omit<GuestRequest, 'id' | 'createdAt' | 'status'>) => {
    const targetProp = properties.find(p => p.id === reqData.propertyId) || properties.find(p => p.slug === activeGuestSlug) || currentProperty;
    const effectiveHostId = reqData.hostId || targetProp?.ownerId || 'demo-host-uid';
    const newReq: GuestRequest = {
      id: `req-${Date.now()}`,
      createdAt:
        language === 'ka' ? 'ახლახანს' : language === 'ru' ? 'Только что' : 'Just now',
      status: 'new',
      hostId: effectiveHostId,
      ...reqData
    };
    setRequests(prev => [newReq, ...prev]);

    try {
      const sanitizedReq = cleanFirestoreData(newReq);
      setDoc(doc(db, 'requests', newReq.id), sanitizedReq).catch(() => {
        // Local session/storage fallback already applied above
      });
    } catch {}

    showToast(
      language === 'ka'
        ? 'მოთხოვნა გაიგზავნა მასპინძელთან 🔔'
        : language === 'ru'
        ? 'Запрос отправлен хозяину 🔔'
        : 'Request sent to host 🔔'
    );
  };

  const updateRequestStatus = (id: string, status: RequestStatus) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));

    try {
      setDoc(doc(db, 'requests', id), { status }, { merge: true }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `requests/${id}`);
      });
    } catch (e) {}

    showToast(language === 'ka' ? 'სტატუსი განახლდა' : 'Request status updated');
  };

  const markArrivalCheckedIn = (id: string) => {
    setTodayArrivals(prev => prev.map(a => a.id === id ? { ...a, status: 'checked_in' } : a));
    showToast(language === 'ka' ? 'სტუმარი დარეგისტრირდა ✅' : 'Guest marked as checked in ✅');
  };

  const togglePropertyGem = (propertyId: string, gemId: string) => {
    let targetPropSnapshot: Property | undefined;
    setProperties(prev => prev.map(p => {
      if (p.id !== propertyId) return p;
      const currentGemIds = p.gemIds || [];
      const updated = currentGemIds.includes(gemId)
        ? currentGemIds.filter(id => id !== gemId)
        : [...currentGemIds, gemId];
      const nextProp = { ...p, gemIds: updated };
      targetPropSnapshot = nextProp;
      return nextProp;
    }));

    const activeUid = auth.currentUser?.uid || firebaseUser?.uid;
    if (activeUid && targetPropSnapshot && targetPropSnapshot.ownerId === activeUid && !targetPropSnapshot.isDemo) {
      persistHostPropertySafely(targetPropSnapshot, false)
        .then(saved => {
          setProperties(prev => prev.map(p => (p.id === saved.id ? saved : p)));
        })
        .catch(err => {
          handleFirestoreError(err, OperationType.UPDATE, `properties/${propertyId}`);
        });
    }
    showToast('Local gem saved to property guide');
  };

  const addCustomGem = (newGem: StumariGem, propertyId?: string) => {
    const activeUid = auth.currentUser?.uid || firebaseUser?.uid;
    const gemWithOwner: StumariGem = activeUid
      ? { ...newGem, ownerId: activeUid }
      : { ...newGem };
    const cleanedGem = cleanFirestoreData(gemWithOwner);
    setGems(prev => [gemWithOwner, ...prev.filter(g => g.id !== gemWithOwner.id)]);

    if (activeUid) {
      try {
        setDoc(doc(db, 'gems', gemWithOwner.id), cleanedGem).catch(err => {
          handleFirestoreError(err, OperationType.CREATE, `gems/${gemWithOwner.id}`);
        });
      } catch (e) {}
    }

    if (propertyId) {
      let targetPropSnapshot: Property | undefined;
      setProperties(prev => prev.map(p => {
        if (p.id !== propertyId) return p;
        const currentIds = p.gemIds || [];
        const updatedGemIds = currentIds.includes(gemWithOwner.id) ? currentIds : [...currentIds, gemWithOwner.id];
        const currentCustom = p.customGems || [];
        const updatedCustomGems = [gemWithOwner, ...currentCustom.filter(g => g.id !== gemWithOwner.id)];
        const nextProp = {
          ...p,
          gemIds: updatedGemIds,
          customGems: updatedCustomGems
        };
        targetPropSnapshot = nextProp;
        return nextProp;
      }));

      if (activeUid && targetPropSnapshot && targetPropSnapshot.ownerId === activeUid && !targetPropSnapshot.isDemo) {
        persistHostPropertySafely(targetPropSnapshot, false)
          .then(saved => {
            setProperties(prev => prev.map(p => (p.id === saved.id ? saved : p)));
          })
          .catch(err => {
            handleFirestoreError(err, OperationType.UPDATE, `properties/${propertyId}`);
          });
      }
    }

    showToast(`Added host secret "${gemWithOwner.title}"`);
  };

  // Reusable Template Methods
  const addTemplate = (tmpl: Omit<PropertyTemplate, 'id' | 'createdAt'>): PropertyTemplate => {
    const newTemplate: PropertyTemplate = {
      ...tmpl,
      id: `tmpl-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setTemplates(prev => [newTemplate, ...prev]);
    showToast(language === 'ka' ? `შაბლონი "${newTemplate.name}" შეიქმნა` : `Template "${newTemplate.name}" created`);
    return newTemplate;
  };

  const updateTemplate = (tmpl: PropertyTemplate) => {
    setTemplates(prev => prev.map(t => t.id === tmpl.id ? { ...tmpl, updatedAt: new Date().toISOString() } : t));
    showToast(language === 'ka' ? `შაბლონი განახლდა` : `Template updated`);
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    showToast(language === 'ka' ? `შაბლონი წაიშალა` : `Template removed`);
  };

  const applyTemplateToProperty = (
    propertyId: string, 
    templateId: string, 
    options: { rules?: boolean; appliances?: boolean; checkout?: boolean; departureChecklist?: boolean } = { rules: true, appliances: true, checkout: true, departureChecklist: true }
  ) => {
    const tmpl = templates.find(t => t.id === templateId);
    if (!tmpl) return;

    setProperties(prev => prev.map(p => {
      if (p.id !== propertyId) return p;
      const updated: Property = {
        ...p,
        templateId: tmpl.id,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      if (options.rules !== false) {
        updated.houseRules = [...tmpl.houseRules];
        updated.quietHours = tmpl.quietHours;
        updated.trashSchedule = tmpl.trashSchedule;
      }
      if (options.appliances !== false && tmpl.appliances?.length) {
        updated.appliances = tmpl.appliances.map(app => ({
          ...app,
          id: `app-tmpl-${Date.now()}-${Math.floor(Math.random() * 1000)}`
        }));
      }
      if (options.checkout !== false) {
        updated.checkOutTime = tmpl.checkOutTime;
      }
      if (options.departureChecklist !== false && tmpl.departureChecklist) {
        updated.departureChecklist = [...tmpl.departureChecklist];
      }
      return updated;
    }));

    showToast(language === 'ka' ? `შაბლონი "${tmpl.name}" გამოყენებულია!` : `Template "${tmpl.name}" applied to guide!`);
  };

  // Reusable Instruction Library Methods
  const saveInstructionToLibrary = (guide: ApplianceGuide) => {
    setInstructionLibrary(prev => {
      const exists = prev.some(item => item.id === guide.id || item.title.toLowerCase() === guide.title.toLowerCase());
      if (exists) {
        return prev.map(item => (item.id === guide.id || item.title.toLowerCase() === guide.title.toLowerCase()) ? { ...guide, isLibraryPreset: true } : item);
      }
      return [{ ...guide, id: `lib-${Date.now()}`, isLibraryPreset: true }, ...prev];
    });
    showToast(language === 'ka' ? `ინსტრუქცია შენახულია ბიბლიოთეკაში` : `Instruction saved to reusable library`);
  };

  const deleteInstructionFromLibrary = (id: string) => {
    setInstructionLibrary(prev => prev.filter(item => item.id !== id));
    showToast(language === 'ka' ? `ინსტრუქცია წაიშალა ბიბლიოთეკიდან` : `Removed from instruction library`);
  };

  // Parse initial route from window.location.pathname or hash
  const getInitialRoute = (): AppRoute => {
    const hash = window.location.hash;
    const path = window.location.pathname;

    if (hash.startsWith('#/g/') || hash.startsWith('#guest-')) {
      return '/g/:propertySlug';
    }
    if (hash === '#/features' || path === '/features') return '/features';
    if (hash === '#/for-properties' || path === '/for-properties') return '/for-properties';
    if (hash === '#/pricing' || path === '/pricing') return '/pricing';
    if (hash === '#/demo' || path === '/demo') return '/demo';
    if (hash === '#/onboarding' || path === '/onboarding') return '/onboarding';
    if (hash === '#/app/properties' || path === '/app/properties') return '/app/properties';
    if (hash.startsWith('#/app/properties/') || path.startsWith('/app/properties/')) return '/app/properties/:id';
    if (hash === '#/app' || path === '/app') return '/app';
    if (hash === '#/admin/hosts' || path === '/admin/hosts') return '/admin/hosts';
    if (hash === '#/admin/properties' || path === '/admin/properties') return '/admin/properties';
    if (hash === '#/admin/settings' || path === '/admin/settings') return '/admin/settings';
    if (hash === '#/admin' || path === '/admin') return '/admin';
    if (path.startsWith('/g/')) return '/g/:propertySlug';

    return '/';
  };

  const getInitialGuestSlug = (): string => {
    const hash = window.location.hash;
    const path = window.location.pathname;
    if (hash.startsWith('#/g/')) {
      return decodeURIComponent(hash.replace('#/g/', '').split('?')[0]);
    }
    if (hash.startsWith('#guest-')) {
      return decodeURIComponent(hash.replace('#guest-', '').split('?')[0]);
    }
    if (path.startsWith('/g/')) {
      return decodeURIComponent(path.replace('/g/', '').split('?')[0]);
    }
    return properties[0]?.slug || 'old-tbilisi-apartment';
  };

  const [currentRoute, setCurrentRouteState] = useState<AppRoute>(getInitialRoute);
  const [activeGuestSlug, setActiveGuestSlug] = useState<string>(getInitialGuestSlug);
  const activeGuestSlugRef = useRef<string>(activeGuestSlug);
  activeGuestSlugRef.current = activeGuestSlug;
  const [toast, setToast] = useState<ToastState | null>(null);

  // Language state (Defaults to Georgian 'ka' for local hosts, supports 'ru' & 'en')
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const savedLang = localStorage.getItem('stumari_language') as Language | null;
      if (savedLang === 'ka' || savedLang === 'ru' || savedLang === 'en') return savedLang;
      // Auto-detect browser language if Russian
      if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('ru')) {
        return 'ru';
      }
    } catch {
      // ignore
    }
    return 'ka'; // 🇬🇪 Georgian default for authentic host experience
  });

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem('stumari_language', newLang);
      document.documentElement.lang = newLang;
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    try {
      document.documentElement.lang = language;
    } catch {
      // ignore
    }
  }, [language]);

  const t = translations[language] || translations.ka;

  // Dark/Light Theme mode state
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const savedTheme = localStorage.getItem('stumari_theme') as ThemeMode | null;
      if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
    } catch {
      // ignore
    }
    return 'dark'; // Default to rich modern dark bento
  });

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('stumari_theme', newTheme);
    } catch {
      // ignore
    }
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sync to localStorage (only persist demo properties in unauthenticated mode)
  useEffect(() => {
    if (firebaseUser || isAuthLoading) return;
    try {
      const demoProps = properties.filter(
        p => p.isDemo || !p.ownerId || p.ownerId === 'demo-host-uid' || INITIAL_PROPERTIES.some(init => init.id === p.id)
      );
      localStorage.setItem('stumari_mvp_properties_v2', JSON.stringify(demoProps));
    } catch (err) {
      console.error('Failed to save properties to localStorage', err);
    }
  }, [properties, firebaseUser, isAuthLoading]);

  useEffect(() => {
    try {
      if (firebaseUser || currentUser.id === 'host-user-1') {
        localStorage.setItem('stumari_mvp_user_v2', JSON.stringify(currentUser));
      }
    } catch (err) {
      console.error('Failed to save user to localStorage', err);
    }
  }, [currentUser, firebaseUser]);

  // Sync title and SEO
  useEffect(() => {
    let robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.name = 'robots';
      document.head.appendChild(robotsMeta);
    }

    if (currentRoute === '/g/:propertySlug') {
      robotsMeta.content = 'noindex, follow';
      const prop = properties.find(
        p => (p.slug === activeGuestSlug || p.id === activeGuestSlug) && p.status === 'published'
      );
      document.title = prop
        ? `${prop.title} — Digital Guest Guide (Stumari)`
        : 'Guide Not Found — Stumari';
    } else if (currentRoute.startsWith('/admin')) {
      robotsMeta.content = 'noindex, nofollow';
      document.title = 'Stumari Admin Console';
    } else if (currentRoute.startsWith('/app')) {
      robotsMeta.content = 'noindex, nofollow';
      document.title = 'Host Dashboard — Stumari';
    } else if (currentRoute === '/onboarding') {
      robotsMeta.content = 'noindex, follow';
      document.title = 'Create Your Stumari — Quick Host Onboarding';
    } else {
      robotsMeta.content = 'index, follow';
      if (currentRoute === '/features') document.title = 'Features — Stumari Digital Guest Experience';
      else if (currentRoute === '/for-properties') document.title = 'For Apartments, Guesthouses & Hotels — Stumari';
      else if (currentRoute === '/pricing') document.title = 'Simple Pricing — Stumari Host SaaS';
      else if (currentRoute === '/demo') document.title = 'Live Interactive Demo — Stumari';
      else document.title = 'Stumari — Everything your guests need. In one place.';
    }
  }, [currentRoute, activeGuestSlug, properties]);

  const showToast = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast(prev => (prev?.id === id ? null : prev));
    }, 2800);
  }, []);

  const setCurrentRoute = useCallback((route: AppRoute) => {
    setCurrentRouteState(prev => (prev === route ? prev : route));
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update history pushState if supported (never re-append ?k= token into visible URL bar)
    try {
      const targetHash =
        route === '/g/:propertySlug'
          ? `#/g/${activeGuestSlugRef.current}`
          : `#${route}`;
      if (window.location.hash !== targetHash) {
        window.history.pushState({}, '', targetHash);
      }
    } catch {
      // ignore
    }
  }, []);

  const navigateTo = useCallback((route: AppRoute) => {
    setCurrentRoute(route);
  }, [setCurrentRoute]);

  const hydrateGuestPrivateAccess = useCallback(async (prop: Property, candidateToken?: string | null): Promise<Property> => {
    const activeUid = auth.currentUser?.uid || firebaseUser?.uid;
    const isOwnerView = Boolean(activeUid && prop.ownerId && prop.ownerId === activeUid);

    if (isOfficialDemoProperty(prop) || isOwnerView) {
      return isOwnerView ? await resolveHostPropertyWithSecrets(prop) : prop;
    }

    // Determine effective capability token from explicit argument, URL, state, or sessionStorage
    let token =
      extractCapabilityToken(candidateToken) ||
      getUrlCapabilityToken() ||
      unlockedPropertyTokensRef.current[prop.id] ||
      null;
    if (!token && typeof window !== 'undefined') {
      try {
        token = extractCapabilityToken(
          sessionStorage.getItem(`stumari_guest_key_${prop.slug}`) ||
          sessionStorage.getItem(`stumari_guest_key_${prop.id}`)
        );
      } catch {}
    }

    // Always strip any legacy plaintext credentials from the public property snapshot first
    const sanitizedBase = stripPublicPropertyCredentials(prop);

    if (!isValidCapabilityToken(token)) {
      return sanitizedBase;
    }

    try {
      const privateSnap = await getDoc(doc(db, 'properties', prop.id, 'privateAccess', token));
      if (privateSnap.exists()) {
        const priv = privateSnap.data() as PropertyPrivateAccess;
        const unlockedProp: Property = {
          ...sanitizedBase,
          wifiNetwork: priv.wifiNetwork || '',
          wifiPassword: priv.wifiPassword || '',
          doorKeypadCode: priv.doorKeypadCode || '',
          lockboxCode: priv.lockboxCode || '',
          arrivalDirections: priv.arrivalDirections || '',
          parkingInstructions: priv.parkingInstructions || '',
          address: priv.address || '',
          hostPhone: priv.hostPhone || '',
          hostWhatsApp: priv.hostWhatsApp || '',
          emergencyContact: priv.emergencyContact || '',
          accessToken: token,
          hasPrivateCredentials: true
        };
        setUnlockedPropertyTokens(prev =>
          prev[prop.id] === token ? prev : { ...prev, [prop.id]: token! }
        );
        try {
          sessionStorage.setItem(`stumari_guest_key_${prop.slug}`, token);
          sessionStorage.setItem(`stumari_guest_key_${prop.id}`, token);
        } catch {}
        scrubTokenFromVisibleUrl(prop.slug);
        return unlockedProp;
      }
    } catch {
      // Invalid or revoked token: return sanitized public guide only
    }

    return sanitizedBase;
  }, [firebaseUser, resolveHostPropertyWithSecrets]);

  const fetchGuestProperty = useCallback(async (rawSlugOrId: string, explicitKey?: string): Promise<Property | null> => {
    if (!rawSlugOrId) return null;

    const cleanSlugOrId = decodeURIComponent(rawSlugOrId.split('?')[0]).trim();
    const inlineToken = extractCapabilityToken(explicitKey) || extractCapabilityToken(rawSlugOrId) || getUrlCapabilityToken();

    if (inlineToken && typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(`stumari_guest_key_${cleanSlugOrId}`, inlineToken);
      } catch {}
      scrubTokenFromVisibleUrl(cleanSlugOrId);
    }

    // 1. Check if already loaded in local state (via ref to keep fetchGuestProperty callback stable)
    const foundInState = propertiesRef.current.find(
      p => p.slug === cleanSlugOrId || p.id === cleanSlugOrId
    );
    if (foundInState && foundInState.status === 'published') {
      const hydrated = await hydrateGuestPrivateAccess(foundInState, inlineToken);
      setProperties(prev => upsertPropertyIfChanged(prev, hydrated));
      setCurrentPropertyId(prev => prev === hydrated.id ? prev : hydrated.id);
      setActiveGuestSlug(prev => prev === hydrated.slug ? prev : hydrated.slug);
      return hydrated;
    }

    try {
      // 2. Query Firestore for published property by slug
      const q = query(
        collection(db, 'properties'),
        where('slug', '==', cleanSlugOrId),
        where('status', '==', 'published'),
        limit(1)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
        const rawLoaded = { id: docSnap.id, ...docSnap.data() } as Property;
        const hydrated = await hydrateGuestPrivateAccess(rawLoaded, inlineToken);
        setProperties(prev => upsertPropertyIfChanged(prev, hydrated));
        setCurrentPropertyId(prev => prev === hydrated.id ? prev : hydrated.id);
        setActiveGuestSlug(prev => prev === hydrated.slug ? prev : hydrated.slug);
        return hydrated;
      }

      // 3. Fallback: Query by document ID directly (only return if published)
      const directDocRef = doc(db, 'properties', cleanSlugOrId);
      const directSnap = await getDoc(directDocRef);
      if (directSnap.exists()) {
        const rawLoaded = { id: directSnap.id, ...directSnap.data() } as Property;
        if (rawLoaded.status === 'published') {
          const hydrated = await hydrateGuestPrivateAccess(rawLoaded, inlineToken);
          setProperties(prev => upsertPropertyIfChanged(prev, hydrated));
          setCurrentPropertyId(prev => prev === hydrated.id ? prev : hydrated.id);
          setActiveGuestSlug(prev => prev === hydrated.slug ? prev : hydrated.slug);
          return hydrated;
        }
      }
    } catch (err) {
      console.warn('Error fetching guest property by slug/ID:', err);
    }

    // Never silently fall back to another property's demo data on unknown or draft slugs
    return null;
  }, [hydrateGuestPrivateAccess]);

  const unlockGuestPropertyAccess = useCallback(async (slugOrId: string, tokenOrUrlInput: string): Promise<boolean> => {
    const token = extractCapabilityToken(tokenOrUrlInput);
    if (!isValidCapabilityToken(token)) {
      showToast(
        language === 'ka'
          ? 'გთხოვთ შეიყვანოთ სწორი წვდომის გასაღები ან ბმული'
          : 'Please enter a valid check-in access key or link',
        'info'
      );
      return false;
    }

    const cleanSlugOrId = decodeURIComponent(slugOrId.split('?')[0]).trim();
    const target = properties.find(p => p.slug === cleanSlugOrId || p.id === cleanSlugOrId);
    if (!target) return false;

    try {
      const privateSnap = await getDoc(doc(db, 'properties', target.id, 'privateAccess', token));
      if (!privateSnap.exists()) {
        showToast(
          language === 'ka'
            ? 'წვდომის გასაღები არასწორია ან ვადაგასულია'
            : 'Invalid or expired check-in access key',
          'info'
        );
        return false;
      }

      const priv = privateSnap.data() as PropertyPrivateAccess;
      const unlockedProp: Property = {
        ...target,
        wifiNetwork: priv.wifiNetwork || '',
        wifiPassword: priv.wifiPassword || '',
        doorKeypadCode: priv.doorKeypadCode || '',
        lockboxCode: priv.lockboxCode || '',
        arrivalDirections: priv.arrivalDirections || '',
        parkingInstructions: priv.parkingInstructions || '',
        address: priv.address || '',
        hostPhone: priv.hostPhone || '',
        hostWhatsApp: priv.hostWhatsApp || '',
        emergencyContact: priv.emergencyContact || '',
        accessToken: token,
        hasPrivateCredentials: true
      };

      setUnlockedPropertyTokens(prev => ({ ...prev, [target.id]: token }));
      setProperties(prev => prev.map(p => p.id === target.id ? unlockedProp : p));
      try {
        sessionStorage.setItem(`stumari_guest_key_${target.slug}`, token);
        sessionStorage.setItem(`stumari_guest_key_${target.id}`, token);
      } catch {}
      scrubTokenFromVisibleUrl(target.slug);

      showToast(
        language === 'ka'
          ? 'Wi-Fi და შესვლის დეტალები გაიხსნა!'
          : 'Check-in & Wi-Fi credentials unlocked!',
        'success'
      );
      return true;
    } catch {
      showToast(
        language === 'ka'
          ? 'წვდომის შემოწმება ვერ მოხერხდა'
          : 'Could not verify access key',
        'info'
      );
      return false;
    }
  }, [properties, language, showToast]);

  const isPropertyAccessUnlocked = useCallback((prop?: Property | null): boolean => {
    if (!prop) return false;
    if (isOfficialDemoProperty(prop)) return true;
    const activeUid = auth.currentUser?.uid || firebaseUser?.uid;
    if (activeUid && prop.ownerId && prop.ownerId === activeUid) return true;
    return Boolean(unlockedPropertyTokens[prop.id]);
  }, [firebaseUser, unlockedPropertyTokens]);

  const getGuestCheckInUrl = useCallback((prop: Property, includeAccessKey = true): string => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://stumari.ge';
    const base = `${origin}/#/g/${prop.slug}`;
    if (!includeAccessKey) return base;
    const token =
      (isValidCapabilityToken(prop.accessToken) ? prop.accessToken : null) ||
      (isValidCapabilityToken(hostSecretsMapRef.current[prop.id]?.accessToken)
        ? hostSecretsMapRef.current[prop.id]?.accessToken
        : null) ||
      unlockedPropertyTokens[prop.id];
    if (isValidCapabilityToken(token)) {
      return `${base}?k=${encodeURIComponent(token)}`;
    }
    return base;
  }, [unlockedPropertyTokens]);

  const rotatePropertyAccessToken = useCallback(async (propertyId: string): Promise<string | null> => {
    const activeUid = auth.currentUser?.uid || firebaseUser?.uid;
    const rawTarget = properties.find(p => p.id === propertyId);
    if (!activeUid || !rawTarget || rawTarget.ownerId !== activeUid || rawTarget.isDemo) {
      showToast('Only the property owner can rotate the guest access key.', 'info');
      return null;
    }

    const target = await resolveHostPropertyWithSecrets(rawTarget);
    const oldToken = target.accessToken || hostSecretsMapRef.current[propertyId]?.accessToken;
    const newToken = generateCapabilityToken();
    const { publicDoc, privateAccess } = splitPropertyPublicAndPrivate({
      ...target,
      accessToken: newToken
    });

    try {
      await setDoc(
        doc(db, 'properties', propertyId, 'privateAccess', newToken),
        cleanFirestoreData(privateAccess)
      );
      await setDoc(
        doc(db, 'properties', propertyId, 'hostSecrets', 'config'),
        cleanFirestoreData({
          ...privateAccess,
          accessToken: newToken,
          ownerId: activeUid
        }),
        { merge: true }
      );
      // Ensure top-level property document is also sanitized so legacy fields are cleared
      await setDoc(
        doc(db, 'properties', propertyId),
        cleanFirestoreData(buildPublicPropertyFirestorePayload(publicDoc)),
        { merge: true }
      );
      if (isValidCapabilityToken(oldToken) && oldToken !== newToken) {
        await deleteDoc(doc(db, 'properties', propertyId, 'privateAccess', oldToken)).catch(() => {});
      }

      hostSecretsMapRef.current[propertyId] = {
        ...privateAccess,
        accessToken: newToken,
        ownerId: activeUid
      };

      setProperties(prev =>
        prev.map(p =>
          p.id === propertyId
            ? {
                ...target,
                accessToken: newToken,
                hasPrivateCredentials: publicDoc.hasPrivateCredentials
              }
            : p
        )
      );
      showToast(
        language === 'ka'
          ? 'სტუმრის წვდომის გასაღები განახლდა. ძველი ბმული გაუქმებულია.'
          : 'Guest check-in key rotated. Previous check-in links are now revoked.',
        'success'
      );
      return newToken;
    } catch (err: any) {
      handleFirestoreError(err, OperationType.UPDATE, `properties/${propertyId}/hostSecrets/config`);
      showToast(`Failed to rotate access key: ${err.message || 'Error'}`, 'info');
      return null;
    }
  }, [properties, firebaseUser, language, showToast, resolveHostPropertyWithSecrets]);

  const navigateToGuestGuide = useCallback(async (rawSlugOrId: string) => {
    const cleanSlug = decodeURIComponent(rawSlugOrId.split('?')[0]).trim();
    const inlineToken = extractCapabilityToken(rawSlugOrId) || getUrlCapabilityToken();
    if (inlineToken && typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(`stumari_guest_key_${cleanSlug}`, inlineToken);
      } catch {}
    }
    activeGuestSlugRef.current = cleanSlug;
    setActiveGuestSlug(prev => (prev === cleanSlug ? prev : cleanSlug));
    setCurrentRoute('/g/:propertySlug');
    scrubTokenFromVisibleUrl(cleanSlug);
    await fetchGuestProperty(cleanSlug, inlineToken || undefined);
  }, [fetchGuestProperty, setCurrentRoute]);

  const navigateToPropertyHub = useCallback((propId: string, subTab: PropertyTab = 'overview') => {
    const activeUid = auth.currentUser?.uid || firebaseUser?.uid;
    const target = propertiesRef.current.find(p => p.id === propId);
    if (activeUid) {
      if (!target || target.ownerId !== activeUid || target.isDemo) {
        showToast('You can only open properties belonging to your account.', 'info');
        setCurrentRoute('/app');
        return;
      }
    }
    if (target) {
      setCurrentPropertyId(prev => (prev === target.id ? prev : target.id));
      activeGuestSlugRef.current = target.slug;
      setActiveGuestSlug(prev => (prev === target.slug ? prev : target.slug));
    }
    setPropertySubTab(prev => (prev === subTab ? prev : subTab));
    setCurrentRoute('/app/properties/:id');
  }, [firebaseUser, showToast, setCurrentRoute]);

  const updateProperty = async (updated: Property): Promise<void> => {
    const existing = properties.find(p => p.id === updated.id);
    const withTimestamp: Property = {
      ...updated,
      accessToken:
        (isValidCapabilityToken(updated.accessToken) ? updated.accessToken : undefined) ||
        (isValidCapabilityToken(existing?.accessToken) ? existing?.accessToken : undefined) ||
        (isValidCapabilityToken(hostSecretsMapRef.current[updated.id]?.accessToken)
          ? hostSecretsMapRef.current[updated.id]?.accessToken
          : undefined),
      updatedAt: new Date().toISOString().split('T')[0]
    };

    const activeUid = auth.currentUser?.uid || firebaseUser?.uid;
    // Only attempt Firestore write if authenticated and owner matches
    if (activeUid && updated.ownerId === activeUid) {
      try {
        const persisted = await persistHostPropertySafely(withTimestamp, true);
        setProperties(prev => prev.map(p => (p.id === updated.id ? persisted : p)));
        showToast('Guidebook changes saved securely');
      } catch (err: any) {
        console.error('Failed to update property in Firestore:', err);
        handleFirestoreError(err, OperationType.UPDATE, `properties/${updated.id}`);
        showToast(`Database save failed: ${err.message || 'Error'}`, 'info');
        throw err;
      }
    } else {
      setProperties(prev => prev.map(p => (p.id === updated.id ? withTimestamp : p)));
      showToast('Guidebook saved (Local Mode)');
    }
  };

  const togglePublishProperty = async (id: string): Promise<void> => {
    const target = properties.find(p => p.id === id);
    if (!target) return;

    const nextStatus: 'published' | 'draft' = target.status === 'published' ? 'draft' : 'published';
    const hydratedTarget = await resolveHostPropertyWithSecrets(target);
    const updatedTarget: Property = {
      ...hydratedTarget,
      status: nextStatus,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setProperties(prev => prev.map(p => (p.id === id ? updatedTarget : p)));
    showToast(
      nextStatus === 'published'
        ? `"${target.title}" is now published and live`
        : `"${target.title}" is now set to draft`
    );

    const activeUid = auth.currentUser?.uid || firebaseUser?.uid;
    if (activeUid && target.ownerId === activeUid) {
      try {
        const persisted = await persistHostPropertySafely(updatedTarget, false);
        setProperties(prev => prev.map(p => (p.id === id ? persisted : p)));
      } catch (err: any) {
        handleFirestoreError(err, OperationType.UPDATE, `properties/${id}`);
      }
    }
  };

  const createProperty = async (partial?: Partial<Property>): Promise<Property> => {
    const newId = `prop-${Date.now()}`;
    const baseTitle = partial?.title?.trim() || 'Modern Boutique Retreat';
    const slug = baseTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `prop-${Math.floor(Math.random() * 900 + 100)}`;
    const currentAuthUid = auth.currentUser?.uid || firebaseUser?.uid;
    const effectiveOwnerId = currentAuthUid || 'demo-host-uid';
    
    const hasPartial = Boolean(partial && Object.keys(partial).length > 0);
    const defaultHostDisplay =
      partial?.hostName?.trim() ||
      auth.currentUser?.displayName ||
      firebaseUser?.displayName ||
      (currentUser?.id && currentUser.id !== 'host-user-1' ? currentUser.name : '') ||
      'Your Host';

    const newProp: Property = {
      id: newId,
      ownerId: effectiveOwnerId,
      isDemo: !currentAuthUid,
      slug,
      title: baseTitle,
      subtitle: partial?.subtitle !== undefined ? partial.subtitle : 'Designer residence with all essential amenities',
      tagline: partial?.tagline || 'Make yourself at home. Everything you need is right here.',
      type: partial?.type || 'apartment',
      status: partial?.status || 'published',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      viewsCount: 1,
      sourcePlatform: partial?.sourcePlatform || 'direct',
      sourceUrl: partial?.sourceUrl || '',

      address: hasPartial ? (partial?.address ?? '') : '12 Rustaveli Avenue',
      city: partial?.city?.trim() || 'Tbilisi',
      country: partial?.country?.trim() || 'Georgia',
      coverImage: partial?.coverImage || partial?.photos?.[0]?.url || '',
      photos: partial?.photos || [],
      languages: partial?.languages || ['en', 'ka'],

      hostName: defaultHostDisplay,
      hostAvatar: currentUser.avatar,
      hostRole: partial?.hostRole || 'Host & Superhost',
      hostPhone: hasPartial ? (partial?.hostPhone || partial?.hostWhatsApp || '') : '+995 555 123 456',
      hostWhatsApp: hasPartial ? (partial?.hostWhatsApp || partial?.hostPhone || '') : '+995555123456',
      emergencyContact: hasPartial ? (partial?.emergencyContact ?? '') : '+995 555 999 888',
      emergencyServicesNumber: partial?.emergencyServicesNumber || '112',

      welcomeTitle: partial?.welcomeTitle || `Welcome to ${baseTitle}!`,
      welcomeGreeting: partial?.welcomeGreeting || 'We are delighted to host you. Please reach out if you need anything!',

      checkInTime: partial?.checkInTime || '3:00 PM',
      checkOutTime: partial?.checkOutTime || '11:00 AM',
      checkInMethod: partial?.checkInMethod || 'keypad',
      doorKeypadCode: hasPartial ? (partial?.doorKeypadCode ?? '') : '5824#',
      lockboxCode: hasPartial ? (partial?.lockboxCode ?? '') : '4219',
      parkingInstructions: hasPartial ? (partial?.parkingInstructions ?? '') : 'Free street parking or courtyard parking available.',
      arrivalDirections: hasPartial ? (partial?.arrivalDirections ?? '') : 'Enter the courtyard gate, proceed to the 2nd floor, and enter your keypad code.',

      wifiNetwork: hasPartial ? (partial?.wifiNetwork ?? '') : `${baseTitle.replace(/[^a-zA-Z0-9]/g, '')}_Guest`,
      wifiPassword: hasPartial ? (partial?.wifiPassword ?? '') : 'WelcomeHome2026!',

      appliances: partial?.appliances !== undefined ? partial.appliances : [
        {
          id: 'app-default-1',
          title: 'Climate Control (AC & Heat)',
          icon: 'Thermometer',
          instructions: 'Use wall remote to set desired temperature (22°C recommended).'
        },
        {
          id: 'app-default-2',
          title: 'Espresso Coffee Machine',
          icon: 'Coffee',
          instructions: 'Capsules are in the kitchen pantry drawer. Insert pod and press brew button.'
        }
      ],

      trashSchedule: partial?.trashSchedule !== undefined ? partial.trashSchedule : 'Municipal green bins on the corner. Collection daily after 9 PM.',
      quietHours: partial?.quietHours || '11:00 PM – 8:00 AM',
      houseRules: partial?.houseRules !== undefined ? partial.houseRules : [
        'No smoking inside (balcony is fine).',
        'Quiet hours from 11 PM to 8 AM.',
        'Remove outdoor footwear in the hallway.'
      ],

      recommendations: partial?.recommendations !== undefined ? partial.recommendations : [],
      gemIds: partial?.gemIds || [],
      customGems: partial?.customGems || [],

      taxiInfo: partial?.taxiInfo !== undefined ? partial.taxiInfo : 'Download Bolt app for easy city transit.',
      transitInfo: partial?.transitInfo !== undefined ? partial.transitInfo : 'Nearest metro/bus station is a 5-minute walk.',
      airportTransit: partial?.airportTransit !== undefined ? partial.airportTransit : '25-minute taxi ride to the international airport.',

      departureChecklist: partial?.departureChecklist !== undefined ? partial.departureChecklist : [
        'Turn off lights and climate control.',
        'Place used towels in the bathroom basket.',
        'Lock front door deadbolt.'
      ]
    };

    if (partial?.templateId) {
      newProp.templateId = partial.templateId;
    }

    // If authenticated, persist public metadata to /properties/{id} and credentials to protected subcollections
    if (currentAuthUid) {
      try {
        const inMemoryProp = await persistHostPropertySafely(newProp, true);

        setProperties(prev => [inMemoryProp, ...prev.filter(p => p.id !== inMemoryProp.id)]);
        setCurrentPropertyId(inMemoryProp.id);
        setActiveGuestSlug(inMemoryProp.slug);
        showToast(
          inMemoryProp.status === 'draft'
            ? `Saved draft "${inMemoryProp.title}" to database`
            : `Published "${inMemoryProp.title}" to database`,
          'success'
        );
        return inMemoryProp;
      } catch (err: any) {
        console.error('Failed to write property to Firestore:', err);
        handleFirestoreError(err, OperationType.CREATE, `properties/${newProp.id}`);
        showToast(`Database write failed: ${err.message || 'Write error'}`, 'info');
        throw err;
      }
    } else {
      // Unauthenticated demo mode: save in local state only
      setProperties(prev => [newProp, ...prev.filter(p => p.id !== newProp.id)]);
      setCurrentPropertyId(newProp.id);
      setActiveGuestSlug(newProp.slug);
      showToast(`Created "${newProp.title}" (Local Preview Mode)`, 'success');
      return newProp;
    }
  };

  const duplicateProperty = async (id: string): Promise<void> => {
    const rawExisting = properties.find(p => p.id === id);
    if (!rawExisting) return;
    const currentAuthUid = auth.currentUser?.uid || firebaseUser?.uid;
    if (currentAuthUid && (rawExisting.ownerId !== currentAuthUid || rawExisting.isDemo)) {
      showToast('You can only duplicate properties belonging to your account', 'info');
      return;
    }
    const existing = await resolveHostPropertyWithSecrets(rawExisting);
    const effectiveOwnerId = currentAuthUid || currentUser.id || 'demo-host-uid';
    const duplicatedBase: Property = {
      ...existing,
      id: `prop-${Date.now()}`,
      ownerId: effectiveOwnerId,
      isDemo: !currentAuthUid,
      accessToken: generateCapabilityToken(),
      slug: `${existing.slug}-copy-${Math.floor(Math.random() * 900 + 100)}`,
      title: `${existing.title} (Copy)`,
      viewsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    try {
      if (currentAuthUid) {
        const inMemoryProp = await persistHostPropertySafely(duplicatedBase, true);
        setProperties(prev => [inMemoryProp, ...prev]);
        setCurrentPropertyId(inMemoryProp.id);
        setActiveGuestSlug(inMemoryProp.slug);
      } else {
        setProperties(prev => [duplicatedBase, ...prev]);
        setCurrentPropertyId(duplicatedBase.id);
        setActiveGuestSlug(duplicatedBase.slug);
      }
      showToast(`Duplicated "${existing.title}" and saved to database`);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.CREATE, `properties/${duplicatedBase.id}`);
      showToast(`Database write failed: ${err.message || 'Error'}`, 'info');
      throw err;
    }
  };

  const deleteProperty = async (id: string): Promise<void> => {
    const currentAuthUid = auth.currentUser?.uid || firebaseUser?.uid;
    if (!currentAuthUid && properties.length <= 1) {
      showToast('You must keep at least one property', 'info');
      return;
    }
    const propToDelete = properties.find(p => p.id === id);
    if (!propToDelete) return;

    if (!currentAuthUid && propToDelete.isDemo && properties.filter(p => !p.isDemo).length === 0) {
      showToast('Starter demo templates cannot be deleted', 'info');
      return;
    }

    if (currentAuthUid && (propToDelete.ownerId !== currentAuthUid || propToDelete.isDemo)) {
      showToast('You cannot delete another host\'s property', 'info');
      return;
    }

    try {
      if (currentAuthUid) {
        if (propToDelete.accessToken && propToDelete.accessToken.length >= 32) {
          await deleteDoc(doc(db, 'properties', id, 'privateAccess', propToDelete.accessToken)).catch(() => {});
        }
        await deleteDoc(doc(db, 'properties', id, 'hostSecrets', 'config')).catch(() => {});
        await deleteDoc(doc(db, 'properties', id));
      }
      setProperties(prev => prev.filter(p => p.id !== id));
      if (currentPropertyId === id) {
        const remaining = properties.filter(p => p.id !== id && (!currentAuthUid || (p.ownerId === currentAuthUid && !p.isDemo)));
        if (remaining.length > 0) {
          setCurrentPropertyId(remaining[0].id);
          setActiveGuestSlug(remaining[0].slug);
        } else {
          setCurrentPropertyId('');
        }
      }
      showToast(`Deleted "${propToDelete.title}" from database`);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.DELETE, `properties/${id}`);
      showToast(`Database delete failed: ${err.message || 'Error'}`, 'info');
      throw err;
    }
  };

  const updateCurrentUser = (userUpdate: Partial<HostUser>) => {
    setCurrentUser(prev => ({ ...prev, ...userUpdate }));
    showToast('Host profile & settings updated');
  };

  const rawCurrentProperty = useMemo(() => {
    const activeUid = auth.currentUser?.uid || firebaseUser?.uid;
    if (activeUid) {
      const owned = properties.filter(p => p.ownerId === activeUid && !p.isDemo);
      return owned.find(p => p.id === currentPropertyId) || owned[0] || (null as unknown as Property);
    }
    return properties.find(p => p.id === currentPropertyId) || properties[0];
  }, [properties, currentPropertyId, firebaseUser]);

  const currentProperty = useMemo(() => {
    return getLocalizedProperty(rawCurrentProperty, language);
  }, [rawCurrentProperty, language]);

  const getLocalizedPropertyForContext = useCallback(
    (p: Property) => getLocalizedProperty(p, language),
    [language]
  );

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        language,
        setLanguage,
        t,
        currentRoute,
        setCurrentRoute,
        propertySubTab,
        setPropertySubTab,
        guideActiveSection,
        setGuideActiveSection,
        properties,
        currentProperty,
        setCurrentPropertyId,
        updateProperty,
        createProperty,
        duplicateProperty,
        deleteProperty,
        togglePublishProperty,
        rotatePropertyAccessToken,
        unlockGuestPropertyAccess,
        isPropertyAccessUnlocked,
        getGuestCheckInUrl,
        currentUser,
        updateCurrentUser,
        toast,
        showToast,
        activeGuestSlug,
        navigateToGuestGuide,
        fetchGuestProperty,
        navigateToPropertyHub,
        navigateTo,
        getLocalizedProperty: getLocalizedPropertyForContext,

        // Stumari Gems & Stay Moments
        gems,
        togglePropertyGem,
        addCustomGem,
        activeMood,
        setActiveMood,
        activeExperience,
        setActiveExperience,
        activeMoment,
        setActiveMoment,

        // Review Engine & Stay Feedback
        feedbacks,
        addStayFeedback,
        resolveFeedback,
        isFeedbackModalOpen,
        setIsFeedbackModalOpen,

        // Guest Requests & Issues (Stage 1 Operational)
        requests,
        addGuestRequest,
        updateRequestStatus,

        // Arrivals Schedule (Stage 1 Operational)
        todayArrivals,
        markArrivalCheckedIn,

        // Reusable Property Templates & Instruction Library
        templates,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        applyTemplateToProperty,
        instructionLibrary,
        saveInstructionToLibrary,
        deleteInstructionFromLibrary,

        // Guest Saved Favorites
        guestFavorites,
        toggleGuestFavorite,
        isGuestFavorite,
        guestFavoritesCount: guestFavorites.length,

        // Unified Add Property Modal
        isAddPropertyModalOpen,
        openAddPropertyModal,
        closeAddPropertyModal,

        // Firebase Auth
        firebaseUser,
        isAuthLoading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOutHost,
        resetPassword,
        loginAsDemoHost,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
