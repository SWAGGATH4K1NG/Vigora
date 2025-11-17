import { Router } from 'express';
import { getMyProfile, updateMyProfile } from '../controllers/client.controller';
import auth from '../middleware/authMiddleware';
import requireRole from '../middleware/requireRole';
import { trainerCreateClient} from '../controllers/client.controller';
import { listMyClients } from '../controllers/client.controller';


const router = Router();

router.use(auth);
router.use(requireRole('TRAINER'));

router.post('/', trainerCreateClient);
router.get('/my', listMyClients);

router.get('/me', requireRole('CLIENT'), getMyProfile);
router.put('/me', requireRole('CLIENT'), updateMyProfile);

export default router;
