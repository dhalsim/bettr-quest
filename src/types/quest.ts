export interface TagItem {
  name: string;
  popularity?: number;
}

// Base properties that all quest types share
export type BaseQuest = {
  title: string;
  description: string;
  userId: string;
  username: string;
  createdAt: string;
  dueDate: string;
  imageUrl: string;
  specializations: TagItem[];
  visibility: 'public' | 'private';
};

// Properties for a quest that has been saved but not locked
export type DraftQuest = BaseQuest & {
  id: string;
  status: 'draft';
  savedAt: string;
};

export type LockedQuestStatus = 'on_review' | 'success' | 'failed' | 'in_dispute';

export type QuestStatus = LockedQuestStatus | 'draft';

// Properties for a quest that has been locked with escrow
export type LockedQuest = BaseQuest & {
  id: string;
  status: LockedQuestStatus;
  lockedAmount: number;
  rewardAmount: number;
  escrowStatus: 'locked' | 'in_process' | 'distributed';
  totalZapped: number;
  inDispute?: boolean;
};

export function isLockedQuest(quest: DraftQuest | LockedQuest): quest is LockedQuest {
  return 'lockedAmount' in quest;
}

// Properties for quest data being created/edited
export type QuestData = BaseQuest & {
  id?: string; // Optional since it might not exist when creating
  lockedAmount?: number;
  rewardAmount?: number;
  escrowStatus?: 'locked' | 'in_process' | 'distributed';
  totalZapped?: number;
  inDispute?: boolean;
};

// Union type for all quest types
export type Quest = DraftQuest | LockedQuest | QuestData; 