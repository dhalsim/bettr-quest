// Base properties that all quest types share
export type BaseQuest = {
  title: string;
  description: string;
  userId: string;
  username: string;
  createdAt: string;
  dueDate: string;
  category: string;
  imageUrl: string;
  visibility: 'public' | 'private';
};

// Properties for a quest that has been saved but not locked
export type SavedQuest = BaseQuest & {
  id: string;
  status: 'saved';
  savedAt: string;
};

// Properties for a quest that has been locked with escrow
export type LockedQuest = BaseQuest & {
  id: string;
  status: 'on_review' | 'success' | 'failed' | 'in_dispute';
  lockedAmount: number;
  rewardAmount: number;
  escrowStatus: 'locked' | 'in_process' | 'distributed';
  totalZapped: number;
  inDispute?: boolean;
};

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
export type Quest = SavedQuest | LockedQuest | QuestData; 