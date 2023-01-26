import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
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

  return auth?.roles?.find((role) => allowedRoles?.includes(role)) ? (
    <>
      <Header />
      <MemberHeader />
      <Navigation />
      <Outlet />
    </>
  ) : auth?.accessToken ? (
    <Navigate to="/acces_refuse" state={{ from: location }} replace />
  ) : (
    <Navigate to="/se_connecter" state={{ from: location }} replace />
  );
};

export default PrivateRoutes;
