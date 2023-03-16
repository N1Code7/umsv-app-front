import { useLocation, useNavigate } from "react-router-dom";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import { useContext } from "react";
import { mutate } from "swr";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { IUser } from "../../interfaces/interfaces";
import { getRefreshTokenFromCookie } from "../../utils/cookies";

const Logout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();

  const { setUser, setAuth } = useContext(AuthenticationContext);

  const clearCache = () => mutate(() => true, undefined, { revalidate: false });

  const logout = async () => {
    try {
      await axiosPrivate.post("token/refresh/invalidate", {
        refreshToken: getRefreshTokenFromCookie(),
      });
    } catch (err) {
      // console.error(err);
    }
    setAuth?.({});
    setUser?.({} as IUser);
    document.cookie = `refreshToken=;expires=${new Date(-1)};SameSite=strict`;
    clearCache();
    navigate("/se_connecter", { replace: true });
  };

  return (
    <button className="btn-logout" onClick={logout}>
      <i className="fa-solid fa-right-from-bracket img-logout"></i>
    </button>
  );
};

export default Logout;
