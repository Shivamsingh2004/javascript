import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Trophy,
  TrendingUp,
  Calendar,
  Target,
  Award,
  Clock,
  CheckCircle2,
  Flame,
} from 'lucide-react';
import { dashboardService } from '@/services';
import { cn, getDifficultyColor, formatRelativeTime } from '@/lib/utils';

export default function Dashboard() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardService.getStats,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Failed to load dashboard</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 btn btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const user = stats?.user;
  const problemStats = stats?.problemStats;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Welcome back, {user?.username}! 👋
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Track your progress and keep solving problems
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {/* Total Solved */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Problems Solved
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {user?.stats.totalSolved || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <span className="text-xs px-2 py-1 rounded-md bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
              {user?.stats.easySolved || 0} Easy
            </span>
            <span className="text-xs px-2 py-1 rounded-md bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400">
              {user?.stats.mediumSolved || 0} Medium
            </span>
            <span className="text-xs px-2 py-1 rounded-md bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400">
              {user?.stats.hardSolved || 0} Hard
            </span>
          </div>
        </div>

        {/* Acceptance Rate */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Acceptance Rate
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {user?.acceptanceRate || 0}%
              </p>
            </div>
            <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-accent-600 dark:text-accent-400" />
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            {user?.stats.acceptedSubmissions || 0} / {user?.stats.totalSubmissions || 0} submissions
          </p>
        </div>

        {/* Current Streak */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Current Streak
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {user?.streak.current || 0} days
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <Flame className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            Longest: {user?.streak.longest || 0} days
          </p>
        </div>

        {/* Badges */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Badges Earned
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {user?.badges?.length || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            Keep solving to earn more!
          </p>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Progress & Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Overview */}
          <motion.div variants={itemVariants} className="card p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Problem Solving Progress
            </h2>
            <div className="space-y-4">
              {/* Easy */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Easy
                  </span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {user?.stats.easySolved || 0} / {problemStats?.byDifficulty.Easy || 0}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        problemStats?.byDifficulty.Easy
                          ? ((user?.stats.easySolved || 0) / problemStats.byDifficulty.Easy) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Medium */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Medium
                  </span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {user?.stats.mediumSolved || 0} / {problemStats?.byDifficulty.Medium || 0}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        problemStats?.byDifficulty.Medium
                          ? ((user?.stats.mediumSolved || 0) / problemStats.byDifficulty.Medium) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Hard */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Hard
                  </span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {user?.stats.hardSolved || 0} / {problemStats?.byDifficulty.Hard || 0}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        problemStats?.byDifficulty.Hard
                          ? ((user?.stats.hardSolved || 0) / problemStats.byDifficulty.Hard) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Submissions */}
          <motion.div variants={itemVariants} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Submissions
              </h2>
              <Link
                to="/submissions"
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {stats?.recentSubmissions && stats.recentSubmissions.length > 0 ? (
                stats.recentSubmissions.slice(0, 5).map((submission) => (
                  <div
                    key={submission._id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                  >
                    <div className="flex-1">
                      <Link
                        to={`/problems/${typeof submission.problemId === 'object' ? submission.problemId._id : submission.problemId}`}
                        className="font-medium text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        {typeof submission.problemId === 'object' ? submission.problemId.title : 'Problem'}
                      </Link>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {formatRelativeTime(submission.submittedAt)} • {submission.language}
                      </p>
                    </div>
                    <span
                      className={cn(
                        'px-2 py-1 text-xs font-medium rounded-md',
                        submission.status === 'Accepted'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      )}
                    >
                      {submission.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center py-8 text-slate-600 dark:text-slate-400">
                  No submissions yet. Start solving problems!
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Trending & Badges */}
        <div className="space-y-6">
          {/* Badges */}
          <motion.div variants={itemVariants} className="card p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Your Badges
            </h2>
            {user?.badges && user.badges.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {user.badges.map((badge) => (
                  <div
                    key={badge._id}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-center"
                  >
                    <div className="text-3xl mb-1">{badge.icon}</div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {badge.name}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {badge.tier}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-slate-600 dark:text-slate-400">
                Solve problems to earn badges!
              </p>
            )}
          </motion.div>

          {/* Trending Problems */}
          <motion.div variants={itemVariants} className="card p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Trending Problems
            </h2>
            <div className="space-y-3">
              {stats?.trendingProblems && stats.trendingProblems.length > 0 ? (
                stats.trendingProblems.map((problem) => (
                  <Link
                    key={problem._id}
                    to={`/problems/${problem._id}`}
                    className="block p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <p className="font-medium text-slate-900 dark:text-white text-sm">
                      {problem.title}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={cn('text-xs px-2 py-0.5 rounded-md', getDifficultyColor(problem.difficulty))}>
                        {problem.difficulty}
                      </span>
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        {problem.acceptanceRate}% accepted
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-center py-4 text-slate-600 dark:text-slate-400">
                  No trending problems
                </p>
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="card p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <Link
                to="/problems"
                className="block w-full btn btn-primary"
              >
                Browse Problems
              </Link>
              <Link
                to="/problems?difficulty=Easy"
                className="block w-full btn btn-secondary"
              >
                Practice Easy
              </Link>
              <Link
                to="/profile"
                className="block w-full btn btn-ghost"
              >
                View Profile
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
