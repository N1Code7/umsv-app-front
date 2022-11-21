import Image from "next/image";
import { imgPath } from "../../config";
import Navigation from "./Navigation";

const Header = () => {
  return (
    <header className="header">
      <div className="img-container">
        <Image src={"/assets/img/logo-club.png"} width={120} height={30} alt="logo du club" />
      </div>
      <Navigation />
    </header>
  )
}

export default Header