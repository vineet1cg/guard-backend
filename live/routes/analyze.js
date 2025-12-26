import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { analyzeInput, getHistory } from '../controllers/analyzeController.js';

const router = express.Router();

router.post('/', authenticateToken, analyzeInput);
router.get('/history', authenticateToken, getHistory);

export default router;