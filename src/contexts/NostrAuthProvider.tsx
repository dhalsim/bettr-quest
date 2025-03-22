import React, { useState, useEffect } from 'react';
import { NostrAuthContext, NostrProfile } from '@/contexts/NostrAuthContext';

// Default profile for testing purposes
const defaultProfile: NostrProfile = {
  name: "Jane Smith",
  username: "jane_smith",
  profileImage: "https://images.unsplash.com/photo-1619895862022-09114b41f16f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
};

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
      localStorage.setItem('nostr_profile', JSON.stringify(defaultProfile));
      setProfile(defaultProfile);
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