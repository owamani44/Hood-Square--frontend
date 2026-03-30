import { useState, useEffect, useCallback } from 'react';
import type { LostResponseDTO, ClaimRequestDTO, ClaimResponseDTO } from '../types/lost.types';
import { myAxios } from '../../../api';

interface UseLostAndFoundReturn {
  items: LostResponseDTO[];
  claims: ClaimResponseDTO[]; 
  loading: boolean;
  error: string | null;
  submitting: boolean;
  claiming: string | null;
  postItem: (message: string, image: File | null) => Promise<boolean>;
  claimItem: (dto: ClaimRequestDTO) => Promise<ClaimResponseDTO | null>;
  refresh: () => void;
}

export const useLostAndFound = (): UseLostAndFoundReturn => {
  const [items, setItems]           = useState<LostResponseDTO[]>([]);
  const [claims, setClaims]         = useState<ClaimResponseDTO[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [claiming, setClaiming]     = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await myAxios.get<LostResponseDTO[]>('/lost');
      setItems(data);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to load items.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const fetchClaims = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await myAxios.get<ClaimResponseDTO[]>('/claim');
      setClaims(data);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to load claims.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchClaims(); }, [fetchClaims]);

  const postItem = async (message: string, image: File | null): Promise<boolean> => {
    setSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('message', message);
      if (image) formData.append('image', image);

      const { data } = await myAxios.post<LostResponseDTO>('/lost', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setItems((prev) => [data, ...prev]);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to post item.');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const claimItem = async (dto: ClaimRequestDTO): Promise<ClaimResponseDTO | null> => {
  setClaiming(dto.claimNumber);
  setError(null);
    try {
      const { data } = await myAxios.post<ClaimResponseDTO>('/claim', dto);
      setClaims((prev) => [data, ...prev]);
      
      await fetchItems();
      await fetchClaims();

      return data;
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to claim item.');
      return null;
    } finally {
      setClaiming(null);
    }
  };

  return { items,claims, loading, error, submitting, claiming, postItem, claimItem, refresh: fetchItems };
};