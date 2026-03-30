import { useState, useRef,type ChangeEvent } from 'react';
import Navbar from '../../Components/sidebar/Navbar';
import { useLostAndFound } from './hooks/useLostAndFound';
import type { LostResponseDTO, ClaimRequestDTO } from './types/lost.types';
import './lostAndFound.css';


const toImageSrc = (base64: string | null): string | null => {
  if (!base64) return null;
  // Backend sends raw base64 bytes[] — prefix with data URI
  return base64.startsWith('data:') ? base64 : `data:image/jpeg;base64,${base64}`;
};


interface ClaimModalProps {
  claimNumber: string;
  onClose: () => void;
  onConfirm: (dto: ClaimRequestDTO) => Promise<void>;
  claiming: boolean;
}

const ClaimModal = ({ claimNumber, onClose, onConfirm, claiming }: ClaimModalProps) => {
  const [username, setUsername] = useState('');

  const handleSubmit = async (e: ChangeEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    await onConfirm({ username: username.trim(), claimNumber });
  };

  return (
    <div className="lf-backdrop" onClick={onClose}>
      <div className="lf-modal" onClick={(e) => e.stopPropagation()}>
        <div className="lf-modal__header">
          <h2>Claim Item</h2>
          <button className="lf-modal__close" onClick={onClose}>✕</button>
        </div>
        <p className="lf-modal__sub">
          Claim number: <strong>{claimNumber}</strong>
        </p>
        <form onSubmit={handleSubmit} className="lf-form">
          <div className="lf-form__group">
            <label htmlFor="claim-username">Your Username</label>
            <input
              id="claim-username"
              type="text"
              placeholder="e.g. john_doe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>
          <button type="submit" className="lf-form__submit" disabled={claiming}>
            {claiming ? 'Processing…' : 'Confirm Claim'}
          </button>
        </form>
      </div>
    </div>
  );
};


interface PostModalProps {
  onClose: () => void;
  onSubmit: (message: string, image: File | null) => Promise<boolean>;
  submitting: boolean;
}

