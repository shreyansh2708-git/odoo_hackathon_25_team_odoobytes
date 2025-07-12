import User from '../models/User.js';
import SwapRequest from '../models/SwapRequest.js';
import Rating from '../models/Rating.js';

// Get all users (with search and filter)
export const getAllUsers = async (req, res) => {
  try {
    const { 
      search, 
      skill, 
      location, 
      availability, 
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = { isActive: true, isPublic: true };

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by skill
    if (skill) {
      query.$or = [
        { 'skillsOffered.name': { $regex: skill, $options: 'i' } },
        { 'skillsWanted.name': { $regex: skill, $options: 'i' } }
      ];
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Filter by availability
    if (availability) {
      query.availability = { $in: [availability] };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const users = await User.find(query)
      .select('-password')
      .sort(sortOptions)
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
          totalUsers: total,
          hasNextPage: skip + users.length < total,
          hasPrevPage: parseInt(page) > 1
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

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if profile is public or if it's the user's own profile
    if (!user.isPublic && user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'This profile is private'
      });
    }

    // Get user's recent ratings
    const recentRatings = await Rating.find({ ratedUser: user._id })
      .populate('ratedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        user,
        recentRatings
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const {
      name,
      location,
      bio,
      isPublic,
      skillsOffered,
      skillsWanted,
      availability
    } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (location !== undefined) updates.location = location;
    if (bio !== undefined) updates.bio = bio;
    if (isPublic !== undefined) updates.isPublic = isPublic;
    if (skillsOffered) updates.skillsOffered = skillsOffered;
    if (skillsWanted) updates.skillsWanted = skillsWanted;
    if (availability) updates.availability = availability;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// Upload profile photo
export const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePhoto: req.file.path },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile photo uploaded successfully',
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading profile photo',
      error: error.message
    });
  }
};

// Get user's swap history
export const getUserSwapHistory = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {
      $or: [
        { requester: req.user.id },
        { recipient: req.user.id }
      ]
    };

    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const swaps = await SwapRequest.find(query)
      .populate('requester', 'name profilePhoto rating')
      .populate('recipient', 'name profilePhoto rating')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await SwapRequest.countDocuments(query);

    res.json({
      success: true,
      data: {
        swaps,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalSwaps: total
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching swap history',
      error: error.message
    });
  }
};

// Get user's ratings
export const getUserRatings = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const ratings = await Rating.find({ ratedUser: req.user.id })
      .populate('ratedBy', 'name profilePhoto')
      .populate('swapRequest', 'skillOffered skillRequested')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Rating.countDocuments({ ratedUser: req.user.id });

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

// Deactivate account
export const deactivateAccount = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { isActive: false });
    
    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deactivating account',
      error: error.message
    });
  }
};