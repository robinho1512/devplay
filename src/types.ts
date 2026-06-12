export enum ProgrammingLanguage {
  HTML = 'HTML',
  PYTHON = 'Python',
  JAVASCRIPT = 'JavaScript'
}

export enum ExerciseType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  FILL_IN_BLANKS = 'FILL_IN_BLANKS',
  CODE_SELECT = 'CODE_SELECT',
  ORDER_CODE = 'ORDER_CODE'
}

export interface Exercise {
  id: string;
  language: ProgrammingLanguage;
  level: number; // 1 to 5
  title: string;
  question: string;
  type: ExerciseType;
  options: string[]; // for multiple choice / code select / order code options
  correctAnswer: string; // or joined by commas for order code
  explanation: string;
  xpReward: number;
}

export interface Achievement {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  icon: string; // lucide icon name
  xpReward: number;
  conditionType: 'lessons_completed' | 'streak_days' | 'forum_posts' | 'duels_won' | 'perfect_scores';
  requiredCount: number;
}

export interface UserStats {
  uid: string;
  displayName: string;
  avatarUrl: string;
  githubUsername?: string;
  level: number;
  xp: number;
  gold: number;
  hearts: number; // Max 5, recharges with gold or over time
  streak: number;
  lastActiveDate?: string; // YYYY-MM-DD
  history: { [date: string]: number }; // date (YYYY-MM-DD) -> minutes studied
  unlockedAchievements: string[]; // achievementIds
  completedExerciseIds: string[];
  xpGoal: number; // e.g. 50 XP per day
  minutesGoal: number; // e.g. 15 mins per day
  isBiometricEnabled: boolean;
  is2faEnabled: boolean;
  appLanguage: 'pt' | 'en';
  theme: 'dark' | 'light';
  apiKey?: string;
}

export interface DuelChallenge {
  id: string;
  challengerUid: string;
  challengerName: string;
  opponentUid?: string;
  opponentName?: string;
  language: ProgrammingLanguage;
  status: 'pending' | 'accepted' | 'completed' | 'declined';
  winnerUid?: string;
  challengerAnswers: { [exerciseId: string]: boolean };
  opponentAnswers: { [exerciseId: string]: boolean };
  challengerScore: number; // XP earned or answers correct
  opponentScore: number;
  exerciseIds: string[];
  createdAt: string;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorUid: string;
  authorLevel: number;
  language: ProgrammingLanguage | 'General';
  createdAt: string;
  likes: number;
  likedBy: string[]; // uids
  replies: ForumReply[];
}

export interface ForumReply {
  id: string;
  content: string;
  authorName: string;
  authorUid: string;
  authorLevel: number;
  createdAt: string;
  likes: number;
  likedBy: string[];
  isSolution?: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  language: ProgrammingLanguage;
}

export interface LeaderboardUser {
  uid: string;
  displayName: string;
  avatarUrl: string;
  level: number;
  xp: number;
  gold: number;
  streak: number;
  monthlyXp: number;
}
