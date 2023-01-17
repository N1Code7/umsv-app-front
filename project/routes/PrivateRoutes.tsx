import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import { fetchUser } from "../../config/fetchFunctions";
import MemberHeader from "../components/MemberHeader";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import { IUser } from "../../config/interfaces";

const PrivateRoutes = () => {
  const location = useLocation();
  const { auth, setUser } = useContext(AuthenticationContext);

  useEffect(() => {
    auth?.accessToken &&
      fetchUser(auth.accessToken).then(
        ({ id, lastName, firstName, email, roles, FFBadStats: array }: IUser) => {
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
        }
      );
  }, [auth?.accessToken, setUser]);

  useEffect(() => {
    console.log("private routes re-render");
  }, []);

  return (
    <>
      {auth?.isAuthenticated ? (
        <>
          <Header />
          <MemberHeader />
          <Navigation />
          <Outlet />
        </>
      ) : (
        <Navigate to="/se_connecter" state={{ from: location }} replace />
      )}
    </>
  );
};

export default PrivateRoutes;
