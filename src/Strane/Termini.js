import { useState } from "react";
  import "react-calendar/dist/Calendar.css";
  import { useLocation, useHistory } from "react-router-dom";
  import "./Termini.css";
  import { cloneDeep } from "lodash";

  import { collection, query, where, getDocs } from "firebase/firestore";
  import {  generisiOpcijePon,generisiOpcijeUto,generisiOpcijeSre,generisiOpcijeCet,generisiOpcijePet,generisiOpcijeSub,generisiOpcijeNed} from "./Pocetneopcije"; 
  import MyCalendar from "./Kalendar";
  import { db } from "../firebase/firebaseconfig";
  //import BackButton from "./Dugmenazad";
  import Modal from "react-bootstrap/Modal";
  import Button from "react-bootstrap/Button";

  

  const Termini = () => {
    const history = useHistory();
    const location = useLocation();
    const uslugeifrizer = location.state;
    const { usluge, frizer, radnoVreme, korak, cena } = uslugeifrizer;
  
    const [pocetakTermina, setPocetkaTermina] = useState(null);
    const [datum, setDatum] = useState(new Date());
    const [naseOpcije, setNaseOpcije] = useState([]);
    const [showModal, setShowModal] = useState(false); //modal za termine
  
    console.log(cena);
    console.log(usluge);
    // Pretpostavljamo da je naseOpcije niz termina koje Å¾elite prikazati
  
    // const trenutniTermini = naseOpcije.slice(indeksPrvogTermina, indeksPoslednjegTermina);
  
    // const prikaziSledecuStranicu = () => {
    //   postaviTrenutnuStranicu((prethodnaStranica) => prethodnaStranica + 1);
    // };
  
    // const prikaziPrethodnuStranicu = () => {
    //   postaviTrenutnuStranicu((prethodnaStranica) => prethodnaStranica - 1);
    // };
  
    const slanjeterminabazi = async (event) => {
      history.push("./Podacikorisnika", {
        pocetakTermina: {
          label: pocetakTermina,
          value: pocetakTermina,
          slobodan: true,
        },
        datum,
        usluge,
        frizer,
        cena,
      });
    };
  
    async function postaviDatum(event) {
      setDatum(event);
      let lokalneOpcije = cloneDeep(
        event.getDay() === 1
          ? generisiOpcijePon(
              radnoVreme.ponedeljak.pocetak,
              radnoVreme.ponedeljak.kraj,
              korak
            )
          : event.getDay() === 2
          ? generisiOpcijeUto(
              radnoVreme.utorak.pocetak,
              radnoVreme.utorak.kraj,
              korak
            )
          : event.getDay() === 3
          ? generisiOpcijeSre(
              radnoVreme.sreda.pocetak,
              radnoVreme.sreda.kraj,
              korak
            )
          : event.getDay() === 4
          ? generisiOpcijeCet(
              radnoVreme.cetvrtak.pocetak,
              radnoVreme.cetvrtak.kraj,
              korak
            )
          : event.getDay() === 5
          ? generisiOpcijePet(
              radnoVreme.petak.pocetak,
              radnoVreme.petak.kraj,
              korak
            )
          : event.getDay() === 6
          ? generisiOpcijeSub(
              radnoVreme.subota.pocetak,
              radnoVreme.subota.kraj,
              korak
            )
          : event.getDay() === 0
          ? generisiOpcijeNed(
              radnoVreme.nedelja.pocetak,
              radnoVreme.nedelja.kraj,
              korak
            )
          : console.log("izaberite datum")
      );
  
      //datum koji nam je dao kalendar
  
      //upit ka firestoru da nam da usluge za izabrani datum
      const q = query(
        collection(db, "zakazivanje"),
        where("izabraneUsluge.datum", "==", event),
        where("izabraneUsluge.frizer", "==", frizer)
      );
  
      const querySnapshot = await getDocs(q);
  
      lokalneOpcije.forEach((opcija) => {
        opcija.slobodan = true;
      });
  
      querySnapshot.forEach((doc) => {
        let nasObjekat = doc.data();
        let pom = nasObjekat.izabraneUsluge.usluge;
        let ukupnoMinuta = 0;
  
        Object.keys(pom).forEach((item) => {
          if (pom[item] !== false) {
            ukupnoMinuta = ukupnoMinuta + Number(pom[item]);
          }
        });
  
        let pocetakTermina = nasObjekat.izabraneUsluge.pocetakTermina.value;
        if (typeof pocetakTermina === 'string') {
          let satMinut = pocetakTermina.split(":");
          let sat = +satMinut[0];
          let minuti = +satMinut[1];
          let pocetniDatum = new Date(0, 0, 0, sat, minuti);
          let krajnjiDatum = new Date(0, 0, 0, sat, minuti + ukupnoMinuta);
  
          lokalneOpcije = lokalneOpcije.map((item) => {
            if (item.vreme >= pocetniDatum && item.vreme < krajnjiDatum) {
              return { ...item, slobodan: false };
            }
            return item;
          });
        }
        
          else if (typeof pocetakTermina === 'object' && pocetakTermina !== null && 'value' in pocetakTermina) {
            let satMinut = pocetakTermina.value.split(":");
            let sat = +satMinut[0];
          let minuti = +satMinut[1];
          let pocetniDatum = new Date(0, 0, 0, sat, minuti);
          let krajnjiDatum = new Date(0, 0, 0, sat, minuti + ukupnoMinuta);
  
          lokalneOpcije = lokalneOpcije.map((item) => {
            if (item.vreme >= pocetniDatum && item.vreme < krajnjiDatum) {
              return { ...item, slobodan: false };
            }
            return item;
          });
        }
        else {
          console.error("pocetakTermina nije validan:", pocetakTermina);
        }
      });
  
      let trajanjeMojeUsluge = 0;
      Object.keys(usluge).forEach((item) => {
        if (usluge[item] !== false) {
          trajanjeMojeUsluge = trajanjeMojeUsluge + Number(usluge[item]);
        }
      });
  
      let brojKoraka = Math.ceil(trajanjeMojeUsluge / korak);
  
      let nasNiz = cloneDeep(lokalneOpcije);
      console.log(lokalneOpcije);
      nasNiz.forEach((opcija, indeks) => {
        let ostaje = true;
        for (let i = indeks; i < indeks + brojKoraka; i++) {
          if (nasNiz[i] === undefined || nasNiz[i].slobodan === false) {
            ostaje = false;
          }
        }
        opcija.slobodan = ostaje;
      });
  
      setNaseOpcije(lokalneOpcije.filter((opcija) => opcija.slobodan === true));
      console.log(naseOpcije);
      console.log(lokalneOpcije);
    }
  
    const handleCloseModal = () => {
      setShowModal(false);
    };
  
    const handleKlikDugmeta = (item) => {
      setPocetkaTermina(item.value);
      setShowModal(true);
      console.log(item.value);
    };
    console.log(naseOpcije);
    console.log(pocetakTermina);

return (
  <>
   {/* <div className="terminipozadina">
      <img src={pozadina5} className="terminipozadina2" alt="pozadina"/>
      </div> */}
    <div className="big-container">
<div className="small-container">
        <h1 className="terminitekst">Termini:</h1>
        <p className="terminipritisnite">Pritisnite na dugme termina koji želite odabrati.</p>
        
        <MyCalendar onPostavi={postaviDatum} mojDatum={datum} className="calendar" locale="en-EN" />
        {/* <button
          className="link"
          to="/Podacikorisnika"
          onClick={slanjeterminabazi}
          disabled={pocetakTermina === null}
        >
          Dalje
        </button>
<BackButton>Nazad</BackButton> */}
      </div>
      <div className="small-container">
        <div className="buttons-container">
          {naseOpcije.length === 0 && <p>Nema slobodnih termina</p>}
          {naseOpcije.map((item, index) => (
            <div className="flex-item" key={index}>
              <hr className="linija"></hr>
              <button className="button-option" 
              onClick={() => {
                //setPocetkaTermina(item);
                handleKlikDugmeta(item);
            }} 
               >
                {item.label}
              </button>
            </div>
          ))}
        </div>
        {showModal && (
  <div className="modal-overlay123" onClick={handleCloseModal}>
    <Modal
      show={showModal}
      onHide={handleCloseModal}
      className="modal123"
      // Sprečava propagaciju klika na modalu, tako da se klik unutar modala ne prenosi na overlay
      onClick={(e) => e.stopPropagation()}
    >
      <Modal.Header>
        <Modal.Title>Pritisnite 'Dalje' ako ste odabrali zeljeni termin.</Modal.Title>
      </Modal.Header>
      <div className="vertical-line3"></div>
      <Modal.Body className="modal-question-termini">
        Termin: <b>{pocetakTermina}h</b>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleCloseModal}
          className="modal-button-promeni"
        >
          Promeni
        </Button>
        <Button
          variant="primary"
          onClick={slanjeterminabazi}
          className="modal-button-dalje"
          to="/Podacikorisnika"
        >
          Dalje
        </Button>
      </Modal.Footer>
    </Modal>
  </div>
)}

      </div>
    </div>
  </>
);
};

export default Termini;