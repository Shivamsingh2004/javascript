import { Response } from 'express';
import { Problem } from '../models/Problem';
import { Tag } from '../models/Tag';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

// @desc    Get all problems with filters and pagination
// @route   GET /api/problems
// @access  Private
export const getProblems = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const {
      page = 1,
      limit = 20,
      difficulty,
      tags,
      search,
      sort = '-createdAt',
    } = req.query;

    const query: any = { isActive: true };

    // Filter by difficulty
    if (difficulty) {
      query.difficulty = difficulty;
    }

    // Filter by tags
    if (tags) {
      const tagArray = typeof tags === 'string' ? tags.split(',') : tags;
      const tagDocs = await Tag.find({ slug: { $in: tagArray } });
      query.tags = { $in: tagDocs.map((t) => t._id) };
    }

    // Search
    if (search && typeof search === 'string') {
      query.$text = { $search: search };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const problems = await Problem.find(query)
      .populate('tags', 'name slug color')
      .sort(sort as string)
      .skip(skip)
      .limit(Number(limit))
      .select('-testCases -solution');

    const total = await Problem.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        problems,
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

// @desc    Get problem by ID
// @route   GET /api/problems/:id
// @access  Private
export const getProblemById = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const problem = await Problem.findOne({
      _id: req.params.id,
      isActive: true,
    })
      .populate('tags', 'name slug color')
      .select('-testCases.isHidden -solution');

    if (!problem) {
      throw new AppError('Problem not found', 404);
    }

    res.status(200).json({
      success: true,
      data: problem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create problem
// @route   POST /api/problems
// @access  Private/Admin
export const createProblem = async (req: AuthRequest, res: Response, next: any) => {
  try {
    // Handle tag IDs
    if (req.body.tags && Array.isArray(req.body.tags)) {
      const tagIds = await Promise.all(
        req.body.tags.map(async (tagSlug: string) => {
          let tag = await Tag.findOne({ slug: tagSlug });
          if (!tag) {
            tag = await Tag.create({
              name: tagSlug,
              slug: tagSlug,
            });
          }
          tag.problemCount += 1;
          await tag.save();
          return tag._id;
        })
      );
      req.body.tags = tagIds;
    }

    req.body.createdBy = req.user._id;

    const problem = await Problem.create(req.body);

    res.status(201).json({
      success: true,
      data: problem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update problem
// @route   PUT /api/problems/:id
// @access  Private/Admin
export const updateProblem = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      throw new AppError('Problem not found', 404);
    }

    const updatedProblem = await Problem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('tags');

    res.status(200).json({
      success: true,
      data: updatedProblem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete problem
// @route   DELETE /api/problems/:id
// @access  Private/Admin
export const deleteProblem = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      throw new AppError('Problem not found', 404);
    }

    // Soft delete
    problem.isActive = false;
    await problem.save();

    res.status(200).json({
      success: true,
      message: 'Problem deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
