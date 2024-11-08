import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';
import logoCompleto from '../assets/images/logocompleto.png';
import { FaFacebook, FaYoutube, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
       
        <div className="footer-section">
          <img 
            src={logoCompleto} 
            alt="Patitas Sin Hogar" 
            className="footer-logo"
          />
          <h3 className="footer-title">
            Adopta un amigo, cambia una vida
          </h3>
          <h4 className="footer-subtitle">Patitas Sin Hogar</h4>
          <Link 
            to="/login" 
            className="footer-admin-link"
          >
            Administrar
          </Link>
        </div>

      
        <div className="footer-section">
          <h3 className="footer-title">¡Navega por la web!</h3>
          <nav className="footer-nav">
            <ul className="footer-nav-list">
              <li>
                <Link to="/" className="footer-link">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/adoptar" className="footer-link">
                  Adoptar
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="footer-link">
                  Contacto
                </Link>
              </li>
              <li>
                <Link to="/hogar-transito" className="footer-link">
                  Hogar de Tránsito
                </Link>
              </li>
            </ul>
          </nav>
        </div>

       
        <div className="footer-section">
          <h3 className="footer-title">Redes Sociales</h3>
          <div className="social-links">
            <a href="#" className="social-link">
              <FaFacebook /> Facebook
            </a>
            <a href="#" className="social-link">
              <FaYoutube /> YouTube
            </a>
            <a href="#" className="social-link">
              <FaInstagram /> Instagram
            </a>
            <a href="#" className="social-link">
              <FaTwitter /> Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;