// routes/authRoutes.js
import express from 'express';
import { registerController, loginController, verifyTokenController } from '../controller/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);

// esta la agregue porque no me salia mi token sjjsjsjs
router.get('/verify', authenticateToken, verifyTokenController); 

export default router;