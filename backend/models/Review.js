// ============================================
// Review Model — Stores AI Code Review Results
// ============================================
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    originalCode: {
      type: String,
      required: [true, 'Original code is required'],
      trim: true,
    },
    language: {
      type: String,
      required: [true, 'Programming language is required'],
      enum: ['javascript', 'python', 'java', 'cpp', 'typescript'],
      lowercase: true,
    },
    summary: {
      type: String,
      default: '',
    },
    strengths: {
      type: [String],
      default: [],
    },
    issues: [
      {
        title: { type: String, default: '' },
        severity: { type: String, enum: ['critical', 'warning', 'info'], default: 'info' },
        description: { type: String, default: '' },
        line: { type: Number, default: null },
      },
    ],
    improvements: {
      type: [String],
      default: [],
    },
    bestPractices: {
      type: [String],
      default: [],
    },
    securitySuggestions: {
      type: [String],
      default: [],
    },
    performanceSuggestions: {
      type: [String],
      default: [],
    },
    correctedCode: {
      type: String,
      default: '',
    },
    explanation: {
      type: String,
      default: '',
    },
    scores: {
      codeQuality: { type: Number, min: 0, max: 100, default: 0 },
      security: { type: Number, min: 0, max: 100, default: 0 },
      performance: { type: Number, min: 0, max: 100, default: 0 },
      readability: { type: Number, min: 0, max: 100, default: 0 },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Index for efficient searching
reviewSchema.index({ language: 1, createdAt: -1 });
reviewSchema.index({ createdAt: -1 });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
