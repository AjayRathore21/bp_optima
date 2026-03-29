import mongoose, { Schema, Document } from 'mongoose';

export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface IJob extends Document {
  fileUrl: string;
  status: JobStatus;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  result?: any;
  attempts: number;
}

const JobSchema: Schema = new Schema(
  {
    fileUrl: { type: String, required: true },
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
  fileUrl: string;
}

export interface UpdateJobDto {
  status?: JobStatus;
  startedAt?: Date;
  completedAt?: Date;
  result?: any;
  attempts?: number;
}

export default mongoose.model<IJob>('Job', JobSchema);
