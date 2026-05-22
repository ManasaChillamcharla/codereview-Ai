// ============================================
// Review Controller — Handles AI code review
// ============================================
import { analyzeCode } from '../../services/aiService.js';
import Review from '../../models/Review.js';

/**
 * POST /api/review
 * Body: { code: string, language: string }
 */
export const submitReview = async (req, res) => {
  try {
    const { code, language } = req.body;

    // Validation
    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      return res.status(400).json({ error: 'Code is required and must be a non-empty string.' });
    }
    if (!language || typeof language !== 'string') {
      return res.status(400).json({ error: 'Language is required.' });
    }

    const supportedLanguages = ['javascript', 'python', 'java', 'cpp', 'typescript'];
    if (!supportedLanguages.includes(language.toLowerCase())) {
      return res.status(400).json({
        error: `Unsupported language. Choose from: ${supportedLanguages.join(', ')}`,
      });
    }

    console.log(`🔍 Analyzing ${language} code (${code.length} chars)...`);

    // Call AI service
    const reviewData = await analyzeCode(code.trim(), language.toLowerCase());

    // Save to MongoDB
    const savedReview = await Review.create({
      originalCode: code.trim(),
      language: language.toLowerCase(),
      summary: reviewData.summary,
      strengths: reviewData.strengths,
      issues: reviewData.issues,
      improvements: reviewData.improvements,
      bestPractices: reviewData.bestPractices,
      securitySuggestions: reviewData.securitySuggestions,
      performanceSuggestions: reviewData.performanceSuggestions,
      correctedCode: reviewData.correctedCode,
      explanation: reviewData.explanation,
      scores: reviewData.scores,
    });

    console.log(`✅ Review saved with ID: ${savedReview._id}`);

    res.status(200).json({
      success: true,
      reviewId: savedReview._id,
      ...reviewData,
    });
  } catch (error) {
    console.error('Review error:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to analyze code. Please try again.',
    });
  }
};
