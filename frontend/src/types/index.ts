// User types
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  bio?: string;
  stats: {
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    totalSubmissions: number;
    acceptedSubmissions: number;
  };
  streak: {
    current: number;
    longest: number;
    lastSolvedDate?: string;
  };
  badges: Badge[];
  acceptanceRate: number;
}

// Problem types
export interface Problem {
  _id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: Tag[];
  companies: string[];
  examples: Example[];
  constraints: string[];
  testCases?: TestCase[];
  starterCode: StarterCode;
  hints: string[];
  likes: number;
  dislikes: number;
  acceptanceRate: number;
  totalSubmissions: number;
  totalAccepted: number;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface StarterCode {
  javascript: string;
  python: string;
  java: string;
  cpp: string;
}

export interface Tag {
  _id: string;
  name: string;
  slug: string;
  color?: string;
  description?: string;
}

export interface Badge {
  _id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

// Submission types
export interface Submission {
  _id: string;
  userId: string;
  problemId: Problem | string;
  code: string;
  language: 'javascript' | 'python' | 'java' | 'cpp';
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Compile Error';
  runtime?: number;
  memory?: number;
  testCasesPassed: number;
  totalTestCases: number;
  errorMessage?: string;
  submittedAt: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Dashboard types
export interface DashboardStats {
  user: User;
  problemStats: {
    total: number;
    byDifficulty: {
      Easy: number;
      Medium: number;
      Hard: number;
    };
    solved: {
      Easy: number;
      Medium: number;
      Hard: number;
    };
  };
  recentSubmissions: Submission[];
  trendingProblems: Problem[];
  recentlySolvedProblems: Problem[];
}

// Run code types
export interface RunCodeRequest {
  problemId: string;
  code: string;
  language: 'javascript' | 'python' | 'java' | 'cpp';
  testCases?: TestCase[];
}

export interface RunCodeResult {
  results: Array<{
    input: string;
    expectedOutput: string;
    actualOutput: string;
    passed: boolean;
  }>;
  allPassed: boolean;
  runtime: number;
}
