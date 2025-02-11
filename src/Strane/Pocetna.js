import React from "react";
import { Link } from "react-router-dom";
import classes from "./Pocetna.module.css";
import instaicon from "../images/instaicon.png";
import undologoo from '../images/undologoo.jpg'

const Pocetna = () => {

  return (
    <>
      {/* <video
        autoPlay
        playsInline
        loop
        muted
        disablePictureInPicture
        controls={false}
        className={classes["video-bg"]}
      >
        <source src={bickejinovivideo} type="video/mp4" />
      </video> */}
      <div className={classes.container}>
      <img src={undologoo} alt="LOGO" className={classes.firstImage}/>
        <div className={classes.info}>
          <h1>Undo Vrbas</h1>
          <h2>Software za zakazivanje</h2>
          <Link to={"/Odabrirfrizera"} className={classes.button}>
            ZAKAŽI TERMIN
          </Link>
          <div className={classes.instagram}>
            <a
              href="https://www.instagram.com/zecevic__a/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={instaicon}
                alt="Instagram"
                className={classes.instaIcon}
              />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pocetna;
