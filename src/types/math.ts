export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'master' | 'decade';

export interface DifficultyConfig {
  id: DifficultyLevel;
  name: string;
  shortName: string;
  levelBadge: string;
  description: string;
  sample: string;
  explanation: string;
  carryNote: string;
}

export interface MathProblem {
  id: string;
  num1: number;
  num2: number;
  answer: number;
  sum: number; // Alias for answer to ensure full backwards compatibility with stored data
  difficulty: DifficultyLevel;
  hintTip?: string;
  carriesOnes?: boolean;
  carriesTens?: boolean;
}

export interface AnswerResult {
  problem: MathProblem;
  userAnswer: number;
  isCorrect: boolean;
  timeSpentMs: number;
}

export interface WrongAnswerRecord {
  id: string;
  problem: MathProblem;
  userAnswer: number;
  timestamp: number;
  resolved: boolean;
  retryCount: number;
}

export interface GameRecord {
  id: string;
  mode: 'practice' | 'timed_60' | 'sprint_10';
  timestamp: number;
  totalQuestions: number;
  correctCount: number;
  durationSeconds: number;
  difficulty: DifficultyLevel;
  score?: number;
  maxCombo?: number;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: number;
}

export interface UserStats {
  totalSolved: number;
  totalCorrect: number;
  totalTimeSeconds: number;
  bestTimedScore: number;
  bestSprintTimeMs: number;
  currentStreakDays: number;
  lastActiveDate: string;
  difficultyBreakdown: Record<DifficultyLevel, { solved: number; correct: number }>;
}

export interface StepExplanation {
  num1: number;
  num2: number;
  onesDigit2: number;
  tensDigit2: number;
  step1Product: number;
  step2Product: number;
  step2Value: number;
  finalProduct: number;
}
