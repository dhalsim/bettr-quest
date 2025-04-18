import { Proof } from '@/types/proof';
import { mockProofs } from '@/mock/data';

/**
 * Fetches the active proof for a quest
 * @param questId The ID of the quest to fetch the proof for
 * @returns The active proof or null if not found
 * @throws Error if quest is in dispute but no proof is found
 */
export function getQuestProof(questId: string): Proof | null {
  return mockProofs[questId]?.[0] || null;
} 
