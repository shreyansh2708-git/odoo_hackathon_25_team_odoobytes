import SwapRequest from '../models/SwapRequest.js';
import User from '../models/User.js';
import Rating from '../models/Rating.js';
import { sendSwapRequestEmail } from '../utils/sendEmail.js';

// Create new swap request
export const createSwapRequest = async (req, res) => {
  try {
    const {
      recipientId,
      skillOffered,
      skillRequested,
      message,
      scheduledDate,
      duration,
      meetingType,
      meetingDetails
    } = req.body;

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
    }

    // Check if user is trying to request from themselves
    if (recipientId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot create swap request with yourself'
      });
    }

    // Check for existing pending request between same users
    const existingRequest = await SwapRequest.findOne({
      requester: req.user.id,
      recipient: recipientId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending request with this user'
      });
    }

    // Create swap request
    const swapRequest = await SwapRequest.create({
      requester: req.user.id,
      recipient: recipientId,
      skillOffered,
      skillRequested,
      message,
      scheduledDate,
      duration,
      meetingType,
      meetingDetails
    });

    // Populate the request
    await swapRequest.populate('requester', 'name profilePhoto');
    await swapRequest.populate('recipient', 'name profilePhoto');

    // Send notification email
    try {
      await sendSwapRequestEmail(
        recipient,
        { name: req.user.name },
        skillOffered.name,
        skillRequested.name
      );
    } catch (emailError) {
      console.log('Swap request email could not be sent:', emailError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Swap request created successfully',
      data: { swapRequest }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating swap request',
      error: error.message
    });
  }
};

// Get all swap requests for current user
export const getMySwapRequests = async (req, res) => {
  try {
    const { status, type = 'all', page = 1, limit = 10 } = req.query;

    let query = {};
    
    // Filter by type (sent, received, or all)
    if (type === 'sent') {
      query.requester = req.user.id;
    } else if (type === 'received') {
      query.recipient = req.user.id;
    } else {
      query.$or = [
        { requester: req.user.id },
        { recipient: req.user.id }
      ];
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const swapRequests = await SwapRequest.find(query)
      .populate('requester', 'name profilePhoto rating')
      .populate('recipient', 'name profilePhoto rating')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await SwapRequest.countDocuments(query);

    res.json({
      success: true,
      data: {
        swapRequests,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalRequests: total
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching swap requests',
      error: error.message
    });
  }
};

// Get swap request by ID
export const getSwapRequestById = async (req, res) => {
  try {
    const swapRequest = await SwapRequest.findById(req.params.id)
      .populate('requester', 'name profilePhoto rating')
      .populate('recipient', 'name profilePhoto rating');

    if (!swapRequest) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found'
      });
    }

    // Check if user is part of this swap request
    if (swapRequest.requester._id.toString() !== req.user.id && 
        swapRequest.recipient._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { swapRequest }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching swap request',
      error: error.message
    });
  }
};

// Accept swap request
export const acceptSwapRequest = async (req, res) => {
  try {
    const { responseMessage, scheduledDate, meetingDetails } = req.body;

    const swapRequest = await SwapRequest.findById(req.params.id);

    if (!swapRequest) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found'
      });
    }

    // Check if user is the recipient
    if (swapRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the recipient can accept this request'
      });
    }

    // Check if request is still pending
    if (swapRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'This request is no longer pending'
      });
    }

    // Update swap request
    swapRequest.status = 'accepted';
    swapRequest.responseMessage = responseMessage;
    if (scheduledDate) swapRequest.scheduledDate = scheduledDate;
    if (meetingDetails) swapRequest.meetingDetails = meetingDetails;

    await swapRequest.save();

    // Populate for response
    await swapRequest.populate('requester', 'name profilePhoto');
    await swapRequest.populate('recipient', 'name profilePhoto');

    res.json({
      success: true,
      message: 'Swap request accepted successfully',
      data: { swapRequest }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error accepting swap request',
      error: error.message
    });
  }
};

