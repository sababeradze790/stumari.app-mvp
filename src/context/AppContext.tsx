import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Property, 
  HostUser, 
  AppRoute, 
  StumariGem, 
  StayFeedback, 
  StayMoment, 
  GemMood, 
  GemExperience 
} from '../types';
import { INITIAL_PROPERTIES, MOCK_HOST_USER, MOCK_STAY_FEEDBACKS } from '../data/mockData';
import { TBILISI_GEMS_LIBRARY } from '../data/stumariGemsData';
import { Language, SUPPORTED_LANGUAGES } from '../i18n/types';
import { translations, Translations } from '../i18n/translations';
import { getLocalizedProperty } from '../data/localizedProperties';
import { doc, setDoc, deleteDoc, onSnapshot, collection } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'info';
}

export type ThemeMode = 'dark' | 'light';

export type PropertyTab = 'overview' | 'guide' | 'gems' | 'reviews' | 'preview' | 'qr' | 'settings';
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
  updateProperty: (updated: Property) => void;
  createProperty: (partial?: Partial<Property>) => Property;
  duplicateProperty: (id: string) => void;
  deleteProperty: (id: string) => void;
  togglePublishProperty: (id: string) => void;
  currentUser: HostUser;
  updateCurrentUser: (user: Partial<HostUser>) => void;
  toast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'info') => void;
  activeGuestSlug: string;
  navigateToGuestGuide: (slugOrId: string) => void;
  navigateToPropertyHub: (propId: string, subTab?: PropertyTab) => void;
  navigateTo: (route: AppRoute) => void;
  getLocalizedProperty: (prop: Property) => Property;

  // Stumari Gems & Stay Moments
  gems: StumariGem[];
  togglePropertyGem: (propertyId: string, gemId: string) => void;
  addCustomGem: (gem: StumariGem) => void;
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const saved = localStorage.getItem('stumari_mvp_properties_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_PROPERTIES;
  });

  const [currentPropertyId, setCurrentPropertyId] = useState<string>(() => {
    return properties[0]?.id || 'prop-1';
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

  // Stumari Gems State & Filters
  const [gems, setGems] = useState<StumariGem[]>(() => {
    try {
      const saved = localStorage.getItem('stumari_gems_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return TBILISI_GEMS_LIBRARY;
  });

  const [activeMood, setActiveMood] = useState<GemMood | 'all'>('all');
  const [activeExperience, setActiveExperience] = useState<GemExperience | 'all'>('all');
  const [activeMoment, setActiveMoment] = useState<StayMoment>('during_stay');

  // Stay Feedback & Review Engine State
  const [feedbacks, setFeedbacks] = useState<StayFeedback[]>(() => {
    try {
      const saved = localStorage.getItem('stumari_feedbacks_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return MOCK_STAY_FEEDBACKS;
  });

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('stumari_gems_v1', JSON.stringify(gems));
    } catch {
      // ignore
    }
  }, [gems]);

  useEffect(() => {
    try {
      localStorage.setItem('stumari_feedbacks_v1', JSON.stringify(feedbacks));
    } catch {
      // ignore
    }
  }, [feedbacks]);

  // Firestore Real-Time Listeners & Seeding
  useEffect(() => {
    let unsubProps: (() => void) | undefined;
    let unsubFeedbacks: (() => void) | undefined;
    let unsubGems: (() => void) | undefined;

    try {
      unsubProps = onSnapshot(collection(db, 'properties'), (snapshot) => {
        if (!snapshot.empty) {
          const remoteList: Property[] = [];
          snapshot.forEach(docSnap => {
            remoteList.push(docSnap.data() as Property);
          });
          setProperties(remoteList);
        } else {
          // If Firestore is empty, seed initial properties so they persist across cloud sessions
          INITIAL_PROPERTIES.forEach(prop => {
            setDoc(doc(db, 'properties', prop.id), prop).catch(err => {
              handleFirestoreError(err, OperationType.WRITE, `properties/${prop.id}`);
            });
          });
        }
      }, (err) => {
        handleFirestoreError(err, OperationType.GET, 'properties');
      });

      unsubFeedbacks = onSnapshot(collection(db, 'feedbacks'), (snapshot) => {
        if (!snapshot.empty) {
          const remoteList: StayFeedback[] = [];
          snapshot.forEach(docSnap => {
            remoteList.push(docSnap.data() as StayFeedback);
          });
          setFeedbacks(remoteList);
        }
      }, (err) => {
        handleFirestoreError(err, OperationType.GET, 'feedbacks');
      });

      unsubGems = onSnapshot(collection(db, 'gems'), (snapshot) => {
        if (!snapshot.empty) {
          const remoteList: StumariGem[] = [];
          snapshot.forEach(docSnap => {
            remoteList.push(docSnap.data() as StumariGem);
          });
          setGems(remoteList);
        }
      }, (err) => {
        handleFirestoreError(err, OperationType.GET, 'gems');
      });
    } catch (e) {
      console.warn('Firestore listener initialisation:', e);
    }

    return () => {
      if (unsubProps) unsubProps();
      if (unsubFeedbacks) unsubFeedbacks();
      if (unsubGems) unsubGems();
    };
  }, []);

  const addStayFeedback = (feedbackData: Omit<StayFeedback, 'id' | 'createdAt' | 'status'>) => {
    const newFeedback: StayFeedback = {
      id: `fb-${Date.now()}`,
      createdAt: new Date().toLocaleString(),
      status: 'new',
      ...feedbackData
    };
    setFeedbacks(prev => [newFeedback, ...prev]);

    // Persist to Firestore
    try {
      setDoc(doc(db, 'feedbacks', newFeedback.id), newFeedback).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `feedbacks/${newFeedback.id}`);
      });
    } catch (e) {
      // local fallback handled
    }

    if (feedbackData.sentiment === 'amazing' || feedbackData.sentiment === 'good') {
      showToast('Thank you for your feedback! ❤️ Public review prompt opened.');
    } else {
      showToast('Private feedback delivered directly to your host. Thank you for helping us improve!');
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

  const togglePropertyGem = (propertyId: string, gemId: string) => {
    let updatedGemIds: string[] = [];
    setProperties(prev => prev.map(p => {
      if (p.id !== propertyId) return p;
      const currentGemIds = p.gemIds || [];
      const updated = currentGemIds.includes(gemId)
        ? currentGemIds.filter(id => id !== gemId)
        : [...currentGemIds, gemId];
      updatedGemIds = updated;
      return { ...p, gemIds: updated };
    }));

    try {
      setDoc(doc(db, 'properties', propertyId), { gemIds: updatedGemIds }, { merge: true }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `properties/${propertyId}`);
      });
    } catch (e) {}
    showToast('Local gem saved to property guide');
  };

  const addCustomGem = (newGem: StumariGem) => {
    setGems(prev => [newGem, ...prev]);
    try {
      setDoc(doc(db, 'gems', newGem.id), newGem).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `gems/${newGem.id}`);
      });
    } catch (e) {}
    showToast(`Added host secret "${newGem.title}"`);
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

  const [currentRoute, setCurrentRouteState] = useState<AppRoute>(getInitialRoute);
  const [activeGuestSlug, setActiveGuestSlug] = useState<string>(properties[0]?.slug || 'old-tbilisi-apartment');
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

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('stumari_mvp_properties_v2', JSON.stringify(properties));
    } catch (err) {
      console.error('Failed to save properties to localStorage', err);
    }
  }, [properties]);

  useEffect(() => {
    try {
      localStorage.setItem('stumari_mvp_user_v2', JSON.stringify(currentUser));
    } catch (err) {
      console.error('Failed to save user to localStorage', err);
    }
  }, [currentUser]);

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
      const prop = properties.find(p => p.slug === activeGuestSlug) || properties[0];
      document.title = `${prop.title} — Digital Guest Guide (Stumari)`;
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

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast(prev => (prev?.id === id ? null : prev));
    }, 2800);
  };

  const setCurrentRoute = (route: AppRoute) => {
    setCurrentRouteState(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update history pushState if supported
    try {
      if (route === '/g/:propertySlug') {
        window.history.pushState({}, '', `#/g/${activeGuestSlug}`);
      } else {
        window.history.pushState({}, '', `#${route}`);
      }
    } catch {
      // ignore
    }
  };

  const navigateTo = (route: AppRoute) => {
    setCurrentRoute(route);
  };

  const navigateToGuestGuide = (slugOrId: string) => {
    const target = properties.find(p => p.slug === slugOrId || p.id === slugOrId) || properties[0];
    if (target) {
      setActiveGuestSlug(target.slug);
      setCurrentPropertyId(target.id);
    }
    setCurrentRoute('/g/:propertySlug');
  };

  const navigateToPropertyHub = (propId: string, subTab: PropertyTab = 'overview') => {
    const target = properties.find(p => p.id === propId);
    if (target) {
      setCurrentPropertyId(target.id);
      setActiveGuestSlug(target.slug);
    }
    setPropertySubTab(subTab);
    setCurrentRoute('/app/properties/:id');
  };

  const updateProperty = (updated: Property) => {
    const withTimestamp = { ...updated, updatedAt: new Date().toISOString().split('T')[0] };
    setProperties(prev => prev.map(p => p.id === updated.id ? withTimestamp : p));
    try {
      setDoc(doc(db, 'properties', updated.id), withTimestamp, { merge: true }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `properties/${updated.id}`);
      });
    } catch (e) {}
    showToast('Guidebook changes saved successfully');
  };

  const togglePublishProperty = (id: string) => {
    let nextStatus: 'published' | 'draft' = 'published';
    setProperties(prev => prev.map(p => {
      if (p.id === id) {
        nextStatus = p.status === 'published' ? 'draft' : 'published';
        showToast(nextStatus === 'published' ? `"${p.title}" is now published and live` : `"${p.title}" is now set to draft`);
        return { ...p, status: nextStatus };
      }
      return p;
    }));
    try {
      setDoc(doc(db, 'properties', id), { status: nextStatus }, { merge: true }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `properties/${id}`);
      });
    } catch (e) {}
  };

  const createProperty = (partial?: Partial<Property>): Property => {
    const newId = `prop-${Date.now()}`;
    const baseTitle = partial?.title || 'Modern Boutique Retreat';
    const slug = baseTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `prop-${Math.floor(Math.random() * 900 + 100)}`;
    
    const newProp: Property = {
      id: newId,
      slug,
      title: baseTitle,
      subtitle: partial?.subtitle || 'Designer residence with all essential amenities',
      tagline: partial?.tagline || 'Make yourself at home. Everything you need is right here.',
      type: partial?.type || 'apartment',
      status: 'published',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      viewsCount: 1,
      sourcePlatform: partial?.sourcePlatform || 'direct',
      sourceUrl: partial?.sourceUrl || '',

      address: partial?.address || '12 Rustaveli Avenue',
      city: partial?.city || 'Tbilisi',
      country: partial?.country || 'Georgia',
      coverImage: partial?.coverImage || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      languages: ['en', 'ka'],

      hostName: partial?.hostName || currentUser.name || 'Your Host',
      hostAvatar: currentUser.avatar,
      hostRole: 'Host & Superhost',
      hostPhone: partial?.hostPhone || '+995 555 123 456',
      hostWhatsApp: partial?.hostWhatsApp || '+995555123456',
      emergencyContact: partial?.emergencyContact || '+995 555 999 888',
      emergencyServicesNumber: '112',

      welcomeTitle: partial?.welcomeTitle || `Welcome to ${baseTitle}!`,
      welcomeGreeting: partial?.welcomeGreeting || 'We are delighted to host you. Please reach out if you need anything!',

      checkInTime: partial?.checkInTime || '3:00 PM',
      checkOutTime: partial?.checkOutTime || '11:00 AM',
      checkInMethod: partial?.checkInMethod || 'keypad',
      doorKeypadCode: partial?.doorKeypadCode || '5824#',
      lockboxCode: partial?.lockboxCode || '4219',
      parkingInstructions: partial?.parkingInstructions || 'Free street parking or courtyard parking available.',
      arrivalDirections: partial?.arrivalDirections || 'Enter the courtyard gate, proceed to the 2nd floor, and enter your keypad code.',

      wifiNetwork: partial?.wifiNetwork || `${baseTitle.replace(/[^a-zA-Z0-9]/g, '')}_Guest`,
      wifiPassword: partial?.wifiPassword || 'WelcomeHome2026!',

      appliances: partial?.appliances || [
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

      trashSchedule: partial?.trashSchedule || 'Municipal green bins on the corner. Collection daily after 9 PM.',
      quietHours: partial?.quietHours || '11:00 PM – 8:00 AM',
      houseRules: partial?.houseRules || [
        'No smoking inside (balcony is fine).',
        'Quiet hours from 11 PM to 8 AM.',
        'Remove outdoor footwear in the hallway.'
      ],

      recommendations: partial?.recommendations || [
        {
          id: 'rec-default-1',
          name: 'The Neighborhood Bakery & Coffee',
          category: 'coffee',
          description: 'Specialty flat whites, fresh croissants, and artisan toasts.',
          hostTip: 'Try the cinnamon morning bun.',
          address: 'Main Street 4',
          distance: '2 min walk (150m)',
          mapsUrl: 'https://maps.google.com/?q=coffee+near+me'
        }
      ],

      taxiInfo: partial?.taxiInfo || 'Download Bolt app for easy city transit.',
      transitInfo: partial?.transitInfo || 'Nearest metro/bus station is a 5-minute walk.',
      airportTransit: partial?.airportTransit || '25-minute taxi ride to the international airport.',

      departureChecklist: partial?.departureChecklist || [
        'Turn off lights and climate control.',
        'Place used towels in the bathroom basket.',
        'Lock front door deadbolt.'
      ]
    };

    setProperties(prev => [newProp, ...prev]);
    setCurrentPropertyId(newProp.id);
    setActiveGuestSlug(newProp.slug);

    try {
      setDoc(doc(db, 'properties', newProp.id), newProp).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `properties/${newProp.id}`);
      });
    } catch (e) {}

    showToast(`Created new guide "${newProp.title}"`);
    return newProp;
  };

  const duplicateProperty = (id: string) => {
    const existing = properties.find(p => p.id === id);
    if (!existing) return;
    const duplicated: Property = {
      ...existing,
      id: `prop-${Date.now()}`,
      slug: `${existing.slug}-copy-${Math.floor(Math.random() * 900 + 100)}`,
      title: `${existing.title} (Copy)`,
      viewsCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProperties(prev => [duplicated, ...prev]);
    try {
      setDoc(doc(db, 'properties', duplicated.id), duplicated).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `properties/${duplicated.id}`);
      });
    } catch (e) {}
    showToast(`Duplicated "${existing.title}"`);
  };

  const deleteProperty = (id: string) => {
    if (properties.length <= 1) {
      showToast('You must keep at least one property', 'info');
      return;
    }
    const propToDelete = properties.find(p => p.id === id);
    setProperties(prev => prev.filter(p => p.id !== id));
    if (currentPropertyId === id) {
      const remaining = properties.filter(p => p.id !== id);
      setCurrentPropertyId(remaining[0].id);
      setActiveGuestSlug(remaining[0].slug);
    }
    try {
      deleteDoc(doc(db, 'properties', id)).catch(err => {
        handleFirestoreError(err, OperationType.DELETE, `properties/${id}`);
      });
    } catch (e) {}
    showToast(`Deleted "${propToDelete?.title || 'property'}"`);
  };

  const updateCurrentUser = (userUpdate: Partial<HostUser>) => {
    setCurrentUser(prev => ({ ...prev, ...userUpdate }));
    showToast('Host profile & settings updated');
  };

  const rawCurrentProperty = properties.find(p => p.id === currentPropertyId) || properties[0];
  const currentProperty = getLocalizedProperty(rawCurrentProperty, language);

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
        currentUser,
        updateCurrentUser,
        toast,
        showToast,
        activeGuestSlug,
        navigateToGuestGuide,
        navigateToPropertyHub,
        navigateTo,
        getLocalizedProperty: (p: Property) => getLocalizedProperty(p, language),

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
