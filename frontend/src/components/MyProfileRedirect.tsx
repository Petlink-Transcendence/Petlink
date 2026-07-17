import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export default function MyProfileRedirect() {
  const [userType, setUserType] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access');
    fetch('http://localhost:8080/auth/me/', {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => setUserType(data.user_type ?? 'owner'))
      .catch(() => setError(true));
  }, []);

  if (error) return <Navigate to="/login" replace />;
  if (!userType) return null;

  return <Navigate to={userType === 'provider' || userType === 'sitter' ? '/sitterprofile' : '/ownerprofile'} replace />;
}
