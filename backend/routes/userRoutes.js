import express from 'express';
const router = express.Router();

import { authUser, registerUser } from '../controllers/userController.js';

router.route('/register').post(registerUser);
router.post('/login', authUser);

export default router;
