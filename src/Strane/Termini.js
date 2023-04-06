//import Calendar from 'react-calendar'
import { useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import Kalendar from './Kalendar';
import Select from 'react-select';
import { Link } from 'react-router-dom';


 
const Termini =() =>{
    const [selektovanaOpcija, setSelektovanaOpicja] = useState(null);
    const Opcije =[
      {value: "9", label:"9"},
      {value: "9.25", label:"9.25"},
      {value: "9.50", label:"9.50"},
      {value: "10.15", label:"10.15"},
      {value: "10.40", label:"10.40"},
      {value: "11.05", label:"11.05"},
      {value: "11.30", label:"11.30"},
      {value: "11.55", label:"11.55"},
      {value: "12.20", label:"12.20"},
      {value: "12.45", label:"12.45"},
      {value: "13.10", label:"13.10"},
      {value: "13.35", label:"13.35"},
      {value:"14",labeL:"14"},
      {value:"14.25", label:"14.25"},
      {value:"14.50", label:"14.50"},
      {value:"15.15", label:"15.15"},
      {value:"15.40", label:"15.40"},
      {value:"16.05", label:"16.05"},
      {value:"16.30", label:"16.30"},
      {value:"16.55", label:"16.55"},
      {value:"17.20", label:"17.20"},
      {value:"17.45", label:"17.45"},
      {value:"18.10", label:"18.10"},
      {value:"18.35", label:"18.35"},
      {value:"19", label:"19"},
      
    ]
    console.log(selektovanaOpcija)
    return(
        <>
        <div>Termini:</div>
        <Kalendar/>
        <Select
  value={selektovanaOpcija}
  onChange={setSelektovanaOpicja}
  options={Opcije}
/>

<Link  className="yellow-button" to="/Podacikorisnika">Na stranu za Vase podatke</Link>
        </>
    )
}
export default Termini