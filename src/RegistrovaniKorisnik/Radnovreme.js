import React, { useState, useEffect } from "react";
import { Select, MenuItem, Button, Slider } from "@mui/material";
import { db } from "../firebase/firebaseconfig";
import "./Radnovreme.css";
import {
  getDocs,
  collection,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";

const RadnoVreme = () => {
  const [frizer, setFrizer] = useState("");
  const [workHours, setWorkHours] = useState({
    ponedeljak: { pocetak: "", kraj: "" },
    utorak: { pocetak: "", kraj: "" },
    sreda: { pocetak: "", kraj: "" },
    cetvrtak: { pocetak: "", kraj: "" },
    petak: { pocetak: "", kraj: "" },
    subota: { pocetak: "", kraj: "" },
    nedelja: { pocetak: "", kraj: "" },
  });
  const [sliderValue, setSliderValue] = useState(15);
  const [frizeriList, setFrizeriList] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const frizeriQuerySnapshot = await getDocs(collection(db, "frizeri"));

      let frizeriData = [];
      frizeriQuerySnapshot.forEach((doc) => {
        let obj = { ...doc.data(), id: doc.id };
        frizeriData.push(obj);
      });

      setFrizeriList(frizeriData);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const odabraniFrizer = frizeriList.find(
      (frizerItem) => frizerItem.ime === frizer
    );
  
    if (odabraniFrizer) {
      setWorkHours(odabraniFrizer.frizer.radnoVreme || {});
    } else {
      setWorkHours({
        ponedeljak: { pocetak: "", kraj: "", neradan: false },
        utorak: { pocetak: "", kraj: "", neradan: false },
        sreda: { pocetak: "", kraj: "", neradan: false },
        cetvrtak: { pocetak: "", kraj: "", neradan: false },
        petak: { pocetak: "", kraj: "", neradan: false },
        subota: { pocetak: "", kraj: "", neradan: false },
        nedelja: { pocetak: "", kraj: "", neradan: false },
      });
    }
  }, [frizer, frizeriList]);

  const generateTimeOptions = (startHour, endHour) => {
    const options = [];
    for (let hour = startHour; hour <= endHour; hour++) {
      const formattedHour = hour.toString().padStart(2, "0");
      options.push(formattedHour);
    }
    return options;
  };

  const timeOptionsPocetak = generateTimeOptions(8, 20);
  const timeOptionsKraj = generateTimeOptions(8, 20);

  const handleNeradanChange = (event, day) => {
    const newWorkHours = { ...workHours };
    newWorkHours[day].neradan = event.target.checked;
    setWorkHours(newWorkHours);
  };

  const handleTimeChange = (event, day, type) => {
    // Kloniraj workHours kako bi se izbegle direktne promene
    const newWorkHours = { ...workHours };
  
    // Inicijalizuj objekat za određeni dan ako ne postoji
    if (!newWorkHours[day]) {
      newWorkHours[day] = { pocetak: "", kraj: "", neradan: false };
    }
  
    // Postavi određeni tip vremena (pocetak ili kraj) na novu vrednost
    newWorkHours[day][type] = event.target.value;
  
    // Ažuriraj stanje workHours
    setWorkHours(newWorkHours);
  };
  

  const handleSpremiRadnoVreme = async () => {
    try {
      const frizerQuerySnapshot = await getDocs(
        query(collection(db, "frizeri"), where("frizer.ime", "==", frizer))
      );
      if (frizerQuerySnapshot.docs.length === 0) {
        return;
      }

      const frizerDoc = frizerQuerySnapshot.docs[0];
      const frizerId = frizerDoc.id;

      await updateDoc(doc(db, "frizeri", frizerId), {
        "frizer.radnoVreme": workHours,
        "frizer.korak": sliderValue,
      });

      setFrizer("");
      setSliderValue(15);
    } catch (error) {
      console.error("Greška prilikom ažuriranja radnog vremena:", error);
    }
  };

  const handleFrizerChange = (event) => {
    setFrizer(event.target.value);
  };

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };

  return (
    <div className="radno-vreme-container">
      <h2>Radno Vreme</h2>
      <Select
        labelId="frizer-label"
        id="frizer-select"
        value={frizer}
        label="Frizer"
        onChange={handleFrizerChange}
        className="novi-frizer-input-radno2"
      >
        {frizeriList.map((frizerItem) => (
          <MenuItem key={frizerItem.frizer.id} value={frizerItem.frizer.ime}>
            {frizerItem.frizer.ime}
          </MenuItem>
        ))}
      </Select>

      {frizer ? (
        <div>
          {Object.keys(workHours).map((day) => (
  <div key={day} className="day-container">
    <div className="day-label">{day}</div>
    <input
      type="checkbox"
      checked={workHours[day].neradan}
      onChange={(event) => handleNeradanChange(event, day)}
      className="neradan-checkbox"
    />
    <label className="neradan-checkbox-label">
        (oznacite za neradan dan)
      </label>
    <Select
      value={(workHours[day] && workHours[day].pocetak) || ""}
      onChange={(event) => handleTimeChange(event, day, "pocetak")}
      label="Pocetak radnog vremena"
      variant="outlined"
      className="time-selector"
    >
      {timeOptionsPocetak.map((time) => (
        <MenuItem key={time} value={time}>
          {time}
        </MenuItem>
      ))}
    </Select>
    <Select
      value={(workHours[day] && workHours[day].kraj) || ""}
      onChange={(event) => handleTimeChange(event, day, "kraj")}
      label="Kraj radnog vremena"
      variant="outlined"
      className="time-selector"
    >
      {timeOptionsKraj.map((time) => (
        <MenuItem key={time} value={time}>
          {time}
        </MenuItem>
      ))}
    </Select>
  </div>
))}

<Slider
  aria-label="Temperature"
  defaultValue={sliderValue}
  value={sliderValue}
  onChange={handleSliderChange}
  step={5}
  marks
  min={5}
  max={60}
  className="slider-container"
/>
          <div>Trenutna vrednost slajdera: {sliderValue}</div>
          <Button variant="contained" onClick={handleSpremiRadnoVreme}>
            Spremi radno vreme
          </Button>
        </div>
      ) : (
        <div>
          <Button variant="contained">Napravi radno vreme</Button>
        </div>
      )}
<div className="table-responsive">
<table className="table table-bordered radno-vreme-table">
        <thead>
          <tr>
            <th>Frizer</th>
            <th>Korak</th>
            <th>Početak Pon</th>
            <th>Kraj Pon</th>
            <th>Početak Uto</th>
            <th>Kraj Uto</th>
            <th>Početak Sre</th>
            <th>Kraj Sre</th>
            <th>Početak Cet</th>
            <th>Kraj Cet</th>
            <th>Početak Pet</th>
            <th>Kraj Pet</th>
            <th>Početak Sub</th>
            <th>Kraj Sub</th>
            <th>Početak Ned</th>
            <th>Kraj Ned</th>
          </tr>
        </thead>
        <tbody>
          {frizeriList.map((frizerItem) => (
            <tr key={frizerItem.frizer.id}>
              <td><b>{frizerItem.frizer.ime}</b></td>
              <td>{frizerItem.frizer.korak || "Nije postavljeno"} korak</td>
              <td>
                {frizerItem.frizer.radnoVreme
                  ? frizerItem.frizer.radnoVreme.ponedeljak.pocetak || "Nije postavljeno"
                  : "Nije postavljeno"}h
              </td>
              <td>
                {frizerItem.frizer.radnoVreme
                  ? frizerItem.frizer.radnoVreme.ponedeljak.kraj || "Nije postavljeno"
                  : "Nije postavljeno"}h
              </td>
              <td>
                {frizerItem.frizer.radnoVreme
                  ? frizerItem.frizer.radnoVreme.utorak.pocetak || "Nije postavljeno"
                  : "Nije postavljeno"}h
              </td>
              <td>
                {frizerItem.frizer.radnoVreme
                  ? frizerItem.frizer.radnoVreme.utorak.kraj || "Nije postavljeno"
                  : "Nije postavljeno"}h
              </td>
              <td>
                {frizerItem.frizer.radnoVreme
                  ? frizerItem.frizer.radnoVreme.sreda.pocetak || "Nije postavljeno"
                  : "Nije postavljeno"}h
              </td>
              <td>
                {frizerItem.frizer.radnoVreme
                  ? frizerItem.frizer.radnoVreme.sreda.kraj || "Nije postavljeno"
                  : "Nije postavljeno"}h
              </td>
              <td>
                {frizerItem.frizer.radnoVreme
                  ? frizerItem.frizer.radnoVreme.cetvrtak.pocetak || "Nije postavljeno"
                  : "Nije postavljeno"}h
              </td>
              <td>
                {frizerItem.frizer.radnoVreme
                  ? frizerItem.frizer.radnoVreme.cetvrtak.kraj || "Nije postavljeno"
                  : "Nije postavljeno"}h
              </td>
              <td>
                {frizerItem.frizer.radnoVreme
                  ? frizerItem.frizer.radnoVreme.petak.pocetak || "Nije postavljeno"
                  : "Nije postavljeno"}h
              </td>
              <td>
                {frizerItem.frizer.radnoVreme
                  ? frizerItem.frizer.radnoVreme.petak.kraj || "Nije postavljeno"
                  : "Nije postavljeno"}h
              </td>
              <td>
                {frizerItem.frizer.radnoVreme
                  ? frizerItem.frizer.radnoVreme.subota.pocetak || "Nije postavljeno"
                  : "Nije postavljeno"}h
              </td>
              <td>
                {frizerItem.frizer.radnoVreme
                  ? frizerItem.frizer.radnoVreme.subota.kraj || "Nije postavljeno"
                  : "Nije postavljeno"}h
              </td>
              <td>
                {frizerItem.frizer.radnoVreme
                  ? frizerItem.frizer.radnoVreme.nedelja.pocetak || "Nije postavljeno"
                  : "Nije postavljeno"}h
              </td>
              <td>
                {frizerItem.frizer.radnoVreme
                  ? frizerItem.frizer.radnoVreme.nedelja.kraj || "Nije postavljeno"
                  : "Nije postavljeno"}h
              </td>
              
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default RadnoVreme;