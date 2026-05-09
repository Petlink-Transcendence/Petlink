import './Auth.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Login | PetLink";
    }, []);

    const handleLogin = async () => {
        setError('');
        try {
            const response = await fetch('http://localhost:8000/login/', {
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

    return (
        <div className="login-page-container">
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

                <div className="sign-up-container">
                    <span className="sign-up-text">Don't have an account?</span>
                    <a href="/register" className="sign-up-link">Sign up</a>
                </div>
            </div>
        </div>
    );
}
