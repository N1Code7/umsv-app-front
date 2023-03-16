import Image from "next/image";
import { Dispatch, MouseEvent, SetStateAction, useContext } from "react";
import Logout from "../components/Logout";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import Switch from "../components/Switch";
import { useNavigate } from "react-router-dom";

interface IHeaderProps {
  toggleDisplayNavigation?: () => void;
  isAdminViewActive?: boolean;
  setIsAdminViewActive?: Dispatch<SetStateAction<boolean>>;
}

const Header = ({
  isAdminViewActive,
  setIsAdminViewActive,
  toggleDisplayNavigation,
}: IHeaderProps) => {
  const { user, auth } = useContext(AuthenticationContext);
  const navigate = useNavigate();

  const switchClickAction = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    isAdminViewActive ? navigate("/") : navigate("/admin");
    setIsAdminViewActive?.((prev) => !prev);
    localStorage.setItem("isAdminViewActive", isAdminViewActive ? "false" : "true");
  };

  return (
    <header className="header">
      {auth?.isAuthenticated ? (
        <>
          {user?.roles?.includes("ROLE_ADMIN") || user?.roles?.includes("ROLE_SUPERADMIN") ? (
            <div className="switch-container">
              <span>Admin</span>
              <Switch
                customName="admin"
                isActive={isAdminViewActive}
                clickAction={switchClickAction}
              />
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
