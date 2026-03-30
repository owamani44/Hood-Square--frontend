import { useState, useEffect, useCallback } from 'react';
import { myAxios } from '../../../api';
import type { UserProfile } from '../types/users.types';

// Decode JWT to get current user's role 
const getCurrentUserRole = (): string | null => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded.Role ?? decoded.role ?? null;
  } catch {
    return null;
  }
};

interface UseUsersReturn {
  users: UserProfile[];
  loading: boolean;
  error: string | null;
  deleting: string | null;       
  isAdmin: boolean;
  deleteUser: (id: number, username: string) => Promise<boolean>;
  refresh: () => void;
}

export const useUsers = (): UseUsersReturn => {
  const [users, setUsers]     = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const isAdmin = getCurrentUserRole() === 'ROLE_ADMIN';

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await myAxios.get<UserProfile[]>('/auth/users');
      setUsers(data);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const deleteUser = async (id: number, username: string): Promise<boolean> => {
    setDeleting(username);
    setError(null);
    try {
      await myAxios.delete(`/auth/${id}`);  
      setUsers((prev) => prev.filter((u) => u.id !== id));
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to delete user.');
      return false;
    } finally {
      setDeleting(null);
    }
  };

  return { users, loading, error, deleting, isAdmin, deleteUser, refresh: fetchUsers };
};
