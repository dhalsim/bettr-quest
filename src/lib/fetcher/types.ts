import { DraftQuest, LockedQuest, TagItem } from '@/types/quest';
import { UserProfile } from '@/types/user';
import { Proof } from '@/types/proof';
import { ThreadComment } from '@/types/thread';
import { Coach } from '@/types/coach';

export interface DataFetcher {
  // Quest related methods
  getQuests(): Promise<(DraftQuest | LockedQuest)[]>;
  getQuest(id: string): Promise<DraftQuest | LockedQuest | null>;
  getSavedQuests(): Promise<DraftQuest[]>;
  createQuest(quest: DraftQuest): Promise<void>;
  
  // User related methods
  getUser(username: string): Promise<UserProfile | null>;
  getSuggestedUsers(): Promise<UserProfile[]>;
  
  // Proof related methods
  getProofs(questId: string): Promise<Proof[]>;
  
  // Thread related methods
  getThreadComments(questId: string): Promise<ThreadComment[]>;

  getTags(): Promise<TagItem[]>;
  getCoaches(): Promise<Coach[]>;
  getDefaultProfile(): Promise<UserProfile>;
  getSpecializations(): Promise<string[]>;
} 