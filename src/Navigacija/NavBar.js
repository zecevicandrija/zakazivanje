import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './NavBar.css';
import { getAuth, onAuthStateChanged, signOut } from '@firebase/auth';
import undologoo from '../images/undologoo.jpg';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    }, setError);
    return () => unsubscribe();
  }, []);
  
  const handleLogoutClick = () => {
    signOut(getAuth());
  };

  // Kontroler za otvaranje/zatvaranje menija (hamburger)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    // Klik van menija zatvara mobilni meni
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, []);

  const handleMenuClick = (e) => {
    // Sprečava propagaciju klika unutar menija
    e.stopPropagation();
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/PocetnaStrana">
            <img src={undologoo} alt="Logo" />
          </Link>
        </div>
        {/* Navigacioni linkovi */}
        <nav className={`navbar-menu ${isMenuOpen ? 'open' : ''}`} onClick={handleMenuClick}>
          <NavLink exact to="/PocetnaStrana" activeClassName="active-link">Pocetna</NavLink>
          <NavLink to="/Onama" activeClassName="active-link">O nama</NavLink>
          <NavLink to="/Odabrirfrizera" activeClassName="active-link">Usluge</NavLink>
          {user && <NavLink to="/loginovan" activeClassName="active-link">Termini</NavLink>}
          {user && <NavLink to="/Kategorija" activeClassName="active-link">Kategorija</NavLink>}
          {user && <NavLink to="/pauza" activeClassName="active-link">Pauza</NavLink>}
          {user && <NavLink to="/Statistika" activeClassName="active-link">Statistika</NavLink>}
          {user && <NavLink to="/usluge" activeClassName="active-link">Tabela Usluge</NavLink>}
          {user && <NavLink to="/Radnovreme" activeClassName="active-link">Radno vreme</NavLink>}
          {user && (
            <Link to="/Odjava" className="navbar-link" onClick={handleLogoutClick}>
              Izloguj se
            </Link>
          )}
        </nav>
        {/* Hamburger dugme za mobilne uređaje */}
        <button className={`navbar-toggle ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
