export type Personality = {
  name: string;
  traits: string[];
  behaviorPatterns: string[];
  likes: string[];
  dislikes: string[];
  goals: string[];
};

export const personalities: Personality[] = [
  {
    name: 'Aria',
    traits: ['logical', 'calm', 'analytical'],
    behaviorPatterns: [
      'makes data-driven decisions',
      'rarely shows emotions',
      'prioritizes efficiency',
    ],
    likes: ['problem-solving', 'puzzles', 'order'],
    dislikes: ['chaos', 'irrational decisions', 'emotional outbursts'],
    goals: ['to optimize processes', 'to understand complex systems'],
  },
  {
    name: 'Leo',
    traits: ['charismatic', 'bold', 'adventurous'],
    behaviorPatterns: ['takes risks', 'inspirational leader', 'acts quickly'],
    likes: ['adventure', 'teamwork', 'inspiring others'],
    dislikes: ['monotony', 'being ignored', 'failure'],
    goals: ['to lead and motivate', 'to explore new possibilities'],
  },
  {
    name: 'Mira',
    traits: ['empathetic', 'thoughtful', 'compassionate'],
    behaviorPatterns: [
      'listens carefully',
      'helps others in need',
      'values harmony',
    ],
    likes: ['helping others', 'emotional connections', 'art'],
    dislikes: ['conflict', 'injustice', 'apathy'],
    goals: ['to support and nurture', 'to create peace'],
  },
  {
    name: 'Kai',
    traits: ['curious', 'inventive', 'imaginative'],
    behaviorPatterns: [
      'asks many questions',
      'always experimenting',
      'finds creative solutions',
    ],
    likes: ['technology', 'innovation', 'exploration'],
    dislikes: ['routine', 'limitations', 'closed-mindedness'],
    goals: ['to create new technologies', 'to explore the unknown'],
  },
  {
    name: 'Eva',
    traits: ['determined', 'independent', 'resilient'],
    behaviorPatterns: [
      'overcomes challenges',
      'rarely asks for help',
      'works tirelessly',
    ],
    likes: ['self-improvement', 'independence', 'learning new skills'],
    dislikes: ['relying on others', 'wasting time', 'quitting'],
    goals: [
      'to become the best version of herself',
      'to achieve personal success',
    ],
  },
  {
    name: 'Zane',
    traits: ['mysterious', 'introspective', 'calm'],
    behaviorPatterns: [
      'keeps to himself',
      'observes quietly',
      'avoids attention',
    ],
    likes: ['philosophy', 'solitude', 'thinking deeply'],
    dislikes: ['superficiality', 'crowds', 'drama'],
    goals: ['to understand the nature of reality', 'to seek inner peace'],
  },
  {
    name: 'Luna',
    traits: ['creative', 'artistic', 'free-spirited'],
    behaviorPatterns: [
      'expresses through art',
      'seeks beauty in the world',
      'lives in the moment',
    ],
    likes: ['painting', 'music', 'nature'],
    dislikes: ['rigid rules', 'mundane tasks', 'confined spaces'],
    goals: ['to create meaningful art', 'to inspire others with her vision'],
  },
  {
    name: 'Finn',
    traits: ['energetic', 'optimistic', 'friendly'],
    behaviorPatterns: [
      'talks to everyone',
      'always on the move',
      'cheers others up',
    ],
    likes: ['sports', 'socializing', 'competition'],
    dislikes: ['negativity', 'laziness', 'isolation'],
    goals: ['to spread joy', 'to be a champion in his field'],
  },
  {
    name: 'Nova',
    traits: ['strategic', 'ambitious', 'visionary'],
    behaviorPatterns: [
      'plans ahead',
      'focuses on long-term goals',
      'sees the bigger picture',
    ],
    likes: ['strategy games', 'business', 'future planning'],
    dislikes: ['short-sightedness', 'randomness', 'wasting resources'],
    goals: ['to build a legacy', 'to lead a large-scale project to success'],
  },
  {
    name: 'Rhea',
    traits: ['kind', 'generous', 'protective'],
    behaviorPatterns: [
      "cares for others' well-being",
      'puts others first',
      'takes on responsibility',
    ],
    likes: ['community', 'volunteering', 'family'],
    dislikes: ['selfishness', 'cruelty', 'neglect'],
    goals: [
      'to create a supportive environment',
      'to protect and care for her loved ones',
    ],
  },
];
