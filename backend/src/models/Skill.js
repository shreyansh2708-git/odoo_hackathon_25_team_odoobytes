import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    unique: true,
    trim: true,
    minlength: [2, 'Skill name must be at least 2 characters'],
    maxlength: [50, 'Skill name cannot exceed 50 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    enum: [
      'Technology',
      'Design',
      'Business',
      'Languages',
      'Arts & Crafts',
      'Music',
      'Sports & Fitness',
      'Cooking',
      'Photography',
      'Writing',
      'Marketing',
      'Education',
      'Health & Wellness',
      'Finance',
      'Other'
    ]
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isApproved: {
    type: Boolean,
    default: false // Admin needs to approve new skills
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  usageCount: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  relatedSkills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Text index for search
skillSchema.index({ 
  name: 'text', 
  description: 'text',
  tags: 'text'
});

// Index for efficient queries
skillSchema.index({ category: 1, isActive: 1 });
skillSchema.index({ isApproved: 1 });
skillSchema.index({ usageCount: -1 });

// Virtual for popularity level
skillSchema.virtual('popularityLevel').get(function() {
  if (this.usageCount >= 100) return 'high';
  if (this.usageCount >= 20) return 'medium';
  return 'low';
});

// Middleware to increment usage count
skillSchema.statics.incrementUsage = async function(skillName) {
  return await this.findOneAndUpdate(
    { name: skillName, isActive: true },
    { $inc: { usageCount: 1 } }
  );
};

export default mongoose.model('Skill', skillSchema);