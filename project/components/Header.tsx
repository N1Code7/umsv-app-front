import Image from "next/image";
import { useContext } from "react";
import { NavigationContext } from "../../contexts/NavigationContext";
import AdminSwitch from "./AdminSwitch";
import Logout from "./Logout";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";

const Header = () => {
  const { toggleDisplay } = useContext(NavigationContext);
  const { isAuthenticated } = useContext(AuthenticationContext);

  return (
    <header className="header">
      <div className="switch-container">
        {isAuthenticated && (
          <>
            <span>Admin</span>
            <AdminSwitch />
          </>
        )}
      </div>
      {/* <Image src={"/assets/img/logo-club.png"} width={120} height={30} alt="logo du club" className="img-logo"/> */}
      <button className="btn btn-primary btn-menu" id="menuBtn" onClick={toggleDisplay}>
        Menu
      </button>
      {isAuthenticated && <Logout />}
    </header>
  );
};

export default Header;
