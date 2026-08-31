import { Router } from 'express';
import { getUsers, updateUser } from '../controllers/users.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', verifyToken, getUsers);
router.put('/:email', verifyToken, updateUser);

export default router;
