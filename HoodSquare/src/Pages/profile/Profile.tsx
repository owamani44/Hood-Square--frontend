import { PowerSettingsNew } from '@mui/icons-material';
import Navbar from '../../Components/sidebar/Navbar';
import { useProfile } from './hooks/useProfile';
import './profile.css';

const getInitials = (fullName: string): string => {
  return fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};


interface InfoRowProps {
  label: string;
  value: string;
  index: number;
}

const InfoRow = ({ label, value, index }: InfoRowProps) => (
  <div className="pf-row" style={{ animationDelay: `${index * 80}ms` }}>
    <span className="pf-row__label">{label}</span>
    <span className="pf-row__value">{value}</span>
  </div>
);
const handleLogout = () => {
  localStorage.removeItem('token');
  window.location.href = '/';
};

const ProfileSkeleton = () => (
  <div className="pf-skeleton">
    <div className="pf-skeleton__avatar" />
    <div className="pf-skeleton__line pf-skeleton__line--wide" />
    <div className="pf-skeleton__line" />
    {[...Array(3)].map((_, i) => (
      <div key={i} className="pf-skeleton__row" />
    ))}
  </div>
);

const Profile = () => {
  const { profile, loading, error } = useProfile();

  return (
    <div className="pf-page">
      <Navbar />

      <main className="pf-main">
        {loading && <ProfileSkeleton />}

        {error && (
          <div className="pf-error">
            <p>{error}</p>
          </div>
        )}

        {profile && !loading && (
          <div className="pf-card">

           
            <div className="pf-header">
              <div className="pf-header__bg" />
              <div className="pf-avatar">
                {getInitials(profile.fullName)}
              </div>
              <div className="pf-header__text">
                <h1 className="pf-name">{profile.fullName}</h1>
                <p className="pf-handle">@{profile.username}</p>
                <span className={`pf-role-badge pf-role-badge--`}>
                
                </span>
              </div>
            </div>

            
            <div className="pf-body">
              <p className="pf-section-label">Account Details</p>

              <InfoRow label="Full Name"     value={profile.fullName}    index={0} />
              <InfoRow label="Username"      value={`@${profile.username}`} index={1} />
              <InfoRow label="Phone Number"  value={profile.phoneNumber} index={2} />
                <button className="pf-logout-btn" onClick={handleLogout}>
              <PowerSettingsNew/>
               <p>Log Out</p>
              </button>
            </div>
             
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;