const PostModal = ({ onClose, onSubmit, submitting }: PostModalProps) => {
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
    else setPreview(null);
  };

  const handleSubmit = async (e: ChangeEvent) => {
    e.preventDefault();
    const ok = await onSubmit(message, file);
    if (ok) onClose();
  };

  return (
    <div className="lf-backdrop" onClick={onClose}>
      <div className="lf-modal" onClick={(e) => e.stopPropagation()}>
        <div className="lf-modal__header">
          <h2>Report Lost Item</h2>
          <button className="lf-modal__close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="lf-form">
          <div className="lf-form__group">
            <label htmlFor="lf-message">Description</label>
            <textarea
              id="lf-message"
              rows={4}
              placeholder="Describe the item — colour, size, where it was lost…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <div className="lf-form__group">
            <label>Photo (optional)</label>
            <div
              className={`lf-dropzone ${preview ? 'lf-dropzone--has-image' : ''}`}
              onClick={() => fileRef.current?.click()}
            >
              {preview ? (
                <img src={preview} alt="preview" className="lf-dropzone__preview" />
              ) : (
                <span>Click to attach a photo</span>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="lf-hidden-input"
              onChange={handleImage}
            />
          </div>

          <button type="submit" className="lf-form__submit" disabled={submitting}>
            {submitting ? 'Posting…' : 'Submit Report'}
          </button>
        </form>
      </div>
    </div>
  );
};


interface LostCardProps {
  item: LostResponseDTO;
  index: number;
  onClaimClick: (claimNumber: string) => void;
}

const LostCard = ({ item, index, onClaimClick }: LostCardProps) => {
  const imgSrc = toImageSrc(item.image);

  return (
    <article className="lf-card" style={{ animationDelay: `${index * 60}ms` }}>
      {imgSrc ? (
        <div className="lf-card__image-wrap">
          <img src={imgSrc} alt="Lost item" className="lf-card__image" />
        </div>
      ) : (
        <div className="lf-card__image-wrap lf-card__image-wrap--empty">
          <span>No photo</span>
        </div>
      )}

      <div className="lf-card__body">
        <p className="lf-card__message">{item.message}</p>

        <div className="lf-card__meta">
          <span className="lf-card__claim-num">#{item.claimNumber}</span>
          {item.claimed ? (
            <span className="lf-badge lf-badge--claimed">Claimed</span>
          ) : (
            <span className="lf-badge lf-badge--unclaimed">Not yet claimed</span>
          )}
        </div>

        {item.claimed ? (
          <div className="lf-card__claimed-info">
            <span>✓ This item has been claimed</span>
          </div>
        ) : (
          <button
            className="lf-card__claim-btn"
            onClick={() => onClaimClick(item.claimNumber)}
          >
            This is mine →
          </button>
        )}
      </div>
    </article>
  );
};


const LostAndFound = () => {
  const { items,claims, loading, error, submitting, claiming, postItem, claimItem } =
    useLostAndFound();

  const [showPostModal, setShowPostModal] = useState(false);
  const [claimTarget, setClaimTarget] = useState<string | null>(null);

  const handleClaim = async (dto: ClaimRequestDTO) => {
    const result = await claimItem(dto);
    if (result) setClaimTarget(null);
  };

  const unclaimedItems = items.filter((i) => !i.claimed);
 

  return (
    <div className="lf-page">
      <Navbar />

      <main className="lf-main">
      
        <div className="lf-hero">
          <div className="lf-hero__text">
            <h1 className="lf-hero__title">Lost &amp; Found</h1>
            <p className="lf-hero__sub">
              Lost something in the hood? Report it — someone might have it.
            </p>
          </div>
          <button className="lf-hero__btn" onClick={() => setShowPostModal(true)}>
            + Report Lost Item
          </button>
        </div>

        {error && <p className="lf-error">{error}</p>}

       
        <section className="lf-section">
          <h2 className="lf-section__title">
            <span className="lf-dot lf-dot--red" /> Unclaimed Items
            <span className="lf-count">{unclaimedItems.length}</span>
          </h2>

          {loading ? (
            <div className="lf-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="lf-card lf-card--skeleton" />
              ))}
            </div>
          ) : unclaimedItems.length === 0 ? (
            <p className="lf-empty">No unclaimed items right now.</p>
          ) : (
            <div className="lf-grid">
              {unclaimedItems.map((item, i) => (
                <LostCard
                  key={item.id}
                  item={item}
                  index={i}
                  onClaimClick={setClaimTarget}
                />
              ))}
            </div>
          )}
        </section>

       
       {claims.length > 0 && (
  <section className="lf-section lf-section--claimed">
    <h2 className="lf-section__title">
      <span className="lf-dot lf-dot--green" /> Claimed Items
      <span className="lf-count">{claims.length}</span>
    </h2>
    <div className="lf-claims-list">
      {claims.map((claim) => (
        <div key={claim.claimNumber} className="lf-claims-row">
          <span className="lf-claims-row__num">#{claim.claimNumber}</span>
          <span className="lf-claims-row__claimed-by">
            Claimed by <strong>@{claim.username}</strong>
          </span>
          <span className="lf-badge lf-badge--claimed">Claimed ✓</span>
        </div>
      ))}
    </div>
  </section>
)}
      </main>

      
      {showPostModal && (
        <PostModal
          onClose={() => setShowPostModal(false)}
          onSubmit={postItem}
          submitting={submitting}
        />
      )}

      {claimTarget && (
        <ClaimModal
          claimNumber={claimTarget}
          onClose={() => setClaimTarget(null)}
          onConfirm={handleClaim}
          claiming={claiming === claimTarget}
        />
      )}
    </div>
  );
};

export default LostAndFound;
