import { ACTIVE } from '../variables/constants';
import Toast from '../component/Toast/Toast';

export const initialiseSelector = (reducer) => {
  if (reducer) {
    const { data = {}, isPending, meta = {} } = reducer;
    const selectedData = {
      data,
      isPending,
      paginations: meta.paginations,
    };
    return selectedData;
  }
  return {
    data: {},
    isPending: true,
    hasError: false,
  };
};

export const updateCounts = (state, statusName) => {
  const { count } = state;
  const { totalCount, activeCount, inactiveCount } = count;

  const updatedCount = {
    ...count,
    totalCount: parseInt(totalCount) + 1,
    activeCount: statusName === ACTIVE ? parseInt(activeCount) + 1 : parseInt(activeCount),
    inactiveCount: statusName !== ACTIVE ? parseInt(inactiveCount) + 1 : parseInt(inactiveCount),
  };

  return updatedCount;
}

export const loadState = key => {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (key, value) => {
  try {
    const serializedState = JSON.stringify(value);
    localStorage.setItem(key, serializedState);
  } catch {
    // ignore write errors
  }
};

export const isServer = typeof window === 'undefined';



const extractFromNRCPassport = (nrcPassport, index, separator) => {
  if (isNRC(nrcPassport)) {
    const parts = nrcPassport.split(separator);
    if (parts.length > index) {
      return parts[index];
    }
  }
  return null;
};

export const isNRC = (nrc) => {
  return /^\d+\//.test(nrc);
};

export const getRegionId = (nrcPassport) => extractFromNRCPassport(nrcPassport, 0, '/');

export const getTownship = (nrcPassport) => {
  const townshipPart = extractFromNRCPassport(nrcPassport, 1, '/');
  return townshipPart ? townshipPart.split('(')[0] : null;
};

export const getCitizenshipTier = (nrcPassport) => {
  const match = nrcPassport?.match(/\((.*?)\)/);
  return match ? `(${match[1]})` : null;
};

export const getNRCNumber = (nrcPassport) => {
  const nrcNumberPart = extractFromNRCPassport(nrcPassport, 1, '/');
  return nrcNumberPart ? nrcNumberPart?.split(')')[1] : null;
};

/**
 * Capitalizes the first letter of a string.
 * @param {string} str - The input string.
 * @returns {string} - The string with the first letter capitalized.
 */
export const capitalizeFirstLetter = (str) => {
  if (str) {
    // Capitalize the first character of the string using charAt(0) and toUpperCase()
    const firstLetter = str.charAt(0).toUpperCase();
    // Concatenate the capitalized first letter with the rest of the string (excluding the first character)
    const restOfStr = str.slice(1);
    // Return the modified string
    return firstLetter + restOfStr;
  } else {
    return null;
  }
}

/**
 * Use this method to check file size and type
 *
 * @param {File} file
 * @param {boolean} isVideo true if it's video
 *
 * @return {boolean} false if file type or size is not valid
 */
export function validateFile(file) {
  const isValidType =
    file.type === "image/jpeg" ||
    file.type === "image/png" ||
    file.type === "image/jpg" ||
    file.type === "image/jfif" ||
    file.type === "image/gif"

  if (!isValidType) {
    Toast.error("You can only upload JPG/PNG/JPEG/GIF file!");
  }

  return isValidType;
}

/**
 * Use this method to get NRC
 *
 * @param nrcNo
 * @param nrcName
 * @param nrcType
 * @param nrcPassport
 *
 * @return {string} 
 */
export function getNrc({ nrcNo, nrcName, nrcType, nrcPassport }) {
  return nrcNo + "/" + nrcName + "(" + nrcType + ")" + nrcPassport;
}


export const validatePhoneNumber = (_, value) => {
  if (!value) {
    return Promise.resolve();
  }

  if (value.startsWith("09") && value.length !== 11) {
    return Promise.reject(
      new Error("Please Valid Phone Number")
    )
  }

  if (value.startsWith("9") && value.length !== 10) {
    if (value.length === 9) {
      return Promise.reject(
        new Error("If your phone number is already start with 9, put another 9 in front of your number")
      )
    } else {
      return Promise.reject(
        new Error("Please Valid Phone Number")
      )
    }

  }

  if (value.length < 9) {
    return Promise.reject(
      new Error("Please Valid Phone Number")
    );
  }

  return Promise.resolve();
};

// For Rate and Inventory Calendar's component
export const darkModeStyle = `
    dark:!bg-[#141414]
    dark:!border-[#dee2e6] 
    dark:!text-gray-200
`;

// Agency Contract and Company Contract
export const partnerDarkModeStyle = `
    dark:border dark:border-gray-600 dark:!bg-gray-900 
    dark:text-gray-100
`;

// Maintenance Request and House Keeping
export const houseKeepingAndMaintenanceRequestDarkMode = `
        dark:bg-[#141414]
        hover:bg-blue-50 
        hover:text-blue-500
    `;


// Room and Room Type Form
export const roomAndRoomTypeDarkMode = `
    dark:border dark:border-gray-200 dark:bg-[#141414]!
    dark:text-gray-100
  `;


// all text to white
export const textWhiteInDarkStyle = `
  dark:!text-gray-200
`;

export const textGrayInDarkStyle = `
  dark:!text-gray-400
`;

export const textBlackInDarkStyle = `
  dark:!text-gray-900
`;

// change room (select hover for available rooms)
export const selectedDarkMode = `
  dark:!bg-blue-900/50
  dark:!border-gray-900
`;


// upgrade room (table's upgrade room)
export const upgradeAndDownRoomDarkMode = `
  dark:!bg-purple-900/20
`;

// Stay Extension (Add Room)
export const borderDarkMode = `
  dark:!border-gray-800
`;

// CI/CO
export const textColorDarkMode =  `
  dark:!text-blue-500
`;