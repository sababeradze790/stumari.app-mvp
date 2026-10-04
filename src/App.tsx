import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Toast } from './components/common/Toast';
import { LandingPage } from './components/marketing/LandingPage';
import { FeaturesPage } from './components/marketing/FeaturesPage';
import { ForPropertiesPage } from './components/marketing/ForPropertiesPage';
import { PricingPage } from './components/marketing/PricingPage';
import { DemoPage } from './components/marketing/DemoPage';
import { HostDashboardSimple } from './components/host/HostDashboardSimple';
import { PropertyHub } from './components/host/PropertyHub';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { GuestGuideSimple } from './components/guest/GuestGuideSimple';
import { AdminConsole } from './components/admin/AdminConsole';

const MainApp: React.FC = () => {
  const { 
    currentRoute, 
    setCurrentRoute, 
    navigateToGuestGuide, 
    navigateToPropertyHub,
    properties,
    theme 
  } = useApp();

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

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 w-full overflow-x-hidden ${
      isDark ? 'bg-[#080B0D] text-stone-100' : 'bg-stone-50 text-stone-900'
    } selection:bg-[#E4E98E] selection:text-stone-950`}>
      
      {/* Universal Navigation Header */}
      {!isGuestFullscreen && <Header />}

      {/* Main View Router */}
      <main className="flex-1 w-full overflow-x-hidden">
        {/* 1. Marketing 5 Pages */}
        {currentRoute === '/' && <LandingPage />}
        {currentRoute === '/features' && <FeaturesPage />}
        {currentRoute === '/for-properties' && <ForPropertiesPage />}
        {currentRoute === '/pricing' && <PricingPage />}
        {currentRoute === '/demo' && <DemoPage />}

        {/* 2. Host SaaS Views */}
        {currentRoute === '/app' && <HostDashboardSimple isFullList={false} />}
        {currentRoute === '/app/properties' && <HostDashboardSimple isFullList={true} />}
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
      </main>

      {/* Toast Notifications */}
      <Toast />
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
