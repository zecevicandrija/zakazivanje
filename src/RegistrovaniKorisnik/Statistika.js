import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseconfig";
import "./Statistika.css";
import { Select, TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

const Statistika = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [frizeriList, setFrizeriList] = useState([]);
  const [odabraniFrizer, setOdabraniFrizer] = useState("");
  const [ukupnaZarada, setUkupnaZarada] = useState(0);
  const [filterIme, setFilterIme] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        let q = collection(db, "zakazivanje");
  
        if (odabraniFrizer) {
          q = query(q, where("izabraneUsluge.frizer", "==", odabraniFrizer));
        }
  
        if (filterIme) {
          q = query(q, where("imeKorisnika", "==", filterIme));
        }
  
        if (startDate && endDate) {
          q = query(q, where("izabraneUsluge.datum", ">=", startDate), where("izabraneUsluge.datum", "<=", endDate));
        } else if (startDate) {
          q = query(q, where("izabraneUsluge.datum", ">=", startDate));
        } else if (endDate) {
          q = query(q, where("izabraneUsluge.datum", "<=", endDate));
        }
  
        const querySnapshot = await getDocs(q);
  
        const noviNiz = querySnapshot.docs.map((doc) => {
          const pocetniDatumValue = doc.data().izabraneUsluge.pocetakTermina.value;

  // Add these console.log statements to debug
  console.log('pocetniDatumValue:', pocetniDatumValue);
  console.log('typeof pocetniDatumValue:', typeof pocetniDatumValue);
          let pom = doc.data().izabraneUsluge.usluge;
          let uslugeString = "";
          let ukupnoMinuta = 0;
          Object.keys(pom).forEach((usluga) => {
            if (pom[usluga] !== false) {
              uslugeString = uslugeString + " " + usluga;
              ukupnoMinuta = ukupnoMinuta + Number(pom[usluga]);
            }
          });
  
          const datumTimestamp = doc.data().izabraneUsluge.datum;
          const seconds = datumTimestamp.seconds;
          const milliseconds = seconds * 1000;
          const pocetniDatum = new Date(milliseconds);
          let vreme = doc.data().izabraneUsluge.pocetakTermina.value.split(":");
          let sat = Number(vreme[0]);
          let min = Number(vreme[1]);
          pocetniDatum.setHours(sat, min);
          const krajnjiDatum = new Date(pocetniDatum);
          krajnjiDatum.setMinutes(pocetniDatum.getMinutes() + ukupnoMinuta);
  
          return {
            title: `Korisnik: ${doc.data().imeKorisnika}, telefon: ${doc.data().brojKorisnika}, narucene usluge ${uslugeString}, Trener: ${doc.data().izabraneUsluge.frizer} `,
            start: pocetniDatum,
            end: krajnjiDatum,
            minuti: ukupnoMinuta,
            id: doc.id,
            imeKorisnika: doc.data().imeKorisnika,
            brojKorisnika: doc.data().brojKorisnika,
            frizer: doc.data().izabraneUsluge.frizer,
            usluge: uslugeString,
            cena: doc.data().izabraneUsluge.cena,
          };
        });
  
        const novaUkupnaZarada = noviNiz.reduce(
          (total, item) => +total + +item.cena,
          0
        );
  
        setMyEvents(noviNiz);
        setUkupnaZarada(novaUkupnaZarada);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
  
      const frizeriQuerySnapshot = await getDocs(collection(db, "frizeri"));
      const frizeriData = frizeriQuerySnapshot.docs.map(
        (doc) => doc.data().frizer.ime
      );
      setFrizeriList(frizeriData);
    }
  
    fetchData();
  }, [odabraniFrizer, filterIme, startDate, endDate]);
  
  const filterHandler = (event) => {
    setFilterIme(event.target.value);
  };

  const handleStartDateChange = (date) => {
    console.log("handleStartDateChange:", date);
    setStartDate(new Date(date));  // Pretvori string u objekat datuma
  };

  const handleEndDateChange = (date) => {
    console.log("handleEndDateChange:", date);
    setEndDate(new Date(date));  // Pretvori string u objekat datuma
  };

  const totalItems = myEvents.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = myEvents.slice(indexOfFirstItem, indexOfLastItem);

  const renderPaginationButtons = () => {
    const pageButtons = [];

    for (let i = 1; i <= totalPages; i++) {
      pageButtons.push(
        <li
          key={i}
          className={`page-item ${currentPage === i ? "active" : ""}`}
        >
          <button className="page-link" onClick={() => setCurrentPage(i)}>
            {i}
          </button>
        </li>
      );
    }

    return pageButtons;
  };

  return (
    <div className="statistika">
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={odabraniFrizer}
      label="Frizer"
      onChange={(event) => setOdabraniFrizer(event.target.value)}
    >
      <MenuItem key="all" value="">
        Svi treneri
      </MenuItem>
      {frizeriList.map((frizerItem) => (
        <MenuItem key={frizerItem} value={frizerItem}>
          {frizerItem}
        </MenuItem>
      ))}
    </Select>
    <div className="MuiTextField-root">
      <TextField
        value={filterIme}
        onChange={filterHandler}
        label="Filtriraj po imenu klijenta"
        variant="outlined"
      />
    </div>
    <div className="MuiTextField-root">
      <TextField
        label="Start Date"
        type="date"
        onChange={(event) => handleStartDateChange(event.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </div>
    <div className="MuiTextField-root">
      <TextField
        label="End Date"
        type="date"
        onChange={(event) => handleEndDateChange(event.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </div>
      <div className="calendar">
        <table className="event-table">
          <thead>
            <tr>
              <th>Ime klijenta</th>
              <th>Broj klijenta</th>
              <th>Naručene usluge</th>
              <th>Datum</th>
              <th>Sati</th>
              <th>Trener</th>
              <th>Cena</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => {
              if (
                (!startDate || item.start >= startDate) &&
                (!endDate || item.start <= endDate)
              ) {
                return (
                  <tr key={index}>
                    <td>{item.imeKorisnika}</td>
                    <td>{item.brojKorisnika}</td>
                    <td>{item.usluge}</td>
                    <td>{item.start.toLocaleDateString()}</td>
                    <td>{item.start.toLocaleTimeString()}</td>
                    <td>{item.frizer}</td>
                    <td>{item.cena}</td>
                  </tr>
                );
              } else {
                return null;
              }
            })}
          </tbody>
        </table>

        <nav>
          <ul className="pagination">{renderPaginationButtons()}</ul>
        </nav>

        <div>
          <b>Ukupna zarada: {ukupnaZarada}</b>
        </div>

      </div>
    </div>
  );
};

export default Statistika;