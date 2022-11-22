import Image from "next/image";
import Navigation from "./Navigation";
import SwitchOnOff from "./SwitchOnOff";

const Header = () => {
  return (
    <header className="header">
      <div className="switch-container">
        <span>Admin</span>
        <SwitchOnOff />
      </div>
      <Image src={"/assets/img/logo-club.png"} width={120} height={30} alt="logo du club" className="img-logo"/>
      <button className="btn-logout">
        <i className="fa-solid fa-right-from-bracket img-logout"></i>
      </button>
    </header>
  )
}

export default Header