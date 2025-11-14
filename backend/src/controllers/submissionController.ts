import { Response } from 'express';
import { Submission } from '../models/Submission';
import { Problem } from '../models/Problem';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

// Mock code runner (replace with actual sandbox execution)
const runTests = async (
  code: string,
  language: string,
  testCases: any[]
): Promise<{
  status: string;
  testCasesPassed: number;
  totalTestCases: number;
  runtime?: number;
  memory?: number;
  errorMessage?: string;
}> => {
  // This is a mock implementation
  // In production, use Docker sandbox or cloud execution service
  
  try {
    // Simulate execution time
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Mock result - randomly pass/fail for demonstration
    const passed = Math.random() > 0.3 ? testCases.length : Math.floor(Math.random() * testCases.length);

    return {
      status: passed === testCases.length ? 'Accepted' : 'Wrong Answer',
      testCasesPassed: passed,
      totalTestCases: testCases.length,
      runtime: Math.floor(Math.random() * 100),
      memory: Math.floor(Math.random() * 50),
    };
  } catch (error: any) {
    return {
      status: 'Runtime Error',
      testCasesPassed: 0,
      totalTestCases: testCases.length,
      errorMessage: error.message,
    };
  }
};

// @desc    Submit code
// @route   POST /api/submissions
// @access  Private
export const submitCode = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const { problemId, code, language } = req.body;

    const problem = await Problem.findById(problemId);
    if (!problem) {
      throw new AppError('Problem not found', 404);
    }

    // Run tests
    const result = await runTests(code, language, problem.testCases);

    // Create submission
    const submission = await Submission.create({
      userId: req.user._id,
      problemId,
      code,
      language,
      status: result.status,
      runtime: result.runtime,
      memory: result.memory,
      testCasesPassed: result.testCasesPassed,
      totalTestCases: result.totalTestCases,
      errorMessage: result.errorMessage,
    });

    // Update user stats
    const user = await User.findById(req.user._id);
    if (user) {
      user.stats.totalSubmissions += 1;

      if (result.status === 'Accepted') {
        user.stats.acceptedSubmissions += 1;

        // Check if first time solving this problem
        const alreadySolved = user.solvedProblems.some(
          (sp) => sp.problemId.toString() === problemId
        );

        if (!alreadySolved) {
          user.solvedProblems.push({
            problemId,
            solvedAt: new Date(),
          });
          user.stats.totalSolved += 1;

          // Update difficulty-specific stats
          if (problem.difficulty === 'Easy') user.stats.easySolved += 1;
          else if (problem.difficulty === 'Medium') user.stats.mediumSolved += 1;
          else if (problem.difficulty === 'Hard') user.stats.hardSolved += 1;

          // Update streak
          const today = new Date().setHours(0, 0, 0, 0);
          const lastSolved = user.streak.lastSolvedDate
            ? new Date(user.streak.lastSolvedDate).setHours(0, 0, 0, 0)
            : 0;

          if (lastSolved === today - 86400000) {
            // Yesterday
            user.streak.current += 1;
          } else if (lastSolved !== today) {
            // Streak broken
            user.streak.current = 1;
          }

          if (user.streak.current > user.streak.longest) {
            user.streak.longest = user.streak.current;
          }

          user.streak.lastSolvedDate = new Date();
        }
      }

      await user.save();
    }

    // Update problem stats
    problem.totalSubmissions += 1;
    if (result.status === 'Accepted') {
      problem.totalAccepted += 1;
    }
    problem.updateAcceptanceRate();
    await problem.save();

    res.status(201).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user submissions
// @route   GET /api/submissions
// @access  Private
export const getUserSubmissions = async (
  req: AuthRequest,
  res: Response,
  next: any
) => {
  try {
    const { page = 1, limit = 20, problemId, status } = req.query;

    const query: any = { userId: req.user._id };

    if (problemId) query.problemId = problemId;
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const submissions = await Submission.find(query)
      .populate('problemId', 'title slug difficulty')
      .sort('-submittedAt')
      .skip(skip)
      .limit(Number(limit));

    const total = await Submission.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        submissions,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get submission by ID
// @route   GET /api/submissions/:id
// @access  Private
export const getSubmissionById = async (
  req: AuthRequest,
  res: Response,
  next: any
) => {
  try {
    const submission = await Submission.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate('problemId', 'title slug difficulty');

    if (!submission) {
      throw new AppError('Submission not found', 404);
    }

    res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};
