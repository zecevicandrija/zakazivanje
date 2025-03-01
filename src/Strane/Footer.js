import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import undologoo from '../images/undologoo.jpg';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo секција */}
        <div className="footer-logo">
          <Link to="/PocetnaStrana">
            <img src={undologoo} alt="Footer Logo" />
          </Link>
        </div>

        {/* Navigacioni линкови */}
        <nav className="footer-nav">
          <Link to="/PocetnaStrana" className="footer-link">Početna</Link>
          <Link to="/Odabrirfrizera" className="footer-link">Zakazivanje</Link>
          <Link to="/Onama" className="footer-link">O Nama</Link>
        </nav>

        {/* Copyright текст */}
        <div className="footer-copyright">
          <p>&copy; {new Date().getFullYear()} Undo Vrbas</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;