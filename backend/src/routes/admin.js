import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  getAllSwapRequests,
  getAllRatings,
  toggleRatingFlag,
  getActivityReports,
  sendPlatformMessage
} from '../controllers/adminController.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Apply admin authentication to all routes
router.use(adminAuth);

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin only)
router.get('/dashboard', getDashboardStats);

// @route   GET /api/admin/users
// @desc    Get all users for admin
// @access  Private (Admin only)
router.get('/users', getAllUsers);

// @route   PUT /api/admin/users/:userId/status
// @desc    Ban/unban user
// @access  Private (Admin only)
router.put('/users/:userId/status', toggleUserStatus);

// @route   GET /api/admin/swaps
// @desc    Get all swap requests for admin
// @access  Private (Admin only)
router.get('/swaps', getAllSwapRequests);

// @route   GET /api/admin/ratings
// @desc    Get all ratings for admin
// @access  Private (Admin only)
router.get('/ratings', getAllRatings);

// @route   PUT /api/admin/ratings/:ratingId/flag
// @desc    Flag/unflag rating
// @access  Private (Admin only)
router.put('/ratings/:ratingId/flag', toggleRatingFlag);

// @route   GET /api/admin/reports
// @desc    Get activity reports
// @access  Private (Admin only)
router.get('/reports', getActivityReports);

// @route   POST /api/admin/message
// @desc    Send platform-wide message
// @access  Private (Admin only)
router.post('/message', sendPlatformMessage);

export default router;