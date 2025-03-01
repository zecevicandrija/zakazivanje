import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseconfig";
import "./Statistika.css";
import { FormControl, InputLabel, Select, TextField } from "@mui/material";
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
          q = query(
            q,
            where("izabraneUsluge.datum", ">=", startDate),
            where("izabraneUsluge.datum", "<=", endDate)
          );
        } else if (startDate) {
          q = query(q, where("izabraneUsluge.datum", ">=", startDate));
        } else if (endDate) {
          q = query(q, where("izabraneUsluge.datum", "<=", endDate));
        }

        const querySnapshot = await getDocs(q);

        const noviNiz = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          // Ako nije definiran, koristimo podrazumevani "00:00"
          const pocetakTerminaValue =
            data.izabraneUsluge.pocetakTermina &&
            data.izabraneUsluge.pocetakTermina.value
              ? data.izabraneUsluge.pocetakTermina.value
              : "00:00";

          let pom = data.izabraneUsluge.usluge;
          let uslugeString = "";
          let ukupnoMinuta = 0;
          Object.keys(pom).forEach((usluga) => {
            if (pom[usluga] !== false) {
              uslugeString += " " + usluga;
              ukupnoMinuta += Number(pom[usluga]);
            }
          });

          const datumTimestamp = data.izabraneUsluge.datum;
          const seconds = datumTimestamp.seconds;
          const milliseconds = seconds * 1000;
          const pocetniDatum = new Date(milliseconds);
          let vreme = pocetakTerminaValue.split(":");
          let sat = Number(vreme[0]);
          let min = Number(vreme[1]);
          pocetniDatum.setHours(sat, min);
          const krajnjiDatum = new Date(pocetniDatum);
          krajnjiDatum.setMinutes(pocetniDatum.getMinutes() + ukupnoMinuta);

          return {
            title: `Korisnik: ${data.imeKorisnika}, telefon: ${data.brojKorisnika}, narucene usluge ${uslugeString}, Trener: ${data.izabraneUsluge.frizer}`,
            start: pocetniDatum,
            end: krajnjiDatum,
            minuti: ukupnoMinuta,
            id: doc.id,
            imeKorisnika: data.imeKorisnika,
            brojKorisnika: data.brojKorisnika,
            frizer: data.izabraneUsluge.frizer,
            usluge: uslugeString,
            // Ako nema polje cena, tretiramo kao 0
            cena: data.izabraneUsluge.cena ? Number(data.izabraneUsluge.cena) : 0,
          };
        });

        // Sortiramo termine tako da najnoviji (najveći datum) budu prvi
        noviNiz.sort((a, b) => b.start.getTime() - a.start.getTime());
        console.log("Sorted events:", noviNiz);

        const novaUkupnaZarada = noviNiz.reduce(
          (total, item) => total + (item.cena || 0),
          0
        );

        setMyEvents(noviNiz);
        setUkupnaZarada(novaUkupnaZarada);
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      // Dohvati listu frizera/trenera
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

  // Ako je unesena prazan string, postavi state na null
  const handleStartDateChange = (dateString) => {
    console.log("handleStartDateChange:", dateString);
    if (!dateString) {
      setStartDate(null);
    } else {
      setStartDate(new Date(dateString));
    }
  };

  const handleEndDateChange = (dateString) => {
    console.log("handleEndDateChange:", dateString);
    if (!dateString) {
      setEndDate(null);
    } else {
      setEndDate(new Date(dateString));
    }
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
        <li key={i} className={`page-item ${currentPage === i ? "active" : ""}`}>
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
      <div className="filters">
        <FormControl className="filter-select" variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel sx={{ fontFamily: "Bai Jamjuree, sans-serif" }}>Frizer</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={odabraniFrizer}
            label="Frizer"
            onChange={(event) => setOdabraniFrizer(event.target.value)}
          >
            <MenuItem key="all" value="" style={{ fontFamily: "Bai Jamjuree, sans-serif" }}>
              Svi frizeri
            </MenuItem>
            {frizeriList.map((frizerItem) => (
              <MenuItem key={frizerItem} value={frizerItem} style={{ fontFamily: "Bai Jamjuree, sans-serif" }}>
                {frizerItem}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <TextField
          value={filterIme}
          onChange={filterHandler}
          label="Filtriraj po imenu klijenta"
          variant="outlined"
          className="filter-textfield"
          InputLabelProps={{
            style: { fontFamily: "Bai Jamjuree, sans-serif" },
          }}
        />
        <TextField
          label="Start Date"
          type="date"
          onChange={(event) => handleStartDateChange(event.target.value)}
          InputLabelProps={{
            shrink: true,
            style: { fontFamily: "Bai Jamjuree, sans-serif" },
          }}
          className="filter-textfield"
        />
        <TextField
          label="End Date"
          type="date"
          onChange={(event) => handleEndDateChange(event.target.value)}
          InputLabelProps={{
            shrink: true,
            style: { fontFamily: "Bai Jamjuree, sans-serif" },
          }}
          className="filter-textfield"
        />
      </div>

      <div className="table-container">
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
      </div>

      <nav className="pagination-container">
        <ul className="pagination">{renderPaginationButtons()}</ul>
      </nav>

      <div className="total-earnings">
        <b>Ukupna zarada: {ukupnaZarada}</b>
      </div>
    </div>
  );
};

export default Statistika;
