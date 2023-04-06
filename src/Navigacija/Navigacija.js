import { Link } from "react-router-dom";
import "./Navigacija.css";

const Navigacija = () => {
  return (
    <>
      <div className="navbar">
        <Link to={"/Onama"}>O nama</Link>
        <Link to={"/VrsteUsluga"}>Vrste usluga</Link>
        <Link className="yellow-button " to={"/Login"}>Login</Link>
        
      </div>
    </>
  );
};
export default Navigacija;
