
import { useContext } from 'react';
import { NostrAuthContext, NostrAuthContextType } from '@/contexts/NostrAuthContext';

export const useNostrAuth = (): NostrAuthContextType => {
  return useContext(NostrAuthContext);
};
