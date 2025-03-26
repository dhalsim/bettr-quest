import { Quest, LockedQuest, SavedQuest } from '@/types/quest';
import { Proof } from '@/components/ui/ProofCard';

// Mock data for quests
export const mockQuests: { [key: string]: LockedQuest } = {
  "1": {
    id: '1',
    title: 'Meditate for 20 minutes tomorrow',
    description: 'I want to begin my meditation practice by dedicating 20 minutes tomorrow to mindful meditation. This will help me reduce stress and improve focus.',
    userId: 'user1',
    username: 'mindfulness_guru',
    createdAt: '2023-04-15T10:30:00Z',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Wellness',
    status: 'on_review',
    imageUrl: 'https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=600&auto=format',
    visibility: 'public',
    lockedAmount: 1000,
    rewardAmount: 50,
    escrowStatus: 'locked',
    totalZapped: 1500
  },
  "2": {
    id: '2',
    title: 'Learn 5 phrases in Italian',
    description: 'I will learn and memorize 5 useful Italian phrases for my upcoming trip to Rome. This will help me navigate and connect with locals better.',
    userId: 'user2',
    username: 'polyglot_learner',
    createdAt: '2023-04-08T14:20:00Z',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Learning',
    status: 'on_review',
    imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=600&auto=format',
    visibility: 'public',
    lockedAmount: 20000,
    rewardAmount: 1000,
    escrowStatus: 'locked',
    totalZapped: 1500
  },
  "3": {
    id: '3',
    title: 'Run 5km in under 30 minutes',
    description: 'I want to improve my running pace and complete a 5km run in under 30 minutes. This will be a personal record for me.',
    userId: 'user3',
    username: 'runner_joe',
    createdAt: '2023-04-10T09:15:00Z',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Fitness',
    status: 'success',
    imageUrl: 'https://images.unsplash.com/photo-1486218119243-13883505764c?q=80&w=600&auto=format',
    visibility: 'public',
    lockedAmount: 20000,
    rewardAmount: 200,
    escrowStatus: 'distributed',
    totalZapped: 5000
  },
  "4": {
    id: '4',
    title: 'Write a short story in one day',
    description: "Challenge myself to write a 1000-word short story in a single day to boost creativity and overcome writer's block.",
    userId: 'user4',
    username: 'storyteller',
    createdAt: '2023-04-12T16:45:00Z',
    dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Creativity',
    status: 'failed',
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=600&auto=format',
    visibility: 'public',
    lockedAmount: 20000,
    rewardAmount: 400,
    escrowStatus: 'in_process',
    totalZapped: 10000
  },
  "5": {
    id: '5',
    title: 'Complete a challenging coding problem',
    description: 'I will solve a difficult algorithm problem from LeetCode to improve my problem-solving skills.',
    userId: 'user5',
    username: 'code_ninja',
    createdAt: '2023-04-14T11:30:00Z',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Technology',
    status: 'in_dispute',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=600&auto=format',
    visibility: 'public',
    lockedAmount: 20000,
    rewardAmount: 2000,
    escrowStatus: 'in_process',
    inDispute: true,
    totalZapped: 3200
  }
};

