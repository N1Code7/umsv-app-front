import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Homepage from "./Homepage";
import UserTournaments from "./UserTournaments";
import TournamentRegistration from "./NewTournamentRegistration";
import Results from "./Results";
import Settings from "./Settings";
import { useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import { fetchUser } from "../../config/functions";
import MemberHeader from "../components/MemberHeader";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import { IUser } from "../../config/interfaces";

const PrivateRoutes = () => {
  const navigate = useNavigate();
  const { authToken, setAuthToken, setUser, isAuthenticated, setIsAuthenticated } =
    useContext(AuthenticationContext);
  const [deviceDisplay, setDeviceDisplay] = useState("");

  useEffect(() => {
    if (authToken) {
      fetchUser(authToken)
        .then((res) => {
          if (res.ok) return res.json();
          document.cookie = `refreshToken=;expires=${new Date(-1)};SameSite=strict`;
          navigate("/");
          throw new Error(res.status + " An error occurs when try to set user context after login");
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
    } else {
      setIsAuthenticated?.(false);
      setAuthToken?.("");
      setUser?.({});
      document.cookie = `refreshToken=;expires=${new Date(-1)};SameSite=strict`;
      navigate("/");
    }
  }, []);

  /** Adapt the component return to window's width => RESPONSIVE */
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      entries.forEach(() => {
        if (window.innerWidth < 1000) {
          setDeviceDisplay("mobile");
        } else {
          setDeviceDisplay("desktop");
        }
      });
    });

    if (document.body) observer.observe(document.body);
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
            <Route
              path="/tournois"
              element={
                <UserTournaments
                  deviceDisplay={deviceDisplay}
                  setDeviceDisplay={setDeviceDisplay}
                />
              }
            />
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
