import { fetchRefreshToken } from "../config/fetchFunctions";
import { AuthenticationContext } from "../contexts/AuthenticationContext";
import { useCallback, useContext } from "react";

const useRefreshToken = () => {
  const { setAuth } = useContext(AuthenticationContext);

  const refresh = useCallback(async () => {
    return fetchRefreshToken()
      .then((res) => {
        setAuth?.({ accessToken: res.token, isAuthenticated: true });
        document.cookie = `refreshToken=${res.refreshToken};max-age=2592000;SameSite=strict;secure;path=/`;
        return res;
      })
      .catch((err) => console.error(err));
  }, [setAuth]);
  return refresh;
};

export default useRefreshToken;
