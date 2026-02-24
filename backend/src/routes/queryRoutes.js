import express from 'express';
import { executeQuery } from '../controllers/queryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/execute', protect, executeQuery);

export default router;
