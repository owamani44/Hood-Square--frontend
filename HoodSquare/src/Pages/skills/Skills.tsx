import { useState, type ChangeEvent } from 'react';
import Navbar from '../../Components/sidebar/Navbar';
import {useSkills} from './hooks/useSkills';
import type { CreateSkillRequest } from './types/skill.types';
import './skills.css';


const COLORS = ['#e07a5f', '#3d405b', '#81b29a', '#f2cc8f', '#118ab2', '#06d6a0'];
const avatarColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = 31 * hash + name.charCodeAt(i);
  return COLORS[Math.abs(hash) % COLORS.length];
};

interface SkillCardProps {
  id: number;
  username: string;
  skillName: string;
  description: string;
  amount: number;
  index: number;
}

const SkillCard = ({ username, skillName, description, amount, index }: SkillCardProps) => (
  <article className="skill-card" style={{ animationDelay: `${index * 60}ms` }}>
    <div className="skill-card__header">
      <span
        className="skill-card__avatar"
        style={{ backgroundColor: avatarColor(username) }}
      >
        {username[0].toUpperCase()}
      </span>
      <span className="skill-card__username">@{username}</span>
    </div>

    <h3 className="skill-card__name">{skillName}</h3>
    <p className="skill-card__description">{description}</p>

    <div className="skill-card__footer">
      <span className="skill-card__price">
        UGX {amount.toLocaleString()}
      </span>
      <button className="skill-card__cta">Enquire</button>
    </div>
  </article>
);


interface AddSkillFormProps {
  onClose: () => void;
  onSubmit: (skill: CreateSkillRequest) => Promise<boolean>;
  submitting: boolean;
}

const EMPTY_FORM: CreateSkillRequest = {
  username: '',
  skillName: '',
  description: '',
  amount: 0,
};

const AddSkillForm = ({ onClose, onSubmit, submitting }: AddSkillFormProps) => {
  const [form, setForm] = useState<CreateSkillRequest>(EMPTY_FORM);

  const set = (field: keyof CreateSkillRequest) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({
        ...prev,
        [field]: field === 'amount' ? Number(e.target.value) : e.target.value,
      }));

  const handleSubmit = async (e: ChangeEvent) => {
    e.preventDefault();
    const ok = await onSubmit(form);
    if (ok) {
      setForm(EMPTY_FORM);
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2>List a Skill</h2>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="skill-form">
          <div className="skill-form__group">
            <label htmlFor="sf-username">Username</label>
            <input
              id="sf-username"
              type="text"
              placeholder="your_handle"
              value={form.username}
              onChange={set('username')}
              required
            />
          </div>

          <div className="skill-form__group">
            <label htmlFor="sf-skillName">Skill / Service Name</label>
            <input
              id="sf-skillName"
              type="text"
              placeholder="e.g. Logo Design, Plumbing, Tutoring"
              value={form.skillName}
              onChange={set('skillName')}
              required
            />
          </div>

          <div className="skill-form__group">
            <label htmlFor="sf-description">Description</label>
            <textarea
              id="sf-description"
              rows={3}
              placeholder="Describe what you offer and attach your Phone number"
              value={form.description}
              onChange={set('description')}
              required
            />
          </div>

          <div className="skill-form__group">
            <label htmlFor="sf-amount">Rate (Ugx)</label>
            <input
              id="sf-amount"
              type="number"
              min={0}
              placeholder="0"
              value={form.amount || ''}
              onChange={set('amount')}
              required
            />
          </div>

          <button type="submit" className="skill-form__submit" disabled={submitting}>
            {submitting ? 'Posting…' : 'Post Skill'}
          </button>
        </form>
      </div>
    </div>
  );
};


const Skills = () => {
  const { skills, loading, error, submitting, addSkill } = useSkills();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="skills-page">
      <Navbar />

      <main className="skills-main">
        <div className="skills-hero">
          <div className="skills-hero__text">
            <p className="skills-hero__label">HoodSquare Marketplace</p>
            <h3 className="skills-hero__title">Skills &amp; Services</h3>
            <p className="skills-hero__sub">
              Discover talent and services in your community or offer your own.
            </p>
          </div>
          <button className="skills-hero__btn" onClick={() => setShowForm(true)}>
            + List a Skill
          </button>
        </div>

        {error && <p className="skills-error">{error}</p>}

        {loading ? (
          <div className="skills-loading">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skill-card skill-card--skeleton" />
            ))}
          </div>
        ) : skills.length === 0 ? (
          <div className="skills-empty">
            <p>No skills listed yet.</p>
            <button onClick={() => setShowForm(true)}>Be the first →</button>
          </div>
        ) : (
          <div className="skills-grid">
            {skills.map((skill, i) => (
              <SkillCard key={skill.id} {...skill} index={i} />
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <AddSkillForm
          onClose={() => setShowForm(false)}
          onSubmit={addSkill}
          submitting={submitting}
        />
      )}
    </div>
  );
};

export default Skills;
