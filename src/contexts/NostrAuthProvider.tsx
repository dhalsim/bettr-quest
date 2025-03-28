
import React, { useState, useEffect } from 'react';
import { NostrAuthContext, NostrProfile } from '@/contexts/NostrAuthContext';
import { defaultProfile } from '@/mock/data';

export const NostrAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('nostr_logged_in') === 'true';
  });
  
  const [profile, setProfile] = useState<NostrProfile | null>(() => {
    const savedProfile = localStorage.getItem('nostr_profile');
    return savedProfile ? JSON.parse(savedProfile) : isLoggedIn ? defaultProfile : null;
  });

  const logout = () => {
    localStorage.removeItem('nostr_logged_in');
    localStorage.removeItem('nostr_private_key');
    localStorage.removeItem('nostr_bunker_url');
    localStorage.removeItem('nostr_profile');
    setIsLoggedIn(false);
    setProfile(null);
  };

  const login = (newProfile?: NostrProfile) => {
    localStorage.setItem('nostr_logged_in', 'true');
    
    if (newProfile) {
      localStorage.setItem('nostr_profile', JSON.stringify(newProfile));
      setProfile(newProfile);
    } else if (!profile) {
      // Make sure defaultProfile has name property
      const profileWithName = {
        ...defaultProfile,
        name: defaultProfile.displayName // Ensure name matches displayName if not already set
      };
      localStorage.setItem('nostr_profile', JSON.stringify(profileWithName));
      setProfile(profileWithName);
    }
    
    setIsLoggedIn(true);
  };

  const updateProfile = (newProfile: NostrProfile) => {
    localStorage.setItem('nostr_profile', JSON.stringify(newProfile));
    setProfile(newProfile);
  };

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'nostr_logged_in') {
        setIsLoggedIn(event.newValue === 'true');
      } else if (event.key === 'nostr_profile' && event.newValue) {
        setProfile(JSON.parse(event.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <NostrAuthContext.Provider value={{ isLoggedIn, profile, logout, login, updateProfile }}>
      {children}
    </NostrAuthContext.Provider>
  );
};
