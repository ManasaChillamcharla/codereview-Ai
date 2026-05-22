import express from 'express';
import { submitReview } from '../controllers/reviewController.js';

const router = express.Router();

// POST /api/review — Submit code for AI analysis
router.post('/', submitReview);

export default router;
