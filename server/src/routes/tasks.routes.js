import { Router } from 'express';
import { getTasks, createTask, moveTask, deleteTask } from '../controllers/tasks.controller.js';
import { verifyToken, requireManager } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', verifyToken, getTasks);
router.post('/', verifyToken, requireManager, createTask);
router.patch('/:id/move', verifyToken, moveTask);
router.delete('/:id', verifyToken, deleteTask);

export default router;
