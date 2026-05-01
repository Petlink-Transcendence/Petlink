import { Navigate } from 'react-router-dom';

const PublicOnlyRoute = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem('access');

    if (token && token !== 'undefined' && token !== 'null') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PublicOnlyRoute;
