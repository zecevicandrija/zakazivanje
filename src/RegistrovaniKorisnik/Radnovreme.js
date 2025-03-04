import React, { useState, useEffect } from "react";
import { 
  Select, 
  MenuItem, 
  Button, 
  Slider,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel
} from "@mui/material";
import { db } from "../firebase/firebaseconfig";
import {
  getDocs,
  collection,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import "./Radnovreme.css"; // Importujemo CSS
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';

const RadnoVreme = () => {
  const [frizer, setFrizer] = useState("");
  const [workHours, setWorkHours] = useState({
    ponedeljak: { pocetak: "", kraj: "", neradan: false },
    utorak: { pocetak: "", kraj: "", neradan: false },
    sreda: { pocetak: "", kraj: "", neradan: false },
    cetvrtak: { pocetak: "", kraj: "", neradan: false },
    petak: { pocetak: "", kraj: "", neradan: false },
    subota: { pocetak: "", kraj: "", neradan: false },
    nedelja: { pocetak: "", kraj: "", neradan: false },
  });
  const [sliderValue, setSliderValue] = useState(15);
  const [frizeriList, setFrizeriList] = useState([]);

  const daniPrevod = {
    ponedeljak: "Ponedeljak",
    utorak: "Utorak",
    sreda: "Sreda",
    cetvrtak: "Četvrtak",
    petak: "Petak",
    subota: "Subota",
    nedelja: "Nedelja",
  };

  const theme = createTheme({
    typography: {
      fontFamily: '"Bai Jamjuree", sans-serif',
    },
  });

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
      (frizerItem) => frizerItem.frizer?.ime === frizer
    );
  
    if (odabraniFrizer && odabraniFrizer.frizer?.radnoVreme) {
      setWorkHours(odabraniFrizer.frizer.radnoVreme);
      setSliderValue(odabraniFrizer.frizer.korak || 15);
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
      setSliderValue(15);
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
    if (!newWorkHours[day]) {
      newWorkHours[day] = { pocetak: "", kraj: "", neradan: false };
    }
    newWorkHours[day].neradan = event.target.checked;
    setWorkHours(newWorkHours);
  };

  const handleTimeChange = (event, day, type) => {
    const newWorkHours = { ...workHours };
  
    if (!newWorkHours[day]) {
      newWorkHours[day] = { pocetak: "", kraj: "", neradan: false };
    }
  
    newWorkHours[day][type] = event.target.value;
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

      // Obaveštenje o uspehu - može se implementirati sa Toast komponentom
      alert("Radno vreme uspešno sačuvano!");
    } catch (error) {
      console.error("Greška prilikom ažuriranja radnog vremena:", error);
      alert("Došlo je do greške prilikom čuvanja radnog vremena.");
    }
  };

  const handleFrizerChange = (event) => {
    setFrizer(event.target.value);
  };

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };

  // Helper za dobijanje statusa radnog vremena
  const getStatusClass = (radnoVreme) => {
    if (!radnoVreme || (!radnoVreme.pocetak && !radnoVreme.kraj)) {
      return "status-nije-postavljeno";
    }
    if (radnoVreme.neradan) {
      return "status-neradan";
    }
    return "status-radno-vreme";
  };

  return (
    <ThemeProvider theme={theme}>
    <div className="radno-vreme-container fade-in">
      <Paper elevation={3} sx={{ p: 3, mb: 4 }} className="section-card">
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Upravljanje radnim vremenom
        </Typography>

        <Box sx={{ mb: 4 }}>
          <FormControl fullWidth>
            <InputLabel id="frizer-label">Izaberite frizera</InputLabel>
            <Select
              labelId="frizer-label"
              id="frizer-select"
              value={frizer}
              label="Izaberite frizera"
              onChange={handleFrizerChange}
              sx={{ mb: 2 }}
            >
              {frizeriList.map((frizerItem) => (
                <MenuItem key={frizerItem.id} value={frizerItem.frizer?.ime}>
                  {frizerItem.frizer?.ime}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {frizer ? (
          <Card className="section-card">
            <CardHeader 
              title={`Radno vreme: ${frizer}`} 
              className="card-header-custom"
              sx={{ 
                bgcolor: 'primary.main', 
                color: 'primary.contrastText',
                pb: 1 
              }}
            />
            <CardContent>
              <Grid container spacing={3}>
                {Object.keys(daniPrevod).map((day) => (
                  <Grid item xs={12} sm={6} md={4} key={day}>
                    <Paper elevation={2} className="day-card" sx={{ p: 2 }}>
                      <Typography variant="h6" className="day-header">
                        {daniPrevod[day]}
                      </Typography>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={workHours[day]?.neradan || false}
                            onChange={(event) => handleNeradanChange(event, day)}
                            color="primary"
                            className="neradan-check"
                          />
                        }
                        label="Neradan dan"
                        className="neradan-label"
                        sx={{ mb: 1, display: 'block' }}
                      />
                      <div className="time-controls">
                        <FormControl 
                          fullWidth 
                          disabled={workHours[day]?.neradan}
                          size="small"
                          className="select-time"
                        >
                          <InputLabel>Od</InputLabel>
                          <Select
                            value={workHours[day]?.pocetak || ""}
                            onChange={(event) => handleTimeChange(event, day, "pocetak")}
                            label="Od"
                          >
                            {timeOptionsPocetak.map((time) => (
                              <MenuItem key={time} value={time}>
                                {time}:00
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl 
                          fullWidth 
                          disabled={workHours[day]?.neradan}
                          size="small"
                          className="select-time"
                        >
                          <InputLabel>Do</InputLabel>
                          <Select
                            value={workHours[day]?.kraj || ""}
                            onChange={(event) => handleTimeChange(event, day, "kraj")}
                            label="Do"
                          >
                            {timeOptionsKraj.map((time) => (
                              <MenuItem key={time} value={time}>
                                {time}:00
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ mt: 4, mb: 2 }} className="slider-container">
                <Typography gutterBottom>
                  Interval rezervacije (minuta):
                </Typography>
                <Slider
                  value={sliderValue}
                  onChange={handleSliderChange}
                  step={5}
                  marks
                  min={5}
                  max={60}
                  valueLabelDisplay="auto"
                />
                <Typography variant="body2" className="slider-value">
                  Trenutni interval: {sliderValue} minuta
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button 
                  variant="contained" 
                  onClick={handleSpremiRadnoVreme}
                  size="large"
                  className="save-button"
                >
                  Sačuvaj radno vreme
                </Button>
              </Box>
            </CardContent>
          </Card>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" gutterBottom>
              Izaberite frizera da biste postavili radno vreme
            </Typography>
          </Box>
        )}
      </Paper>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Pregled radnog vremena
      </Typography>
      <Paper sx={{ mt: 2, overflowX: 'auto' }} className="section-card">
        <TableContainer>
          <Table size="small" className="radno-vreme-table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Frizer</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Interval</TableCell>
                {Object.keys(daniPrevod).map(day => (
                  <TableCell key={day} sx={{ fontWeight: 'bold' }}>{daniPrevod[day]}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {frizeriList.map((frizerItem) => (
                <TableRow 
                  key={frizerItem.id} 
                  hover
                  className={frizerItem.frizer?.ime === frizer ? "active-hairdresser" : ""}
                >
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    {frizerItem.frizer?.ime}
                  </TableCell>
                  <TableCell>
                    {frizerItem.frizer?.korak || "15"} min
                  </TableCell>
                  {Object.keys(daniPrevod).map(day => {
                    const radnoVreme = frizerItem.frizer?.radnoVreme?.[day];
                    let displayText = "Nije postavljeno";
                    
                    if (radnoVreme) {
                      if (radnoVreme.neradan) {
                        displayText = "Neradan dan";
                      } else if (radnoVreme.pocetak && radnoVreme.kraj) {
                        displayText = `${radnoVreme.pocetak}-${radnoVreme.kraj}h`;
                      }
                    }
                    
                    return (
                      <TableCell 
                        key={`${frizerItem.id}-${day}`}
                        className={getStatusClass(radnoVreme)}
                      >
                        {displayText}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
    </ThemeProvider>
  );
};

export default RadnoVreme;