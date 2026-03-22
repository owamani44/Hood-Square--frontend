import { useState, useEffect, useCallback } from 'react';
import type { AlertRequestDTO, AlertResponseDTO } from '../types/alert.types';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

interface UseAlertsReturn {
  alerts: AlertResponseDTO[];
  loading: boolean;
  error: string | null;
  submitting: boolean;
  postAlert: (dto: AlertRequestDTO, image: File | null) => Promise<boolean>;
  refresh: () => void;
}

export const useAlerts = (): UseAlertsReturn => {
  const [alerts, setAlerts] = useState<AlertResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/alerts`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data: AlertResponseDTO[] = await res.json();
      setAlerts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load alerts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

  // Controller uses @ModelAttribute + @RequestParam MultipartFile
  // so we must send as multipart/form-data — never set Content-Type manually
  const postAlert = async (dto: AlertRequestDTO, image: File | null): Promise<boolean> => {
    setSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('location',    dto.location);
      formData.append('description', dto.description);
      if (image) formData.append('image', image);

      const res = await fetch(`${BASE_URL}/alerts`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const created: AlertResponseDTO = await res.json();
      setAlerts((prev) => [created, ...prev]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post alert.');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return { alerts, loading, error, submitting, postAlert, refresh: fetchAlerts };
};
