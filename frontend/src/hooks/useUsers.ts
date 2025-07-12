import { useState, useEffect } from 'react';
import { User } from '@/types';
import { userApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

/**
 * Custom hook for managing users data
 * Handles loading states and error handling
 */
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedUsers = await userApi.getPublicUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load users';
      setError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (skillName: string) => {
    try {
      setLoading(true);
      const results = await userApi.searchUsersBySkill(skillName);
      setUsers(results);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Search failed';
      setError(errorMsg);
      toast({
        title: "Search Error", 
        description: errorMsg,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    searchUsers,
    refetch: fetchUsers // alias for convenience
  };
}

/**
 * Hook for managing individual user data
 */
export function useUser(userId: string | null) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setUser(null);
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const userData = await userApi.getUserById(userId);
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, loading, error };
}