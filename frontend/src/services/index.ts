import api from './api';
import type {
  LoginCredentials,
  SignupCredentials,
  AuthResponse,
  User,
  Problem,
  Submission,
  DashboardStats,
  RunCodeRequest,
  RunCodeResult,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

// Auth endpoints
export const authService = {
  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/signup', credentials);
    return data.data!;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return data.data!;
  },

  getMe: async (): Promise<User> => {
    const { data } = await api.get<ApiResponse<User>>('/auth/me');
    return data.data!;
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};

// Problem endpoints
export const problemService = {
  getProblems: async (params?: {
    page?: number;
    limit?: number;
    difficulty?: string;
    tags?: string;
    search?: string;
    sort?: string;
  }): Promise<PaginatedResponse<Problem>> => {
    const { data } = await api.get('/problems', { params });
    return data;
  },

  getProblemById: async (id: string): Promise<Problem> => {
    const { data } = await api.get<ApiResponse<Problem>>(`/problems/${id}`);
    return data.data!;
  },

  createProblem: async (problem: Partial<Problem>): Promise<Problem> => {
    const { data } = await api.post<ApiResponse<Problem>>('/problems', problem);
    return data.data!;
  },

  updateProblem: async (id: string, problem: Partial<Problem>): Promise<Problem> => {
    const { data } = await api.put<ApiResponse<Problem>>(`/problems/${id}`, problem);
    return data.data!;
  },

  deleteProblem: async (id: string): Promise<void> => {
    await api.delete(`/problems/${id}`);
  },
};

// Submission endpoints
export const submissionService = {
  submitCode: async (submission: {
    problemId: string;
    code: string;
    language: string;
  }): Promise<Submission> => {
    const { data } = await api.post<ApiResponse<Submission>>('/submissions', submission);
    return data.data!;
  },

  getUserSubmissions: async (params?: {
    page?: number;
    limit?: number;
    problemId?: string;
    status?: string;
  }): Promise<PaginatedResponse<Submission>> => {
    const { data } = await api.get('/submissions', { params });
    return data;
  },

  getSubmissionById: async (id: string): Promise<Submission> => {
    const { data } = await api.get<ApiResponse<Submission>>(`/submissions/${id}`);
    return data.data!;
  },
};

// Run code endpoint
export const runService = {
  runCode: async (request: RunCodeRequest): Promise<RunCodeResult> => {
    const { data } = await api.post<ApiResponse<RunCodeResult>>('/run', request);
    return data.data!;
  },
};

// Dashboard endpoint
export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await api.get<ApiResponse<DashboardStats>>('/dashboard');
    return data.data!;
  },
};
