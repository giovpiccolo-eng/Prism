export type Realm = 'life' | 'matter' | 'forces';
export type AO = 'AO1' | 'AO2' | 'AO3';
export type Mode = 'recall' | 'learn' | 'apply' | 'calculate' | 'lab' | 'command' | 'crack' | 'frontier';
export type CommandWord = 'state' | 'define' | 'describe' | 'explain' | 'calculate' | 'suggest' | 'predict' | 'evaluate' | 'compare' | 'identify';
export type RoundType = 'warmup' | 'learn' | 'apply' | 'lab' | 'crack';

export type Rank = 'Cadet' | 'Lab Tech' | 'Analyst' | 'Investigator' | 'Lead Scientist' | 'Laureate';

export interface Reward {
  xp: number;
  credits: number;
}

export interface SrsData {
  interval: number;
  ease: number;
  due: string | null;
}

// Recall item
export interface RecallItem {
  id: string;
  mode: 'recall';
  realm: Realm;
  node: string;
  ao: AO;
  command: CommandWord;
  marks: number;
  front: string;
  back: string;
  keywords: string[];
  srs: SrsData;
  reward: Reward;
}

// Learn item
export interface LearnItem {
  id: string;
  mode: 'learn';
  realm: Realm;
  node: string;
  ao: AO;
  command: CommandWord;
  marks: number;
  stem: string;
  concept: string;
  predict: string;
  reveal: string;
  explanation: string;
  reward: Reward;
}

// Dataset point for apply / lab
export interface DataPoint {
  x: number | string;
  y: number;
  label?: string;
}

export interface Dataset {
  xLabel: string;
  yLabel: string;
  xUnit?: string;
  yUnit?: string;
  points: DataPoint[];
}

// Apply item (AO2 data/graph question)
export interface ApplyItem {
  id: string;
  mode: 'apply';
  realm: Realm;
  node: string;
  ao: AO;
  command: CommandWord;
  marks: number;
  stem: string;
  dataset?: Dataset;
  options?: string[];
  correct_option?: number;
  mark_scheme: string[];
  keywords: string[];
  nexus?: string | null;
  reward: Reward;
}

// Calculate item
export interface CalculateItem {
  id: string;
  mode: 'calculate';
  realm: Realm;
  node: string;
  ao: AO;
  command: CommandWord;
  marks: number;
  stem: string;
  given: Record<string, string>;
  equation: string;
  answer: { value: number; unit: string };
  mark_scheme: string[];
  nexus?: string | null;
  frontier?: string;
  reward: Reward;
}

// Lab item (AO3)
export interface LabItem {
  id: string;
  mode: 'lab';
  realm: Realm;
  node: string;
  ao: AO;
  command: CommandWord;
  marks: number;
  stem: string;
  scenario: string;
  variables: {
    independent: string;
    dependent: string;
    control: string[];
  };
  question: string;
  mark_scheme: string[];
  reward: Reward;
}

// Command-word drill
export interface CommandItem {
  id: string;
  mode: 'command';
  realm: Realm;
  node: string;
  ao: AO;
  command: CommandWord;
  marks: number;
  stem: string;
  command_word: CommandWord;
  depth_hint: string;
  mark_scheme: string[];
  reward: Reward;
}

// Crack (exam boss)
export interface CrackItem {
  id: string;
  mode: 'crack';
  realm: Realm;
  node: string;
  ao: AO;
  command: CommandWord;
  marks: number;
  stem: string;
  mark_scheme: string[];
  max_keywords: number;
  nexus?: string | null;
  reward: Reward;
}

export type ContentItem = RecallItem | LearnItem | ApplyItem | CalculateItem | LabItem | CommandItem | CrackItem;

// Skill tree node
export interface SkillNode {
  id: string;
  realm: Realm;
  label: string;
  description: string;
  examFocus: string;
  ao: AO[];
  prerequisites: string[];
  nexusLinks: string[];
}

// Nexus connection
export interface NexusLink {
  id: string;
  title: string;
  description: string;
  nodes: string[];
  reward: Reward;
}

// Game state
export interface GameState {
  xp: number;
  rank: Rank;
  streak: number;
  lastPlayedDate: string | null;
  streakFreezes: number;
  credits: number;
  badges: string[];
}

// Mastery state per node
export interface NodeMastery {
  nodeId: string;
  ao1Attempts: number;
  ao1Correct: number;
  ao2Attempts: number;
  ao2Correct: number;
  ao3Attempts: number;
  ao3Correct: number;
  totalAttempts: number;
  masteredAt: string | null;
}

export interface SrsSchedule {
  itemId: string;
  interval: number;
  ease: number;
  due: string | null;
  lastReviewed: string | null;
}

// Session state
export interface SessionRound {
  type: RoundType;
  items: ContentItem[];
  completed: boolean;
  xpEarned: number;
}

export interface SessionState {
  nodeId: string;
  rounds: SessionRound[];
  currentRoundIndex: number;
  totalXpEarned: number;
  startedAt: string;
  completedAt: string | null;
}
