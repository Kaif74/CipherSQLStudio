import React, { useState, useContext } from 'react';
import './Navbar.scss';
import { User, Bell, Sun, Moon, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../../assets/image.png';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import AuthModal from '../auth/AuthModal';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    return (
        <nav className="navbar">
            <div className="navbar__container">
                <Link to="/" className="navbar__logo">
                    <img src={logo} alt="CipherSchools Logo" className="navbar__logo-icon" />
                    <span className="navbar__logo-text">CipherSchools</span>
                </Link>
                <div className="navbar__actions">
                    {user && (
                        <button className="navbar__icon-btn">
                            <Bell size={20} />
                        </button>
                    )}
                    <button className="navbar__icon-btn" onClick={toggleTheme} title="Toggle Theme">
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>

                    {user ? (
                        <>
                            <div className="navbar__user-info">
                                <User className="navbar__user-icon" size={20} />
                                <span className="navbar__user-text">Hey, {user.name?.split(' ')[0] || 'User'}</span>
                            </div>
                            <button className="navbar__icon-btn logout-btn" onClick={logout} title="Logout">
                                <LogOut size={20} />
                            </button>
                        </>
                    ) : (
                        <button className="navbar__login-btn" onClick={() => setIsAuthModalOpen(true)}>
                            Login / Register
                        </button>
                    )}
                </div>
            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </nav>
    );
};

export default Navbar;
