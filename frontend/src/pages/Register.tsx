import './Auth.css';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();
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

        if (!name.trim()) {
            setError("Full name is required.");
            return;
        }

        if (!username.trim()) {
            setError("Username is required.");
            return;
        }

        if (!email.trim()) {
            setError("Email is required.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            setError("Enter a valid email address.");
            return;
        }

        if (!password) {
            setError("Password is required.");
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,15}$/;
        if (!passwordRegex.test(password)) {
            setError("Password must contain at least 8 chars, one lower, one upper, one number, and one special char.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        // Pre-check availability via GET endpoint (200 OK) to prevent 400 Bad Request browser console errors
        try {
            const checkRes = await fetch(`/auth/check-availability/?username=${encodeURIComponent(username.trim())}&email=${encodeURIComponent(email.trim())}`);
            if (checkRes.ok) {
                const checkData = await checkRes.json();
                if (checkData.username_taken) {
                    setError("A user with that username already exists.");
                    return;
                }
                if (checkData.email_taken) {
                    setError("A user with that email already exists.");
                    return;
                }
            }
        } catch {
            // Ignore pre-check fetch error and fallback to direct POST
        }

        try {
            const response = await fetch('/auth/register/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username.trim(),
                    email: email.trim(),
                    password,
                    name: name.trim(),
                    user_type: userType
                })
            });

            if (response.ok) {
                alert("Account created successfully!");
                navigate('/login');
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
                const detailError = getFirstMessage(data?.detail);
                const nonFieldErrors = getFirstMessage(data?.non_field_errors);

                if (usernameError) {
                    setError(usernameError);
                } else if (emailError) {
                    setError(emailError);
                } else if (passwordError) {
                    setError(passwordError);
                } else if (detailError) {
                    setError(detailError);
                } else if (nonFieldErrors) {
                    setError(nonFieldErrors);
                } else {
                    setError('Error creating account.');
                }
            }
        } catch (err) {
            setError("Error connecting to server.");
        }
    };

    return (
        <div className="login-page-container signup-page-container">
            <h1 className="welcome-message">
                Welcome to <span className="welcome-message-petlink">PetLink</span>
            </h1>

            <div className="login-box">
                <h2 className="login-title">Sign Up</h2>
                {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

                <div className="input-group">
                    <label htmlFor="reg-name">Full Name</label>
                    <input id="reg-name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="input-group">
                    <label htmlFor="reg-username">Username</label>
                    <input id="reg-username" type="text" placeholder="Choose a username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>

                <div className="input-group">
                    <label htmlFor="reg-email">Email</label>
                    <input id="reg-email" type="email" placeholder="youremail@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="input-group">
                    <label htmlFor="reg-password">Password</label>
                    <input id="reg-password" type="password" placeholder="***************" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <div className="input-group">
                    <label htmlFor="reg-confirm-password">Confirm Password</label>
                    <input id="reg-confirm-password" type="password" placeholder="***************" value={confirmPassword}
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
                    <Link to="/login" className="sign-up-link">Login</Link>
                </div>
            </div>
        </div>
    );
}
