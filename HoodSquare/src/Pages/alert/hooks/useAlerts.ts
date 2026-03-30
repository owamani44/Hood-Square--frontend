import { useState, useEffect, useCallback } from 'react';
import type { AlertRequestDTO, AlertResponseDTO } from '../types/alert.types';
import { myAxios } from '../../../api';

interface UseAlertsReturn {
  alerts: AlertResponseDTO[];
  loading: boolean;
  error: string | null;
  submitting: boolean;
  postAlert: (dto: AlertRequestDTO, image: File | null) => Promise<boolean>;
  refresh: () => void;
}

export const useAlerts = (): UseAlertsReturn => {
  const [alerts, setAlerts]         = useState<AlertResponseDTO[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await myAxios.get<AlertResponseDTO[]>('/alerts');
      setAlerts(data);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to load alerts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

  const postAlert = async (dto: AlertRequestDTO, image: File | null): Promise<boolean> => {
    setSubmitting(true);
    setError(null);
    try {
      
      const formData = new FormData();
      formData.append('location', dto.location);
      formData.append('description', dto.description);
      if (image) formData.append('image', image);

      const { data } = await myAxios.post<AlertResponseDTO>('/alerts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setAlerts((prev) => [data, ...prev]);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to post alert.');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return { alerts, loading, error, submitting, postAlert, refresh: fetchAlerts };
};
