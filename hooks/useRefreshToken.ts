import axios, { axiosPrivate } from "../config/axios";
import { getRefreshTokenFromCookie } from "../config/fetchFunctions";
import { AuthenticationContext } from "../contexts/AuthenticationContext";
import { useContext } from "react";

const useRefreshToken = () => {
  const { setAuth, user, setUser } = useContext(AuthenticationContext);

  const refresh = async () => {
    const refreshResponse = await axios.post("token/refresh", {
      refreshToken: getRefreshTokenFromCookie(),
    });

    const userResponse = await axiosPrivate.get("user", {
      headers: { Authorization: `Bearer ${refreshResponse.data.token}` },
    });

    user && Object.keys(user).length === 0 && setUser?.(userResponse.data);
    setAuth?.((prev) => ({
      ...prev,
      accessToken: refreshResponse.data.token,
      isAuthenticated: true,
      roles: userResponse.data.roles,
    }));
    document.cookie = `refreshToken=${refreshResponse.data.refreshToken};max-age=2592000;SameSite=strict;secure;path=/`;
    return refreshResponse.data.token;
  };
  return refresh;
};

export default useRefreshToken;
