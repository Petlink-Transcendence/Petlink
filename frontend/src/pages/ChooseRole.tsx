import './Auth.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ChooseRole() {
    const [userType, setUserType] = useState('owner');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Choose Role | PetLink";
    }, []);

    const handleSubmit = async () => {
        setError('');
        setIsLoading(true);

        const token = localStorage.getItem('access');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch('/auth/set-role/', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ user_type: userType })
            });

            if (response.ok) {
                navigate('/');
            } else {
                setError('Failed to set role. Please try again.');
                setIsLoading(false);
            }
        } catch (err) {
            setError("Error connecting to server.");
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page-container">
            <h1 className="welcome-message">
                Welcome to <span className="welcome-message-petlink">PetLink</span>!
            </h1>

            <div className="login-box">
                <h2 className="login-title">Almost there...</h2>
                <p style={{ textAlign: 'center', marginBottom: '20px', color: '#ccc' }}>
                    How are you planning to use PetLink?
                </p>

                {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

                <div className="input-group">
                    <label>I am a:</label>
                    <div className="radio-options" style={{ display: 'flex', gap: '20px', marginTop: '10px', marginBottom: '20px' }}>
                        <label className="radio-option" style={{ cursor: 'pointer' }}>
                            <input
                                type="radio"
                                name="userType"
                                value="owner"
                                checked={userType === 'owner'}
                                onChange={(e) => setUserType(e.target.value)}
                            />
                            {' '}Pet Owner
                        </label>
                        <label className="radio-option" style={{ cursor: 'pointer' }}>
                            <input
                                type="radio"
                                name="userType"
                                value="provider"
                                checked={userType === 'provider'}
                                onChange={(e) => setUserType(e.target.value)}
                            />
                            {' '}Pet Sitter
                        </label>
                    </div>
                </div>

                <button 
                    className="login-button" 
                    onClick={handleSubmit} 
                    disabled={isLoading}
                    style={{ opacity: isLoading ? 0.7 : 1 }}
                >
                    {isLoading ? 'Saving...' : 'Complete Profile'}
                </button>
            </div>
        </div>
    );
}
