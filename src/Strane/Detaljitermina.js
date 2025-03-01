import React from "react";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { db } from "../firebase/firebaseconfig";
import { collection, addDoc } from "firebase/firestore";
import "./Detaljitermina.css"
import BackButton from "./Dugmenazad";
import wallpaper3 from "../images/wallpaper3.webp";

const Detaljitermina = () => {
 
  const history = useHistory();
  const location = useLocation();
  const podaci = location.state;
  const { izabraneUsluge, imeKorisnika, brojKorisnika } = podaci;
 // console.log(podaci)
  //console.log("izabrane usluge:", izabraneUsluge);
  const pocetakTerminaValue = izabraneUsluge.pocetakTermina.value; //.value

  const frizerValue = izabraneUsluge.frizer;
  const datumValue = izabraneUsluge.datum;
  const formatiranDatum = new Intl.DateTimeFormat('sr-Latn-RS', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Belgrade',
    localeMatcher: "lookup"
  }).format(datumValue);
  
  //const trajanjeValue = izabraneUsluge.usluge.name;
  const odabraneUsluge = izabraneUsluge.usluge
  //console.log('korisnik je odabrao:', odabraneUsluge)
  // const opisUsluge = izabraneUsluge.opis;
  // console.log('opis:', opisUsluge)


//   let ukupnoTrajanje = 0;
//   const imeSvihUsluga = [];

//   for (const [usluga, trajanje] of Object.entries(izabraneUsluge.usluge)) {
//   ukupnoTrajanje += parseInt(trajanje);
//   imeSvihUsluga.push(usluga);
// }
// // for (const trajanje of Object.values(izabraneUsluge.usluge)) {
// //   ukupnoTrajanje += parseInt(trajanje);
// // }
//   console.log('ukupno', ukupnoTrajanje);
//   console.log('imenasu', imeSvihUsluga);

//   const formatiranaImenaUsluga = imeSvihUsluga.join(", "); // Razmak izmedju imena usluga
//   console.log('formatirana imena usluga:', formatiranaImenaUsluga);

  const usluge = izabraneUsluge.usluge || {};
  let ukupnoTrajanje = 0;
  const imeSvihUsluga = [];
  for (const [usluga, trajanje] of Object.entries(usluge)) {
    ukupnoTrajanje += parseInt(trajanje);
    imeSvihUsluga.push(`${usluga} (${trajanje} min)`);
  }
  
  

  const handleZakazi = async () => {
    history.push('/PocetnaStrana')
    try
    { 
      const god = izabraneUsluge.datum.getFullYear();
      const mes = izabraneUsluge.datum.getMonth() + 1;
      const dan = izabraneUsluge.datum.getDate();
      const datum = `${god}.${mes}.${dan}`
      const docRef = await addDoc
      (collection
        (db, "zakazivanje"), 
      {
        izabraneUsluge, imeKorisnika, brojKorisnika, datum
    });
  //   (collection
  //     (db, "messages"), 
  //   {
  //     body:`Postovani ${imeKorisnika}, vas termin je zakazan za ${formatiranDatum} kod frizera ${frizerValue}.`,
  //     from:"+17076570783",
  //     to:`${brojKorisnika}`
  // });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  
  }
};


    
return (
  <>
  <div className="barberpozadina">
      <img src={wallpaper3} className="barberwallpaper" alt="pozadina"/>
      </div>
  <div className="center-content">
    <div className="user-data-card">
      <div className="user-info">
        <p><b>Vaše ime:</b> {imeKorisnika}</p>
        <p><b>Vaš broj:</b> {brojKorisnika}</p>
      </div>
      <div className="vertical-line3"></div>
      <div className="service-info">
        <p><b>Usluge:</b> {imeSvihUsluga.join(", ")}</p>
        <p><b>Frizer:</b> {frizerValue}</p>
      </div>
      <div className="vertical-line3"></div>
      <div className="other-info">
        <p><b>Trajanje: </b>{ukupnoTrajanje}min</p>
        
        <p><b>Početak termina: </b>{pocetakTerminaValue}h</p>
        <p><b>Datum:</b> {formatiranDatum}</p>
      </div>
     
    </div>
    <button onClick={handleZakazi} className="dugmezazakazivanje">Zakaži</button>
    </div>
    <BackButton>Nazad</BackButton>
  </>
);
};

export default Detaljitermina;