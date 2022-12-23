import { ApiUrl } from ".";

export const getRefreshTokenFromCookie = () => {
    const cookies = document.cookie.split(";");
    let refreshToken = "";
    cookies.forEach((cookie) => {
      if (cookie.split("=")[0].includes("refreshToken")) {
        refreshToken = cookie.split("=")[1];
      }
    });
    return refreshToken;
  };

export const fetchUser = async (authToken :any) => {
  const response = await fetch(ApiUrl + "user", {
    method: "GET",
    headers: {
      Authorization: `bearer ${authToken}`,
    },
    mode: "cors",
    cache: "default",
  });
  return response;
};

export const fetchRefreshToken = async () => {
  const response = await fetch(ApiUrl + "token/refresh", {
    method: "POST",
    mode: "cors",
    cache: "default",
    body: JSON.stringify({
      refreshToken: getRefreshTokenFromCookie(),
    }),
  });
  return response;
};