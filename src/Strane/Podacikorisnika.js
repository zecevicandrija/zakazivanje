import { useState } from "react"
import { Link } from "react-router-dom"


const Podacikorisnika =()=>{
    const [imeKorisnika, setImeKorisnika]=useState("")
    const [brojKorisnika, setBrojKorisnika]=useState("")

    const imeKorisnikaHandler =(event)=>{
        setImeKorisnika(event.target.value)
    }
    const brojKorisnikaHandler =(event)=>{
        setBrojKorisnika(event.target.value)
    }
    
    console.log(imeKorisnika, brojKorisnika)
    return(
    <>
    <div>Ostavite nam Vaše kontakt podatke kako bismo potvrdili rezervaciju.</div>
    <div>Ime:</div>
    <input type="text" value={imeKorisnika} onChange={imeKorisnikaHandler}/>
    <div>Broj:</div>
    <input type="number" value={brojKorisnika} onChange={brojKorisnikaHandler}/>
    <Link  className="yellow-button" to="/PocetnaStrana"> Zavrsite</Link>
    </>
    )
}
export default Podacikorisnika