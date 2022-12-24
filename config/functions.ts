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

export const fetchLogin = async (email: string, password: string) => {
  const response = await fetch(ApiUrl + "login", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    mode: "cors",
    cache: "default",
    body: JSON.stringify({
      email,
      password,
    }),
  });
  return response;
};

export const fetchRefreshToken = async (refreshToken: string) => {
  const response = await fetch(ApiUrl + "token/refresh", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    mode: "cors",
    cache: "default",
    body: JSON.stringify({
      refreshToken,
    }),
  });
  return response;
};

export const fetchUser = async (authToken: any) => {
  const response = await fetch(ApiUrl + "user", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    mode: "cors",
    cache: "default",
  });
  return response;
};
