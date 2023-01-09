import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Homepage from "./Homepage";
import Tournaments from "./Tournaments";
import TournamentRegistration from "./TournamentRegistration";
import Results from "./Results";
import Settings from "./Settings";
import { useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import { fetchRefreshToken, fetchUser, getRefreshTokenFromCookie } from "../../config/functions";
import { ModalEventContext } from "../../contexts/ModalEventContext";
import MemberHeader from "../components/MemberHeader";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import { User } from "../../config/interfaces";

interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

const PrivateRoutes = () => {
  const navigate = useNavigate();
  const { authToken, setAuthToken, setUser, isAuthenticated, setIsAuthenticated } =
    useContext(AuthenticationContext);
  const [modalIsActive, setModalIsActive] = useState(false);
  const [event, setEvent] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      setAuthToken?.("");
      setUser?.({});
      navigate("/");
    } else if (authToken !== "") {
      fetchUser(authToken!)
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw new Error("Authentication does not work!");
        })
        .then(({ id, lastName, firstName, email, roles, FFBadStats: array }: User) => {
          setUser?.({
            id,
            lastName,
            firstName,
            email,
            roles,
            birthDate: array[array.length - 1].birthDate,
            license: array[array.length - 1].license,
            isPlayerTransferred: array[array.length - 1].isPlayerTransferred,
            feather: array[array.length - 1].feather,
            rankings: {
              effectiveDate: array[array.length - 1].rankingsDate,
              single: {
                cpph: array[array.length - 1].singleCPPH,
                rankNumber: array[array.length - 1].singleRankNumber,
                rankName: array[array.length - 1].singleRankName,
              },
              double: {
                cpph: array[array.length - 1].doubleCPPH,
                rankNumber: array[array.length - 1].doubleRankNumber,
                rankName: array[array.length - 1].doubleRankName,
              },
              mixed: {
                cpph: array[array.length - 1].mixedCPPH,
                rankNumber: array[array.length - 1].mixedRankNumber,
                rankName: array[array.length - 1].mixedRankName,
              },
            },
            category: {
              short: array[array.length - 1].categoryShort,
              long: array[array.length - 1].categoryLong,
              global: array[array.length - 1].categoryGlobal,
            },
          });
        });
    } else if (getRefreshTokenFromCookie() && getRefreshTokenFromCookie() !== "") {
      fetchRefreshToken(getRefreshTokenFromCookie())
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw new Error("Can't refresh the token!");
        })
        .then(({ token, refreshToken }: RefreshTokenResponse) => {
          setIsAuthenticated?.(true);
          setAuthToken?.(token);
          document.cookie = `refreshToken=${refreshToken};max-age=2592000;SameSite=strict;secure;path=/`;
        });
    } else {
      setIsAuthenticated?.(false);
      setAuthToken?.("");
      setUser?.({});
      navigate("/");
    }
  }, []);

  return (
    <>
      {/* {isAuthenticated && ( */}
      <>
        <Header />
        <MemberHeader />
        <Navigation />
        <Routes>
          <Route path="/" element={<Navigate to="/utilisateur/accueil" replace />} />
          <Route path="/accueil" element={<Homepage />} />
          <Route path="/tournois" element={<Tournaments />} />
          <Route path="/inscription" element={<TournamentRegistration />} />
          <Route path="/resultats" element={<Results />} />
          <Route path="/reglages" element={<Settings />} />
        </Routes>
      </>
      {/* )} */}
    </>
  );
};

export default PrivateRoutes;
