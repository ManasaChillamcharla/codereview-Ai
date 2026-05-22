// ============================================
// History Controller — CRUD for saved reviews
// ============================================
import Review from '../../models/Review.js';
import mongoose from 'mongoose';

/**
 * GET /api/history
 * Returns all reviews, most recent first
 */
export const getHistory = async (req, res) => {
  try {
    const { search, language, page = 1, limit = 20 } = req.query;
    const query = {};

    if (language) query.language = language.toLowerCase();
    if (search) {
      query.$or = [
        { summary: { $regex: search, $options: 'i' } },
        { originalCode: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [reviews, total] = await Promise.all([
      Review.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .select('-originalCode -correctedCode'), // trim large fields for list view
      Review.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      reviews,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('History fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch review history.' });
  }
};

/**
 * GET /api/history/:id
 * Returns a single review with all details
 */
export const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid review ID.' });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found.' });
    }

    res.status(200).json({ success: true, review });
  } catch (error) {
    console.error('Fetch review detail error:', error.message);
    res.status(500).json({ error: 'Failed to fetch review details.' });
  }
};

/**
 * DELETE /api/history/:id
 * Deletes a review by MongoDB ObjectId
 */
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid review ID.' });
    }

    const deleted = await Review.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Review not found.' });
    }

    res.status(200).json({ success: true, message: 'Review deleted successfully.' });
  } catch (error) {
    console.error('Delete error:', error.message);
    res.status(500).json({ error: 'Failed to delete review.' });
  }
};
