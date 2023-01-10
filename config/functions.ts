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
 * Connect the user to the service
 * @param email the user's email
 * @param password the user's plain password
 */
export const fetchLogin = async (email: string, password: string) => {
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
  return response;
};

/**
 * Keep the user's authentication and generate a new authToken
 * @param refreshToken the refreshToken stored in cookie
 */
export const fetchRefreshToken = async (refreshToken: string) => {
  const response = await fetch(process.env.NEXT_PUBLIC_HOST_BACK + "token/refresh", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      refreshToken,
    }),
  });
  return response;
};

/**
 * Remove the refreshToken from the database and so disconnect the user from the service
 * @param refreshToken the refreshToken stored in cookie
 */
export const fetchInvalidateRefreshToken = async (refreshToken: string) => {
  const response = await fetch(process.env.NEXT_PUBLIC_HOST_BACK + "token/refresh/invalidate", {
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
  const response = await fetch(process.env.NEXT_PUBLIC_HOST_BACK + "user", {
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
 * Get information of all events
 * @param token the authentication token
 */
export const fetchEvents = async (token: string) => {
  const response = await fetch(process.env.NEXT_PUBLIC_HOST_BACK + "events", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

/**
 * Get information of all tournaments
 * @param token the authentication token
 */
export const fetchTournaments = async (token: string) => {
  const response = await fetch(process.env.NEXT_PUBLIC_HOST_BACK + "tournaments", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

/**
 * Format the input date into the selected schema
 * @param entryDate1 the date to format
 * @param entryDate2 the second date in case of interval
 * @param outputFormat the selected output schema
 */
export const formatDate = (entryDate1: string, entryDate2?: string, outputFormat?: string) => {
  let formattedDate = entryDate1.split("T")[0].split("-"); // return ["YYYY", "MM", "DD"]

  if (outputFormat === "XX/XX/XX") {
    return `${formattedDate[2]}/${formattedDate[1]}/${formattedDate[0][2]}${formattedDate[0][3]}`;
  } else if (outputFormat === "XX & XX xxx XXXX" && entryDate2 !== undefined) {
    let formattedDate2 = entryDate2.split("T")[0].split("-");
    if (new Date(entryDate1).getMonth() === new Date(entryDate2).getMonth()) {
      return `${formattedDate[2]} & ${formattedDate2[2]} ${getMonthOfYear(entryDate1)} ${
        formattedDate[0]
      }`;
    } else {
      return `${formattedDate[2]} ${getMonthOfYear(entryDate1)} & ${
        formattedDate2[2]
      } ${getMonthOfYear(entryDate2)} ${formattedDate[0]}`;
    }
  }
  return `${formattedDate[2]}/${formattedDate[1]}/${formattedDate[0]}`;
};

/**
 * Get the day of week, either in short (default) or long format
 * @param entryDate the date taken to determine the day of week
 */
export const getDayOfWeek = (entryDate: string, format = "short") => {
  let week = [
    { short: "Lun", long: "Lundi" },
    { short: "Mar", long: "Mardi" },
    { short: "Mer", long: "Mercredi" },
    { short: "Jeu", long: "Jeudi" },
    { short: "Ven", long: "Vendredi" },
    { short: "Sam", long: "Samedi" },
    { short: "Dim", long: "Dimanche" },
  ];

  let dayNumber = new Date(entryDate).getDay();

  if (format === "long") {
    return week[dayNumber].long;
  }
  return week[dayNumber].short;
};

export const getMonthOfYear = (entryDate: string, format = "short") => {
  let year = [
    { short: "Jan", long: "Janvier" },
    { short: "Fev", long: "Février" },
    { short: "Mar", long: "Mars" },
    { short: "Avr", long: "Avril" },
    { short: "Mai", long: "Mai" },
    { short: "Jun", long: "Juin" },
    { short: "Jui", long: "Juillet" },
    { short: "Aou", long: "Août" },
    { short: "Sep", long: "Septembre" },
    { short: "Oct", long: "Octobre" },
    { short: "Nov", long: "Novembre" },
    { short: "Dec", long: "Décembre" },
  ];

  let monthNumber = new Date(entryDate).getMonth();

  if (format === "long") {
    return year[monthNumber].long;
  }
  return year[monthNumber].short;
};
