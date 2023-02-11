import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import MemberHeader from "../components/MemberHeader";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import { ITournament } from "../../config/interfaces";
import { SelectedTournamentContext } from "../../contexts/SelectedTournamentContext";

interface IPrivateRoutesProps {
  allowedRoles?: Array<string>;
}

const PrivateRoutes = ({ allowedRoles }: IPrivateRoutesProps) => {
  const location = useLocation();
  const { auth } = useContext(AuthenticationContext);
  const [isAdminConnected, setIsAdminConnected] = useState(
    auth?.roles?.includes("ROLE_ADMIN") || false
  );
  const [displayNavigation, setDisplayNavigation] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState({} as ITournament);

  const toggleDisplayNavigation = () => {
    setDisplayNavigation((prev) => !prev);
  };

  const toggleIsAdminConnected = () => {
    setIsAdminConnected((prev) => !prev);
  };

  return auth?.roles?.find((role) => allowedRoles?.includes(role)) ? (
    <>
      <Header
        toggleDisplayNavigation={toggleDisplayNavigation}
        isAdminConnected={isAdminConnected}
        setIsAdminConnected={setIsAdminConnected}
      />
      {!isAdminConnected && <MemberHeader />}
      <Navigation displayNavigation={displayNavigation} isAdminConnected={isAdminConnected} />

      <SelectedTournamentContext.Provider value={{ selectedTournament, setSelectedTournament }}>
        <Outlet />
      </SelectedTournamentContext.Provider>
    </>
  ) : auth?.accessToken ? (
    <Navigate to="/acces_refuse" state={{ from: location }} replace />
  ) : (
    <Navigate to="/se_connecter" state={{ from: location }} replace />
  );
};

export default PrivateRoutes;
