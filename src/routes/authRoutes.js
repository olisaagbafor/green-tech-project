import express from 'express';

import {
    login,
    logout,
    getMe,
    register,
    updateDetails,
    forgotPassword,
    resetPassword,
    updatePassword
} from '../controllers/authController.js';

import { authenticate } from "../middlewares/auth-middleware.js";

const router = express.Router();

router.post('/login', login);
router.get('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);
router.get('/me', authenticate, getMe);
router.post('/register', register);
router.put('/me/update-details', authenticate, updateDetails);
router.put('/me/update-password', authenticate, updatePassword);


export default router;