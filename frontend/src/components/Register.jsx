import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isActive, setIsActive] = useState(false);
    
    const { register } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            setIsActive(true);
        }, 100);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== password2) {
            setError('Passwords do not match');
            return;
        }

        try {
            const success = await register(username, email, password, password2);
            if (success) {
                navigate('/');
            } else {
                setError('Registration failed');
            }
        } catch (err) {
            setError('An error occurred during registration');
            console.error('Registration error:', err);
        }
    };

    return (
        <div className={`auth-container ${isActive ? 'active' : ''}`}>
            <div className="auth-card">
                <div className="auth-header">
                    <h1>MovieBuddy</h1>
                    <p>Create your account</p>
                </div>
                
                {error && <div className="form-error">{error}</div>}
                
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className={username ? 'has-value' : ''}
                        />
                        <label htmlFor="username">Username</label>
                    </div>
                    
                    <div className="form-group">
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={email ? 'has-value' : ''}
                        />
                        <label htmlFor="email">Email</label>
                    </div>
                    
                    <div className="form-group">
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className={password ? 'has-value' : ''}
                        />
                        <label htmlFor="password">Password</label>
                    </div>
                    
                    <div className="form-group">
                        <input
                            type="password"
                            id="password2"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            required
                            className={password2 ? 'has-value' : ''}
                        />
                        <label htmlFor="password2">Confirm Password</label>
                    </div>
                    
                    <div className="form-checkbox">
                        <input type="checkbox" id="terms" required />
                        <label htmlFor="terms">I agree to the Terms of Service and Privacy Policy</label>
                    </div>
                    
                    <button type="submit" className="auth-button" disabled={isLoading}>
                        {isLoading ? 'Processing...' : 'Register'}
                    </button>
                </form>
                
                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Log In</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register; 