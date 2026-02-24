import React, { useState, useContext } from 'react';
import { X, Lock, Mail, User } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import './AuthModal.scss';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
    const [mode, setMode] = useState(initialMode); // 'login' or 'register'
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, register } = useContext(AuthContext);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (mode === 'login') {
                await login(email, password);
            } else {
                await register(name, email, password);
            }
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const switchMode = () => {
        setMode(mode === 'login' ? 'register' : 'login');
        setError('');
    };

    return (
        <div className="auth-overlay" onClick={onClose}>
            <div className="auth-modal" onClick={e => e.stopPropagation()}>
                <div className="auth-modal__header">
                    <h2>{mode === 'login' ? 'Welcome Back' : 'Create an Account'}</h2>
                    <button className="btn-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form className="auth-modal__form" onSubmit={handleSubmit}>
                    {error && <div className="auth-error">{error}</div>}

                    {mode === 'register' && (
                        <div className="input-group">
                            <label>Name</label>
                            <div className="input-wrapper">
                                <User size={16} className="input-icon" />
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    <div className="input-group">
                        <label>Email</label>
                        <div className="input-wrapper">
                            <Mail size={16} className="input-icon" />
                            <input
                                type="email"
                                required
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <Lock size={16} className="input-icon" />
                            <input
                                type="password"
                                required
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button className="btn-submit" type="submit" disabled={loading}>
                        {loading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Sign Up')}
                    </button>
                </form>

                <div className="auth-modal__footer">
                    <p>
                        {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                        <button className="btn-switch" onClick={switchMode} type="button">
                            {mode === 'login' ? 'Sign up' : 'Login'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
