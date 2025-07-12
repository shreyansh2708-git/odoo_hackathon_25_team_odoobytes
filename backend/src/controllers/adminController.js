import User from '../models/User.js';
import SwapRequest from '../models/SwapRequest.js';
import Rating from '../models/Rating.js';
import Skill from '../models/Skill.js';

// Get dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    // Get counts
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalSwaps = await SwapRequest.countDocuments();
    const completedSwaps = await SwapRequest.countDocuments({ status: 'completed' });
    const pendingSwaps = await SwapRequest.countDocuments({ status: 'pending' });
    const totalRatings = await Rating.countDocuments();
    const averageRating = await Rating.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    // Get recent activities
    const recentUsers = await User.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt');

    const recentSwaps = await SwapRequest.find()
      .populate('requester', 'name')
      .populate('recipient', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get monthly stats
    const monthlyStats = await SwapRequest.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalSwaps,
          completedSwaps,
          pendingSwaps,
          totalRatings,
          averageRating: averageRating[0]?.avgRating || 0
        },
        recentUsers,
        recentSwaps,
        monthlyStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats',
      error: error.message
    });
  }
};

// Get all users for admin
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;

    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) {
      query.isActive = status === 'active';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalUsers: total
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// Ban/unban user
export const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive, reason } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from banning themselves
    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own status'
      });
    }

    user.isActive = isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user status',
      error: error.message
    });
  }
};

// Get all swap requests for admin
export const getAllSwapRequests = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    let query = {};
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const swapRequests = await SwapRequest.find(query)
      .populate('requester', 'name email')
      .populate('recipient', 'name email')
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

// Get all ratings for admin
export const getAllRatings = async (req, res) => {
  try {
    const { page = 1, limit = 10, flagged } = req.query;

    let query = {};
    if (flagged !== undefined) {
      query.flagged = flagged === 'true';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const ratings = await Rating.find(query)
      .populate('ratedBy', 'name email')
      .populate('ratedUser', 'name email')
      .populate('swapRequest', 'skillOffered skillRequested')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Rating.countDocuments(query);

    res.json({
      success: true,
      data: {
        ratings,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalRatings: total
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching ratings',
      error: error.message
    });
  }
};

// Flag/unflag rating
export const toggleRatingFlag = async (req, res) => {
  try {
    const { ratingId } = req.params;
    const { flagged, flagReason } = req.body;

    const rating = await Rating.findById(ratingId);
    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
      });
    }

    rating.flagged = flagged;
    rating.flagReason = flagged ? flagReason : null;
    await rating.save();

    res.json({
      success: true,
      message: `Rating ${flagged ? 'flagged' : 'unflagged'} successfully`,
      data: { rating }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating rating flag',
      error: error.message
    });
  }
};

// Get activity reports
export const getActivityReports = async (req, res) => {
  try {
    const { startDate, endDate, type = 'all' } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const reports = {};

    if (type === 'all' || type === 'users') {
      reports.userActivity = await User.aggregate([
        { $match: dateFilter.createdAt ? { createdAt: dateFilter } : {} },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ]);
    }

    if (type === 'all' || type === 'swaps') {
      reports.swapActivity = await SwapRequest.aggregate([
        { $match: dateFilter.createdAt ? { createdAt: dateFilter } : {} },
        {
          $group: {
            _id: {
              status: '$status',
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]);
    }

    if (type === 'all' || type === 'ratings') {
      reports.ratingActivity = await Rating.aggregate([
        { $match: dateFilter.createdAt ? { createdAt: dateFilter } : {} },
        {
          $group: {
            _id: {
              rating: '$rating',
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]);
    }

    res.json({
      success: true,
      data: { reports }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating activity reports',
      error: error.message
    });
  }
};

// Send platform-wide message (placeholder for notification system)
export const sendPlatformMessage = async (req, res) => {
  try {
    const { title, message, type = 'info' } = req.body;

    // In a real application, this would integrate with a notification system
    // For now, we'll just return success
    
    res.json({
      success: true,
      message: 'Platform message sent successfully',
      data: {
        title,
        message,
        type,
        sentAt: new Date(),
        sentBy: req.user.id
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending platform message',
      error: error.message
    });
  }
};