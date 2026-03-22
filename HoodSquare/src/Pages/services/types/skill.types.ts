export interface Skill {
  id: number;
  username: string;
  skillName: string;
  description: string;
  amount: number;
}

export type CreateSkillRequest = Omit<Skill, 'id'>;
