import { useCallback, useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import useRefreshToken from "../../hooks/useRefreshToken";
import { getRefreshTokenFromCookie } from "../../config/fetchFunctions";

const Persist = () => {
  const navigate = useNavigate();
  const { auth, setAuth, user, setUser } = useContext(AuthenticationContext);
  const refresh = useRefreshToken();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!getRefreshTokenFromCookie() || getRefreshTokenFromCookie() === "undefined") {
      setAuth?.({});
      setUser?.({});
      document.cookie = `refreshToken=;expires=${new Date(-1)};SameSite=strict`;
      return navigate("/se_connecter", { replace: true });
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

    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

    return () => {
      ignore = true;
    };
  }, []);

  return <>{isLoading ? <p>Chargement de la page...</p> : <Outlet />}</>;
};

export default Persist;
