import type { DataFetcher } from './types';
import type { DraftQuest, LockedQuest, TagItem } from '@/types/quest';
import type { UserProfile } from '@/types/user';
import type { Proof } from '@/types/proof';
import type { ThreadComment } from '@/types/thread';
import type { Coach } from '@/types/coach';

export class NostrDataFetcher implements DataFetcher {
  async getQuests(): Promise<(DraftQuest | LockedQuest)[]> {
    // TODO: Implement Nostr fetching logic
    throw new Error('Not implemented');
  }

  async getQuest(id: string): Promise<DraftQuest | LockedQuest | null> {
    // TODO: Implement Nostr fetching logic
    throw new Error('Not implemented');
  }

  async getSavedQuests(): Promise<DraftQuest[]> {
    // TODO: Implement Nostr fetching logic
    throw new Error('Not implemented');
  }

  async createQuest(quest: DraftQuest): Promise<void> {
    // TODO: Implement Nostr fetching logic
    throw new Error('Not implemented');
  }

  async getUser(username: string): Promise<UserProfile | null> {
    // TODO: Implement Nostr fetching logic
    throw new Error('Not implemented');
  }

  async getSuggestedUsers(): Promise<UserProfile[]> {
    // TODO: Implement Nostr fetching logic
    throw new Error('Not implemented');
  }

  async getProofs(questId: string): Promise<Proof[]> {
    // TODO: Implement Nostr fetching logic
    throw new Error('Not implemented');
  }

  async getThreadComments(questId: string): Promise<ThreadComment[]> {
    // TODO: Implement Nostr fetching logic
    throw new Error('Not implemented');
  }

  async getTags(): Promise<TagItem[]> {
    // TODO: Implement Nostr fetching logic
    throw new Error('Not implemented');
  }

  async getCoaches(): Promise<Coach[]> {
    // TODO: Implement Nostr fetching logic
    throw new Error('Not implemented');
  }

  async getDefaultProfile(): Promise<UserProfile> {
    // TODO: Implement Nostr fetching logic
    throw new Error('Not implemented');
  }

  async getSpecializations(): Promise<string[]> {
    // TODO: Implement Nostr fetching logic
    throw new Error('Not implemented');
  }
} 