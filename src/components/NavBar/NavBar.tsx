import { Link, useLocation } from 'react-router-dom';
import { Home, UserRound } from 'lucide-react';
import { Moon, Sun } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import './navbar-styles.css';

export const Navbar = () => {
    const { isAuth } = useAuth();

    const { isLight, handleToggle } = useTheme();
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <div className="navbar-left">
                    <Link to="/home" className={`navbar-icon-btn ${location.pathname === '/home' ? 'navbar-icon-active' : ''}`}>
                        <Home size={20} />
                    </Link>
                </div>
                <div className="navbar-right">
                    {!isAuth ? (
                        <>
                            <Link to="/" className="navbar-btn">log in</Link>
                            <Link to="/register" className="navbar-btn navbar-btn-accent">sign up</Link>
                        </>
                    ) : (
                        <Link to="/profile" className="navbar-icon-btn">
                            <UserRound size={20} />
                        </Link>
                    )}
                    <button className="navbar-icon-btn" onClick={handleToggle}>
                        {isLight ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                </div>
            </div>
        </nav>
    );
};