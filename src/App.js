import Navigacija from "./Navigacija/Navigacija";
import Pocetna from "./Strane/Pocetna";
import Onama from "./Strane/Onama";
import Termini from "./Strane/Termini";
import VrsteUsluga from "./Strane/VrsteUsluga";
import { Redirect, Route, Switch } from "react-router-dom";
import Podacikorisnika from "./Strane/Podacikorisnika";
import Login from "./Registrovani Korisnik/Login";
import Fejdmakazama from "./Frizure/FejdMakazama";
import Fejdmasinicom from "./Frizure/Fejdmasinicom";
import Decijesisanje from "./Frizure/Decijesisanje";
import Brijanjeglave from "./Frizure/Brijanjeglave";
import Sredjivanjebrade from "./Frizure/Sredjivanjebrade";

function App() {
  return (
    <>
    <div> 
    
       <Navigacija />
      <Switch>
        <Route path="/PocetnaStrana" exact>
          <Pocetna />
        </Route>
        <Route path="/Onama" exact>
          <Onama />
        </Route>
        <Route path="/VrsteUsluga">
          <VrsteUsluga />
        </Route>
        <Route path="/Zakazitermin" exact>
          <Termini />
        </Route>
        <Route path="/Podacikorisnika">
          <Podacikorisnika />
        </Route>
        <Route path="/Login">
          <Login/>
        </Route>

        <Route path="/Fejdmakazama">
          <Fejdmakazama/>
        </Route>

        <Route path="/Fejdmasinicom">
          <Fejdmasinicom/>
        </Route>
        <Route path="/Decijesisanje">
          <Decijesisanje/>
        </Route>
        <Route path="/Brijanjeglave">
          <Brijanjeglave/>
        </Route>

        <Route path="/Sredjivanjebrade">
          <Sredjivanjebrade/>
        </Route>

        <Route path="/">
          <Redirect to="/PocetnaStrana" />
        </Route>
        
      </Switch>
      </div> 
    </>
  );
}

export default App;
