import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import "./VrsteUsluga.css";
import Button from "@mui/material/Button";
import { db } from "../firebase/firebaseconfig";
import "../RegistrovaniKorisnik/ErrorModal.css";
import { collection, getDocs, query } from "firebase/firestore";
import BackButton from "./Dugmenazad";

const VrsteUsluga = ({ isLoggedIn }) => {
  const history = useHistory();
  const location = useLocation();
  const frizeriradnovreme = location.state;
  const { frizer, krajRadnogVremena, pocetakRadnogVremena, korak, radnoVreme } = frizeriradnovreme;
  const [fbUsluge, setFbUsluge] = useState([]);
  const [usluge, setUsluge] = useState({});
  const [jeUslugaOdabrana, setJeUslugaOdabrana] = useState(false);
  const [cena, setCena] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const q = query(collection(db, "usluge"));
      const querySnapshot = await getDocs(q);
      let uslugesafirenbase = [];
      querySnapshot.forEach((doc) => {
        let obj = { ...doc.data(), id: doc.id };
        uslugesafirenbase.push(obj);
      });
      setFbUsluge(uslugesafirenbase);
    }
    fetchData();
  }, [frizer]);

  const slanjeuslugebaziHandler = async () => {
    const objzaslanje = {};
    for (const [key, obj] of Object.entries(usluge)) {
      objzaslanje[obj.naziv] = obj.trajanje;
    }
    history.push("/Zakazitermin", { 
      usluge: objzaslanje, 
      krajRadnogVremena, 
      pocetakRadnogVremena, 
      korak, 
      radnoVreme, 
      frizer, 
      cena 
    });
  };

  // Handler za promenu checkboxa (ostaje radi pristupačnosti)
  const izabraneUslugeHandler = (event, item) => {
    const category = event.target.name;
    const dataIme = event.target.getAttribute("data-ime");
    setUsluge((prev) => {
      const updated = { ...prev };
      if (event.target.checked) {
        updated[category] = { naziv: dataIme, trajanje: event.target.value, cena: item.cena };
      } else {
        delete updated[category];
      }
      return updated;
    });
  };

  // useEffect za preračunavanje cene i postavljanje zastavice
  useEffect(() => {
    const totalCena = Object.values(usluge).reduce((sum, service) => sum + Number(service.cena), 0);
    setCena(totalCena);
    setJeUslugaOdabrana(Object.keys(usluge).length > 0);
  }, [usluge]);

  // Handler koji omogućava selekciju/deselekciju klikom na celu karticu
  const handleCardClick = (item) => {
    const category = item.vrtsaUsluge;
    setUsluge((prev) => {
      const updated = { ...prev };
      if (updated[category] && updated[category].naziv === item.name) {
        delete updated[category];
      } else {
        updated[category] = { naziv: item.name, trajanje: item.trajanje, cena: item.cena };
      }
      return updated;
    });
  };

  return (
    <div>
      <div className="uslugecentar">
        <h1 className="usluge">Usluge</h1>
      </div>
      <div className="pazljivocentar">
        <div className="pazljivo">
          Pažljivo pročitajte opis usluga pre odabira i prelaska na naredni korak. Možete izabrati jednu ili više usluga.
        </div>
      </div>

      <div className="centriranje23">
        {fbUsluge.filter((item) => item.frizer === frizer).map((item) => {
          const isChecked = usluge[item.vrtsaUsluge] && usluge[item.vrtsaUsluge].naziv === item.name;
          return (
            <div
              key={item.id}
              className={`card23 ${isChecked ? "card23-checked" : ""}`}
              onClick={() => handleCardClick(item)}
              style={{ cursor: "pointer" }}
            >
              <div className="blob"></div>
              <div className="bg">
                {/* Leva kolona */}
                <div className="left">
                  <div className="service-image">
                    <img src={item.slika} alt={item.name} />
                  </div>
                </div>
                {/* Desna kolona */}
                <div className="right">
                  <h3 className="ime-usluge">{item.name}</h3>
                  <div className="vrednost-usluge">
                    <p>{item.trajanje}min</p>
                    <p>{item.cena}rsd</p>
                  </div>
                  <p className="opis-usluge">{item.opis}</p>
                  <div className="interactive-elements">
                    <label>
                      <input
                        data-ime={item.name}
                        type="checkbox"
                        name={item.vrtsaUsluge}
                        id={item.id}
                        value={item.trajanje}
                        onChange={(event) => izabraneUslugeHandler(event, item)}
                        checked={isChecked}
                        className="cekbox"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="kraj">
        {jeUslugaOdabrana && (
          <button className="zakazitermin" onClick={slanjeuslugebaziHandler}>
            Zakaži termin
          </button>
        )}
      </div>
      <div className="nazadcontainer">
        <BackButton>Nazad</BackButton>
      </div>
    </div>
  );
};

export default VrsteUsluga;
