import mongoose from 'mongoose';

const swapRequestSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Requester is required']
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recipient is required']
  },
  skillOffered: {
    name: {
      type: String,
      required: [true, 'Skill offered name is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate'
    }
  },
  skillRequested: {
    name: {
      type: String,
      required: [true, 'Skill requested name is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  message: {
    type: String,
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  responseMessage: {
    type: String,
    trim: true,
    maxlength: [500, 'Response message cannot exceed 500 characters']
  },
  scheduledDate: {
    type: Date
  },
  duration: {
    type: Number, // Duration in hours
    min: 0.5,
    max: 8
  },
  meetingType: {
    type: String,
    enum: ['in-person', 'online', 'hybrid'],
    default: 'online'
  },
  meetingDetails: {
    type: String,
    trim: true
  },
  completedAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  cancelReason: {
    type: String,
    trim: true
  },
  isRatedByRequester: {
    type: Boolean,
    default: false
  },
  isRatedByRecipient: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for swap duration status
swapRequestSchema.virtual('isExpired').get(function() {
  if (this.status === 'pending' && this.scheduledDate) {
    return new Date() > this.scheduledDate;
  }
  return false;
});

// Index for efficient queries
swapRequestSchema.index({ requester: 1, status: 1 });
swapRequestSchema.index({ recipient: 1, status: 1 });
swapRequestSchema.index({ status: 1, createdAt: -1 });

// Middleware to update completion date
swapRequestSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'completed') {
    this.completedAt = new Date();
  }
  if (this.isModified('status') && this.status === 'cancelled') {
    this.cancelledAt = new Date();
  }
  next();
});

export default mongoose.model('SwapRequest', swapRequestSchema);