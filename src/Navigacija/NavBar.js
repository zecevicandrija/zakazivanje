import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './NavBar.css'; // Make sure your styles are defined in this CSS file
import lukabickejilogo from "../images/lukabickejilogo.jpg";
import { getAuth, onAuthStateChanged , signOut } from '@firebase/auth'
import undologoo from '../images/undologoo.jpg'

const Navbar = () => {
  const [user, setUser] = useState()
  const [error, setError] = useState()
  
  //console.log("APP ", user)
  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
  //        console.log(user)
        setUser(user)
        
      } else {
        setUser(null)
        // ...
      }
    }, setError)
    return () => unsubscribe()
  },[])
  
  
  //console.log("Navbar ", user)
  const handleLogoutClick = () => {
    signOut(getAuth())
  };

  const [buttonColor, setButtonColor] = useState('#000');
  const [navbarHidden, setNavbarHidden] = useState(true);

  const toggleNavbar = (e) => {
    e.stopPropagation(); // Prevent event propagation
    setNavbarHidden(!navbarHidden);
    setButtonColor(buttonColor === '#fff' ? '#000' : '#fff');
  };

  const closeNavbar = () => {
    setNavbarHidden(true);
    setButtonColor('#000');
  };

  useEffect(() => {
    document.body.addEventListener('click', closeNavbar);

    return () => {
      document.body.removeEventListener('click', closeNavbar);
    };
  }, []);

  const handleNavbarClick = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      <button className="toggle-button" onClick={toggleNavbar} style={{ color: buttonColor }}>
        {navbarHidden ? '⋮' : '⋮'}
      </button>
      <div className={`navbar-target ${navbarHidden ? 'hidden' : ''}`} onClick={handleNavbarClick}>
        <div className="navbar-left">
          <Link to={'/PocetnaStrana'}><img src={undologoo} alt='(logo)' className='logo'/></Link>
        </div>
        <div className="navbar-right">
          <NavLink exact to={'/PocetnaStrana'} className='navbar-link' activeClassName='active-link'>Pocetna</NavLink>
          <NavLink to={"/Onama"} className='navbar-link' activeClassName='active-link'>O nama</NavLink>
          <NavLink to={"/Odabrirfrizera"} className='navbar-link' activeClassName='active-link'>Usluge</NavLink>
          {user && (
            <NavLink to={'/loginovan'} className="navbar-link" activeClassName='active-link'>Termini</NavLink>
          )}
          {user && (
            <NavLink to={'/Kategorija'} className="navbar-link" activeClassName='active-link'>Kategorija</NavLink>
          )}
          {user && (
            <NavLink to={'/pauza'} className="navbar-link" activeClassName='active-link'>Pauza</NavLink>
          )}
          {user && (
            <NavLink to={'/Statistika'} className="navbar-link" activeClassName='active-link'>
              Statistika
            </NavLink>
          )}
          {user && (
            <NavLink to={'/usluge'} className="navbar-link" activeClassName='active-link'>
              Tabela Usluge
            </NavLink>
          )}
          {user && (
            <NavLink to={'/Radnovreme'} className="navbar-link" activeClassName='active-link'>
              Radno vreme
            </NavLink>
          )}

          {user && (
            <Link to={'/Odjava'} className="navbar-link" onClick={handleLogoutClick}>
              Izloguj se
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;