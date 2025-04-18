import { Proof } from '@/types/proof';
import { UserProfile } from '@/types/user';
import { ThreadComment } from '@/types/thread';
import { TagItem, DraftQuest, LockedQuest } from '@/types/quest';
import { mockBookedSchedules, mockCalendarSchedule } from '@/mock/schedule';

export { mockBookedSchedules, mockCalendarSchedule };

// All available tags for quests and coach specializations
export const mockTags = new Map<string, TagItem>([
  ["Fitness", { name: "Fitness", popularity: 100 }],
  ["Learning", { name: "Learning", popularity: 95 }],
  ["Productivity", { name: "Productivity", popularity: 90 }],
  ["Wellness", { name: "Wellness", popularity: 90 }],
  ["Meditation", { name: "Meditation", popularity: 80 }],
  ["Reading", { name: "Reading", popularity: 75 }],
  ["Coding", { name: "Coding", popularity: 70 }],
  ["Technology", { name: "Technology", popularity: 70 }],
  ["Writing", { name: "Writing", popularity: 65 }],
  ["Finance", { name: "Finance", popularity: 60 }],
  ["Health", { name: "Health", popularity: 55 }],
  ["Creativity", { name: "Creativity", popularity: 50 }],
  ["Skills", { name: "Skills", popularity: 45 }],
  ["Personal", { name: "Personal", popularity: 40 }],
  ["Professional", { name: "Professional", popularity: 35 }],
  ["Social", { name: "Social", popularity: 30 }],
  ["Nutrition", { name: "Nutrition", popularity: 85 }],
  ["Education", { name: "Education", popularity: 65 }],
  ["Business", { name: "Business", popularity: 60 }],
  ["Marketing", { name: "Marketing", popularity: 55 }],
  ["Design", { name: "Design", popularity: 50 }],
  ["Sustainability", { name: "Sustainability", popularity: 75 }],
  ["Music", { name: "Music", popularity: 60 }],
  ["Art", { name: "Art", popularity: 55 }],
  ["Travel", { name: "Travel", popularity: 40 }],
  ["Food", { name: "Food", popularity: 35 }],
  ["Photography", { name: "Photography", popularity: 30 }],
  ["Gaming", { name: "Gaming", popularity: 20 }],
  ["Economics", { name: "Economics", popularity: 45 }],
  ["Running", { name: "Running", popularity: 70 }],
  ["Organization", { name: "Organization", popularity: 40 }],
  ["Home", { name: "Home", popularity: 35 }],
  ["Lifestyle", { name: "Lifestyle", popularity: 45 }],
  ["Entrepreneurship", { name: "Entrepreneurship", popularity: 50 }],
  ["Planning", { name: "Planning", popularity: 40 }],
  ["Mindfulness", { name: "Mindfulness", popularity: 75 }],
  ["Mental Health", { name: "Mental Health", popularity: 80 }]
]);

