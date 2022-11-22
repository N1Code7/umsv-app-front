import Image from "next/image";
import { imgPath } from "../../config";
import Navigation from "./Navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Header = () => {
  return (
    <header className="header">
      <Image src={"/assets/img/logo-club.png"} width={120} height={30} alt="logo du club" className="img-logo"/>
      <Image src="/assets/img/logout.svg" width={30} height={30} alt="logout icon" className="img-logout"/>
      <Navigation />
    </header>
  )
}

export default Header