import mongoose, { Document, Schema } from 'mongoose';

// Interfaces
export interface ITestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface IExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface IProblem extends Document {
  title: string;
  slug: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: mongoose.Types.ObjectId[];
  companies: string[];
  examples: IExample[];
  constraints: string[];
  testCases: ITestCase[];
  starterCode: {
    javascript: string;
    python: string;
    java: string;
    cpp: string;
  };
  solution?: string;
  hints: string[];
  likes: number;
  dislikes: number;
  acceptanceRate: number;
  totalSubmissions: number;
  totalAccepted: number;
  isPremium: boolean;
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Test Case Schema
const TestCaseSchema = new Schema<ITestCase>({
  input: {
    type: String,
    required: true,
  },
  expectedOutput: {
    type: String,
    required: true,
  },
  isHidden: {
    type: Boolean,
    default: false,
  },
});

// Example Schema
const ExampleSchema = new Schema<IExample>({
  input: {
    type: String,
    required: true,
  },
  output: {
    type: String,
    required: true,
  },
  explanation: String,
});

// Starter Code Schema
const StarterCodeSchema = new Schema({
  javascript: {
    type: String,
    default: '// Write your solution here\nfunction solution() {\n  \n}',
  },
  python: {
    type: String,
    default: '# Write your solution here\ndef solution():\n    pass',
  },
  java: {
    type: String,
    default: '// Write your solution here\npublic class Solution {\n    \n}',
  },
  cpp: {
    type: String,
    default: '// Write your solution here\nclass Solution {\npublic:\n    \n};',
  },
});

// Problem Schema
const ProblemSchema = new Schema<IProblem>(
  {
    title: {
      type: String,
      required: [true, 'Problem title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters long'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Problem description is required'],
      minlength: [20, 'Description must be at least 20 characters long'],
    },
    difficulty: {
      type: String,
      enum: {
        values: ['Easy', 'Medium', 'Hard'],
        message: 'Difficulty must be Easy, Medium, or Hard',
      },
      required: [true, 'Difficulty is required'],
      index: true,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Tag',
        index: true,
      },
    ],
    companies: [
      {
        type: String,
        trim: true,
      },
    ],
    examples: {
      type: [ExampleSchema],
      validate: {
        validator: function (examples: IExample[]) {
          return examples && examples.length > 0;
        },
        message: 'At least one example is required',
      },
    },
    constraints: [String],
    testCases: {
      type: [TestCaseSchema],
      validate: {
        validator: function (testCases: ITestCase[]) {
          return testCases && testCases.length > 0;
        },
        message: 'At least one test case is required',
      },
    },
    starterCode: {
      type: StarterCodeSchema,
      default: () => ({}),
    },
    solution: String,
    hints: [String],
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
      min: 0,
    },
    acceptanceRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    totalSubmissions: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },
    totalAccepted: {
      type: Number,
      default: 0,
      min: 0,
    },
    isPremium: {
      type: Boolean,
      default: false,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for efficient queries
ProblemSchema.index({ difficulty: 1, isActive: 1 });
ProblemSchema.index({ tags: 1, isActive: 1 });
ProblemSchema.index({ slug: 1 }, { unique: true });
ProblemSchema.index({ title: 'text', description: 'text' });
ProblemSchema.index({ createdAt: -1 });
ProblemSchema.index({ acceptanceRate: -1 });
ProblemSchema.index({ totalSubmissions: -1 });

// Virtual for difficulty score (for sorting)
ProblemSchema.virtual('difficultyScore').get(function () {
  const scores = { Easy: 1, Medium: 2, Hard: 3 };
  return scores[this.difficulty];
});

// Pre-save middleware to generate slug from title
ProblemSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

// Method to update acceptance rate
ProblemSchema.methods.updateAcceptanceRate = function () {
  if (this.totalSubmissions > 0) {
    this.acceptanceRate = Math.round(
      (this.totalAccepted / this.totalSubmissions) * 100
    );
  }
};

// Static method to find problems by difficulty
ProblemSchema.statics.findByDifficulty = function (difficulty: string) {
  return this.find({ difficulty, isActive: true }).populate('tags');
};

// Static method to find trending problems (high submissions recently)
ProblemSchema.statics.findTrending = function (limit = 10) {
  return this.find({ isActive: true })
    .sort({ totalSubmissions: -1 })
    .limit(limit)
    .populate('tags');
};

// Static method to search problems
ProblemSchema.statics.searchProblems = function (
  query: string,
  options: { limit?: number; skip?: number } = {}
) {
  const { limit = 20, skip = 0 } = options;
  return this.find(
    { $text: { $search: query }, isActive: true },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .skip(skip)
    .limit(limit)
    .populate('tags');
};

export const Problem = mongoose.model<IProblem>('Problem', ProblemSchema);
