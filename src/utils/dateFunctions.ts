/**
 * Format the input date into the selected schema
 * Default format : DD/MM/YYYY
 * Available formats : XX/XX/XX, XXXX-XX-XX, XX xxx XXXX, XX & XX xxx XXXX
 * @param entryDate1 the date to format
 * @param entryDate2 the second date in case of interval
 * @param outputFormat the selected output schema
 */
export const formatDate = (entryDate1: string, entryDate2?: string, outputFormat?: string) => {
  let formattedDate = entryDate1.split("T")[0].split("-"); // return ["YYYY", "MM", "DD"]

  if (outputFormat === "XX/XX/XX") {
    return `${formattedDate[2]}/${formattedDate[1]}/${formattedDate[0][2]}${formattedDate[0][3]}`;
  } else if (outputFormat === "XXXX-XX-XX") {
    return `${formattedDate[0]}-${formattedDate[1]}-${formattedDate[2]}`;
  } else if (outputFormat === "XX xxx XXXX") {
    return `${formattedDate[2]} ${getMonthOfYear(entryDate1)} ${formattedDate[0]}`;
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
  } else if (outputFormat === "interval" && entryDate2 !== undefined) {
    let formattedDate2 = entryDate2.split("T")[0].split("-");
    if (new Date(entryDate1).getMonth() === new Date(entryDate2).getMonth()) {
      return `du ${formattedDate2[2]} au ${formattedDate[2]} ${getMonthOfYear(entryDate1)} ${
        formattedDate[0]
      }`;
    } else {
      return `du ${formattedDate[2]} ${getMonthOfYear(entryDate1)} au ${
        formattedDate2[2]
      } ${getMonthOfYear(entryDate2)} ${formattedDate[0]}`;
    }
  }
  return `${formattedDate[2]}/${formattedDate[1]}/${formattedDate[0]}`;
};

/**
 * Get the day of week, either in short (default) or long format
 * @param entryDate the date taken to determine the day of week
 * @param format the name format of output date
 */
export const getDayOfWeek = (entryDate: string, format = "short") => {
  let days = [
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
    return days[dayNumber].long;
  }
  return days[dayNumber].short;
};

/**
 * Get the month of the year, either in short (default) or long format
 * @param entryDate the taken date to determine the month of year
 * @param format the name format of output month
 */
export const getMonthOfYear = (entryDate: string, format = "short") => {
  let months = [
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
    return months[monthNumber].long;
  }
  return months[monthNumber].short;
};
