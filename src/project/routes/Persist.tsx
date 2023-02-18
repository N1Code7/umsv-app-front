import { useContext, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import useRefreshToken from "../../hooks/useRefreshToken";
import { getRefreshTokenFromCookie } from "../../utils/functions/cookies";
import { IUser } from "../../interfaces/interfaces";

const Persist = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, setAuth, user, setUser } = useContext(AuthenticationContext);
  const refresh = useRefreshToken();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!getRefreshTokenFromCookie() || getRefreshTokenFromCookie() === "undefined") {
      setAuth?.({});
      setUser?.({} as IUser);
      document.cookie = `refreshToken=;expires=${new Date(-1)};SameSite=strict`;
      return navigate("/se_connecter", { replace: true, state: { from: location } });
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        !ignore && setIsLoading(false);
      }
    };

    !auth?.isAuthenticated ? verifyRefreshToken() : setIsLoading(false);
    // !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

    return () => {
      ignore = true;
    };
  }, []);

  return <>{isLoading ? <p>Chargement de la page...</p> : <Outlet />}</>;
};

export default Persist;
