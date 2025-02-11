import React from "react";
import "./Onama.css"; 
import wallpaper3 from "../images/wallpaper3.webp";
import lukaslika from "../images/lukaslika.jpg";

const Onama = () => {
  return (
    <>
    <div className="barberpozadina">
        <img src={wallpaper3} className="barberwallpaper" alt="pozadina" />
      </div>
      <h1 className="naslov">O Nama</h1>




       <div className="container">
      <div className="content">
        <div className="text">
          <h1>SVIMA VAMA</h1>
          <p>Priča porodice Bičkeji kakvu svi sada poznajete počinje u Erdeviku 21. marta 1939. rođenjem Pavla, vama starijima poznatijeg pod imenom Paja berber. Pavle je 1952. godine kao 13-godišnji dečak izrazio želju za učenjem zanata tada poznatom vrbaskom berberu Vladi Gajdošu. Zatim se 1962. godine vraća u Vrbas kao glavni majstor berbernice u hotelu "BAČKA". Deset godina kasnije 1972. otvara svoju berbernicu - Berberski salon "Kod Paje"</p>
        </div>
        <img src={''} alt="Prva slika" />
      </div>
      <div className="content reverse">
        <img src={lukaslika} alt="Druga slika" />
        <div className="text">
          <h1>Berbernica Luka Bičkeji</h1>
          <p>Svoje znanje, umeće i ljubav prema ovom zanatu preneo je i na svoje sinove. Prvi je u posao ušao Franja sa svojih 15 godina, a potom Seni i Željko sa 25 godina. Otpočinju svoj put u istom zanatu prateći svoga oca kao nova i još jača generacija i ubrzo preuzimaju vodeću ulogu. Svojim načinom rada već godinama ulepšavaju svoje klijente. I sada, baš kao i nekada nova generacija u sastavu Aleksandar, Mladen, Luka i Boris nastavljaju porodičnu tradiciju. Kroz sve ove godine kao porodica zanatlija bili smo i ostali riznica znanja i događaja.</p>
        </div>
      </div>
    </div>
    <div id="informacije" className="informacije">
        <div className="info-box">
          <div className="info-icon">50+</div>
          <div className="info-text">Godina sa vama</div>
        </div>
        <div className="vertical-line"></div>
        <div className="info-box">
          <div className="info-icon">11-19h</div>
          <div className="info-text">Ponedeljak-Petak</div>
        </div>
        <div className="vertical-line"></div>
        <div className="info-box">
          <div className="info-icon">09-14h</div>
          <div className="info-text">Subotom</div>
        </div>
        <div className="vertical-line"></div>
        <div className="info-box">
          <div className="info-icon">2</div>
          <div className="info-text">Berbera</div>
        </div>
      </div>

      <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2808.5492322116866!2d19.81141777626276!3d45.25690727107128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475b1147a52ef881%3A0x74cada91657bbb41!2sBerbernica%20Luka%20Bi%C4%8Dkeji!5e0!3m2!1ssr!2srs!4v1699905015359!5m2!1ssr!2srs"
              width="800"
              height="250"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="mapa"
              className="guglmapa"
            ></iframe>

<div className="lokacija-info">
        <p><b>Lokacija:</b> Janka Čmelika 2Oa, Novi Sad</p>
        <p><b>Broj telefona:</b> 069 706784</p>
        {/* <p>Mail: andrija@gmail.com</p> */}
        <p className="sajtradili"><b>Sajt radili:</b>  <a href="https://www.undovrbas.com" target="_blank" rel="noopener noreferrer">UNDO VRBAS</a></p>
      </div>
    </>
  );
};

export default Onama;
