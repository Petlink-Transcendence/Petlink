import { Navigate } from 'react-router-dom';
import { useEffect, useState, ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem('access');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token) {
      setIsValid(false);
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch('/auth/me/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsValid(true);
        } else {
          // Token is invalid/expired
          localStorage.removeItem('access');
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh');
          setIsValid(false);
        }
      } catch (error) {
        // Fallback to true if there is a network error (e.g. backend temporarily down)
        // to prevent locking the user out completely.
        setIsValid(true);
      }
    };

    verifyToken();
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isValid === null) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.2rem', color: '#dbb679' }}>
        Verifying session...
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
