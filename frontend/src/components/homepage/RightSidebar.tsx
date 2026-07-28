import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RightSidebar.css';

interface BackendUser {
  id: number;
  name?: string;
  username?: string;
  role?: string;
  user_type?: string;
  city?: string | null;
  country?: string | null;
  rating?: string | number | null;
  avatar?: string | null;
}

function initials(name: string) {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function RightSidebar() {
  const [suggestedSitters, setSuggestedSitters] = useState<BackendUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectingId, setConnectingId] = useState<number | null>(null);
  const navigate = useNavigate();

  const fetchSuggestedConnections = async () => {
    try {
      const token = localStorage.getItem('access') || localStorage.getItem('access_token');
      const response = await fetch('/api/users/suggested/?limit=5', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      if (response.ok) {
        const data: BackendUser[] = await response.json();
        setSuggestedSitters(data);
      }
    } catch (err) {
      console.error('Failed to fetch suggested connections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestedConnections();
    const handleConnectionUpdate = () => fetchSuggestedConnections();
    window.addEventListener('connectionUpdated', handleConnectionUpdate);
    return () => window.removeEventListener('connectionUpdated', handleConnectionUpdate);
  }, []);

  const handleConnect = async (userId: number) => {
    setConnectingId(userId);
    try {
      const token = localStorage.getItem('access') || localStorage.getItem('access_token');
      const response = await fetch(`/api/users/${userId}/follow/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      if (response.ok) {
        window.dispatchEvent(new Event('connectionUpdated'));
        await fetchSuggestedConnections();
      }
    } catch (err) {
      console.error('Error connecting to user:', err);
    } finally {
      setConnectingId(null);
    }
  };

  return (
    <aside className="right-sidebar">
      <div className="rs-card">
        <h3 className="rs-title">Suggested connections</h3>
        {loading ? (
          <p className="rs-subtext" style={{ fontSize: '0.75rem', color: '#888' }}>Loading suggestions...</p>
        ) : suggestedSitters.length === 0 ? (
          <p className="rs-subtext" style={{ fontSize: '0.75rem', color: '#888' }}>No new suggestions available.</p>
        ) : (
          <ul className="rs-list">
            {suggestedSitters.map(s => {
              const displayName = s.name || s.username || `User ${s.id}`;
              const isSitter = s.user_type === 'provider' || s.user_type === 'sitter' || s.role === 'Pet Sitter' || s.role === 'sitter';
              const displayRole = isSitter ? 'Pet Sitter' : 'Pet Owner';
              const displayLocation = [s.city, s.country].filter(Boolean).join(', ') || 'Portugal';
              const hasRating = isSitter && s.rating !== null && s.rating !== undefined;
              const formattedRating = hasRating ? Number(s.rating).toFixed(1) : null;
              const profilePath = isSitter ? `/sitterprofile/${s.id}` : `/ownerprofile/${s.id}`;

              return (
                <li key={s.id} className="rs-item">
                  {s.avatar && s.avatar !== '/static/avatars/profile-pic.png' ? (
                    <img
                      src={s.avatar}
                      alt={displayName}
                      className="rs-avatar"
                      style={{ objectFit: 'cover', cursor: 'pointer' }}
                      onClick={() => navigate(profilePath)}
                    />
                  ) : (
                    <div
                      className="rs-avatar"
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(profilePath)}
                    >
                      {initials(displayName)}
                    </div>
                  )}
                  <div className="rs-info">
                    <span
                      className="rs-name"
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(profilePath)}
                    >
                      {displayName}
                    </span>
                    <span className="rs-info">{displayRole} · {displayLocation}</span>
                    {hasRating && <span className="rs-rating">⭐ {formattedRating}</span>}
                  </div>
                  <button
                    className="rs-btn"
                    disabled={connectingId === s.id}
                    onClick={() => handleConnect(s.id)}
                  >
                    {connectingId === s.id ? '...' : 'Connect'}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
