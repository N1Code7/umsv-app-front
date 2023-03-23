import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthenticationContext } from "../../../contexts/AuthenticationContext";
import MemberHeader from "../../layouts/MemberHeader";
import Navigation from "../../layouts/Navigation";
import Header from "../../layouts/Header";
import { ITournament } from "../../../interfaces/interfaces";
import { SelectedTournamentContext } from "../../../contexts/SelectedTournamentContext";

interface IPrivateRoutesProps {
  allowedRoles?: Array<string>;
}

const PrivateRoutes = ({ allowedRoles }: IPrivateRoutesProps) => {
  const location = useLocation();
  const { auth } = useContext(AuthenticationContext);
  const [isAdminViewActive, setIsAdminViewActive] = useState(
    localStorage.getItem("isAdminViewActive") === "true" || false
  );
  // const [isAdminViewActive, setIsAdminViewActive] = useState(
  //   auth?.roles?.includes("ROLE_SUPERADMIN" || "ROLE_ADMIN") || false
  // );
  const [displayNavigation, setDisplayNavigation] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState({} as ITournament);

  const toggleDisplayNavigation = () => {
    setDisplayNavigation((prev) => !prev);
  };

  return auth?.roles?.find((role) => allowedRoles?.includes(role)) ? (
    <>
      <Header
        toggleDisplayNavigation={toggleDisplayNavigation}
        isAdminViewActive={isAdminViewActive}
        setIsAdminViewActive={setIsAdminViewActive}
      />
      {!isAdminViewActive && <MemberHeader />}
      <Navigation displayNavigation={displayNavigation} isAdminViewActive={isAdminViewActive} />

      <SelectedTournamentContext.Provider value={{ selectedTournament, setSelectedTournament }}>
        <Outlet />
        {/* {isAdminViewActive ? <Navigate to={"/admin"} /> : <Navigate to={"/"} />} */}
      </SelectedTournamentContext.Provider>
    </>
  ) : auth?.isAuthenticated ? (
    // ) : auth?.accessToken ? (
    <Navigate to="/acces_refuse" state={{ from: location }} replace />
  ) : (
    <Navigate to="/se_connecter" state={{ from: location }} replace />
  );
};

export default PrivateRoutes;
