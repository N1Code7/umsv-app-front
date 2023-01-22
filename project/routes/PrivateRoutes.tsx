import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import { fetchUser, getRefreshTokenFromCookie } from "../../config/fetchFunctions";
import MemberHeader from "../components/MemberHeader";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import { IUser } from "../../config/interfaces";
import useRefreshToken from "../../hooks/useRefreshToken";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const PrivateRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, setAuth, setUser } = useContext(AuthenticationContext);
  const refresh = useRefreshToken();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    if (!getRefreshTokenFromCookie() || getRefreshTokenFromCookie() === "undefined") {
      setAuth?.({});
      setUser?.({});
      document.cookie = `refreshToken=;expires=${new Date(-1)};SameSite=strict`;
      return navigate("/se_connecter");
    }
  }, [navigate, setAuth, setUser]);

  useEffect(() => {
    let ignore = false;

    !auth?.accessToken && !ignore && refresh();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    const getUser = async () => {
      try {
        await axiosPrivate.get("user", { signal: controller.signal }).then(
          ({ data }) =>
            !ignore &&
            setUser?.({
              id: data.id,
              lastName: data.lastName,
              firstName: data.firstName,
              email: data.email,
              roles: data.roles,
              // birthDate: data.FFBadStats[FFBadStats.length -1]?.birthDate,
              // license: array[array.length - 1]?.license,
              // isPlayerTransferred: array[array.length - 1]?.isPlayerTransferred,
              // feather: array[array.length - 1]?.feather,
              // rankings: {
              //   effectiveDate: array[array.length - 1]?.rankingsDate,
              //   single: {
              //     cpph: array[array.length - 1]?.singleCPPH,
              //     rankNumber: array[array.length - 1]?.singleRankNumber,
              //     rankName: array[array.length - 1]?.singleRankName,
              //   },
              //   double: {
              //     cpph: array[array.length - 1]?.doubleCPPH,
              //     rankNumber: array[array.length - 1]?.doubleRankNumber,
              //     rankName: array[array.length - 1]?.doubleRankName,
              //   },
              //   mixed: {
              //     cpph: array[array.length - 1]?.mixedCPPH,
              //     rankNumber: array[array.length - 1]?.mixedRankNumber,
              //     rankName: array[array.length - 1]?.mixedRankName,
              //   },
              // },
              // category: {
              //   short: array[array.length - 1]?.categoryShort,

              //   long: array[array.length - 1]?.categoryLong,
              //   global: array[array.length - 1]?.categoryGlobal,
              // },
            })
        );
      } catch (err) {
        console.error(err);
        // navigate("/se_connecter", { state: { from: location }, replace: true });
      }
    };
    getUser();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, []);

  // useEffect(() => {
  //   auth?.accessToken &&
  //     fetchUser(auth.accessToken).then(
  //       ({ id, lastName, firstName, email, roles, FFBadStats: array }: IUser) => {
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
  //       }
  //     );
  // }, [auth?.accessToken, setUser]);

  return (
    // <>
    //   {auth?.accessToken ? (
    <>
      <Header />
      <MemberHeader />
      <Navigation />
      <Outlet />
    </>
    //   ) : (
    //     // <Navigate to="/se_connecter" replace />
    //     <Navigate to="/se_connecter" state={{ from: location }} replace />
    //   )}
    // </>
  );
};

export default PrivateRoutes;
