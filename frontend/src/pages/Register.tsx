import './Auth.css';
import { useEffect, useState } from 'react';

export default function Register() {
    // States to control data
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        document.title = "Sign Up | PetLink";
    }, []);

    // Send data to Backend
    const handleRegister = async () => {
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/register/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            if (response.ok) {
                alert("Account created successfully!");
                window.location.href = "/login";
            } else {
                setError("Error creating account.");
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
                <h2 className="login-title">Sign Up</h2>
                {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

                <div className="input-group">
                    <label>Username</label>
                    <input type="text" placeholder="Choose a username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>

                <div className="input-group">
                    <label>Email</label>
                    <input type="email" placeholder="youremail@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="input-group">
                    <label>Password</label>
                    <input type="password" placeholder="***************" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <div className="input-group">
                    <label>Confirm Password</label>
                    <input type="password" placeholder="***************" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>

                <button className="login-button" onClick={handleRegister}>Sign Up</button>

                <div className="sign-up-container">
                    <span className="sign-up-text">Already have an account?</span>
                    <a href="/login" className="sign-up-link">Login</a>
                </div>
            </div>
        </div>
    );
}
