import { useState } from "react";
import { Link } from "react-router-dom";
import "./Vrsteusluga.css";

const VrsteUsluga = () => {
  const [fejdmakazamaChecked, setFejdmakazamaChecked] = useState(false);
  const [fejdmasinicomChecked, setFejdmasinicomChecked] = useState(false);
  const [decijeChecked, setDecijeChecked] = useState(false);
  const [brijanjeglaveChecked, setBrijanjeglaveChecked] = useState(false);
  const [sredjivanjebradeChecked, setSredjivanjebrade] = useState(false);

  const fejdMakazamaHandler = (event) => {
    setFejdmakazamaChecked(event.target.checked);
    console.log(fejdmakazamaChecked);
  };
  const fejdMasinciomHandler = (event) => {
    setFejdmasinicomChecked(event.target.checked);
    console.log("izabran fejd");
  };
  const decijeSisanjeHandler = (event) => {
    setDecijeChecked(event.target.checked);
    console.log(decijeChecked);
  };
  const brijanjeGlaveHandler = (event) => {
    setBrijanjeglaveChecked(event.target.checked);
    console.log(brijanjeglaveChecked);
  };
  const sredjivanjebradeHandler = (event) => {
    setSredjivanjebrade(event.target.checked);
    console.log(sredjivanjebradeChecked);
  };
  
  return (
    <>
      <div>Izaberi uslugu: </div>
      
      <div className="proizvod-kontejner ">
        
        <div className="proizvod-kartica">
        
          <div>
          <Link to={"/Fejdmakazama"}>
            <img
              src="https://cdn.shopify.com/s/files/1/0066/3070/3140/articles/25_curly_bald_fade_gfn46c.jpg?v=1551635922"
              alt="React Image"
            />
            </Link>
          </div>
          <div>
            Fejd makazama
          </div>
          <label>
            oznaci{" "}
            <input
              type="checkbox"
              checked={fejdmakazamaChecked}
              onChange={fejdMakazamaHandler}
            />
          </label>
          
        </div>
       
        
        <div className="proizvod-kartica">
          <div>
          <Link to={"Fejdmasinicom"}>
            <img
              src="https://i.pinimg.com/originals/2f/2b/07/2f2b0791cd5420ee0b66624343fcd75e.jpg"
              alt="React Image"
            />
             </Link>
          </div>
          <div>Fejd masinicom</div>
          <label>
            oznaci{" "}
            <input
              type="checkbox"
              checked={fejdmasinicomChecked}
              onChange={fejdMasinciomHandler}
            />
          </label>
        </div>
       
        
        <div className="proizvod-kartica">
          <div>
          <Link to={"Decijesisanje"}>
            <img
              src="data:image/jpeg;base64,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"
              alt="React Image"
            />
            </Link>
          </div>
          <div> Decije sisanje</div>
          <label>
            oznaci{" "}
            <input
              type="checkbox"
              checked={decijeChecked}
              onChange={decijeSisanjeHandler}
            />
          </label>
        </div>
        
        
        <div className="proizvod-kartica">
        
          <div>
          <Link to={"/Brijanjeglave"}>
            <img
              src="data:image/jpeg;base64,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"
              alt="React Image"
            />
            </Link>
            <div> Brijanje glave</div>
          </div>
          <label>
            oznaci
            <input
              type="checkbox"
              checked={brijanjeglaveChecked}
              onChange={brijanjeGlaveHandler}
            />
          </label>
        </div>
        
       
        <div className="proizvod-kartica">
          <div>
          <Link to={"/Sredjivanjebrade"}>
            <img
              src="https://www.menshairstyletrends.com/wp-content/uploads/2017/06/eddie_rtb-short-beard-shape-with-buzz-fade.jpg"
              alt="React Image"
            />
            </Link>
          </div>
          <div>Sredjivanje brade</div>
          <label>
            oznaci{" "}
            <input
              type="checkbox"
              checked={sredjivanjebradeChecked}
              onChange={sredjivanjebradeHandler}
            />
          </label>
        </div>
        
        <div >
          <Link to={"/Zakazitermin"} className="yellow-button ">Zakazi termin</Link>
        </div>
        
      </div>
    </>
  );
};
export default VrsteUsluga;
