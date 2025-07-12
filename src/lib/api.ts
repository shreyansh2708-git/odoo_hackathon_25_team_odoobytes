// API utility functions for backend communication
// Note: This will connect to Supabase once it's set up

import { User, SwapRequest, UserSkill, Rating } from '@/types';

// Mock data for development - replace with actual API calls later
const mockUsers: User[] = [
  {
    id: '1',
    email: 'sarah@example.com',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    location: 'San Francisco, CA',
    bio: 'Frontend developer passionate about React and design systems',
    rating: 4.9,
    totalSwaps: 12,
    isPublic: true,
    availability: 'Weekends',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-10')
  },
  {
    id: '2',
    email: 'marcus@example.com', 
    name: 'Marcus Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    location: 'Austin, TX',
    bio: 'Creative photographer and video editor with 8+ years experience',
    rating: 4.7,
    totalSwaps: 8,
    isPublic: true,
    availability: 'Evenings',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-03-08')
  },
  {
    id: '3',
    email: 'emma@example.com',
    name: 'Emma Thompson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    location: 'London, UK', 
    bio: 'Digital marketing strategist specializing in content and SEO',
    rating: 4.8,
    totalSwaps: 15,
    isPublic: true,
    availability: 'Flexible',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-03-12')
  },
  {
    id: '4',
    email: 'alex@example.com',
    name: 'Alex Kim',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    location: 'Seattle, WA',
    bio: 'Data analyst who loves turning numbers into insights',
    rating: 4.6,
    totalSwaps: 6,
    isPublic: true,
    availability: 'Weekdays',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-03-05')
  }
];

// TODO: Replace these with actual Supabase queries
export const userApi = {
  // Get all public users for browsing
  async getPublicUsers(): Promise<User[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockUsers.filter(user => user.isPublic);
  },

  // Search users by skill
  async searchUsersBySkill(skillName: string): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    // For now, just return all users - will implement proper search later
    return mockUsers.filter(user => user.isPublic);
  },

  // Get user profile by ID
  async getUserById(id: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockUsers.find(user => user.id === id) || null;
  },

  // Update user profile
  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const userIndex = mockUsers.findIndex(user => user.id === id);
    if (userIndex === -1) throw new Error('User not found');
    
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
    return mockUsers[userIndex];
  }
};

export const swapApi = {
  // Create a new swap request
  async createSwapRequest(request: Omit<SwapRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<SwapRequest> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const newRequest: SwapRequest = {
      ...request,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return newRequest;
  },

  // Get swap requests for a user
  async getUserSwapRequests(userId: string): Promise<SwapRequest[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    // Mock implementation - return empty array for now
    return [];
  },

  // Update swap request status
  async updateSwapStatus(requestId: string, status: SwapRequest['status']): Promise<SwapRequest> {
    await new Promise(resolve => setTimeout(resolve, 300));
    // Mock implementation
    throw new Error('Not implemented yet');
  }
};

// Skills API
export const skillsApi = {
  async getPopularSkills(): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [
      'React', 'TypeScript', 'Python', 'Photoshop', 'Figma',
      'Digital Marketing', 'SEO', 'Content Writing', 'Data Analysis',
      'Excel', 'SQL', 'UI/UX Design', 'Video Editing', 'Photography'
    ];
  }
};