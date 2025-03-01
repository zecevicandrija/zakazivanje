import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import classes from "./Pocetna.module.css";
import instaicon from "../images/instaicon.png";
import undologoo from '../images/undologoo.jpg';

const Pocetna = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={classes.pageWrapper}>

      <main className={classes.heroSection}>
        <div className={classes.heroContent}>
          <h1 className={classes.title}>Undo Vrbas</h1>
          <h2 className={classes.subtitle}>Profesionalni frizer u vašem gradu</h2>
          <p className={classes.description}>
            Brzo i jednostavno zakazivanje termina online. Bez čekanja, bez stresa.
          </p>
          <Link to="/Odabrirfrizera" className={classes.ctaButton}>
            ZAKAŽI TERMIN
          </Link>
          <div className={classes.socialLinks}>
            <a
              href="https://www.instagram.com/zecevic__a/"
              target="_blank"
              rel="noopener noreferrer"
              className={classes.socialLink}
            >
              <img
                src={instaicon}
                alt="Instagram"
                className={classes.socialIcon}
              />
              <span>Pratite nas</span>
            </a>
          </div>
        </div>
      </main>

      <section className={classes.features}>
        <div className={classes.feature}>
          <div className={classes.featureIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <h3>Brzo zakazivanje</h3>
          <p>Zakazite termin u nekoliko klikova</p>
        </div>
        <div className={classes.feature}>
          <div className={classes.featureIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <h3>Kvalitetna usluga</h3>
          <p>Profesionalni frizeri sa iskustvom</p>
        </div>
        <div className={classes.feature}>
          <div className={classes.featureIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
              <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
            </svg>
          </div>
          <h3>Podrška</h3>
          <p>Dostupni smo za sva vaša pitanja</p>
        </div>
      </section>

      <footer className={classes.footer}>
        <div className={classes.footerContent}>
          <div className={classes.footerLogo}>
            <img src={undologoo} alt="UNDO Logo" className={classes.footerLogoImg} />
            <span>Undo Vrbas</span>
          </div>
          <div className={classes.footerLinks}>
            <a href="#" className={classes.footerLink}>Privatnost</a>
            <a href="#" className={classes.footerLink}>Uslovi korišćenja</a>
            <a href="#" className={classes.footerLink}>Kontakt</a>
          </div>
          <div className={classes.footerSocial}>
            <a
              href="https://www.instagram.com/zecevic__a/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={instaicon} alt="Instagram" className={classes.footerSocialIcon} />
            </a>
          </div>
        </div>
        <div className={classes.footerCopyright}>
          &copy; {new Date().getFullYear()} Undo Vrbas. Sva prava zadržana.
        </div>
      </footer>
    </div>
  );
};

export default Pocetna;