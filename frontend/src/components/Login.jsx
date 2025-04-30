import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [formError, setFormError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [resetStep, setResetStep] = useState('initial'); // initial, otp, verify, reset
    
    const API_URL = 'http://localhost:8000/api';
    
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Animate form after a short delay
        const timer = setTimeout(() => {
            setIsActive(true);
        }, 200);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        try {
            const success = await login(username, password);
            if (success) {
                navigate('/');
            } else {
                setFormError('Invalid username or password');
            }
        } catch (err) {
            setFormError('An error occurred during login');
            console.error('Login error:', err);
        }
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email) {
            setFormError('Please enter your email address');
            return;
        }

        setIsLoading(true);
        setFormError('');

        try {
            const response = await axios.post(`${API_URL}/auth/send-otp/`, { email });
            if (response.status === 200) {
                setResetStep('verify');
                setFormError('');
            }
        } catch (err) {
            setFormError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp) {
            setFormError('Please enter the OTP sent to your email');
            return;
        }

        setIsLoading(true);
        setFormError('');

        try {
            const response = await axios.post(`${API_URL}/auth/verify-otp/`, { 
                email,
                code: otp 
            });
            
            if (response.status === 200) {
                setResetStep('reset');
                setFormError('');
            }
        } catch (err) {
            setFormError(err.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!newPassword) {
            setFormError('Please enter a new password');
            return;
        }

        setIsLoading(true);
        setFormError('');

        try {
            const response = await axios.post(`${API_URL}/reset-password/`, {
                email,
                code: otp,
                password: newPassword
            });
            
            if (response.status === 200) {
                setFormError('');
                setResetStep('initial');
                setFormError('Password reset successful. Please login with your new password.');
            }
        } catch (err) {
            setFormError(err.response?.data?.message || 'Failed to reset password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderLoginForm = () => (
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
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={password ? 'has-value' : ''}
                />
                <label htmlFor="password">Password</label>
                <span 
                    className="password-toggle" 
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? '🙈' : '👁️'}
                </span>
            </div>
            
            {formError && <div className="form-error">{formError}</div>}
            
            <button 
                type="submit" 
                className="auth-button" 
                disabled={isLoading}
            >
                {isLoading ? 'Logging in...' : 'Login'}
            </button>
            
            <div className="auth-links">
                <span onClick={() => setResetStep('otp')} className="forgot-password">
                    Forgot Password?
                </span>
                <Link to="/register" className="register-link">
                    Don't have an account? Register
                </Link>
            </div>
        </form>
    );

    const renderRequestOtpForm = () => (
        <form onSubmit={handleSendOtp} className="auth-form">
            <h2>Reset Password</h2>
            <p className="reset-instructions">
                Enter your email address below and we'll send you an OTP to reset your password.
            </p>
            
            <div className="form-group">
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={email ? 'has-value' : ''}
                />
                <label htmlFor="email">Email Address</label>
            </div>
            
            {formError && <div className="form-error">{formError}</div>}
            
            <button 
                type="submit" 
                className="auth-button" 
                disabled={isLoading}
            >
                {isLoading ? 'Sending...' : 'Send OTP'}
            </button>
            
            <div className="auth-links">
                <span onClick={() => setResetStep('initial')} className="back-to-login">
                    Back to Login
                </span>
            </div>
        </form>
    );

    const renderVerifyOtpForm = () => (
        <form onSubmit={handleVerifyOtp} className="auth-form">
            <h2>Verify OTP</h2>
            <p className="reset-instructions">
                Enter the OTP sent to your email address.
            </p>
            
            <div className="form-group">
                <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className={otp ? 'has-value' : ''}
                />
                <label htmlFor="otp">OTP Code</label>
            </div>
            
            {formError && <div className="form-error">{formError}</div>}
            
            <button 
                type="submit" 
                className="auth-button" 
                disabled={isLoading}
            >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
            
            <div className="auth-links">
                <span onClick={handleSendOtp} className="resend-otp">
                    Resend OTP
                </span>
                <span onClick={() => setResetStep('initial')} className="back-to-login">
                    Back to Login
                </span>
            </div>
        </form>
    );

    const renderResetPasswordForm = () => (
        <form onSubmit={handleResetPassword} className="auth-form">
            <h2>Reset Password</h2>
            <p className="reset-instructions">
                Enter your new password below.
            </p>
            
            <div className="form-group">
                <input
                    type={showPassword ? 'text' : 'password'}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className={newPassword ? 'has-value' : ''}
                />
                <label htmlFor="newPassword">New Password</label>
                <span 
                    className="password-toggle" 
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? '🙈' : '👁️'}
                </span>
            </div>
            
            {formError && <div className="form-error">{formError}</div>}
            
            <button 
                type="submit" 
                className="auth-button" 
                disabled={isLoading}
            >
                {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
            
            <div className="auth-links">
                <span onClick={() => setResetStep('initial')} className="back-to-login">
                    Back to Login
                </span>
            </div>
        </form>
    );

    const renderForm = () => {
        switch (resetStep) {
            case 'otp':
                return renderRequestOtpForm();
            case 'verify':
                return renderVerifyOtpForm();
            case 'reset':
                return renderResetPasswordForm();
            default:
                return renderLoginForm();
        }
    };

    return (
        <div className={`auth-container ${isActive ? 'active' : ''}`}>
            <div className="auth-card">
                <div className="auth-header">
                    <h1>MovieBuddy</h1>
                    <p>Sign in to continue</p>
                </div>
                
                {renderForm()}
            </div>
        </div>
    );
};

export default Login; 