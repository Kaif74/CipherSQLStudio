import express from 'express';
import { getAssignments, getAssignmentById } from '../controllers/assignmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAssignments);
router.get('/:id', getAssignmentById);

export default router;
