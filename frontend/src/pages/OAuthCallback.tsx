import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function OAuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Extract parameters exactly as Django sent them via the URL
        const access = searchParams.get('access');
        const refresh = searchParams.get('refresh');

        if (access && refresh) {
            // Save tokens using the same keys as traditional login
            localStorage.setItem('access', access);
            localStorage.setItem('refresh', refresh);

            // Redirect user to the feed/home page
            navigate('/');
        } else {
            // If something goes wrong (e.g., missing tokens), return to login
            navigate('/login');
        }
    }, [searchParams, navigate]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#2d2d34', color: 'white' }}>
            <h2>Authenticating with 42... 🚀</h2>
        </div>
    );
}
