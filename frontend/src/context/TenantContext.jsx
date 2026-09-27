import React, { createContext, useContext, useState, useEffect } from 'react';
import { MULTI_TENANT_DATA } from '../data/mockData';

// ============================================================================
// SAMAJ / TENANTS REGISTRY (White-Label Multi-Tenant Catalog)
// ============================================================================
export const SAMAJ_REGISTRY = {
  kewat: {
    slug: 'kewat',
    name: 'केवट समाज डिजिटल महासंघ',
    shortName: 'केवट समाज',
    englishName: 'Kewat Samaj Digital Federation',
    tagline: 'स्वजातीय एकता, सेवा एवं अखंड संवाद',
    ishtadev: 'भगवान निषादराज व महर्षि वेदव्यास',
    ishtadevIcon: '🏛️',
    primaryColor: '#ea580c',
    secondaryColor: '#c2410c',
    accentBg: '#fff7ed',
    gotras: [
      'कश्यप',
      'कहार',
      'मल्लाह',
      'बाथम',
      'मांझी',
      'धीवर',
      'जलछत्री',
      'बिंद',
      'नाविक',
      'सानी',
      'रैकवार',
      'गोड़िया',
      'केवट',
    ],
    trustName: 'श्री केवट समाज जनकल्याण ट्रस्ट',
    helpline: '+91 98765 43210',
    email: 'contact@kewatsamaj.org',
    headquarters: 'इंदौर (म.प्र.)',
  },
  patidar: {
    slug: 'patidar',
    name: 'पाटीदार समाज डिजिटल महामंच',
    shortName: 'पाटीदार समाज',
    englishName: 'Patidar Samaj Community Portal',
    tagline: 'संगठन, समृद्धि, संस्कार एवं प्रगति',
    ishtadev: 'जगज्जननी माँ उमिया',
    ishtadevIcon: '🌺',
    primaryColor: '#16a34a',
    secondaryColor: '#15803d',
    accentBg: '#f0fdf4',
    gotras: [
      'पटेल',
      'लेवा',
      'कड़वा',
      'धनोतिया',
      'चावड़ा',
      'राठौड़',
      'चौधरी',
      'मेहता',
      'झांझरिया',
      'काकड़िया',
      'सोलंकी',
      'अमीन',
    ],
    trustName: 'श्री पाटीदार समाज विकास संगठन ट्रस्ट',
    helpline: '+91 98260 11223',
    email: 'contact@patidarsamaj.org',
    headquarters: 'अहमदाबाद / उज्जैन',
  },
  rajput: {
    slug: 'rajput',
    name: 'क्षत्रिय राजपूत समाज परिषद',
    shortName: 'राजपूत समाज',
    englishName: 'Kshatriya Rajput Samaj Portal',
    tagline: 'वीरता, परंपरा, स्वाभिमान एवं सामाजिक एकता',
    ishtadev: 'वीर शिरोमणि महाराणा प्रताप',
    ishtadevIcon: '⚔️',
    primaryColor: '#dc2626',
    secondaryColor: '#b91c1c',
    accentBg: '#fef2f2',
    gotras: [
      'सूर्यवंशी',
      'चंद्रवंशी',
      'राठौड़',
      'चौहान',
      'सिसोदिया',
      'परमार',
      'तोमर',
      'कछवाहा',
      'सोलंकी',
      'जादौन',
      'बघेल',
      'शक्तावत',
    ],
    trustName: 'अखिल भारतीय क्षत्रिय राजपूत महासभा',
    helpline: '+91 94250 55667',
    email: 'contact@rajputsamaj.org',
    headquarters: 'जयपुर / भोपाल',
  },
  yadav: {
    slug: 'yadav',
    name: 'अखिल भारत यादव समाज महासंघ',
    shortName: 'यादव समाज',
    englishName: 'Yadav Samaj Community Platform',
    tagline: 'धर्मो रक्षति रक्षितः • कर्म, निष्ठा एवं सेवा',
    ishtadev: 'योगेश्वर भगवान श्रीकृष्ण',
    ishtadevIcon: '🦚',
    primaryColor: '#2563eb',
    secondaryColor: '#1d4ed8',
    accentBg: '#eff6ff',
    gotras: [
      'अहीर',
      'यदुवंशी',
      'ग्वालवंशी',
      'कौशिक',
      'भारद्वाज',
      'शांडिल्य',
      'वशिष्ठ',
      'कश्यप',
      'गांधार',
      'शौर्यवंशी',
    ],
    trustName: 'श्री यादव समाज उत्थान व कल्याण ट्रस्ट',
    helpline: '+91 98110 33445',
    email: 'contact@yadavsamaj.org',
    headquarters: 'मथुरा / दिल्ली',
  },
};

const TenantContext = createContext(null);

export const TenantProvider = ({ children }) => {
  // Resolve tenant from subdomain, URL query param (?samaj=slug), or localStorage
  const detectInitialTenant = () => {
    try {
      // 1. Check URL query params first (e.g. ?samaj=patidar or ?tenant=rajput)
      const params = new URLSearchParams(window.location.search);
      const queryTenant = params.get('samaj') || params.get('tenant');
      if (queryTenant && SAMAJ_REGISTRY[queryTenant.toLowerCase()]) {
        localStorage.setItem('samaj_active_tenant', queryTenant.toLowerCase());
        return queryTenant.toLowerCase();
      }

      // 2. Check Hostname / Subdomain (e.g. kewat.samajportal.in or patidar.vercel.app)
      const hostname = window.location.hostname.toLowerCase();
      const parts = hostname.split('.');
      if (parts.length > 2) {
        const potentialSubdomain = parts[0];
        if (SAMAJ_REGISTRY[potentialSubdomain]) {
          return potentialSubdomain;
        }
      }

      // 3. Check localStorage
      const savedTenant = localStorage.getItem('samaj_active_tenant');
      if (savedTenant && SAMAJ_REGISTRY[savedTenant]) {
        return savedTenant;
      }
    } catch (e) {
      console.warn('Tenant detection fallback to default:', e);
    }

    // Default to Kewat Samaj
    return 'kewat';
  };

  const [activeSlug, setActiveSlug] = useState(detectInitialTenant);

  const tenant = SAMAJ_REGISTRY[activeSlug] || SAMAJ_REGISTRY.kewat;

  const switchTenant = (newSlug) => {
    const slug = newSlug.toLowerCase();
    if (SAMAJ_REGISTRY[slug]) {
      setActiveSlug(slug);
      try {
        localStorage.setItem('samaj_active_tenant', slug);
      } catch (e) {
        // Ignored
      }
    }
  };

  // Sync document title and favicon dynamically whenever active tenant changes
  useEffect(() => {
    document.title = `${tenant.name} | ${tenant.englishName}`;
  }, [tenant]);

  const tenantData = MULTI_TENANT_DATA[activeSlug] || MULTI_TENANT_DATA.kewat;

  return (
    <TenantContext.Provider
      value={{
        tenant,
        tenantData,
        activeSlug,
        switchTenant,
        allTenants: Object.values(SAMAJ_REGISTRY),
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
