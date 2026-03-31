import { useState, useRef, type ChangeEvent } from 'react';
import Navbar from '../../Components/sidebar/Navbar';
import { useAlerts } from './hooks/useAlerts';
import type { AlertRequestDTO, AlertResponseDTO } from './types/alert.types';
import './alerts.css';


const toImageSrc = (base64: string | null): string | null => {
  if (!base64) return null;
  return base64.startsWith('data:') ? base64 : `data:image/jpeg;base64,${base64}`;
};

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return 'Unknown date';
  const date = new Date(dateStr);
  return date.toLocaleString('en-UG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};


interface PostModalProps {
  onClose: () => void;
  onSubmit: (dto: AlertRequestDTO, image: File | null) => Promise<boolean>;
  submitting: boolean;
}

const EMPTY: AlertRequestDTO = { location: '', description: '' };

const PostModal = ({ onClose, onSubmit, submitting }: PostModalProps) => {
  const [form, setForm]       = useState<AlertRequestDTO>(EMPTY);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile]       = useState<File | null>(null);
  const fileRef               = useRef<HTMLInputElement>(null);

  const set = (field: keyof AlertRequestDTO) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const handleSubmit = async (e: ChangeEvent) => {
    e.preventDefault();
    const ok = await onSubmit(form, file);
    if (ok) onClose();
  };

  return (
    <div className="al-backdrop" onClick={onClose}>
      <div className="al-modal" onClick={(e) => e.stopPropagation()}>
        <div className="al-modal__header">
          <h2>Post an Alert</h2>
          <button className="al-modal__close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="al-form">
          <div className="al-form__group">
            <label htmlFor="al-location">Location</label>
            <input
              id="al-location"
              type="text"
              placeholder="e.g. Mukono Stage, Ganda Road…"
              value={form.location}
              onChange={set('location')}
              required
            />
          </div>

          <div className="al-form__group">
            <label htmlFor="al-description">Description</label>
            <textarea
              id="al-description"
              rows={4}
              placeholder="Describe what's happening…"
              value={form.description}
              onChange={set('description')}
              required
            />
          </div>

          <div className="al-form__group">
            <label>Photo (optional)</label>
            <div
              className={`al-dropzone ${preview ? 'al-dropzone--has-image' : ''}`}
              onClick={() => fileRef.current?.click()}
            >
              {preview
                ? <img src={preview} alt="preview" className="al-dropzone__preview" />
                : <span>Click to attach a photo</span>}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="al-hidden-input"
              onChange={handleImage}
            />
          </div>

          <button type="submit" className="al-form__submit" disabled={submitting}>
            {submitting ? 'Posting…' : 'Send Alert'}
          </button>
        </form>
      </div>
    </div>
  );
};


interface AlertCardProps {
  alert: AlertResponseDTO;
  index: number;
}

const AlertCard = ({ alert, index }: AlertCardProps) => {
  const imgSrc = toImageSrc(alert.image);

  return (
    <article className="al-card" style={{ animationDelay: `${index * 60}ms` }}>
      {imgSrc ? (
        <div className="al-card__image-wrap">
          <img src={imgSrc} alt="Alert" className="al-card__image" />
        </div>
      ) : (
        <div className="al-card__image-wrap al-card__image-wrap--empty">
          <span>No photo</span>
        </div>
      )}

      <div className="al-card__body">
        <div className="al-card__location">
          <span className="al-pin">📍</span>
          {alert.location}
        </div>
        <p className="al-card__description">{alert.description}</p>
      </div>
       <div className="al-card__date">
          {formatDate(alert.createdAt)}
        </div>
     
    </article>
  );
};


const Alerts = () => {
  const { alerts, loading, error, submitting, postAlert } = useAlerts();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="al-page">
      <Navbar />

      <main className="al-main">
        <div className="al-hero">
          <div className="al-hero__text">
            <h1 className="al-hero__title">Community Alerts</h1>
            <p className="al-hero__sub">
              Keep the hood informed — report incidents in real time.
            </p>
          </div>
          <button className="al-hero__btn" onClick={() => setShowModal(true)}>
            + Post Alert
          </button>
        </div>

        {error && <p className="al-error">{error}</p>}

        {loading ? (
          <div className="al-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="al-card al-card--skeleton" />
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <div className="al-empty">
            <p>No alerts yet. Stay safe out there.</p>
            <button onClick={() => setShowModal(true)}>Post the first one →</button>
          </div>
        ) : (
          <div className="al-grid">
            {alerts.map((alert, i) => (
              <AlertCard key={alert.id} alert={alert} index={i} />
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <PostModal
          onClose={() => setShowModal(false)}
          onSubmit={postAlert}
          submitting={submitting}
        />
      )}
    </div>
  );
};

export default Alerts;
