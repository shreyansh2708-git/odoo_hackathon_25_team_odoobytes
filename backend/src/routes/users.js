import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateProfile,
  uploadProfilePhoto,
  getUserSwapHistory,
  getUserRatings,
  deactivateAccount
} from '../controllers/userController.js';
import { auth } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (with search and filters)
// @access  Private
router.get('/', auth, getAllUsers);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', auth, getUserById);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, updateProfile);

// @route   POST /api/users/profile/photo
// @desc    Upload profile photo
// @access  Private
router.post('/profile/photo', auth, upload.single('profilePhoto'), uploadProfilePhoto);

// @route   GET /api/users/me/swaps
// @desc    Get current user's swap history
// @access  Private
router.get('/me/swaps', auth, getUserSwapHistory);

// @route   GET /api/users/me/ratings
// @desc    Get current user's ratings
// @access  Private
router.get('/me/ratings', auth, getUserRatings);

// @route   DELETE /api/users/me/deactivate
// @desc    Deactivate user account
// @access  Private
router.delete('/me/deactivate', auth, deactivateAccount);

export default router;