import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Toast } from './components/common/Toast';
import { AuthModal } from './components/common/AuthModal';
import { LandingPage } from './components/marketing/LandingPage';
import { FeaturesPage } from './components/marketing/FeaturesPage';
import { ForPropertiesPage } from './components/marketing/ForPropertiesPage';
import { PricingPage } from './components/marketing/PricingPage';
import { DemoPage } from './components/marketing/DemoPage';
import { HostDashboardSimple } from './components/host/HostDashboardSimple';
import { PropertyHub } from './components/host/PropertyHub';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { GuidedOnboardingModal } from './components/onboarding/GuidedOnboardingModal';
import { GuestGuideSimple } from './components/guest/GuestGuideSimple';
import { AdminConsole } from './components/admin/AdminConsole';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 16,
    scale: 0.992,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.28,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.994,
    transition: {
      duration: 0.18,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const MainApp: React.FC = () => {
  const { 
    currentRoute, 
    setCurrentRoute, 
    navigateToGuestGuide, 
    navigateToPropertyHub,
    properties,
    currentProperty,
    activeGuestSlug,
    theme,
    isAddPropertyModalOpen,
    closeAddPropertyModal
  } = useApp();

  // Scroll to top on route change for a clean entrance
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentRoute, activeGuestSlug]);

  // Listen to hash and URL navigation for SPA routing
  useEffect(() => {
    const handleUrlChange = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;

      if (hash.startsWith('#/g/')) {
        const slug = hash.replace('#/g/', '');
        navigateToGuestGuide(slug);
      } else if (hash.startsWith('#guest-')) {
        const slug = hash.replace('#guest-', '');
        navigateToGuestGuide(slug);
      } else if (hash === '#/features' || path === '/features') {
        setCurrentRoute('/features');
      } else if (hash === '#/for-properties' || path === '/for-properties') {
        setCurrentRoute('/for-properties');
      } else if (hash === '#/pricing' || path === '/pricing') {
        setCurrentRoute('/pricing');
      } else if (hash === '#/demo' || path === '/demo') {
        setCurrentRoute('/demo');
      } else if (hash === '#/onboarding' || path === '/onboarding') {
        setCurrentRoute('/onboarding');
      } else if (hash === '#/app/properties' || path === '/app/properties') {
        setCurrentRoute('/app/properties');
      } else if (hash === '#/app/templates' || path === '/app/templates') {
        setCurrentRoute('/app/templates');
      } else if (hash === '#/app/analytics' || path === '/app/analytics') {
        setCurrentRoute('/app/analytics');
      } else if (hash === '#/app/reviews' || path === '/app/reviews') {
        setCurrentRoute('/app/reviews');
      } else if (hash === '#/app/requests' || path === '/app/requests') {
        setCurrentRoute('/app/requests');
      } else if (hash.startsWith('#/app/properties/')) {
        const parts = hash.replace('#/app/properties/', '').split('/');
        const propId = parts[0];
        const tab = (parts[1] as any) || 'overview';
        navigateToPropertyHub(propId, tab);
      } else if (hash === '#/app' || path === '/app') {
        setCurrentRoute('/app');
      } else if (hash.startsWith('#/admin')) {
        if (hash === '#/admin/hosts') setCurrentRoute('/admin/hosts');
        else if (hash === '#/admin/properties') setCurrentRoute('/admin/properties');
        else if (hash === '#/admin/settings') setCurrentRoute('/admin/settings');
        else setCurrentRoute('/admin');
      } else if (hash === '#/' || hash === '' || path === '/') {
        // Root marketing
      }
    };

    handleUrlChange();
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  const isGuestFullscreen = currentRoute === '/g/:propertySlug';
  const isDark = theme === 'dark';

  // Compute key to ensure Framer Motion triggers on dynamic routes as well
  const pageKey = 
    currentRoute === '/g/:propertySlug'
      ? `guest-${activeGuestSlug || 'active'}`
      : currentRoute === '/app/properties/:id'
      ? `property-${currentProperty?.id || 'hub'}`
      : currentRoute;

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 w-full overflow-x-hidden ${
      isDark ? 'bg-[#0D0E12] text-zinc-100' : 'bg-[#F8F8F6] text-zinc-900'
    } selection:bg-[#F55A51] selection:text-white tracking-tight`}>
      
      {/* Universal Navigation Header */}
      {!isGuestFullscreen && <Header />}

      {/* Main View Router with Framer Motion Page Entrance Transition */}
      <main className="flex-1 w-full overflow-x-hidden flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={pageKey}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full flex-1 flex flex-col"
          >
            {/* 1. Marketing 5 Pages */}
            {currentRoute === '/' && <LandingPage />}
            {currentRoute === '/features' && <FeaturesPage />}
            {currentRoute === '/for-properties' && <ForPropertiesPage />}
            {currentRoute === '/pricing' && <PricingPage />}
            {currentRoute === '/demo' && <DemoPage />}

            {/* 2. Host SaaS Views */}
            {currentRoute === '/app' && <HostDashboardSimple isFullList={false} activeTab="overview" />}
            {currentRoute === '/app/analytics' && <HostDashboardSimple isFullList={false} activeTab="analytics" />}
            {currentRoute === '/app/properties' && <HostDashboardSimple isFullList={true} activeTab="properties" />}
            {currentRoute === '/app/templates' && <HostDashboardSimple isFullList={false} activeTab="templates" />}
            {currentRoute === '/app/reviews' && <HostDashboardSimple isFullList={false} activeTab="reviews" />}
            {currentRoute === '/app/requests' && <HostDashboardSimple isFullList={false} activeTab="requests" />}
            {currentRoute === '/app/properties/:id' && <PropertyHub />}

            {/* 3. Onboarding */}
            {currentRoute === '/onboarding' && <OnboardingWizard />}

            {/* 4. Guest Experience */}
            {currentRoute === '/g/:propertySlug' && <GuestGuideSimple />}

            {/* 5. Admin Console */}
            {(currentRoute === '/admin' || 
              currentRoute === '/admin/hosts' || 
              currentRoute === '/admin/properties' || 
              currentRoute === '/admin/settings') && <AdminConsole />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Toast Notifications */}
      <Toast />

      {/* Firebase Authentication Modal */}
      <AuthModal />

      {/* Unified Add Property Modal */}
      <GuidedOnboardingModal
        isOpen={isAddPropertyModalOpen}
        onClose={closeAddPropertyModal}
        onCompleted={(newProp) => {
          closeAddPropertyModal();
          if (newProp && newProp.id) {
            navigateToPropertyHub(newProp.id, 'overview');
          }
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
