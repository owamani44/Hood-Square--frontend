import { useState } from 'react';
import Navbar from '../../Components/sidebar/Navbar';
import { useUsers } from './hooks/useUsers';
import type { UserProfile } from './types/users.types';
import './users.css';
import { Delete } from '@mui/icons-material';


const AVATAR_COLORS = [
  '#e07a5f', '#3d405b', '#81b29a', '#f4a261',
  '#264653', '#2a9d8f', '#e9c46a', '#6db33f',
];


const avatarColor = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = Math.imul(31, hash) + name.charCodeAt(i) | 0;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const getInitials = (fullName: string): string =>
  fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

const formatRole = (role: string): string => {
  const stripped = role.replace('ROLE_', '');
  return stripped.charAt(0) + stripped.slice(1).toLowerCase();
};


interface DeleteModalProps {
  user: UserProfile;
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}

const DeleteModal = ({ user, onConfirm, onCancel, deleting }: DeleteModalProps) => (
  <div className="us-backdrop" onClick={onCancel}>
    <div className="us-confirm-modal" onClick={(e) => e.stopPropagation()}>
      <div className="us-confirm-modal__icon">⚠</div>
      <h3>Delete User</h3>
      <p>Are you sure you want to delete <strong>@{user.username}</strong>? This action cannot be undone.</p>
      <div className="us-confirm-modal__actions">
        <button className="us-btn us-btn--ghost" onClick={onCancel} disabled={deleting}>
          Cancel
        </button>
        <button className="us-btn us-btn--danger" onClick={onConfirm} disabled={deleting}>
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </div>
  </div>
);


interface ProfileModalProps {
  user: UserProfile;
  isAdmin: boolean;
  onClose: () => void;
  onDelete: (id: number, username: string) => void;
  deleting: boolean;
}

const ProfileModal = ({ user, isAdmin, onClose, onDelete, deleting }: ProfileModalProps) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <>
      <div className="us-backdrop" onClick={onClose}>
        <div className="us-profile-modal" onClick={(e) => e.stopPropagation()}>
          
          <button className="us-profile-modal__close" onClick={onClose}>✕</button>

          
          <div className="us-profile-modal__header">
            <div
              className="us-profile-modal__avatar"
              style={{ backgroundColor: avatarColor(user.fullName) }}
            >
              {getInitials(user.fullName)}
            </div>
            <h2 className="us-profile-modal__name">{user.fullName}</h2>
            <p className="us-profile-modal__handle">@{user.username}</p>
            <span className={`us-badge us-badge--${user.role.includes('ADMIN') ? 'admin' : 'user'}`}>
              {formatRole(user.role)}
            </span>
          </div>

         
          <div className="us-profile-modal__body">
            <div className="us-info-row">
              <span className="us-info-row__label">Full Name</span>
              <span className="us-info-row__value">{user.fullName}</span>
            </div>
            <div className="us-info-row">
              <span className="us-info-row__label">Username</span>
              <span className="us-info-row__value">@{user.username}</span>
            </div>
            <div className="us-info-row">
              <span className="us-info-row__label">Phone</span>
              <span className="us-info-row__value">{user.phoneNumber}</span>
            </div>
            <div className="us-info-row">
              <span className="us-info-row__label">Role</span>
              <span className="us-info-row__value">{formatRole(user.role)}</span>
            </div>
          </div>

         
          {isAdmin && (
            <div className="us-profile-modal__footer">
              <button
                className="us-btn us-btn--danger us-btn--full"
                onClick={() => setConfirmDelete(true)}
                disabled={deleting}
              >
                🗑 Delete User
              </button>
            </div>
          )}
        </div>
      </div>

      {confirmDelete && (
        <DeleteModal
          user={user}
          onConfirm={() => { onDelete(user.id, user.username); setConfirmDelete(false); onClose(); }}
          onCancel={() => setConfirmDelete(false)}
          deleting={deleting}
        />
      )}
    </>
  );
};


interface UserCardProps {
  user: UserProfile;
  index: number;
  isAdmin: boolean;
  onClick: () => void;
  onDelete: (id: number, username: string) => void;
  deleting: boolean;
}

const UserCard = ({ user, index, isAdmin, onClick, onDelete, deleting }: UserCardProps) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  //const badgeVariant = user.role.includes('ADMIN') ? 'admin' : 'user';

  return (
    <>
      <article
        className="us-card"
        style={{ animationDelay: `${index * 50}ms` }}
        onClick={onClick}
      >
        <div
          className="us-card__avatar"
          style={{ backgroundColor: avatarColor(user.fullName) }}
        >
          {getInitials(user.fullName)}
        </div>

        <div className="us-card__info">
          <h3 className="us-card__name">{user.fullName}</h3>
          <p className="us-card__handle">@{user.username}</p>
          <span className={`us-badge us-badge--`}>
          </span>
        </div>

        
        {isAdmin && (
          <button
            className="us-card__delete"
            title="Delete user"
            disabled={deleting}
            onClick={(e) => {
              e.stopPropagation();
              setConfirmDelete(true);
            }}
          >
            <Delete/>
          </button>
        )}
      </article>

      {confirmDelete && (
        <DeleteModal
          user={user}
          onConfirm={() => { onDelete(user.id, user.username); setConfirmDelete(false); }}
          onCancel={() => setConfirmDelete(false)}
          deleting={deleting}
        />
      )}
    </>
  );
};


const Users = () => {
  const { users, loading, error, deleting, isAdmin, deleteUser } = useUsers();
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  

  return (
    <div className="us-page">
      <Navbar />

      <main className="us-main">
        
        <div className="us-hero">
          <div>
            <h1 className="us-hero__title">Community Members</h1>
            <p className="us-hero__sub">
              {users.length > 0 ? `${users.length} members in the hood` : 'Meet your neighbours'}
            </p>
          </div>
          {isAdmin && (
            <span className="us-admin-tag">Admin View</span>
          )}
        </div>

        {error && <p className="us-error">{error}</p>}

        
        {loading ? (
          <div className="us-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="us-card us-card--skeleton" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <p className="us-empty">No members found.</p>
        ) : (
          <div className="us-grid">
            {users.map((user, i) => (
              <UserCard
                key={user.username}
                user={user}
                index={i}
                isAdmin={isAdmin}
                onClick={() => setSelectedUser(user)}
                onDelete={deleteUser}
                deleting={deleting === user.username}
              />
            ))}
          </div>
        )}
      </main>

     
      {selectedUser && (
        <ProfileModal
          user={selectedUser}
          isAdmin={isAdmin}
          onClose={() => setSelectedUser(null)}
          onDelete={(id, username) => {
            deleteUser(id, username);
            setSelectedUser(null);
          }}
          deleting={deleting === selectedUser.username}
        />
      )}
    </div>
  );
};

export default Users;
