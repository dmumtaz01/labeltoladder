export type Onboarding = {
  fullName: string;
  country: string;
  languages: string[];
  device: "smartphone" | "laptop" | "both";
  internet: "fast" | "ok" | "limited";
  hoursPerWeek: number;
  education: "none" | "primary" | "secondary" | "university";
};

export type Screener = {
  interests: string[];
  domain: string;
  writingComfort: 1 | 2 | 3 | 4 | 5;
  criticalThinking: 1 | 2 | 3 | 4 | 5;
};

export type TaskAnswer = {
  taskId: string;
  selected: number;
  correct: boolean;
  msSpent: number;
};

export type TestResults = {
  answers: TaskAnswer[];
  accuracy: number; // 0-1
  consistency: number; // 0-1
  speed: number; // 0-1
  language: number; // 0-1
  reasoning: number; // 0-1
  reliability: number; // 0-1
  rawScore: number; // 0-1
  level: 0 | 1 | 2 | 3 | 4 | 5 | 6;
};

export type CandidateProfile = {
  onboarding: Onboarding | null;
  screener: Screener | null;
  testResults: TestResults | null;
  completedAt: string | null;
};

export type Level = {
  level: number;
  title: string;
  description: string;
  exampleTasks: string[];
  hourly: string;
};
