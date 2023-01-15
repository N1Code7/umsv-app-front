import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Homepage from "./Homepage";
import UserTournaments from "./UserTournaments";
import TournamentRegistration from "./NewTournamentRegistration";
import Results from "./Results";
import Settings from "./Settings";
import { useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import { fetchRefreshToken, fetchUser, getRefreshTokenFromCookie } from "../../config/functions";
import MemberHeader from "../components/MemberHeader";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import { IUser } from "../../config/interfaces";

interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

const PrivateRoutes = () => {
  const navigate = useNavigate();
  const { authToken, setAuthToken, setUser, isAuthenticated, setIsAuthenticated } =
    useContext(AuthenticationContext);
  const [deviceDisplay, setDeviceDisplay] = useState("");

  useEffect(() => {
    if (authToken && authToken !== "") {
      fetchUser(authToken)
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          document.cookie = `refreshToken=;expires=${new Date(-1)};SameSite=strict`;
          navigate("/");
          throw new Error("An error occurs when try to get user's data : " + res.statusText);
        })
        .then(({ id, lastName, firstName, email, roles, FFBadStats: array }: IUser) => {
          setUser?.({
            id,
            lastName,
            firstName,
            email,
            roles,
            birthDate: array[array.length - 1]?.birthDate,
            license: array[array.length - 1]?.license,
            isPlayerTransferred: array[array.length - 1]?.isPlayerTransferred,
            feather: array[array.length - 1]?.feather,
            rankings: {
              effectiveDate: array[array.length - 1]?.rankingsDate,
              single: {
                cpph: array[array.length - 1]?.singleCPPH,
                rankNumber: array[array.length - 1]?.singleRankNumber,
                rankName: array[array.length - 1]?.singleRankName,
              },
              double: {
                cpph: array[array.length - 1]?.doubleCPPH,
                rankNumber: array[array.length - 1]?.doubleRankNumber,
                rankName: array[array.length - 1]?.doubleRankName,
              },
              mixed: {
                cpph: array[array.length - 1]?.mixedCPPH,
                rankNumber: array[array.length - 1]?.mixedRankNumber,
                rankName: array[array.length - 1]?.mixedRankName,
              },
            },
            category: {
              short: array[array.length - 1]?.categoryShort,
              long: array[array.length - 1]?.categoryLong,
              global: array[array.length - 1]?.categoryGlobal,
            },
          });
        });
    } else if (getRefreshTokenFromCookie() && getRefreshTokenFromCookie() !== "") {
      fetchRefreshToken(getRefreshTokenFromCookie())
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          document.cookie = `refreshToken=;expires=${new Date(-1)};SameSite=strict`;
          navigate("/");
          throw new Error("An error occurs when try to refresh the token : " + res.statusText);
        })
        .then(({ token, refreshToken }: RefreshTokenResponse) => {
          setIsAuthenticated?.(true);
          setAuthToken?.(token);
          document.cookie = `refreshToken=${refreshToken};max-age=2592000;SameSite=strict;secure;path=/`;
          navigate("/utilisateur/accueil");
        });
    } else if (!isAuthenticated) {
      setAuthToken?.("");
      setUser?.({});
      navigate("/");
    } else {
      setIsAuthenticated?.(false);
      setAuthToken?.("");
      setUser?.({});
      document.cookie = `refreshToken=;expires=${new Date(-1)};SameSite=strict`;
      navigate("/");
    }
  }, [authToken]);

  /** Adapt the component return to window's width => RESPONSIVE */
  useEffect(() => {
    const modal = document.body.querySelector(".event-modal");
    const tournamentsDiv = document.body.querySelector(".tournaments");
    const observer = new ResizeObserver((entries) => {
      entries.forEach(() => {
        if (window.innerWidth < 1000) {
          setDeviceDisplay("mobile");
        } else {
          setDeviceDisplay("desktop");
        }
      });
    });

    if (modal) observer.observe(modal);
    if (tournamentsDiv) observer.observe(tournamentsDiv);
  }, [deviceDisplay]);

  return (
    <>
      {isAuthenticated && (
        <>
          <Header />
          <MemberHeader />
          <Navigation />
          <Routes>
            <Route path="/" element={<Navigate to="/utilisateur/accueil" replace />} />
            <Route
              path="/accueil"
              element={
                <Homepage deviceDisplay={deviceDisplay} setDeviceDisplay={setDeviceDisplay} />
              }
            />
            <Route path="/tournois" element={<UserTournaments />} />
            <Route path="/inscription" element={<TournamentRegistration />} />
            <Route path="/resultats" element={<Results />} />
            <Route path="/reglages" element={<Settings />} />
          </Routes>
        </>
      )}
    </>
  );
};

export default PrivateRoutes;
