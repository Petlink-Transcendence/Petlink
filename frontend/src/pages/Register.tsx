import './Auth.css';
import { useEffect, useState } from 'react';

export default function Register() {
    // States to control data
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userType, setUserType] = useState('owner'); // Default to 'owner'
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
            const response = await fetch('/auth/register/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    name,
                    user_type: userType
                })
            });

            if (response.ok) {
                alert("Account created successfully!");
                window.location.href = "/login";
            } else {
                const data = await response.json().catch(() => null);

                const getFirstMessage = (value: unknown) => {
                    if (Array.isArray(value)) {
                        return value[0];
                    }

                    if (typeof value === 'string') {
                        return value;
                    }

                    return null;
                };

                const usernameError = getFirstMessage(data?.username);
                const emailError = getFirstMessage(data?.email);
                const passwordError = getFirstMessage(data?.password);

                if (usernameError) {
                    setError(usernameError);
                } else if (emailError) {
                    setError(emailError);
                } else if (passwordError) {
                    setError(passwordError);
                } else {
                    setError('Error creating account.');
                }
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
                    <label>Full Name</label>
                    <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
                </div>

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
                    <input type="password" placeholder="***************" value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleRegister();
                                }
                            }}
                            />
                </div>

                <div className="input-group">
                    <label>I am:</label>
                    <div className="radio-options">
                        <label className="radio-option">
                            <input
                                type="radio"
                                name="userType"
                                value="owner"
                                checked={userType === 'owner'}
                                onChange={(e) => setUserType(e.target.value)}
                            />
                            Pet owner
                        </label>
                        <label className="radio-option">
                            <input
                                type="radio"
                                name="userType"
                                value="provider"
                                checked={userType === 'provider'}
                                onChange={(e) => setUserType(e.target.value)}
                            />
                            Pet sitter
                        </label>
                    </div>
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
