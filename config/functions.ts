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

export const fetchInvalidateRefreshToken = async (refreshToken: string) => {
  const response = await fetch(ApiUrl + "token/refresh/invalidate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    cache: "default",
    body: JSON.stringify({
      refreshToken,
    }),
  });
  return response;
};

export const fetchInitResetPassword = async (email: any) => {
  const response = await fetch(ApiUrl + "reset_password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    cache: "default",
    body: JSON.stringify({
      email,
    }),
  });
  return response;
};

export const fetchValidNewPassword = async (
  resetToken: string | undefined,
  password: string,
  confirmPassword: string
) => {
  const response = await fetch(ApiUrl + "reset_password/reset", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    cache: "default",
    body: JSON.stringify({
      resetToken,
      password,
      confirmPassword,
    }),
  });
  return response;
};

export const fetchCreateAccount = async (
  email: string,
  password: string,
  confirmPassword: string,
  lastName: string,
  firstName: string
) => {
  const response = await fetch(ApiUrl + "user/account", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    cache: "default",
    body: JSON.stringify({
      email,
      password,
      confirmPassword,
      lastName,
      firstName,
    }),
  });
  return response;
};

export const fetchUser = async (token: any) => {
  const response = await fetch(ApiUrl + "user", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    mode: "cors",
    cache: "default",
  });
  return response;
};
