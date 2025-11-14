import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { Problem } from '../models/Problem';
import { Submission } from '../models/Submission';

// @desc    Get dashboard stats
// @route   GET /api/dashboard
// @access  Private
export const getDashboardStats = async (
  req: AuthRequest,
  res: Response,
  next: any
) => {
  try {
    const user = await User.findById(req.user._id).populate('badges');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get recent submissions
    const recentSubmissions = await Submission.find({ userId: user._id })
      .populate('problemId', 'title slug difficulty')
      .sort('-submittedAt')
      .limit(10);

    // Get problems by difficulty
    const problemStats = await Problem.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$difficulty',
          count: { $sum: 1 },
        },
      },
    ]);

    const totalProblems = problemStats.reduce((acc, curr) => acc + curr.count, 0);

    // Calculate completion percentages
    const completionByDifficulty = {
      Easy: user.stats.easySolved,
      Medium: user.stats.mediumSolved,
      Hard: user.stats.hardSolved,
    };

    // Get trending problems
    const trendingProblems = await Problem.find({ isActive: true })
      .populate('tags', 'name slug color')
      .sort('-totalSubmissions')
      .limit(5)
      .select('-testCases -solution');

    // Get recently solved problems
    const recentlySolved = user.solvedProblems
      .slice(-5)
      .map((sp) => sp.problemId);

    const recentlySolvedProblems = await Problem.find({
      _id: { $in: recentlySolved },
    })
      .populate('tags', 'name slug color')
      .select('-testCases -solution');

    res.status(200).json({
      success: true,
      data: {
        user: {
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          stats: user.stats,
          streak: user.streak,
          badges: user.badges,
          totalSolved: user.stats.totalSolved,
          acceptanceRate: user.acceptanceRate,
        },
        problemStats: {
          total: totalProblems,
          byDifficulty: problemStats.reduce((acc: any, curr) => {
            acc[curr._id] = curr.count;
            return acc;
          }, {}),
          solved: completionByDifficulty,
        },
        recentSubmissions,
        trendingProblems,
        recentlySolvedProblems,
      },
    });
  } catch (error) {
    next(error);
  }
};
