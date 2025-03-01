import { Calendar as MyCalendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { useEffect, useState, useCallback } from "react";
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { Select } from "@mui/material";
import { db } from "../firebase/firebaseconfig";
import "./Registrovanikorisnik.css";

const localizer = momentLocalizer(moment);

const Registrovanikorisnik = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [frizeriList, setFrizeriList] = useState([]);
  const [frizer, setFrizer] = useState("");
  const [view, setView] = useState("month");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  // Handle device resize for responsive design
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Set default view based on device
  useEffect(() => {
    setView(isMobile ? "agenda" : "month");
  }, [isMobile]);

  // Fetch data from Firestore with memoization
  const fetchData = useCallback(async () => {
    try {
      // Fetch list of frizeri
      const frizeriSnapshot = await getDocs(collection(db, "frizeri"));
      const frizeriData = frizeriSnapshot.docs.map((doc) => doc.data().frizer.ime);
      setFrizeriList(frizeriData);

      // Set query constraints
      const currentDate = new Date();
      const beginningOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
      let q = collection(db, "zakazivanje");

      if (frizer) {
        q = query(q, where("izabraneUsluge.frizer", "==", frizer));
      }
      q = query(q, where("izabraneUsluge.datum", ">=", beginningOfDay));

      // Fetch appointments
      const querySnapshot = await getDocs(q);
      const events = querySnapshot.docs
        .map((doc) => {
          const data = { ...doc.data(), id: doc.id };
          if (!data.izabraneUsluge || !data.izabraneUsluge.usluge) return null;

          const services = data.izabraneUsluge.usluge;
          let uslugeString = "";
          let totalMinutes = 0;

          Object.entries(services).forEach(([service, duration]) => {
            if (duration !== false) {
              uslugeString += ` ${service}`;
              totalMinutes += Number(duration);
            }
          });

          const [hour, minute] = data.izabraneUsluge.pocetakTermina.value.split(":").map(Number);
          const startDate = data.izabraneUsluge.datum.toDate();
          startDate.setHours(hour, minute, 0, 0);
          const endDate = new Date(startDate.getTime() + totalMinutes * 60000);
          const formattedStartTime = startDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          return {
            title: `${data.imeKorisnika}, ${data.brojKorisnika}`,
            fullTitle: `Korisnik: ${data.imeKorisnika}, telefon: ${data.brojKorisnika}, usluge: ${uslugeString.trim()}, frizer: ${data.izabraneUsluge.frizer}`,
            start: startDate,
            end: endDate,
            minuti: totalMinutes,
            id: data.id,
            frizer: data.izabraneUsluge.frizer,
            imeKorisnika: data.imeKorisnika,
            vreme: formattedStartTime,
            usluge: uslugeString.trim(),
          };
        })
        .filter((event) => event !== null);

      setMyEvents(events);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [frizer]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSelect = ({ start, end }) => {
    // Placeholder for adding new appointments if needed
  };

  const handleDeleting = async () => {
    if (!eventToDelete || !eventToDelete.id) return;
    try {
      await deleteDoc(doc(db, "zakazivanje", eventToDelete.id));
      setMyEvents((prev) => prev.filter((ev) => ev.id !== eventToDelete.id));
    } catch (error) {
      console.error("Error deleting document:", error);
    }
    setShowModal(false);
    setEventToDelete(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEventToDelete(null);
  };

  const rejectEvent = (event) => {
    setEventToDelete(event);
    setShowModal(true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setShowCopySuccess(true);
        setTimeout(() => setShowCopySuccess(false), 2000);
      })
      .catch((error) => console.error("Error copying to clipboard:", error));
  };

  const handleClickCopy = (event) => {
    const textToCopy = `Poštovani ${event.imeKorisnika}, danas u ${event.vreme} imate zakazan termin kod frizera ${event.frizer}`;
    copyToClipboard(textToCopy);
  };

  const EventComponent = ({ event }) => {
    if (!event) return null;

    if (isMobile) {
      return (
        <div className="event-mobile">
          <div>{event.title}</div>
          <div className="event-actions">
            <button
              className="calendar-button"
              onClick={(e) => {
                e.stopPropagation();
                handleClickCopy(event);
              }}
            >
              Kopiraj
            </button>
            <button
              className="calendar-button"
              onClick={(e) => {
                e.stopPropagation();
                rejectEvent(event);
              }}
            >
              Obriši
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="event-desktop">
        <div>{event.title}</div>
        <div>Frizer: {event.frizer}</div>
        <div className="event-usluge">{event.usluge}</div>
        <div className="event-actions">
          <button
            className="calendar-button"
            onClick={(e) => {
              e.stopPropagation();
              handleClickCopy(event);
            }}
          >
            Kopiraj
          </button>
          <button
            className="calendar-button"
            onClick={(e) => {
              e.stopPropagation();
              rejectEvent(event);
            }}
          >
            Obriši
          </button>
        </div>
      </div>
    );
  };
  const CustomAgendaTime = ({ event }) => {
    if (!event) return null;
    const startTime = moment(event.start).format("HH:mm");
    const endTime = moment(event.end).format("HH:mm");
    return (
      <div className="custom-agenda-time">
        <div>{startTime} - {endTime}</div>
        <div className="usluge">{event.usluge}</div>
      </div>
    );
  };
  const AgendaEventComponent = ({ event }) => {
    if (!event) return null;

    return (
      <div>
        <div>
          {event.title}
        </div>
        <div>Frizer: {event.frizer}</div>
        <div className="event-actions">
          <button
            className="calendar-button"
            onClick={(e) => {
              e.stopPropagation();
              handleClickCopy(event);
            }}
          >
            Kopiraj
          </button>
          <button
            className="calendar-button"
            onClick={(e) => {
              e.stopPropagation();
              rejectEvent(event);
            }}
          >
            Obriši
          </button>
        </div>
      </div>
    );
  };

  const getEventStyle = (event) => {
    if (!event) return {};

    const colors = {
      Ana: "#4285f4",
      Marko: "#34a853",
      Jelena: "#fbbc05",
      Nikola: "#ea4335",
      Ivana: "#9c27b0",
      Petar: "#009688",
      Milica: "#ff9800",
    };

    let style = { backgroundColor: "transparent" };

    if (event.frizer && colors[event.frizer]) {
      style.backgroundColor = colors[event.frizer];
    } else if (event.frizer) {
      const hash = Array.from(event.frizer).reduce(
        (acc, char) => char.charCodeAt(0) + ((acc << 5) - acc),
        0
      );
    }

    return { style };
  };

  return (
    <div className="bigcalendar">
      <div className="calendar-header">
        <div className="frizercontain">
        <FormControl className="frizer-select">
          <InputLabel id="frizer-select-label" style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}>Frizer</InputLabel>
          <Select
            labelId="frizer-select-label"
            id="frizer-select"
            value={frizer}
            label="Frizer"
            onChange={(e) => setFrizer(e.target.value)}
            style={{ fontFamily: '"Bai Jamjuree", sans-serif'}}
          >
            <MenuItem value="" style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}>Svi frizeri</MenuItem>
            {frizeriList.map((frizerItem) => (
              <MenuItem key={frizerItem} value={frizerItem} style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}>
                {frizerItem}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        </div>

       
      </div>

      {showCopySuccess && (
        <div className="copy-success-toast">Uspešno kopirano!</div>
      )}

      <div className="kalendarroditelj">
      <MyCalendar
          localizer={localizer}
          defaultDate={new Date()}
          events={myEvents}
          startAccessor="start"
          endAccessor="end"
          titleAccessor={(event) => event?.title || "Nema naslova"}
          style={{ height: isMobile ? 550 : 650 }}
          className="kalendar"
          onSelectSlot={handleSelect}
          view={view}
          onView={setView}
          messages={{
            agenda: 'Lista',
            day: 'Dan',
            month: 'Mesec',
            week: 'Nedelja',
            today: 'Danas',
            next: 'Sledeće',
            previous: 'Prethodno',
          }}
          components={{
            event: EventComponent,
            agenda: { event: AgendaEventComponent },
            time: CustomAgendaTime,
          }}
          eventPropGetter={getEventStyle}
          popup
          selectable
        />
      </div>

      <Modal show={showModal} onHide={handleCloseModal} className="modal">
        <Modal.Header closeButton>
          <Modal.Title>Upozorenje</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-question">
          {eventToDelete
            ? `Da li ste sigurni da želite da obrišete zakazan termin za korisnika ${eventToDelete.imeKorisnika}?`
            : "Da li ste sigurni da želite da obrišete zakazan termin?"}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseModal}
            className="modal-button modal-button-cancel"
          >
            Otkaži
          </Button>
          <Button
            variant="primary"
            onClick={handleDeleting}
            className="modal-button modal-button-delete"
          >
            Obriši
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Registrovanikorisnik;