import { useContext, useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { AuthenticationContext } from "../contexts/AuthenticationContext";
import { axiosPrivateMultipart } from "../utils/axios";

const useAxiosPrivateMultipart = () => {
  const refresh = useRefreshToken();
  const { auth } = useContext(AuthenticationContext);

  useEffect(() => {
    const requestIntercept = axiosPrivateMultipart.interceptors.request.use(
      async (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
          config.headers["Content-Type"] = "multipart/ form-data";
          console.log(config.headers);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivateMultipart.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (
          (error?.response?.status === 403 || error?.response?.status === 401) &&
          !prevRequest?.sent
        ) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          prevRequest.headers["Content-Type"] = "multipart/ form-data";
          return axiosPrivateMultipart(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivateMultipart.interceptors.request.eject(requestIntercept);
      axiosPrivateMultipart.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return axiosPrivateMultipart;
};

export default useAxiosPrivateMultipart;
