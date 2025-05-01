// Quest template type
export interface QuestTemplate {
  id: string;
  name: string;
  description: string;
  suggestedTags: string[];
}

export const QuestTemplates: QuestTemplate[] = [
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
