import { useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import "./Podacikorisnika.css";
import Button from '@mui/material/Button';
import BackButton from "./Dugmenazad";

const Podacikorisnika = () => {
  const history = useHistory();
  const location = useLocation();
  const izabraneUsluge = location.state;

  const [imeKorisnika, setImeKorisnika] = useState("");
  const [brojKorisnika, setBrojKorisnika] = useState("+3816");

  const slanjekorisnika = () => {
    history.push('/Detaljitermina', { izabraneUsluge, imeKorisnika, brojKorisnika});
  };

  const imeKorisnikaHandler = (event) => {
    setImeKorisnika(event.target.value);
  };

  const brojKorisnikaHandler = (event) => {
    const inputNumber = event.target.value.replace(/\D/g, ""); 
    setBrojKorisnika(inputNumber.startsWith("3816") ? `+${inputNumber}` : `+3816${inputNumber}`);
  };



  return (
    <>
      <div className="conteiner3">
        <p className="tekst3">Ostavite nam Vaše kontakt podatke kako bismo potvrdili rezervaciju.</p>
      </div>
      <div className="conteiner1">
        <div className="text-input-container">
          <p className="text1">Ime:</p>
          <input
            className="input1"
            type="text"
            value={imeKorisnika}
            onChange={imeKorisnikaHandler}
            placeholder="Vaše Ime"
          />
        </div>
        <div className="text-input-container">
          <p className="text2">Broj telefona:</p>
          <div className="input-container">
            <input
              className="input2"
              type="tel"
              value={brojKorisnika}
              onChange={brojKorisnikaHandler}
            />
           
          </div>
        </div>
      </div>
        <div className="podacikorisnikadugmad">
      {imeKorisnika !== "" && brojKorisnika !== "" && (
        <button className="zavrsite" onClick={slanjekorisnika} >Dalje</button>
      )}
      <BackButton className='podacidugmenazad'>Nazad</BackButton>
      </div>
    </>
  );
};

export default Podacikorisnika;