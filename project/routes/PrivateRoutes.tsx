import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Homepage from "./Homepage";
import UserTournaments from "./UserTournaments";
import TournamentRegistration from "./NewTournamentRegistration";
import Results from "./Results";
import Settings from "./Settings";
import { useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import { fetchRefreshToken, fetchUser } from "../../config/fetchFunctions";
import MemberHeader from "../components/MemberHeader";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import { IUser } from "../../config/interfaces";

const PrivateRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authToken, setAuthToken, setUser, isAuthenticated, setIsAuthenticated, auth, setAuth } =
    useContext(AuthenticationContext);

  // useEffect(() => {
  //   !auth?.accessToken &&
  //     fetchRefreshToken().then((res) => setAuth?.((prev) => ({ ...prev, accessToken: res.token })));
  // }, []);

  // useEffect(() => {
  //   if (authToken) {
  //     fetchUser(authToken)
  //       .then((res) => {
  //         if (res.ok) return res.json();
  //         document.cookie = `refreshToken=;expires=${new Date(-1)};SameSite=strict`;
  //         navigate("/");
  //         throw new Error(res.status + " An error occurs when try to set user context after login");
  //       })
  //       .then(({ id, lastName, firstName, email, roles, FFBadStats: array }: IUser) => {
  //         setUser?.({
  //           id,
  //           lastName,
  //           firstName,
  //           email,
  //           roles,
  //           birthDate: array[array.length - 1]?.birthDate,
  //           license: array[array.length - 1]?.license,
  //           isPlayerTransferred: array[array.length - 1]?.isPlayerTransferred,
  //           feather: array[array.length - 1]?.feather,
  //           rankings: {
  //             effectiveDate: array[array.length - 1]?.rankingsDate,
  //             single: {
  //               cpph: array[array.length - 1]?.singleCPPH,
  //               rankNumber: array[array.length - 1]?.singleRankNumber,
  //               rankName: array[array.length - 1]?.singleRankName,
  //             },
  //             double: {
  //               cpph: array[array.length - 1]?.doubleCPPH,
  //               rankNumber: array[array.length - 1]?.doubleRankNumber,
  //               rankName: array[array.length - 1]?.doubleRankName,
  //             },
  //             mixed: {
  //               cpph: array[array.length - 1]?.mixedCPPH,
  //               rankNumber: array[array.length - 1]?.mixedRankNumber,
  //               rankName: array[array.length - 1]?.mixedRankName,
  //             },
  //           },
  //           category: {
  //             short: array[array.length - 1]?.categoryShort,
  //             long: array[array.length - 1]?.categoryLong,
  //             global: array[array.length - 1]?.categoryGlobal,
  //           },
  //         });
  //       });
  //   } else {
  //     setIsAuthenticated?.(false);
  //     setAuthToken?.("");
  //     setUser?.({});
  //     document.cookie = `refreshToken=;expires=${new Date(-1)};SameSite=strict`;
  //     navigate("/");
  //   }
  // }, []);

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
        navigate("/", { state: { from: location }, replace: true })
      )}
    </>
  );
};

export default PrivateRoutes;
