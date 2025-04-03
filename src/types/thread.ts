export interface ThreadComment {
  id: string;
  author: {
    username: string;
    displayName: string;
    profileImage: string;
  };
  content: string;
  createdAt: string;
  replies: ThreadComment[];
}

export interface Thread {
  id: string;
  questId: string;
  proofId?: string;
  comments: ThreadComment[];
} 