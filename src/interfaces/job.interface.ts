import { Document } from 'mongoose';

export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface IJob extends Document {
  fileUrl?: string; // remote URL
  webhookUrl?: string; // callback URL
  fileName?: string; // storage name
  originalName?: string; // user-facing name
  fileType?: string;
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  result?: any;
  attempts: number;
}

export interface ICreateJobDTO {
  fileUrl?: string;
  webhookUrl?: string;
  fileName?: string;
  originalName?: string;
  fileType?: string;
}

export interface IUpdateJobDTO {
  status?: JobStatus;
  startedAt?: Date;
  completedAt?: Date;
  result?: any;
  attempts?: number;
}
