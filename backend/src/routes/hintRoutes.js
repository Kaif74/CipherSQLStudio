import express from 'express';
import { generateHint } from '../controllers/hintController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate', protect, generateHint);

export default router;