// Mock data for saved quests (not locked yet)
export const mockSavedQuests: { [key: string]: SavedQuest } = {
  "6": {
    id: '6',
    title: 'Learn to play guitar',
    description: 'I want to learn to play my favorite song on the guitar.',
    userId: 'user6',
    username: 'music_lover',
    createdAt: '2023-04-20T09:00:00Z',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Music',
    status: 'saved',
    imageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=600&auto=format',
    visibility: 'public',
    savedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
};

// Mock data for proofs
export const mockProofs: Record<string, Proof[]> = {
  "1": [
    {
      id: 'proof1_1',
      challengeId: '1',
      userId: 'user1',
      username: 'mindfulness_guru',
      title: 'Morning Meditation Session Complete',
      createdAt: '2023-04-16T14:15:00Z',
      description: "I completed my 20-minute meditation session this morning. I used the Headspace app and focused on breathing exercises. I feel much calmer and ready for the day.",
      imageUrl: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=600&auto=format',
      votes: {
        accept: 1,
        reject: 0
      }
    }
  ],
  "2": [
    {
      id: 'proof2_1',
      challengeId: '2',
      userId: 'user2',
      username: 'polyglot_learner',
      title: 'Italian Phrases Mastered',
      createdAt: '2023-04-12T10:30:00Z',
      description: "I've learned these 5 Italian phrases: 'Buongiorno' (Good morning), 'Grazie' (Thank you), 'Per favore' (Please), 'Mi scusi' (Excuse me), and 'Dov'è il bagno?' (Where is the bathroom?). I practiced with an Italian friend who confirmed my pronunciation.",
      imageUrl: 'https://images.unsplash.com/photo-1530538095376-a4936b5c6c4b?q=80&w=600&auto=format',
      votes: {
        accept: 2,
        reject: 1
      }
    }
  ],
  "3": [
    {
      id: 'proof3_1',
      challengeId: '3',
      userId: 'user3',
      username: 'runner_joe',
      title: '5km Run Achievement',
      createdAt: '2023-04-18T08:45:00Z',
      description: "I did it! Completed my 5km run in 28:42. I've attached a screenshot from my running app showing the time and distance. The weather was perfect this morning, which helped a lot.",
      imageUrl: 'https://images.unsplash.com/photo-1560073562-f36a05efa160?q=80&w=600&auto=format',
      votes: {
        accept: 5,
        reject: 0
      }
    }
  ],
  "4": [
    {
      id: 'proof4_1',
      challengeId: '4',
      userId: 'user4',
      username: 'storyteller',
      title: 'Story Writing Progress',
      createdAt: '2023-04-13T23:50:00Z',
      description: "I tried my best but only managed to write 600 words. I got stuck halfway through and couldn't finish the story in time. I'll try again with a smaller goal next time.",
      imageUrl: null,
      votes: {
        accept: 0,
        reject: 3
      }
    }
  ],
  "5": [
    {
      id: 'proof5_1',
      challengeId: '5',
      userId: 'user5',
      username: 'code_ninja',
      title: 'Algorithm Challenge Solution',
      createdAt: '2023-04-17T16:20:00Z',
      description: "I solved the 'Merge K Sorted Lists' problem with an optimized approach using a priority queue. My solution has O(n log k) time complexity. I've attached a screenshot of my accepted solution and runtime stats.",
      imageUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=600&auto=format',
      votes: {
        accept: 1,
        reject: 1
      }
    }
  ]
};

// Mock data for suggested users to follow
export const mockSuggestedUsers = [
  {
    id: 'user3',
    username: 'fitness_fanatic',
    bio: 'Daily fitness quests and nutrition tips',
    following: false
  },
  {
    id: 'user4',
    username: 'book_worm',
    bio: 'Reading quests and book recommendations',
    following: false
  },
  {
    id: 'user5',
    username: 'code_ninja',
    bio: 'Coding quests for developers of all levels',
    following: true
  }
];

// Available categories/tags for quests
export const mockTags = [
  { name: "Wellness", popularity: 90 },
  { name: "Fitness", popularity: 85 },
  { name: "Learning", popularity: 80 },
  { name: "Sustainability", popularity: 75 },
  { name: "Productivity", popularity: 70 },
  { name: "Technology", popularity: 65 },
  { name: "Music", popularity: 60 },
  { name: "Art", popularity: 55 },
  { name: "Writing", popularity: 50 },
  { name: "Finance", popularity: 45 },
  { name: "Travel", popularity: 40 },
  { name: "Food", popularity: 35 },
  { name: "Photography", popularity: 30 },
  { name: "Reading", popularity: 25 },
  { name: "Gaming", popularity: 20 }
]; 