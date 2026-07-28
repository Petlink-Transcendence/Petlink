import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';

export default function UserProfileRedirect() {
  const { id } = useParams<{ id: string }>();
  const [targetPath, setTargetPath] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem('access') || localStorage.getItem('access_token');
    fetch(`/api/users/${id}/`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        const isSitter = data.user_type === 'provider' || data.user_type === 'sitter';
        setTargetPath(isSitter ? `/sitterprofile/${id}` : `/ownerprofile/${id}`);
      })
      .catch(() => setError(true));
  }, [id]);

  if (error) return <Navigate to="/" replace />;
  if (!targetPath) return null;

  return <Navigate to={targetPath} replace />;
}
