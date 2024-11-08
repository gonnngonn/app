import React from 'react';
import { Link } from 'react-router-dom';
import './sefooter.css'

const SecundarioFooter = () => {
  return (
    <footer className="secondary-footer">
      <div className="secondary-footer-content">
        <span>Desarrollado por Alba Software</span>
        <Link to="mailto:stefany.mon73@gmail.com" className="footer-contact">
          Contacto
        </Link>
      </div>
    </footer>
  );
};

export default SecundarioFooter;