import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Problem } from '../models/Problem';

// Mock code runner for practice runs (no submission saved)
const executeCode = async (
  code: string,
  language: string,
  testCases: any[]
): Promise<{
  results: Array<{
    input: string;
    expectedOutput: string;
    actualOutput: string;
    passed: boolean;
  }>;
  allPassed: boolean;
  runtime: number;
}> => {
  // Mock implementation - replace with actual sandbox
  await new Promise((resolve) => setTimeout(resolve, 100));

  const results = testCases.map((tc) => ({
    input: tc.input,
    expectedOutput: tc.expectedOutput,
    actualOutput: Math.random() > 0.5 ? tc.expectedOutput : 'Wrong output',
    passed: Math.random() > 0.3,
  }));

  return {
    results,
    allPassed: results.every((r) => r.passed),
    runtime: Math.floor(Math.random() * 100),
  };
};

// @desc    Run code without submitting
// @route   POST /api/run
// @access  Private
export const runCode = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const { problemId, code, language, testCases } = req.body;

    let tests = testCases;

    // If no test cases provided, use problem's public test cases
    if (!tests) {
      const problem = await Problem.findById(problemId);
      if (!problem) {
        return res.status(404).json({
          success: false,
          message: 'Problem not found',
        });
      }
      tests = problem.testCases.filter((tc) => !tc.isHidden);
    }

    const result = await executeCode(code, language, tests);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
