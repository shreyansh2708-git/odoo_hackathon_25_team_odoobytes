import express from 'express';
import {
  createSwapRequest,
  getMySwapRequests,
  getSwapRequestById,
  acceptSwapRequest,
  rejectSwapRequest,
  cancelSwapRequest,
  completeSwap,
  rateSwapPartner
} from '../controllers/swapController.js';
import { auth } from '../middleware/auth.js';
import { validateSwapRequest, validateRating } from '../middleware/validation.js';

const router = express.Router();

// @route   POST /api/swaps
// @desc    Create new swap request
// @access  Private
router.post('/', auth, validateSwapRequest, createSwapRequest);

// @route   GET /api/swaps/my
// @desc    Get current user's swap requests
// @access  Private
router.get('/my', auth, getMySwapRequests);

// @route   GET /api/swaps/:id
// @desc    Get swap request by ID
// @access  Private
router.get('/:id', auth, getSwapRequestById);

// @route   PUT /api/swaps/:id/accept
// @desc    Accept swap request
// @access  Private
router.put('/:id/accept', auth, acceptSwapRequest);

// @route   PUT /api/swaps/:id/reject
// @desc    Reject swap request
// @access  Private
router.put('/:id/reject', auth, rejectSwapRequest);

// @route   PUT /api/swaps/:id/cancel
// @desc    Cancel swap request
// @access  Private
router.put('/:id/cancel', auth, cancelSwapRequest);

// @route   PUT /api/swaps/:id/complete
// @desc    Mark swap as completed
// @access  Private
router.put('/:id/complete', auth, completeSwap);

// @route   POST /api/swaps/:id/rate
// @desc    Rate swap partner
// @access  Private
router.post('/:id/rate', auth, validateRating, rateSwapPartner);

export default router;