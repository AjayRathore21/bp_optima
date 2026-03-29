import mongoose, { Schema, Document } from 'mongoose';

export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface IJob extends Document {
  fileUrl?: string; // either absolute remote URL or local path
  fileName?: string; // name in the uploads folder
  originalName?: string; // name in the UI
  fileType?: string;
  status: JobStatus;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  result?: any;
  attempts: number;
}

const JobSchema: Schema = new Schema(
  {
    fileUrl: { type: String },
    fileName: { type: String },
    originalName: { type: String },
    fileType: { type: String },
    status: {
      type: String,
      enum: ['queued', 'processing', 'completed', 'failed'],
      default: 'queued',
    },
    startedAt: { type: Date },
    completedAt: { type: Date },
    result: { type: Schema.Types.Mixed },
    attempts: { type: Number, default: 0 },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// We keep these interfaces for service layer typing
export interface CreateJobDto {
  fileUrl?: string;
  fileName?: string;
  originalName?: string;
  fileType?: string;
}

export interface UpdateJobDto {
  status?: JobStatus;
  startedAt?: Date;
  completedAt?: Date;
  result?: any;
  attempts?: number;
}

export default mongoose.model<IJob>('Job', JobSchema);
