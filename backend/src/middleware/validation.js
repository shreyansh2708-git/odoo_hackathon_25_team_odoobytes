import Joi from 'joi';

// User registration validation
export const validateUserRegistration = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    location: Joi.string().max(100).optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// User login validation
export const validateUserLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// Skill validation
export const validateSkill = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    description: Joi.string().max(500).optional(),
    category: Joi.string().max(50).optional(),
    level: Joi.string().valid('beginner', 'intermediate', 'advanced').optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// Swap request validation
export const validateSwapRequest = (req, res, next) => {
  const schema = Joi.object({
    recipientId: Joi.string().required(),
    skillOffered: Joi.object({
      name: Joi.string().required(),
      description: Joi.string().optional(),
      level: Joi.string().valid('beginner', 'intermediate', 'advanced').optional()
    }).required(),
    skillRequested: Joi.object({
      name: Joi.string().required(),
      description: Joi.string().optional(),
      level: Joi.string().valid('beginner', 'intermediate', 'advanced').optional()
    }).required(),
    message: Joi.string().max(500).optional(),
    scheduledDate: Joi.date().optional(),
    duration: Joi.number().min(0.5).max(8).optional(),
    meetingType: Joi.string().valid('in-person', 'online', 'hybrid').optional(),
    meetingDetails: Joi.string().optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// Rating validation
export const validateRating = (req, res, next) => {
  const schema = Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().max(500).optional(),
    skillRating: Joi.object({
      quality: Joi.number().min(1).max(5).optional(),
      communication: Joi.number().min(1).max(5).optional(),
      punctuality: Joi.number().min(1).max(5).optional(),
      helpfulness: Joi.number().min(1).max(5).optional()
    }).optional(),
    wouldRecommend: Joi.boolean().optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// Profile update validation
export const validateProfileUpdate = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    location: Joi.string().max(100).optional(),
    bio: Joi.string().max(500).optional(),
    isPublic: Joi.boolean().optional(),
    skillsOffered: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      description: Joi.string().max(200).optional(),
      level: Joi.string().valid('beginner', 'intermediate', 'advanced').optional(),
      category: Joi.string().optional()
    })).optional(),
    skillsWanted: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      description: Joi.string().max(200).optional(),
      level: Joi.string().valid('beginner', 'intermediate', 'advanced').optional(),
      category: Joi.string().optional()
    })).optional(),
    availability: Joi.array().items(
      Joi.string().valid('weekdays', 'weekends', 'evenings', 'mornings', 'afternoons', 'flexible')
    ).optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};