// Reject swap request
export const rejectSwapRequest = async (req, res) => {
  try {
    const { responseMessage } = req.body;

    const swapRequest = await SwapRequest.findById(req.params.id);

    if (!swapRequest) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found'
      });
    }

    // Check if user is the recipient
    if (swapRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the recipient can reject this request'
      });
    }

    // Check if request is still pending
    if (swapRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'This request is no longer pending'
      });
    }

    // Update swap request
    swapRequest.status = 'rejected';
    swapRequest.responseMessage = responseMessage;

    await swapRequest.save();

    res.json({
      success: true,
      message: 'Swap request rejected',
      data: { swapRequest }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rejecting swap request',
      error: error.message
    });
  }
};

// Cancel swap request
export const cancelSwapRequest = async (req, res) => {
  try {
    const { cancelReason } = req.body;

    const swapRequest = await SwapRequest.findById(req.params.id);

    if (!swapRequest) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found'
      });
    }

    // Check if user is part of this swap request
    if (swapRequest.requester.toString() !== req.user.id && 
        swapRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if request can be cancelled
    if (swapRequest.status === 'completed' || swapRequest.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel this request'
      });
    }

    // Update swap request
    swapRequest.status = 'cancelled';
    swapRequest.cancelReason = cancelReason;

    await swapRequest.save();

    res.json({
      success: true,
      message: 'Swap request cancelled',
      data: { swapRequest }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling swap request',
      error: error.message
    });
  }
};

// Mark swap as completed
export const completeSwap = async (req, res) => {
  try {
    const swapRequest = await SwapRequest.findById(req.params.id);

    if (!swapRequest) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found'
      });
    }

    // Check if user is part of this swap request
    if (swapRequest.requester.toString() !== req.user.id && 
        swapRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if request is accepted
    if (swapRequest.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Only accepted requests can be completed'
      });
    }

    // Update swap request
    swapRequest.status = 'completed';
    await swapRequest.save();

    // Update swap counts for both users
    await User.findByIdAndUpdate(swapRequest.requester, { $inc: { swapCount: 1 } });
    await User.findByIdAndUpdate(swapRequest.recipient, { $inc: { swapCount: 1 } });

    res.json({
      success: true,
      message: 'Swap marked as completed',
      data: { swapRequest }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error completing swap',
      error: error.message
    });
  }
};

// Rate swap partner
export const rateSwapPartner = async (req, res) => {
  try {
    const { rating, comment, skillRating, wouldRecommend } = req.body;
    const swapRequestId = req.params.id;

    const swapRequest = await SwapRequest.findById(swapRequestId);

    if (!swapRequest) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found'
      });
    }

    // Check if user is part of this swap request
    if (swapRequest.requester.toString() !== req.user.id && 
        swapRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if swap is completed
    if (swapRequest.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only rate completed swaps'
      });
    }

    // Determine who is being rated
    const ratedUserId = swapRequest.requester.toString() === req.user.id 
      ? swapRequest.recipient 
      : swapRequest.requester;

    // Check if user has already rated this swap
    const existingRating = await Rating.findOne({
      swapRequest: swapRequestId,
      ratedBy: req.user.id
    });

    if (existingRating) {
      return res.status(400).json({
        success: false,
        message: 'You have already rated this swap'
      });
    }

    // Create rating
    const newRating = await Rating.create({
      swapRequest: swapRequestId,
      ratedBy: req.user.id,
      ratedUser: ratedUserId,
      rating,
      comment,
      skillRating,
      wouldRecommend
    });

    // Update swap request rating status
    if (swapRequest.requester.toString() === req.user.id) {
      swapRequest.isRatedByRequester = true;
    } else {
      swapRequest.isRatedByRecipient = true;
    }
    await swapRequest.save();

    res.status(201).json({
      success: true,
      message: 'Rating submitted successfully',
      data: { rating: newRating }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting rating',
      error: error.message
    });
  }
};