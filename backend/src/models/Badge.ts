import mongoose, { Document, Schema } from 'mongoose';

export interface IBadge extends Document {
  name: string;
  description: string;
  icon: string;
  criteria: {
    type: 'solved_count' | 'streak' | 'difficulty' | 'speed' | 'custom';
    value: number;
    difficulty?: 'Easy' | 'Medium' | 'Hard';
  };
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  isActive: boolean;
}

const BadgeSchema = new Schema<IBadge>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    criteria: {
      type: {
        type: String,
        enum: ['solved_count', 'streak', 'difficulty', 'speed', 'custom'],
        required: true,
      },
      value: {
        type: Number,
        required: true,
      },
      difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
      },
    },
    tier: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'platinum'],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Badge = mongoose.model<IBadge>('Badge', BadgeSchema);
