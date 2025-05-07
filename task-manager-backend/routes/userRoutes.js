import express from 'express';
import {
    register,
    login,
    getProfile,
    updateProfile,
    getAllUsers,
    updateUserRole
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Admin routes
router.get('/all', protect, getAllUsers);
router.put('/:userId/role', protect, updateUserRole);

export default router;
