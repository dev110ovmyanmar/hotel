import { DATE_FORMAT, DATE_TIME_FORMAT, START_OF_DAY, TIME_FORMAT } from "../variables/constants";
import dayjs from "dayjs";
// Locales
import "dayjs/locale/pt";

// Plugins
import advancedFormat from "dayjs/plugin/advancedFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from 'dayjs/plugin/utc'
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Load plugins
dayjs.extend(advancedFormat);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);
dayjs.extend(utc);
/**
 * @returns object containing ISO 8601 and RFC2822 formatted date
 */
export function getDate() {
  const currentDate = new Date(Date.now());
  let iso8601Date = currentDate.toISOString();

  iso8601Date = `${iso8601Date.split(".")[0]}+00:00`;

  const rfc2822Date = currentDate.toUTCString().replace("GMT", "+0000");

  return {
    iso8601Date,
    rfc2822Date,
  };
}

/**
 * Checks if the provided date falls before the start of the current day.
 * @param {Date} targetDate - The date to compare against the start of the day.
 * @returns {boolean} - True if the target date is before the start of the day, false otherwise.
 */
export const isBeforeStartOfDay = (targetDate) => {
  return targetDate < dayjs().startOf('day');
};

/**
 * Checks if the provided date falls after the start of the current day.
 * @param {Date} targetDate - The date to compare against the start of the day.
 * @returns {boolean} - True if the target date is after the start of the day, false otherwise.
 */
export const isAfterStartOfDay = (targetDate) => {
  return targetDate > dayjs();
};

/**
 * Formats a given date string into a specific date format using Day.js.
 * @param {string} date - The date string to be formatted.
 * @returns {string} - The formatted date string.
 */
export function formattedDate(date) {
  // Check if the date is provided
  if (date) {
    // Create a new Date object from the provided date string
    const myDate = new Date(date);
    // Format the date using Day.js and the specified DATE_FORMAT
    return dayjs(myDate).format(DATE_FORMAT);
  }

  // Return an empty string if no date is provided
  return '';
}

/**
 * Formats a given date string into a specific date format using Day.js.
 * @param {string} time - The time string to be formatted.
 * @returns {string} - The formatted time string.
 */
export function getFormattedDuration(time) {
  if (time) {
    // Parse the provided date string using Day.js
    const myDate = dayjs(time, ['HH:mm:ss']);

    // Check if the parsed date is valid
    if (myDate.isValid()) {
      // Format the date using Day.js and the specified Time Format
      return myDate; // Adjust the format as needed
    }
  }

  // Return an empty string if no date is provided or the date is invalid
  return '';
}

export function formattedDateTime(dateTime) {
  // Check if the date is provided
  if (dateTime) {
    // Format the date using Day.js and the specified DATE_FORMAT
    return dayjs.utc(dateTime).local().format(DATE_TIME_FORMAT);
  }

  // Return an empty string if no date is provided
  return '';
}

/**
 * Converts a local date-time string to a formatted UTC date-time string.
 * 
 * @param {String} date - The local date-time string to be converted.
 * @param {String} type - The type of conversion, either "START_OF_DAY" or "END_OF_DAY".
 * @return {String} - The formatted UTC date-time string in the specified format, or an empty string if the conversion fails.
 */
export const localToUtcDateTime = (date, type) => {

  if (date) {
    // Check if the conversion type is "START_OF_DAY"
    if (type === START_OF_DAY) {
      
      // Create a Date object from the input date and set the time to the start of the day (00:00:00.000)
      const startOfDay = new Date(date).setHours(0, 0, 0, 0);
     
      // Convert the start of the day to UTC using dayjs.utc()
      return dayjs.utc(startOfDay).format(DATE_TIME_FORMAT);
      
    } else {
      // If the conversion type is not "START_OF_DAY", assume it's "END_OF_DAY"
      // Create a Date object from the input date and set the time to the end of the day (23:59:59.999)
      const endOfDay = new Date(date).setHours(23, 59, 59, 999);
      // Convert the end of the day to UTC using dayjs.utc()
      return dayjs.utc(endOfDay).format(DATE_TIME_FORMAT);
    }
  }
  return '';
}


export function utcToLocalTime(dateTime) {
  // Check if the date is provided
  if (dateTime) {
    // Format the date using Day.js and the specified TIME_FORMAT
    return dayjs.utc(dateTime).local().format(TIME_FORMAT);
  }

  // Return an empty string if no date is provided
  return '';
};

/**
 * @param {String} date - ISO 8601 or RFC 2822 format
 * @return {String} formatted local date
 */
export const utcToLocalDate = (date) => {
  const myDate = dayjs.utc(date).local();
  if (myDate.isValid()) {
    return myDate.format(DATE_FORMAT);
  }

  return "";
};

/**
 * Use this method to show date in application
 *
 * @param {String} date         - ISO 8601 or RFC 2822 format
 * @param {bool} isUTC - if incoming date in UTC and we want to show in local time
 *
 * @return {string} formatted  date in format "YYYY-MM-DD"
 */
export function getFormattedDate(date, isUTC = true) {
  if (date) {
    const myDate = isUTC ? dayjs.utc(date).local().format(DATE_FORMAT) : dayjs(date, { locale: "en" }).format(DATE_FORMAT);
    if (myDate) {
      return myDate;
    }
  }

  return '';
};

export function getFormattedDateTime(date, isUTC = true) {
  if (date) {
    const myDate = isUTC ? dayjs.utc(date).local().format(DATE_TIME_FORMAT) : dayjs(date, { locale: "en" }).format(DATE_TIME_FORMAT);
    if (myDate) {
      return myDate;
    }
  }

  return '';
};

export function isSame(oldDateTime, newDateTime) {
  return dayjs(oldDateTime).isSame(dayjs(newDateTime));
};


