import { useState, useEffect, useCallback } from 'react';
import type { Skill, CreateSkillRequest } from '../types/skill.types';
import { myAxios } from '../../../api';

interface UseSkillsReturn {
  skills: Skill[];
  loading: boolean;
  error: string | null;
  submitting: boolean;
  addSkill: (skill: CreateSkillRequest) => Promise<boolean>;
  refresh: () => void;
}

export const useSkills = (): UseSkillsReturn => {
  const [skills, setSkills]         = useState<Skill[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      
      const { data } = await myAxios.get<Skill[]>('/services');
      setSkills(data);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to load skills.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSkills(); }, [fetchSkills]);

  const addSkill = async (skill: CreateSkillRequest): Promise<boolean> => {
    setSubmitting(true);
    setError(null);
    try {
      const { data } = await myAxios.post<Skill>('/services', skill);
      setSkills((prev) => [data, ...prev]);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to add skill.');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return { skills, loading, error, submitting, addSkill, refresh: fetchSkills };
};
