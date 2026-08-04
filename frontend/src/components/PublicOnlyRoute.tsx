import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

const PublicOnlyRoute = ({ children }: { children: ReactNode }) => {
    const token = localStorage.getItem('access');

    if (token && token !== 'undefined' && token !== 'null') {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default PublicOnlyRoute;
