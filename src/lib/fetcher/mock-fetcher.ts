import { 
  mockQuests, 
  mockSavedQuests, 
  mockUserProfiles, 
  mockProofs, 
  mockThreadComments, 
  mockCoaches, 
  mockTags 
} from '@/mock/data';
import type { UserProfile } from '@/types/user';
import type { TagItem, DraftQuest } from '@/types/quest';
import type { Coach } from '@/types/coach';

import type { DataFetcher } from './types';

const simulateNetworkDelay = (ms: number = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export class MockDataFetcher implements DataFetcher {
  async getQuests() {
    // Simulate network delay
    await simulateNetworkDelay();
    
    return Object.values(mockQuests);
  }

  async getQuest(id: string) {
    await simulateNetworkDelay();
    
    return mockQuests[id] || null;
  }

  async getSavedQuests() {
    await simulateNetworkDelay();
    
    return Object.values(mockSavedQuests);
  }

  async createQuest(quest: DraftQuest) {
    await simulateNetworkDelay();
    
    // In a real implementation, this would save to a database
    console.log('Creating quest:', quest);
  }

  async getUser(username: string) {
    await simulateNetworkDelay();
    
    return mockUserProfiles[username] || null;
  }

  async getSuggestedUsers(): Promise<UserProfile[]> {
    await simulateNetworkDelay();
    // Convert suggested users to full user profiles
    
    return Object.values(mockUserProfiles).slice(0, 3);
  }

  async getProofs(questId: string) {
    await simulateNetworkDelay();
    
    return mockProofs[questId] || [];
  }

  async getThreadComments(questId: string) {
    await simulateNetworkDelay();
    
    return mockThreadComments;
  }

  async getTags(): Promise<TagItem[]> {
    await simulateNetworkDelay();
    
    return Array.from(mockTags.values()); 
  }

  async getCoaches(): Promise<Coach[]> {
    await simulateNetworkDelay();
    
    return mockCoaches;
  }

  async getDefaultProfile(): Promise<UserProfile> {
    await simulateNetworkDelay();
    
    return Object.values(mockUserProfiles)[0];
  }

  async getSpecializations(): Promise<string[]> {
    await simulateNetworkDelay();
    
    // Return unique specializations from mock data
    const specializations = new Set<string>();
    Object.values(mockQuests).forEach(quest => {
      quest.specializations.forEach(tag => {
        specializations.add(tag.name);
      });
    });
    
    return Array.from(specializations);
  }
} 