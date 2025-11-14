import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  avatar?: string;
  bio?: string;
  solvedProblems: {
    problemId: mongoose.Types.ObjectId;
    solvedAt: Date;
  }[];
  bookmarkedProblems: mongoose.Types.ObjectId[];
  badges: mongoose.Types.ObjectId[];
  streak: {
    current: number;
    longest: number;
    lastSolvedDate?: Date;
  };
  stats: {
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    totalSubmissions: number;
    acceptedSubmissions: number;
  };
  refreshToken?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      match: [/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores'],
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
      index: true,
    },
    avatar: String,
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    solvedProblems: [
      {
        problemId: {
          type: Schema.Types.ObjectId,
          ref: 'Problem',
        },
        solvedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    bookmarkedProblems: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Problem',
      },
    ],
    badges: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Badge',
      },
    ],
    streak: {
      current: {
        type: Number,
        default: 0,
      },
      longest: {
        type: Number,
        default: 0,
      },
      lastSolvedDate: Date,
    },
    stats: {
      totalSolved: {
        type: Number,
        default: 0,
      },
      easySolved: {
        type: Number,
        default: 0,
      },
      mediumSolved: {
        type: Number,
        default: 0,
      },
      hardSolved: {
        type: Number,
        default: 0,
      },
      totalSubmissions: {
        type: Number,
        default: 0,
      },
      acceptedSubmissions: {
        type: Number,
        default: 0,
      },
    },
    refreshToken: String,
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        delete ret.password;
        delete ret.refreshToken;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

// Indexes
UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ 'stats.totalSolved': -1 });

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Virtual for acceptance rate
UserSchema.virtual('acceptanceRate').get(function () {
  if (this.stats.totalSubmissions === 0) return 0;
  return Math.round(
    (this.stats.acceptedSubmissions / this.stats.totalSubmissions) * 100
  );
});

export const User = mongoose.model<IUser>('User', UserSchema);
