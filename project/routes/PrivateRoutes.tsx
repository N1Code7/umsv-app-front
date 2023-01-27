import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import MemberHeader from "../components/MemberHeader";
import Navigation from "../components/Navigation";
import Header from "../components/Header";

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

  const toggleDisplayNavigation = () => {
    setDisplayNavigation(!displayNavigation);
    // setDisplayNavigation((prev) => !prev);
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
      <MemberHeader />
      <Navigation displayNavigation={displayNavigation} isAdminConnected={isAdminConnected} />
      <Outlet />
    </>
  ) : auth?.accessToken ? (
    <Navigate to="/acces_refuse" state={{ from: location }} replace />
  ) : (
    <Navigate to="/se_connecter" state={{ from: location }} replace />
  );
};

export default PrivateRoutes;
