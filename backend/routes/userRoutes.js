import express from 'express';
const router = express.Router();

import {
    authUser,
    registerUser,
    getUsers,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(protect, admin, getUsers);
router.post('/register', registerUser);
router.post('/login', authUser);

export default router;
