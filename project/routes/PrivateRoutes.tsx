import { Navigate, Route, Routes } from "react-router-dom";
import Homepage from "./Homepage";
import Tournaments from "./Tournaments";
import Registration from "./Registration";
import Results from "./Results";
import Settings from "./Settings";
import { unescape } from "querystring";
import { useContext, useEffect } from "react";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import { ApiUrl } from "../../config";

const PrivateRoutes = () => {
  const { authToken, setAuthToken } = useContext(AuthenticationContext);
  const { user, setUser } = useContext(AuthenticationContext);

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

  useEffect(() => {
    try {
      fetch(ApiUrl + "user", {
        method: "GET",
        headers: {
          Authorization: `bearer ${authToken}`,
        },
        mode: "cors",
        cache: "default",
      })
        .then((res) => res.json())
        .then(({ id, lastName, firstName, email }) => {
          setUser?.({
            id,
            lastName,
            firstName,
            email,
          });
        });
    } catch (err) {
      console.error(err);
    }
  }, [authToken, setUser]);

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
