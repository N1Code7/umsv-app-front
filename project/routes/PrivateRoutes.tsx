import { Navigate, Route, Routes } from "react-router-dom";
import Homepage from "./Homepage";
import Tournaments from "./Tournaments";
import Registration from "./Registration";
import Results from "./Results";
import Settings from "./Settings";
import { unescape } from "querystring";

const PrivateRoutes = () => {
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
    let isAuthenticated = true;
    // if (localStorage.getItem("token")) {
    //   isAuthenticated = true;
    // } else if (!localStorage.getItem("token") && getCookies().resetToken) {
    //   // Generate a new token through the refreshToken API
    // } else {
    //   isAuthenticated = false;
    // }
    return isAuthenticated;
  };

  return (
    <>
      {hasJWT() ? (
        <Routes>
          <Route path="/home" element={<Homepage />} />
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
