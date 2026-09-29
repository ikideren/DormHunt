import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { Button } from './Button';
import './Navigation.css';

export const Navigation: React.FC = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <Link to="/" className="navbar__logo">
          🏠 DormHunt
        </Link>

        <button
          className="navbar__toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <div className={`navbar__menu ${menuOpen ? 'navbar__menu--open' : ''}`}>
          <Link to="/search" className="navbar__link">
            Search
          </Link>
          <Link to="/compare" className="navbar__link">
            Compare
          </Link>
          <Link to="/roommates" className="navbar__link">
            Roommates
          </Link>

          <div className="navbar__auth">
            {isAuthenticated ? (
              <>
                <Link to="/favorites" className="navbar__link">
                  ❤️ Favorites
                </Link>
                <Link to="/owner/dashboard" className="navbar__link">
                  Owner Dashboard
                </Link>
                <Button variant="secondary" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="navbar__link">
                  Login
                </Link>
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
