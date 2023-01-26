import Image from "next/image";
import { useContext, useEffect } from "react";
import { NavigationContext } from "../../contexts/NavigationContext";
import AdminSwitch from "./AdminSwitch";
import Logout from "./Logout";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import Switch from "./Switch";
import useSWR from "swr";
import { axiosPrivate } from "../../config/axios";
import { IUser } from "../../config/interfaces";

const Header = () => {
  const { toggleDisplay } = useContext(NavigationContext);
  const { user, auth, setUser } = useContext(AuthenticationContext);
  // const controller = new AbortController();
  // const fetcher = async (url: string) =>
  //   axiosPrivate
  //     .get(url, { signal: controller.signal })
  //     .then((res) => res.data)
  //     .then((res) => setUser?.(res))
  //     .catch((err) => {
  //       console.error(err);
  //       controller.abort();
  //     });
  // const { data: userData, isLoading, error: errorData } = useSWR("user", fetcher);

  // useEffect(() => {
  //   console.log(user);
  //   console.log(userData);
  // }, []);

  return (
    <header className="header">
      {auth?.isAuthenticated ? (
        <>
          {user?.roles?.includes("ROLE_ADMIN") || user?.roles?.includes("ROLE_SUPERADMIN") ? (
            <div className="switch-container">
              <span>Admin</span>
              <Switch customName="admin" />
              {/* <AdminSwitch /> */}
            </div>
          ) : (
            <div className="member-role">
              <span>🐅</span>
              {/* <span>Espace</span>
              <span>utilisateur</span> */}
            </div>
          )}
          <button className="btn btn-primary btn-menu" id="menuBtn" onClick={toggleDisplay}>
            Menu
          </button>
          <Logout />
        </>
      ) : (
        <Image
          src={"/assets/img/logo-club.png"}
          width={window.innerWidth < 600 ? 120 : 100}
          height={window.innerWidth < 600 ? 45 : 35}
          alt="logo du club"
          className="img-logo"
        />
      )}
    </header>
  );
};

export default Header;
