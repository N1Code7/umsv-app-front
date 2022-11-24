import Image from "next/image";
import { useContext } from "react";
import { NavigationContext } from "../../contexts/NavigationContext";
import AdminSwitch from "./AdminSwitch";

const Header = () => {
  const { toggleDisplay } = useContext(NavigationContext)  

  return (
    <header className="header">
      <div className="switch-container">
        <span>Admin</span>
        <AdminSwitch />
      </div>
      {/* <Image src={"/assets/img/logo-club.png"} width={120} height={30} alt="logo du club" className="img-logo"/> */}
      <button className="btn btn-primary btn-menu" id="menuBtn" onClick={toggleDisplay}>Menu</button>
      <button className="btn-logout">

        <i className="fa-solid fa-right-from-bracket img-logout"></i>
      </button>
    </header>
  )
}

export default Header