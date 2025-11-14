import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { Problem } from '../models/Problem';
import { Tag } from '../models/Tag';
import { Badge } from '../models/Badge';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dsa_tracker';

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Problem.deleteMany({}),
      Tag.deleteMany({}),
      Badge.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // Create tags
    const tags = await Tag.create([
      { name: 'Array', slug: 'array', color: '#6366f1' },
      { name: 'String', slug: 'string', color: '#8b5cf6' },
      { name: 'Hash Table', slug: 'hash-table', color: '#ec4899' },
      { name: 'Dynamic Programming', slug: 'dynamic-programming', color: '#f59e0b' },
      { name: 'Math', slug: 'math', color: '#10b981' },
      { name: 'Sorting', slug: 'sorting', color: '#06b6d4' },
      { name: 'Greedy', slug: 'greedy', color: '#84cc16' },
      { name: 'Depth-First Search', slug: 'depth-first-search', color: '#14b8a6' },
      { name: 'Binary Search', slug: 'binary-search', color: '#3b82f6' },
      { name: 'Tree', slug: 'tree', color: '#22c55e' },
    ]);
    console.log(`✅ Created ${tags.length} tags`);

    // Create badges
    const badges = await Badge.create([
      {
        name: 'First Steps',
        description: 'Solve your first problem',
        icon: '🌱',
        criteria: { type: 'solved_count', value: 1 },
        tier: 'bronze',
      },
      {
        name: 'Problem Solver',
        description: 'Solve 10 problems',
        icon: '⭐',
        criteria: { type: 'solved_count', value: 10 },
        tier: 'silver',
      },
      {
        name: 'Elite Coder',
        description: 'Solve 50 problems',
        icon: '💎',
        criteria: { type: 'solved_count', value: 50 },
        tier: 'gold',
      },
      {
        name: 'Legend',
        description: 'Solve 100 problems',
        icon: '👑',
        criteria: { type: 'solved_count', value: 100 },
        tier: 'platinum',
      },
      {
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        criteria: { type: 'streak', value: 7 },
        tier: 'silver',
      },
    ]);
    console.log(`✅ Created ${badges.length} badges`);

    // Create admin user
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('✅ Created admin user (admin@example.com / admin123)');

    // Create test user
    const testUser = await User.create({
      username: 'testuser',
      email: 'user@example.com',
      password: 'user123',
      role: 'user',
    });
    console.log('✅ Created test user (user@example.com / user123)');

    // Create sample problems
    const problems = [
      {
        title: 'Two Sum',
        slug: 'two-sum',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
        difficulty: 'Easy',
        tags: [tags[0]._id, tags[2]._id],
        companies: ['Google', 'Amazon', 'Apple'],
        examples: [
          {
            input: 'nums = [2,7,11,15], target = 9',
            output: '[0,1]',
            explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
          },
        ],
        constraints: ['2 <= nums.length <= 104', '-109 <= nums[i] <= 109', 'Only one valid answer exists.'],
        testCases: [
          { input: '[2,7,11,15],9', expectedOutput: '[0,1]', isHidden: false },
          { input: '[3,2,4],6', expectedOutput: '[1,2]', isHidden: false },
          { input: '[3,3],6', expectedOutput: '[0,1]', isHidden: true },
        ],
        hints: ['Use a hash map to store numbers you have seen.', 'For each number, check if target - number exists in the hash map.'],
        createdBy: adminUser._id,
      },
      {
        title: 'Reverse String',
        slug: 'reverse-string',
        description: 'Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.',
        difficulty: 'Easy',
        tags: [tags[1]._id],
        companies: ['Microsoft', 'Facebook'],
        examples: [
          {
            input: 's = ["h","e","l","l","o"]',
            output: '["o","l","l","e","h"]',
          },
        ],
        constraints: ['1 <= s.length <= 105'],
        testCases: [
          { input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]', isHidden: false },
          { input: '["H","a","n","n","a","h"]', expectedOutput: '["h","a","n","n","a","H"]', isHidden: true },
        ],
        hints: ['Use two pointers approach.'],
        createdBy: adminUser._id,
      },
      {
        title: 'Longest Palindromic Substring',
        slug: 'longest-palindromic-substring',
        description: 'Given a string s, return the longest palindromic substring in s.',
        difficulty: 'Medium',
        tags: [tags[1]._id, tags[3]._id],
        companies: ['Amazon', 'Microsoft', 'Adobe'],
        examples: [
          {
            input: 's = "babad"',
            output: '"bab"',
            explanation: '"aba" is also a valid answer.',
          },
        ],
        constraints: ['1 <= s.length <= 1000'],
        testCases: [
          { input: '"babad"', expectedOutput: '"bab"', isHidden: false },
          { input: '"cbbd"', expectedOutput: '"bb"', isHidden: false },
        ],
        hints: ['Expand around center approach', 'Consider both odd and even length palindromes'],
        createdBy: adminUser._id,
      },
      {
        title: 'Median of Two Sorted Arrays',
        slug: 'median-of-two-sorted-arrays',
        description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).',
        difficulty: 'Hard',
        tags: [tags[0]._id, tags[8]._id],
        companies: ['Google', 'Apple', 'Microsoft'],
        examples: [
          {
            input: 'nums1 = [1,3], nums2 = [2]',
            output: '2.00000',
            explanation: 'merged array = [1,2,3] and median is 2.',
          },
        ],
        constraints: ['nums1.length == m', 'nums2.length == n', '0 <= m <= 1000', '0 <= n <= 1000'],
        testCases: [
          { input: '[1,3],[2]', expectedOutput: '2.0', isHidden: false },
          { input: '[1,2],[3,4]', expectedOutput: '2.5', isHidden: false },
        ],
        hints: ['Use binary search on the smaller array', 'Find the partition point'],
        createdBy: adminUser._id,
      },
      {
        title: 'Valid Parentheses',
        slug: 'valid-parentheses',
        description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order.',
        difficulty: 'Easy',
        tags: [tags[1]._id],
        companies: ['Amazon', 'Facebook', 'Google'],
        examples: [
          {
            input: 's = "()"',
            output: 'true',
          },
          {
            input: 's = "()[]{}"',
            output: 'true',
          },
          {
            input: 's = "(]"',
            output: 'false',
          },
        ],
        constraints: ['1 <= s.length <= 104'],
        testCases: [
          { input: '"()"', expectedOutput: 'true', isHidden: false },
          { input: '"()[]{}"', expectedOutput: 'true', isHidden: false },
          { input: '"(]"', expectedOutput: 'false', isHidden: true },
        ],
        hints: ['Use a stack data structure'],
        createdBy: adminUser._id,
      },
      {
        title: 'Merge Two Sorted Lists',
        slug: 'merge-two-sorted-lists',
        description: 'You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.',
        difficulty: 'Easy',
        tags: [tags[0]._id],
        companies: ['Amazon', 'Microsoft', 'Adobe'],
        examples: [
          {
            input: 'list1 = [1,2,4], list2 = [1,3,4]',
            output: '[1,1,2,3,4,4]',
          },
        ],
        constraints: ['The number of nodes in both lists is in the range [0, 50].'],
        testCases: [
          { input: '[1,2,4],[1,3,4]', expectedOutput: '[1,1,2,3,4,4]', isHidden: false },
          { input: '[],[]', expectedOutput: '[]', isHidden: false },
        ],
        hints: ['Use dummy node', 'Iterate through both lists comparing values'],
        createdBy: adminUser._id,
      },
      {
        title: 'Binary Tree Inorder Traversal',
        slug: 'binary-tree-inorder-traversal',
        description: 'Given the root of a binary tree, return the inorder traversal of its nodes\' values.',
        difficulty: 'Easy',
        tags: [tags[9]._id, tags[7]._id],
        companies: ['Amazon', 'Microsoft', 'Facebook'],
        examples: [
          {
            input: 'root = [1,null,2,3]',
            output: '[1,3,2]',
          },
        ],
        constraints: ['The number of nodes in the tree is in the range [0, 100].'],
        testCases: [
          { input: '[1,null,2,3]', expectedOutput: '[1,3,2]', isHidden: false },
          { input: '[]', expectedOutput: '[]', isHidden: false },
        ],
        hints: ['Use recursion or stack for iterative solution'],
        createdBy: adminUser._id,
      },
      {
        title: 'Maximum Subarray',
        slug: 'maximum-subarray',
        description: 'Given an integer array nums, find the subarray with the largest sum, and return its sum.',
        difficulty: 'Medium',
        tags: [tags[0]._id, tags[3]._id],
        companies: ['Amazon', 'LinkedIn', 'Microsoft'],
        examples: [
          {
            input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
            output: '6',
            explanation: 'The subarray [4,-1,2,1] has the largest sum 6.',
          },
        ],
        constraints: ['1 <= nums.length <= 105'],
        testCases: [
          { input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6', isHidden: false },
          { input: '[1]', expectedOutput: '1', isHidden: false },
          { input: '[5,4,-1,7,8]', expectedOutput: '23', isHidden: true },
        ],
        hints: ['Kadane\'s algorithm'],
        createdBy: adminUser._id,
      },
      {
        title: 'Climbing Stairs',
        slug: 'climbing-stairs',
        description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
        difficulty: 'Easy',
        tags: [tags[4]._id, tags[3]._id],
        companies: ['Amazon', 'Google', 'Adobe'],
        examples: [
          {
            input: 'n = 2',
            output: '2',
            explanation: 'There are two ways to climb to the top: 1. 1 step + 1 step, 2. 2 steps',
          },
          {
            input: 'n = 3',
            output: '3',
            explanation: '1. 1 step + 1 step + 1 step, 2. 1 step + 2 steps, 3. 2 steps + 1 step',
          },
        ],
        constraints: ['1 <= n <= 45'],
        testCases: [
          { input: '2', expectedOutput: '2', isHidden: false },
          { input: '3', expectedOutput: '3', isHidden: false },
          { input: '5', expectedOutput: '8', isHidden: true },
        ],
        hints: ['This is a Fibonacci sequence problem'],
        createdBy: adminUser._id,
      },
      {
        title: 'Trapping Rain Water',
        slug: 'trapping-rain-water',
        description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
        difficulty: 'Hard',
        tags: [tags[0]._id, tags[3]._id],
        companies: ['Amazon', 'Facebook', 'Google'],
        examples: [
          {
            input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
            output: '6',
            explanation: 'The elevation map traps 6 units of rain water.',
          },
        ],
        constraints: ['n == height.length', '1 <= n <= 2 * 104'],
        testCases: [
          { input: '[0,1,0,2,1,0,1,3,2,1,2,1]', expectedOutput: '6', isHidden: false },
          { input: '[4,2,0,3,2,5]', expectedOutput: '9', isHidden: true },
        ],
        hints: ['Use two pointers or dynamic programming', 'Track max height from left and right'],
        createdBy: adminUser._id,
      },
    ];

    await Problem.insertMany(problems);
    console.log(`✅ Created ${problems.length} sample problems`);

    // Update tag problem counts
    for (const tag of tags) {
      const count = await Problem.countDocuments({ tags: tag._id });
      tag.problemCount = count;
      await tag.save();
    }
    console.log('✅ Updated tag problem counts');

    console.log('\n✨ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Users: 2`);
    console.log(`   - Problems: ${problems.length}`);
    console.log(`   - Tags: ${tags.length}`);
    console.log(`   - Badges: ${badges.length}`);
    console.log('\n🔐 Login Credentials:');
    console.log('   Admin: admin@example.com / admin123');
    console.log('   User:  user@example.com / user123');
    console.log('');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
