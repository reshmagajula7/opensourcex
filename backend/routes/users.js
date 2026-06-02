import { Router } from 'express';
import { getProfile, getStats, syncGitHub } from '../controllers/userController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/users/profile', requireAuth, getProfile);
router.get('/users/stats', requireAuth, getStats);
router.post('/users/sync', requireAuth, syncGitHub);

export default router;
