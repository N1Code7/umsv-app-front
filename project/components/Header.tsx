import Image from "next/image";
import { Dispatch, SetStateAction, useContext } from "react";
import Logout from "./Logout";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import Switch from "./Switch";

interface IHeaderProps {
  toggleDisplayNavigation?: () => void;
  isAdminConnected?: boolean;
  setIsAdminConnected?: Dispatch<SetStateAction<boolean>>;
}

const Header = ({
  isAdminConnected,
  setIsAdminConnected,
  toggleDisplayNavigation,
}: IHeaderProps) => {
  const { user, auth } = useContext(AuthenticationContext);

  return (
    <header className="header">
      {auth?.isAuthenticated ? (
        <>
          {user?.roles?.includes("ROLE_ADMIN") || user?.roles?.includes("ROLE_SUPERADMIN") ? (
            <div className="switch-container">
              <span>Admin</span>
              <Switch
                customName="admin"
                isActive={isAdminConnected}
                setIsActive={setIsAdminConnected}
              />
              {/* <AdminSwitch /> */}
            </div>
          ) : (
            <div className="member-role">
              <span>🐅</span>
              {/* <span>Espace</span>
              <span>utilisateur</span> */}
            </div>
          )}
          <button
            className="btn btn-primary btn-menu"
            id="menuBtn"
            onClick={toggleDisplayNavigation}
          >
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