// Mock data for quests
export const mockQuests: { [key: string]: DraftQuest | LockedQuest } = {
  "1": {
    id: '1',
    title: 'Meditate for 20 minutes tomorrow',
    description: 'I want to begin my meditation practice by dedicating 20 minutes tomorrow to mindful meditation. This will help me reduce stress and improve focus.',
    userId: 'user1',
    username: 'mindfulness_guru',
    createdAt: '2023-04-15T10:30:00Z',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'on_review',
    specializations: [mockTags.get("Wellness")],
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
    specializations: [mockTags.get("Learning")],
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
    specializations: [mockTags.get("Fitness")],
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
    specializations: [mockTags.get("Creativity")],
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
    specializations: [mockTags.get("Technology")],
    status: 'in_dispute',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=600&auto=format',
    visibility: 'public',
    lockedAmount: 20000,
    rewardAmount: 2000,
    escrowStatus: 'in_process',
    inDispute: true,
    totalZapped: 3200
  },
  "6": {
    id: '6',
    title: 'Build a simple calculator app',
    description: 'I will code a basic calculator app using JavaScript to practice my coding skills.',
    userId: 'user1',
    username: 'mindfulness_guru',
    createdAt: '2023-04-01T09:00:00Z',
    savedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
    specializations: [mockTags.get("Learning")],
    status: 'draft',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format',
    visibility: 'public',
  },
  "7": {
    id: '7',
    title: 'Write a reflection journal entry',
    description: 'I will write a detailed journal entry reflecting on my personal growth this month.',
    userId: 'user1',
    username: 'mindfulness_guru',
    createdAt: '2023-03-15T11:30:00Z',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    specializations: [mockTags.get("Creativity")],
    status: 'success',
    imageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format',
    visibility: 'public',
    lockedAmount: 20000,
    rewardAmount: 200,
    escrowStatus: 'distributed',
    totalZapped: 850
  },
  "8": {
    id: '8',
    title: 'Zero Waste Day',
    description: 'Minimize your waste production for a day by refusing, reducing, reusing, recycling, and composting.',
    userId: 'user3',
    username: 'eco_warrior',
    createdAt: '2023-04-22T14:45:00Z',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'success',
    specializations: [mockTags.get("Sustainability")],
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=600&auto=format',
    visibility: 'public',
    lockedAmount: 20000,
    rewardAmount: 200,
    escrowStatus: 'distributed',
    totalZapped: 2500
  }
};

