import { ApiUrl } from ".";

/**
 * Extract the value of cookie which includes the name refreshToken
 * @returns refreshToken
 */
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

/**
 * Connect the user to the service
 * @param email the user's email
 * @param password the user's plain password
 * @returns
 */
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

/**
 * Keep the user's authentication and generate a new authToken
 * @param refreshToken the refreshToken stored in cookie
 * @returns
 */
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

/**
 * Remove the refreshToken from the database and so disconnect the user from the service
 * @param refreshToken the refreshToken stored in cookie
 * @returns
 */
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

/**
 * Init the reset password procedure
 * @param email the user's email
 * @returns
 */
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

/**
 * Reset the user's password when the @param resetToken is validated
 * This method requires to init the reset password procedure @see fetchInitResetPassword
 * @param resetToken the refreshToken stored in cookie
 * @param password the new plain password of user
 * @param confirmPassword the confirmation of new user's plain password
 * @returns
 */
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

/**
 * Create a new user in database
 * The account's state is set on "pending" until an Admin validates the account
 * @param email the new user's email
 * @param password the new user's plain password
 * @param confirmPassword the new user's confirmation of plain password
 * @param lastName the new user's last name
 * @param firstName the new user's first name
 * @returns
 */
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

/**
 * Get the user's information
 * @param token the user's authentication token
 * @returns
 */
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

/**
 * Get data about club's members
 * @returns
 */
export const fetchFFBAD = async () => {
  const response = await fetch("https://api.ffbad.org/club/?TokenClub=30908181&Mode=smart", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Access-Control-Allow-Origin": "http://localhost:3000",
    },
    mode: "cors",
    cache: "default",
  });
  return response;
};
