import mongoose, { Document, Schema } from 'mongoose';

export interface IPracticeSession extends Document {
  userId: mongoose.Types.ObjectId;
  problemId: mongoose.Types.ObjectId;
  draftCode: {
    javascript?: string;
    python?: string;
    java?: string;
    cpp?: string;
  };
  notes?: string;
  startedAt: Date;
  lastSavedAt: Date;
  completed: boolean;
  completedAt?: Date;
}

const PracticeSessionSchema = new Schema<IPracticeSession>(
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
    draftCode: {
      javascript: String,
      python: String,
      java: String,
      cpp: String,
    },
    notes: String,
    startedAt: {
      type: Date,
      default: Date.now,
    },
    lastSavedAt: {
      type: Date,
      default: Date.now,
    },
    completed: {
      type: Boolean,
      default: false,
      index: true,
    },
    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Compound index for user-problem sessions
PracticeSessionSchema.index({ userId: 1, problemId: 1 });

export const PracticeSession = mongoose.model<IPracticeSession>(
  'PracticeSession',
  PracticeSessionSchema
);
