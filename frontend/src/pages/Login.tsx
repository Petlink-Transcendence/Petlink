import './Auth.css';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        document.title = "Login | PetLink";
        const queryParams = new URLSearchParams(location.search);
        if (queryParams.get('error') === 'account_deleted') {
            setError('Account temporarily unavailable');
        }
    }, [location]);

    // Local authentication
    const handleLogin = async () => {
        setError('');
        try {
            const response = await fetch('/auth/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('access', data.access);
                localStorage.setItem('refresh', data.refresh);
                navigate('/');
            } else {
                setError("Invalid username or password.");
            }
        } catch (err) {
            setError("Error connecting to server.");
        }
    };

    // 42 Intranet OAuth authentication
    const handle42Login = async () => {
        setError('');
        try {
            const response = await fetch('/auth/42/login/');
            if (response.ok) {
                const data = await response.json();
                // Redirect the browser to the official 42 authorization URL
                window.location.href = data.url;
            } else {
                setError("Failed to initialize 42 login.");
            }
        } catch (err) {
            setError("Error connecting to server.");
        }
    };

    return (
        <div className="login-page-container signin-page-container">
            <h1 className="welcome-message">
                Welcome to <span className="welcome-message-petlink">PetLink</span>
            </h1>

            <div className="login-box">
                <h2 className="login-title">Login</h2>
                {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

                <div className="input-group">
                    <label>Username</label>
                    <input type="text" placeholder="Your username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>

                <div className="input-group">
                    <label>Password</label>
                    <input type="password"
                            placeholder="***************"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleLogin();
                                }
                            }}
                            />
                </div>

                <button className="login-button" onClick={handleLogin}>Login</button>

                {/* 42 Login Section */}
                <div className="divider">
                    <span>or</span>
                </div>

                <button className="login-button oauth-42-button" onClick={handle42Login}>
                    Login with 42 Intranet
                </button>

                <div className="sign-up-container">
                    <span className="sign-up-text">Don't have an account?</span>
                    <a href="/register" className="sign-up-link">Sign up</a>
                </div>
            </div>
        </div>
    );
}
