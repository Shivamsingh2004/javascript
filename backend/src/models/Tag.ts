import mongoose, { Document, Schema } from 'mongoose';

export interface ITag extends Document {
  name: string;
  slug: string;
  description?: string;
  color?: string;
  problemCount: number;
  isActive: boolean;
}

const TagSchema = new Schema<ITag>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: String,
    color: {
      type: String,
      default: '#6366f1',
    },
    problemCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Tag = mongoose.model<ITag>('Tag', TagSchema);
