import { Schema, model, models } from 'mongoose';

export interface AnalysisResult {
  techStack: string[];
  architectureType: string;
  summary: string;
  onboardingSteps: string[];
  potentialRisks: string[];
  complexityScore: number;
}

export interface AnalysisDocument {
  repoUrl: string;
  owner: string;
  repoName: string;
  analyzedAt: Date;
  analysis: AnalysisResult;
}

const analysisResultSchema = new Schema<AnalysisResult>(
  {
    techStack: {
      type: [String],
      default: [],
      required: true,
    },
    architectureType: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    onboardingSteps: {
      type: [String],
      default: [],
      required: true,
    },
    potentialRisks: {
      type: [String],
      default: [],
      required: true,
    },
    complexityScore: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
  },
  {
    _id: false,
  },
);

const analysisSchema = new Schema<AnalysisDocument>(
  {
    repoUrl: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    owner: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    repoName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    analyzedAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    analysis: {
      type: analysisResultSchema,
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

analysisSchema.index({ owner: 1, repoName: 1, analyzedAt: -1 });
analysisSchema.index({ analyzedAt: -1 });

const Analysis = models.Analysis || model<AnalysisDocument>('Analysis', analysisSchema);

export default Analysis;
