import express from 'express';
import { getHistory, getReviewById, deleteReview } from '../controllers/historyController.js';

const router = express.Router();

// GET /api/history — Fetch all reviews
router.get('/', getHistory);

// GET /api/history/:id — Fetch a specific review detail
router.get('/:id', getReviewById);

// DELETE /api/history/:id — Delete a review by ID
router.delete('/:id', deleteReview);

export default router;
