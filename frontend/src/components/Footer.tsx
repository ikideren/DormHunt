import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__section">
          <h3 className="footer__title">🏠 DormHunt</h3>
          <p className="footer__description">
            The easiest way for students to find their perfect home away from home.
          </p>
          <div className="footer__socials">
            <a href="#" aria-label="Facebook">
              f
            </a>
            <a href="#" aria-label="Instagram">
              📷
            </a>
            <a href="#" aria-label="Twitter">
              𝕏
            </a>
          </div>
        </div>

        <div className="footer__section">
          <h4 className="footer__subtitle">Explore</h4>
          <nav className="footer__links">
            <Link to="/search">Search Kos</Link>
            <Link to="/roommates">Find Roommates</Link>
            <Link to="/compare">Compare Properties</Link>
            <a href="#">Pricing</a>
          </nav>
        </div>

        <div className="footer__section">
          <h4 className="footer__subtitle">For Owners</h4>
          <nav className="footer__links">
            <Link to="/owner/dashboard">Owner Dashboard</Link>
            <a href="#">List Your Property</a>
            <a href="#">Pricing</a>
            <a href="#">Support</a>
          </nav>
        </div>

        <div className="footer__section">
          <h4 className="footer__subtitle">Support</h4>
          <nav className="footer__links">
            <a href="#">Help Center</a>
            <a href="#">Contact Us</a>
            <a href="#">Safety Information</a>
            <a href="#">Terms & Privacy</a>
          </nav>
        </div>
      </div>

      <div className="footer__bottom">
        <p>&copy; {year} DormHunt. All rights reserved.</p>
      </div>
    </footer>
  );
};
