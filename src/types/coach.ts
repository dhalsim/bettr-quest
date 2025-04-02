export interface Coach {
  id: string;
  name: string;
  username: string;
  profileImage: string;
  bio: string;
  specializations: string[];
  pricingOption: 'hourly' | 'one-time';
  rateAmount: number;
  rating: number;
  reviewCount: number;
  followers: number;
  verified: boolean;
}
