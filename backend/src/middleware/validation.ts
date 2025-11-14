import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

// Generic validation middleware
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }

    next();
  };
};

// Auth validation schemas
export const signupSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.alphanum': 'Username must only contain alphanumeric characters',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username cannot exceed 30 characters',
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Problem validation schemas
export const createProblemSchema = Joi.object({
  title: Joi.string().min(5).max(200).required(),
  description: Joi.string().min(20).required(),
  difficulty: Joi.string().valid('Easy', 'Medium', 'Hard').required(),
  tags: Joi.array().items(Joi.string()).min(1),
  companies: Joi.array().items(Joi.string()),
  examples: Joi.array()
    .items(
      Joi.object({
        input: Joi.string().required(),
        output: Joi.string().required(),
        explanation: Joi.string(),
      })
    )
    .min(1)
    .required(),
  constraints: Joi.array().items(Joi.string()),
  testCases: Joi.array()
    .items(
      Joi.object({
        input: Joi.string().required(),
        expectedOutput: Joi.string().required(),
        isHidden: Joi.boolean(),
      })
    )
    .min(1)
    .required(),
  starterCode: Joi.object({
    javascript: Joi.string(),
    python: Joi.string(),
    java: Joi.string(),
    cpp: Joi.string(),
  }),
  solution: Joi.string(),
  hints: Joi.array().items(Joi.string()),
  isPremium: Joi.boolean(),
});

export const updateProblemSchema = Joi.object({
  title: Joi.string().min(5).max(200),
  description: Joi.string().min(20),
  difficulty: Joi.string().valid('Easy', 'Medium', 'Hard'),
  tags: Joi.array().items(Joi.string()),
  companies: Joi.array().items(Joi.string()),
  examples: Joi.array().items(
    Joi.object({
      input: Joi.string().required(),
      output: Joi.string().required(),
      explanation: Joi.string(),
    })
  ),
  constraints: Joi.array().items(Joi.string()),
  testCases: Joi.array().items(
    Joi.object({
      input: Joi.string().required(),
      expectedOutput: Joi.string().required(),
      isHidden: Joi.boolean(),
    })
  ),
  starterCode: Joi.object({
    javascript: Joi.string(),
    python: Joi.string(),
    java: Joi.string(),
    cpp: Joi.string(),
  }),
  solution: Joi.string(),
  hints: Joi.array().items(Joi.string()),
  isPremium: Joi.boolean(),
  isActive: Joi.boolean(),
});

// Submission validation schema
export const submitCodeSchema = Joi.object({
  problemId: Joi.string().required(),
  code: Joi.string().required(),
  language: Joi.string().valid('javascript', 'python', 'java', 'cpp').required(),
});

// Run code validation schema
export const runCodeSchema = Joi.object({
  problemId: Joi.string().required(),
  code: Joi.string().required(),
  language: Joi.string().valid('javascript', 'python', 'java', 'cpp').required(),
  testCases: Joi.array()
    .items(
      Joi.object({
        input: Joi.string().required(),
        expectedOutput: Joi.string().required(),
      })
    )
    .min(1),
});
