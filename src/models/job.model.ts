import mongoose, { Schema } from 'mongoose';
import { IJob } from '../interfaces/job.interface';

/**
 * MongoDB Schema for Job persistence
 */
const JobSchema: Schema = new Schema(
  {
    fileUrl: { type: String },
    webhookUrl: { type: String },
    fileName: { type: String },
    originalName: { type: String },
    fileType: { type: String },
    status: {
      type: String,
      enum: ['queued', 'processing', 'completed', 'failed'],
      default: 'queued',
      required: true,
      index: true,
    },
    startedAt: { type: Date },
    completedAt: { type: Date },
    result: { type: Schema.Types.Mixed },
    attempts: { type: Number, default: 0 },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

export default mongoose.model<IJob>('Job', JobSchema);
