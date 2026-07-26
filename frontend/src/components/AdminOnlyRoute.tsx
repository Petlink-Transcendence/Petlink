import { Navigate } from 'react-router-dom';
import { useEffect, useState, type ReactNode } from 'react';

type CurrentUser = {
  username?: string;
  role?: string;
};

type AdminOnlyRouteProps = {
  children: ReactNode;
};

export default function AdminOnlyRoute({ children }: AdminOnlyRouteProps) {
  const token = localStorage.getItem('access');
  const [isAdminUser, setIsAdminUser] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token) {
      setIsAdminUser(false);
      return;
    }

    const verifyAdminUser = async () => {
      try {
        const response = await fetch('/auth/me/', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setIsAdminUser(false);
          return;
        }

        const user = await response.json() as CurrentUser;
        setIsAdminUser(user.username === 'Admin' && user.role === 'admin');
      } catch {
        setIsAdminUser(false);
      }
    };

    verifyAdminUser();
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isAdminUser === null) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.2rem', color: '#dbb679' }}>
        Verifying admin access...
      </div>
    );
  }

  if (!isAdminUser) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
