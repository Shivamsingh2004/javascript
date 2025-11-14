import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PracticeState {
  currentProblemId: string | null;
  code: Record<string, string>; // problemId -> code
  language: 'javascript' | 'python' | 'java' | 'cpp';
  hasUnsavedChanges: boolean;
  lastSavedAt: Record<string, number>; // problemId -> timestamp
  
  setCurrentProblem: (problemId: string) => void;
  setCode: (problemId: string, code: string) => void;
  setLanguage: (language: 'javascript' | 'python' | 'java' | 'cpp') => void;
  markSaved: (problemId: string) => void;
  clearUnsavedChanges: () => void;
  getCode: (problemId: string) => string;
  reset: () => void;
}

export const usePracticeStore = create<PracticeState>()(
  persist(
    (set, get) => ({
      currentProblemId: null,
      code: {},
      language: 'javascript',
      hasUnsavedChanges: false,
      lastSavedAt: {},

      setCurrentProblem: (problemId) => set({ currentProblemId: problemId }),

      setCode: (problemId, code) =>
        set((state) => ({
          code: { ...state.code, [problemId]: code },
          hasUnsavedChanges: true,
        })),

      setLanguage: (language) => set({ language }),

      markSaved: (problemId) =>
        set((state) => ({
          lastSavedAt: { ...state.lastSavedAt, [problemId]: Date.now() },
          hasUnsavedChanges: false,
        })),

      clearUnsavedChanges: () => set({ hasUnsavedChanges: false }),

      getCode: (problemId) => get().code[problemId] || '',

      reset: () =>
        set({
          currentProblemId: null,
          code: {},
          language: 'javascript',
          hasUnsavedChanges: false,
          lastSavedAt: {},
        }),
    }),
    {
      name: 'practice-storage',
    }
  )
);
