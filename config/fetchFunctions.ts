/**
 * Extract the value of cookie which includes the name refreshToken
 */
export const getRefreshTokenFromCookie = () => {
  try {
    const cookies = document.cookie.split(";");
    let refreshToken = "";
    cookies.forEach((cookie) => {
      if (cookie.split("=")[0].includes("refreshToken")) {
        refreshToken = cookie.split("=")[1];
      }
    });
    return refreshToken;
  } catch (err) {
    throw new Error(
      "An error occurs when try to get the refresh token stored in the cookie " + err
    );
  }
};

/**
 * Connect the user to the service
 * @param email the user's email
 * @param password the user's plain password
 */
export const fetchLogin = async (email: string, password: string) => {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_HOST_BACK + "login", {
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
    return response.json();
  } catch (err) {
    throw new Error("An error occurs when try to log in the user " + err);
  }
};

/**
 * Keep the user's authentication and generate a new authToken
 * This function get the refresh token from the function @see getRefreshTokenFromCookie()
 */
export const fetchRefreshToken = async () => {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_HOST_BACK + "token/refresh", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: getRefreshTokenFromCookie(),
      }),
    });
    return response.json();
  } catch (err) {
    throw new Error("An error occurs when try to refresh the user's access token " + err);
  }
};

/**
 * Remove the refreshToken from the database and so disconnect the user from the service
 * This function get the refresh token from the function @see getRefreshTokenFromCookie()
 * @param refreshToken the refreshToken stored in cookie
 */
export const fetchInvalidateRefreshToken = async () => {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_HOST_BACK + "token/refresh/invalidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      cache: "default",
      body: JSON.stringify({
        refreshToken: getRefreshTokenFromCookie(),
      }),
    });
    return response.json();
  } catch (err) {
    throw new Error(
      "An error occurs when try to invalidate the user's refresh token at logout " + err
    );
  }
};

/**
 * Init the reset password procedure
 * @param email the user's email
 */
export const fetchInitResetPassword = async (email: any) => {
  const response = await fetch(process.env.NEXT_PUBLIC_HOST_BACK + "reset_password", {
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
 */
export const fetchValidNewPassword = async (
  resetToken: string | undefined,
  password: string,
  confirmPassword: string
) => {
  const response = await fetch(process.env.NEXT_PUBLIC_HOST_BACK + "reset_password/reset", {
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
 */
export const fetchCreateAccount = async (
  email: string,
  password: string,
  confirmPassword: string,
  lastName: string,
  firstName: string
) => {
  const response = await fetch(process.env.NEXT_PUBLIC_HOST_BACK + "user/account", {
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
 */
export const fetchUser = async (token: string) => {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_HOST_BACK + "user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      mode: "cors",
      cache: "default",
    });
    return response.json();
  } catch (err) {
    throw new Error("An error occurs when try to fetch User " + err);
  }
};

/**
 * Get information of all events
 * @param token the authentication token
 */
export const fetchEvents = async (token: string) => {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_HOST_BACK + "events", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  } catch (err) {
    throw new Error(err + " An error occurs when try to fetch events");
  }
};

/**
 * Get information of all tournaments
 * @param token the authentication token
 */
export const fetchTournaments = async (token: string) => {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_HOST_BACK + "tournaments", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  } catch (err) {
    throw new Error(err + "An error occurs when try to fetch tournaments");
  }
};

/**
 * Get information of all user's tournament registrations
 * @param token the user's authentication token
 */
export const fetchUserRegistrations = async (token: string) => {
  const response = await fetch(process.env.NEXT_PUBLIC_HOST_BACK + "tournament-registrations", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};
