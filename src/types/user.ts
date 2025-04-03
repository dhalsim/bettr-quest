import { NostrProfile } from '@/contexts/NostrAuthContext';

export interface UserProfile extends NostrProfile {
  displayName: string;
  bio: string;
  joinedDate: string;
  followers: number;
  following: number;
  isCoach: boolean;
  hasCalendar: boolean;
  rating: number;
  reviewCount: number;
} 