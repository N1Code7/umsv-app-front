import { Navigate, Route, Routes } from "react-router-dom";
import Homepage from "./Homepage";
import Tournaments from "./Tournaments";
import Registration from "./Registration";
import Results from "./Results";
import Settings from "./Settings";
import { unescape } from "querystring";
import { useContext } from "react";
import { AuthTokenContext } from "../../contexts/AuthTokenContext";

const PrivateRoutes = () => {
  const { authToken, setAuthToken } = useContext(AuthTokenContext);

  const getCookies = () => {
    let cookiesArray = document.cookie.split(";");
    let cookies: any = {};
    for (let i = 0; i < cookiesArray.length; i++) {
      let pair = cookiesArray[i].split("=");
      cookies[(pair[0] + "").trim()] = unescape(pair.slice(1).join("="));
    }
    return cookies;
  };

  const hasJWT = () => {
    let isAuthenticated = false;
    authToken ? (isAuthenticated = true) : (isAuthenticated = false);
    return isAuthenticated;
  };

  return (
    <>
      {hasJWT() ? (
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/tournois" element={<Tournaments />} />
          <Route path="/inscription" element={<Registration />} />
          <Route path="/resultats" element={<Results />} />
          <Route path="/reglages" element={<Settings />} />
        </Routes>
      ) : (
        <Navigate to="/" replace={true} />
      )}
    </>
  );
};

export default PrivateRoutes;
