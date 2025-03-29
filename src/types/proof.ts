export type Proof = {
  id: string;
  challengeId: string;
  userId: string;
  username: string;
  title: string;
  createdAt: string;
  description: string;
  imageUrl?: string;
  votes: {
    accept: number;
    reject: number;
  };
}; 