// Mock data for saved quests (not locked yet)
export const mockSavedQuests: { [key: string]: DraftQuest } = {
  "6": {
    id: '6',
    title: 'Learn to play guitar',
    description: 'I want to learn to play my favorite song on the guitar.',
    userId: 'user6',
    username: 'music_lover',
    createdAt: '2023-04-20T09:00:00Z',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    specializations: [mockTags.get("Music")],
    status: 'draft',
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

// Mock user profiles data
export const mockUserProfiles: Record<string, UserProfile> = {
  'coach_alex': {
    pubkey: 'user2',
    username: 'coach_alex',
    displayName: 'Alex Johnson',
    bio: 'Professional coach helping people achieve their goals through structured challenges.',
    joinedDate: '2023-02-20',
    profileImage: 'https://i.pravatar.cc/150?img=2',
    followers: 850,
    following: 120,
    isCoach: true,
    hasCalendar: true,
    rating: 4.9,
    reviewCount: 56
  },
  'mindfulness_guru': {
    pubkey: 'user1',
    username: 'mindfulness_guru',
    displayName: 'Mindfulness Guru',
    bio: 'Helping you find inner peace through meditation and mindfulness practices.',
    joinedDate: '2023-01-15',
    profileImage: 'https://i.pravatar.cc/150?img=1',
    followers: 1250,
    following: 45,
    isCoach: true,
    hasCalendar: true,
    rating: 4.8,
    reviewCount: 42
  },
  'polyglot_learner': {
    pubkey: 'user3',
    username: 'polyglot_learner',
    displayName: 'Sarah Chen',
    bio: 'Language enthusiast sharing my journey to learn 5 languages in 2 years.',
    joinedDate: '2023-03-10',
    profileImage: 'https://i.pravatar.cc/150?img=3',
    followers: 320,
    following: 45,
    isCoach: false,
    hasCalendar: false,
    rating: 4.5,
    reviewCount: 0
  },
  'runner_joe': {
    pubkey: 'user3',
    username: 'runner_joe',
    displayName: 'Runner Joe',
    bio: 'Marathon runner and fitness enthusiast. Setting challenging running goals and helping others achieve their fitness targets.',
    joinedDate: '2022-08-05T14:30:00Z',
    profileImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=300&auto=format',
    followers: 892,
    following: 128,
    isCoach: true,
    hasCalendar: true,
    rating: 4.8,
    reviewCount: 67
  },
  'storyteller': {
    pubkey: 'user4',
    username: 'storyteller',
    displayName: 'Creative Storyteller',
    bio: 'Writer and storyteller crafting tales that inspire and entertain. Creating writing challenges to spark creativity.',
    joinedDate: '2023-03-12T11:20:00Z',
    profileImage: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=300&auto=format',
    followers: 445,
    following: 89,
    isCoach: false,
    hasCalendar: false,
    rating: 0,
    reviewCount: 0
  },
  'code_ninja': {
    pubkey: 'user5',
    username: 'code_ninja',
    displayName: 'Code Ninja',
    bio: 'Software developer passionate about solving complex problems. Creating coding challenges to help others improve their skills.',
    joinedDate: '2022-11-30T16:45:00Z',
    profileImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=300&auto=format',
    followers: 1234,
    following: 156,
    isCoach: true,
    hasCalendar: true,
    rating: 4.9,
    reviewCount: 89
  },
  'jane_smith': {
    pubkey: 'user6',
    username: 'jane_smith',
    displayName: 'Jane Smith',
    bio: 'Default user profile for testing purposes.',
    joinedDate: '2023-01-01T00:00:00Z',
    profileImage: 'https://images.unsplash.com/photo-1619895862022-09114b41f16f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    followers: 0,
    following: 0,
    isCoach: false,
    hasCalendar: false,
    rating: 0,
    reviewCount: 0
  },
  'zen_master': {
    pubkey: 'user7',
    username: 'zen_master',
    displayName: 'Zen Master',
    bio: 'Experienced meditation practitioner sharing wisdom and techniques.',
    joinedDate: '2022-12-15T10:00:00Z',
    profileImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=300&auto=format',
    followers: 234,
    following: 45,
    isCoach: false,
    hasCalendar: false,
    rating: 0,
    reviewCount: 0
  },
  'wellness_beginner': {
    pubkey: 'user8',
    username: 'wellness_beginner',
    displayName: 'Wellness Beginner',
    bio: 'Starting my wellness journey and learning from the community.',
    joinedDate: '2023-04-01T09:00:00Z',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format',
    followers: 45,
    following: 67,
    isCoach: false,
    hasCalendar: false,
    rating: 0,
    reviewCount: 0
  },
  'fitness_coach': {
    pubkey: 'user4',
    username: 'fitness_coach',
    displayName: 'Mike Thompson',
    bio: 'Certified fitness trainer helping people transform their lives through exercise.',
    joinedDate: '2023-01-05',
    profileImage: 'https://i.pravatar.cc/150?img=4',
    followers: 1500,
    following: 200,
    isCoach: true,
    hasCalendar: true,
    rating: 4.7,
    reviewCount: 89
  },
  'coding_beginner': {
    pubkey: 'user5',
    username: 'coding_beginner',
    displayName: 'Emma Wilson',
    bio: 'Learning to code and documenting my journey to become a web developer.',
    joinedDate: '2023-04-01',
    profileImage: 'https://i.pravatar.cc/150?img=5',
    followers: 150,
    following: 30,
    isCoach: false,
    hasCalendar: false,
    rating: 4.0,
    reviewCount: 0
  },
  'nutrition_expert': {
    pubkey: 'user6',
    username: 'nutrition_expert',
    displayName: 'Dr. Lisa Park',
    bio: 'Registered dietitian helping people make sustainable changes to their eating habits.',
    joinedDate: '2023-02-15',
    profileImage: 'https://i.pravatar.cc/150?img=6',
    followers: 2000,
    following: 150,
    isCoach: true,
    hasCalendar: true,
    rating: 4.9,
    reviewCount: 120
  },
  'bookworm': {
    pubkey: 'user7',
    username: 'bookworm',
    displayName: 'David Miller',
    bio: 'Avid reader challenging myself to read 50 books this year.',
    joinedDate: '2023-03-20',
    profileImage: 'https://i.pravatar.cc/150?img=7',
    followers: 180,
    following: 25,
    isCoach: false,
    hasCalendar: false,
    rating: 4.2,
    reviewCount: 0
  },
  'yoga_instructor': {
    pubkey: 'user8',
    username: 'yoga_instructor',
    displayName: 'Priya Sharma',
    bio: 'Yoga teacher helping people find balance and strength through mindful movement.',
    joinedDate: '2023-01-10',
    profileImage: 'https://i.pravatar.cc/150?img=8',
    followers: 3000,
    following: 100,
    isCoach: true,
    hasCalendar: true,
    rating: 4.8,
    reviewCount: 95
  }
};

// Mock user activities data
export const mockUserActivities = [
  {
    id: 'act1',
    type: 'proof_review',
    action: 'accepted',
    username: 'zen_master',
    challengeTitle: 'Meditate for 10 minutes',
    challengeId: '1',
    timestamp: '2023-04-22T15:30:00Z'
  },
  {
    id: 'act2',
    type: 'proof_review',
    action: 'rejected',
    username: 'wellness_beginner',
    challengeTitle: 'Digital Detox Hour',
    challengeId: '3',
    timestamp: '2023-03-20T09:15:00Z'
  },
  {
    id: 'act3',
    type: 'challenge_created',
    challengeTitle: 'Morning Gratitude',
    challengeId: '2',
    timestamp: '2023-05-01T08:45:00Z'
  }
];

// Mock reviews data
export const mockReviews = {
  'coach_alex': [
    {
      id: 'rev1',
      reviewerUsername: 'fitness_enthusiast',
      reviewerDisplayName: 'Emma Wilson',
      reviewerImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=300&auto=format',
      rating: 5,
      content: 'Coach Alex completely transformed my approach to fitness. The personalized training plan was exactly what I needed!',
      date: '2023-11-15T14:30:00Z'
    },
    {
      id: 'rev2',
      reviewerUsername: 'wellness_seeker',
      reviewerDisplayName: 'Mark Johnson',
      reviewerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format',
      rating: 4.5,
      content: 'Great coach who really knows his stuff. Very responsive and supportive throughout my fitness journey.',
      date: '2023-10-22T09:15:00Z'
    },
    {
      id: 'rev3',
      reviewerUsername: 'health_first',
      reviewerDisplayName: 'Sarah Miller',
      reviewerImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format',
      rating: 5,
      content: 'The nutrition advice alone was worth every penny. I\'ve lost 15 pounds and feel amazing!',
      date: '2023-09-05T16:45:00Z'
    }
  ],
  'mindfulness_guru': [
    {
      id: 'rev4',
      reviewerUsername: 'zen_student',
      reviewerDisplayName: 'David Chen',
      reviewerImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format',
      rating: 5,
      content: 'The meditation techniques I learned have truly changed my daily life. Highly recommend!',
      date: '2023-08-12T11:20:00Z'
    },
    {
      id: 'rev5',
      reviewerUsername: 'stress_free',
      reviewerDisplayName: 'Olivia Parker',
      reviewerImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format',
      rating: 4,
      content: 'Great guidance and very patient with beginners. Would have liked a bit more personalized feedback.',
      date: '2023-07-28T13:10:00Z'
    }
  ]
};

// Default profile for testing purposes
export const defaultProfile = mockUserProfiles.mindfulness_guru;

// Quest template type
export interface QuestTemplate {
  id: string;
  name: string;
  description: string;
  suggestedTags: string[];
}

// Quest templates data
export const questTemplates: QuestTemplate[] = [
  { 
    id: 'book', 
    name: 'Finish Economics Book Chapter 4', 
    description: 'I want to complete Chapter 4 of my economics textbook by the end of this week. I\'ll track my progress and take notes on key concepts.',
    suggestedTags: ['Reading', 'Learning', 'Economics']
  },
  { 
    id: 'run', 
    name: 'Run 3 km', 
    description: 'I\'m challenging myself to run 3 kilometers within a specific timeframe. I\'ll start slow and build up my stamina day by day.',
    suggestedTags: ['Fitness', 'Running', 'Health']
  },
  { 
    id: 'closet', 
    name: 'Organize My Closet', 
    description: 'I need to declutter and organize my entire closet. I\'ll sort items into keep, donate, and discard piles. I\'ll document my progress!',
    suggestedTags: ['Organization', 'Home', 'Lifestyle']
  },
  { 
    id: 'business', 
    name: 'Write a business plan', 
    description: 'I want to create a comprehensive business plan for my idea or startup. I\'ll include market analysis, financial projections, and marketing strategy.',
    suggestedTags: ['Business', 'Entrepreneurship', 'Planning']
  },
  { 
    id: 'meditation', 
    name: 'Daily meditation practice', 
    description: 'I\'m building a daily meditation habit. I\'ll start with just 5 minutes per day and work my way up to longer sessions.',
    suggestedTags: ['Mindfulness', 'Wellness', 'Mental Health']
  }
];

export const mockCoaches = [
  {
    id: 'coach1',
    name: 'Alex Thompson',
    username: 'coach_alex',
    profileImage: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80',
    bio: 'Certified fitness coach with 8+ years experience. Specializing in strength training and habit formation.',
    specializations: ['Fitness', 'Nutrition', 'Wellness'],
    pricingOption: 'hourly',
    rateAmount: 25000,
    rating: 4.9,
    reviewCount: 127,
    followers: 1234,
    verified: true
  },
  {
    id: 'coach2',
    name: 'Maya Williams',
    username: 'mindful_maya',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    bio: 'Mindfulness expert and meditation teacher. I help people reduce stress and build healthy mental habits.',
    specializations: ['Wellness', 'Meditation', 'Productivity'],
    pricingOption: 'one-time',
    rateAmount: 50000,
    rating: 4.8,
    reviewCount: 93,
    followers: 856,
    verified: true
  },
  {
    id: 'coach3',
    name: 'Daniel Chen',
    username: 'tech_daniel',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    bio: 'Software engineer and coding mentor. Specialized in helping people build coding habits and learn new programming skills.',
    specializations: ['Coding', 'Technology', 'Education'],
    pricingOption: 'hourly',
    rateAmount: 35000,
    rating: 4.7,
    reviewCount: 81,
    followers: 654,
    verified: true
  },
  {
    id: 'coach4',
    name: 'Sarah Johnson',
    username: 'finance_sarah',
    profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1361&q=80',
    bio: 'Financial advisor helping people develop better money habits and reach their financial goals.',
    specializations: ['Finance', 'Productivity', 'Education'],
    pricingOption: 'one-time',
    rateAmount: 45000,
    rating: 4.6,
    reviewCount: 62,
    followers: 432,
    verified: true
  }
];

// Mock thread data
export const mockThreadComments: ThreadComment[] = [
  {
    id: "comment_1",
    author: {
      username: "mindfulness_guru",
      displayName: "Mindfulness Guru",
      profileImage: "https://i.pravatar.cc/150?img=1"
    },
    content: "Great quest! I've been practicing meditation for years and this is a perfect starting point.",
    createdAt: "2024-03-15T10:30:00Z",
    replies: [
      {
        id: "reply_1",
        author: {
          username: "polyglot_learner",
          displayName: "Sarah Chen",
          profileImage: "https://i.pravatar.cc/150?img=3"
        },
        content: "Thanks for the encouragement! Do you have any tips for beginners?",
        createdAt: "2024-03-15T11:15:00Z",
        replies: []
      }
    ]
  },
  {
    id: "comment_2",
    author: {
      username: "runner_joe",
      displayName: "Runner Joe",
      profileImage: "https://i.pravatar.cc/150?img=4"
    },
    content: "I've been meaning to start meditation. This quest is exactly what I needed!",
    createdAt: "2024-03-16T08:45:00Z",
    replies: []
  },
  {
    id: "comment_3",
    author: {
      username: "zen_master",
      displayName: "Zen Master",
      profileImage: "https://i.pravatar.cc/150?img=5"
    },
    content: "Great job on completing the meditation session! Keep up the good work.",
    createdAt: "2024-03-16T14:30:00Z",
    replies: []
  }
];
