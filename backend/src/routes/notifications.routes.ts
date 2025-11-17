import { Router } from 'express';
import auth from '../middleware/authMiddleware';
import { listMyNotifications, markNotificationRead } from '../controllers/notification.controller';

const router = Router();

router.use(auth);

// GET /api/notifications?onlyUnread=true
router.get('/', listMyNotifications);

// POST /api/notifications/:id/read
router.post('/:id/read', markNotificationRead);

export default router;
