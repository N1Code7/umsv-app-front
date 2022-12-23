import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Homepage from "./Homepage";
import Tournaments from "./Tournaments";
import Registration from "./Registration";
import Results from "./Results";
import Settings from "./Settings";
import { cache, useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import { ApiUrl } from "../../config";
import { fetchRefreshToken, fetchUser, getRefreshTokenFromCookie } from "../../config/functions";

const PrivateRoutes = () => {
  const navigate = useNavigate();

  const { isAuthenticated, setIsAuthenticated } = useContext(AuthenticationContext);
  const { user, setUser } = useContext(AuthenticationContext);
  const { authToken, setAuthToken } = useContext(AuthenticationContext);

  useEffect(() => {
    if (authToken) {
      setIsAuthenticated?.(true);
      fetchUser(authToken)
        .then((res) => res.json)
        .then(({ id, lastName, firstName, email }: any) =>
          setUser?.({ id, lastName, firstName, email })
        );
    } else if (!authToken && getRefreshTokenFromCookie()) {
      fetchRefreshToken()
        .then((res) => res.json())
        .then(({ token }: any) => {
          setIsAuthenticated?.(true);
          setAuthToken?.(token);
          fetchUser(token)
            .then((res) => res.json)
            .then(({ id, lastName, firstName, email }: any) =>
              setUser?.({ id, lastName, firstName, email })
            );
        });
    } else {
      setIsAuthenticated?.(false);
      navigate("/");
    }
  }, [authToken, setAuthToken, setUser, setIsAuthenticated, navigate]);

  // useEffect(() => {
  //   if (getRefreshTokenFromCookie()) {
  //   }
  //
  //   if (!isAuthenticated) {
  //     try {
  //       refreshToken()
  //         .then((res) => res.json())
  //         .then(({ token }: any) => {
  //           setIsAuthenticated?.(true);
  //           setToken(token);
  //         });
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }
  // }, [isAuthenticated, setIsAuthenticated, setToken]);

  return (
    <>
      {
        isAuthenticated && (
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/tournois" element={<Tournaments />} />
            <Route path="/inscription" element={<Registration />} />
            <Route path="/resultats" element={<Results />} />
            <Route path="/reglages" element={<Settings />} />
          </Routes>
        )
        // <Navigate to="/" replace={true} />
      }
    </>
  );
};

export default PrivateRoutes;
