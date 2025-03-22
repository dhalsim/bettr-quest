import { createContext } from 'react';

export interface NostrProfile {
  name: string;
  username: string;
  profileImage: string;
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