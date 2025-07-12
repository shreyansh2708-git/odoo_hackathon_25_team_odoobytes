import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  swapRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SwapRequest',
    required: [true, 'Swap request is required']
  },
  ratedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Rater is required']
  },
  ratedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Rated user is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  comment: {
    type: String,
    trim: true,
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  skillRating: {
    quality: {
      type: Number,
      min: 1,
      max: 5
    },
    communication: {
      type: Number,
      min: 1,
      max: 5
    },
    punctuality: {
      type: Number,
      min: 1,
      max: 5
    },
    helpfulness: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  wouldRecommend: {
    type: Boolean,
    default: true
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  flagged: {
    type: Boolean,
    default: false
  },
  flagReason: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Prevent duplicate ratings for same swap
ratingSchema.index({ swapRequest: 1, ratedBy: 1 }, { unique: true });

// Index for efficient queries
ratingSchema.index({ ratedUser: 1, createdAt: -1 });
ratingSchema.index({ rating: -1 });

// Virtual for overall skill rating average
ratingSchema.virtual('skillRatingAverage').get(function() {
  if (this.skillRating) {
    const ratings = Object.values(this.skillRating).filter(r => r);
    return ratings.length > 0 ? ratings.reduce((a, b) => a + b) / ratings.length : 0;
  }
  return 0;
});

// Middleware to update user's rating when a new rating is created
ratingSchema.post('save', async function() {
  const User = mongoose.model('User');
  
  // Calculate new average rating for the rated user
  const ratings = await mongoose.model('Rating').find({ ratedUser: this.ratedUser });
  const average = ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length;
  
  await User.findByIdAndUpdate(this.ratedUser, {
    'rating.average': Math.round(average * 10) / 10, // Round to 1 decimal place
    'rating.count': ratings.length
  });
});

export default mongoose.model('Rating', ratingSchema);