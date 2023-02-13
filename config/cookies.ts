/**
 * Extract the value of cookie which includes the name refreshToken
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
 * Extract the value of cookie which includes the name last
 */
export const getLocationFromCookie = () => {
  const cookies = document.cookie.split(";");
  let lastLocation = "";
  cookies.forEach((cookie) => {
    if (cookie.split("=")[0].includes("lastLocation")) {
      lastLocation = cookie.split("=")[1];
    }
  });
  return lastLocation;
};
