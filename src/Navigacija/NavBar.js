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
          <Link to="/PocetnaStrana" onClick={closeMenu}>
            <img src={undologoo} alt="Logo" />
          </Link>
        </div>
        {/* Navigacioni linkovi */}
        <nav className={`navbar-menu ${isMenuOpen ? 'open' : ''}`} onClick={handleMenuClick}>
          <NavLink exact to="/PocetnaStrana" activeClassName="active-link" onClick={closeMenu}>Početna</NavLink>
          <NavLink to="/Onama" activeClassName="active-link" onClick={closeMenu}>O nama</NavLink>
          <NavLink to="/Odabrirfrizera" activeClassName="active-link" onClick={closeMenu}>Usluge</NavLink>
          {user && <NavLink to="/loginovan" activeClassName="active-link" onClick={closeMenu}>Termini</NavLink>}
          {user && <NavLink to="/Kategorija" activeClassName="active-link" onClick={closeMenu}>Kategorija</NavLink>}
          {user && <NavLink to="/pauza" activeClassName="active-link" onClick={closeMenu}>Pauza</NavLink>}
          {user && <NavLink to="/Statistika" activeClassName="active-link" onClick={closeMenu}>Statistika</NavLink>}
          {user && <NavLink to="/usluge" activeClassName="active-link" onClick={closeMenu}>Tabela Usluge</NavLink>}
          {user && <NavLink to="/Radnovreme" activeClassName="active-link" onClick={closeMenu}>Radno vreme</NavLink>}
          {user && (
            <Link
              to="/Odjava"
              className="navbar-link"
              onClick={(e) => {
                handleLogoutClick();
                closeMenu();
              }}
            >
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
