import { useState, useEffect } from 'react';
import { myAxios } from '../../../api';
import type { UserProfile } from '../types/profile.types';

// Decode JWT payload without a library — token is already in localStorage
// Structure: header.payload.signature — payload is base64url encoded JSON
const decodeToken = (token: string): Record<string, any> | null => {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

interface UseProfileReturn {
  profile: UserProfile | null;
  username: string | null;
  loading: boolean;
  error: string | null;
}

export const useProfile = (): UseProfileReturn => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const claims = decodeToken(token);
        if (!claims?.sub) throw new Error('Invalid token');

        setUsername(claims.sub);
        const { data } = await myAxios.get<UserProfile>('/auth/me');
        setProfile(data);
      } catch (err: any) {
        setError(err.response?.data?.message ?? err.message ?? 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, username, loading, error };
};
