import { useState, useEffect, useCallback } from 'react';
import type { Skill, CreateSkillRequest } from '../types/skill.types';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

interface UseSkillsReturn {
  skills: Skill[];
  loading: boolean;
  error: string | null;
  submitting: boolean;
  addSkill: (skill: CreateSkillRequest) => Promise<boolean>;
  refresh: () => void;
}

export const useSkills = (): UseSkillsReturn => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/services`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data: Skill[] = await res.json();
      setSkills(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load skills.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const addSkill = async (skill: CreateSkillRequest): Promise<boolean> => {
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE_URL}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skill),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const created: Skill = await res.json();
      setSkills((prev) => [created, ...prev]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add skill.');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return { skills, loading, error, submitting, addSkill, refresh: fetchSkills };
};
