import { useState, useEffect, useCallback } from 'react';
import type {
  LostResponseDTO,
  ClaimRequestDTO,
  ClaimResponseDTO,
} from '../types/lost.types';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

interface UseLostAndFoundReturn {
  items: LostResponseDTO[];
  loading: boolean;
  error: string | null;
  submitting: boolean;
  claiming: string | null;          // claimNumber currently being claimed
  postItem: (message: string, image: File | null) => Promise<boolean>;
  claimItem: (dto: ClaimRequestDTO) => Promise<ClaimResponseDTO | null>;
  refresh: () => void;
}

export const useLostAndFound = (): UseLostAndFoundReturn => {
  const [items, setItems] = useState<LostResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [claiming, setClaiming] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/lost`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data: LostResponseDTO[] = await res.json();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load items.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  // ── POST lost item as multipart/form-data ──────────────────
  // Controller uses @ModelAttribute LostRequestDTO + @RequestParam MultipartFile
  // so we send message as a form field and image as a file part
  const postItem = async (message: string, image: File | null): Promise<boolean> => {
    setSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('message', message);
      if (image) formData.append('image', image);

      const res = await fetch(`${BASE_URL}/lost`, {
        method: 'POST',
        // Do NOT set Content-Type header — browser sets it with boundary automatically
        body: formData,
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const created: LostResponseDTO = await res.json();
      setItems((prev) => [created, ...prev]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post item.');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // ── Claim a lost item ──────────────────────────────────────
  const claimItem = async (dto: ClaimRequestDTO): Promise<ClaimResponseDTO | null> => {
    setClaiming(dto.claimNumber);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const result: ClaimResponseDTO = await res.json();

      // Update the local item to reflect claimed = true
      setItems((prev) =>
        prev.map((item) =>
          item.claimNumber === dto.claimNumber ? { ...item, claimed: true } : item
        )
      );
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim item.');
      return null;
    } finally {
      setClaiming(null);
    }
  };

  return { items, loading, error, submitting, claiming, postItem, claimItem, refresh: fetchItems };
};
