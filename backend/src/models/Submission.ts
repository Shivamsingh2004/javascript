import mongoose, { Document, Schema } from 'mongoose';

export interface ISubmission extends Document {
  userId: mongoose.Types.ObjectId;
  problemId: mongoose.Types.ObjectId;
  code: string;
  language: 'javascript' | 'python' | 'java' | 'cpp';
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Compile Error';
  runtime?: number;
  memory?: number;
  testCasesPassed: number;
  totalTestCases: number;
  errorMessage?: string;
  submittedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    problemId: {
      type: Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      enum: ['javascript', 'python', 'java', 'cpp'],
      required: true,
    },
    status: {
      type: String,
      enum: [
        'Accepted',
        'Wrong Answer',
        'Time Limit Exceeded',
        'Runtime Error',
        'Compile Error',
      ],
      required: true,
      index: true,
    },
    runtime: Number,
    memory: Number,
    testCasesPassed: {
      type: Number,
      required: true,
      min: 0,
    },
    totalTestCases: {
      type: Number,
      required: true,
      min: 1,
    },
    errorMessage: String,
    submittedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
SubmissionSchema.index({ userId: 1, problemId: 1, submittedAt: -1 });
SubmissionSchema.index({ userId: 1, status: 1 });
SubmissionSchema.index({ problemId: 1, status: 1 });

export const Submission = mongoose.model<ISubmission>(
  'Submission',
  SubmissionSchema
);
