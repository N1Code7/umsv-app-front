import axios from "../config/axios";
import { getRefreshTokenFromCookie } from "../config/fetchFunctions";
import { AuthenticationContext } from "../contexts/AuthenticationContext";
import { useContext } from "react";

const useRefreshToken = () => {
  const { setAuth } = useContext(AuthenticationContext);

  const refresh = async () => {
    const response = await axios.post("token/refresh", {
      refreshToken: getRefreshTokenFromCookie(),
    });
    setAuth?.((prev) => ({ ...prev, accessToken: response.data.token, isAuthenticated: true }));
    document.cookie = `refreshToken=${response.data.refreshToken};max-age=2592000;SameSite=strict;secure;path=/`;
    return response.data.token;
  };
  return refresh;
};

export default useRefreshToken;
