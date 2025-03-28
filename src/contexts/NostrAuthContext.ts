
import { createContext } from 'react';

export interface NostrProfile {
  username: string;
  displayName: string;
  profileImage: string;
  name: string; // Added name property to match existing usage
}

export interface NostrAuthContextType {
  isLoggedIn: boolean;
  profile: NostrProfile | null;
  logout: () => void;
  login: (profile?: NostrProfile) => void;
  updateProfile: (profile: NostrProfile) => void;
}

export const NostrAuthContext = createContext<NostrAuthContextType>({
  isLoggedIn: false,
  profile: null,
  logout: () => {},
  login: () => {},
  updateProfile: () => {},
}); 
