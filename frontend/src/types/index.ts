// Main type definitions for the Skill Swap Platform
// Created by: Development Team
// Last updated: 2024

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  location?: string;
  bio?: string;
  rating: number;
  totalSwaps: number;
  isPublic: boolean;
  availability: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description?: string;
}

export interface UserSkill {
  id: string;
  userId: string;
  skillId: string;
  skill: Skill;
  type: 'offered' | 'wanted';
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  addedAt: Date;
}

export interface SwapRequest {
  id: string;
  requesterId: string;
  targetUserId: string;
  offeredSkillId: string;
  requestedSkillId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  message?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Populated data
  requester?: User;
  targetUser?: User;
  offeredSkill?: Skill;
  requestedSkill?: Skill;
}

export interface Rating {
  id: string;
  swapRequestId: string;
  fromUserId: string;
  toUserId: string;
  rating: number; // 1-5 stars
  feedback?: string;
  createdAt: Date;
}

// Admin specific types
export interface AdminUser extends User {
  role: 'admin' | 'moderator';
  permissions: string[];
}

export interface PlatformStats {
  totalUsers: number;
  totalSkills: number;
  totalSwaps: number;
  activeSwaps: number;
  averageRating: number;
}