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
      {isAuthenticated ? (
        <>
          <div className="switch-container">
            <span>Admin</span>
            <AdminSwitch />
          </div>
          <button className="btn btn-primary btn-menu" id="menuBtn" onClick={toggleDisplay}>
            Menu
          </button>
          <Logout />
        </>
      ) : (
        <Image
          src={"/assets/img/logo-club.png"}
          width={window.innerWidth < 600 ? 120 : 100}
          height={window.innerWidth < 600 ? 45 : 35}
          alt="logo du club"
          className="img-logo"
        />
      )}
    </header>
  );
};

export default Header;
