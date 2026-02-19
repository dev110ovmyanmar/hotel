import axios from "axios";
import Base64 from "crypto-js/enc-base64";
import Utf8 from "crypto-js/enc-utf8";
import Logger from "./apiLogger";
import { getAuthorization, getContentMD5, loadState, getDate } from "../utils";
import { sessionExpired } from "../services/appSlice";
import {
  ACCESS_KEY_ID,
  HASH_SIGN_KEY,
  LOCAL_STORAGE_KEYS,
  SECRET_ACCESS_KEY,
  SERVER_ERROR_CODES,
} from "../variables/constants";
import store from "./store";
import Toast from "../component/Toast/Toast";
import { deviceId, deviceName } from "../utils/deviceInfo";

// Set up axios response interceptor
export const setupResponseInterceptor = () => {
  axios.interceptors.response.use(
    (response) => {
      Logger.describeSuccessResponse(response);
      return response;
    },
    (error) => {
      Logger.describeErrorResponse(error);
      handleSessionExpiration(error, store);
      return Promise.reject(error); // Reject with parsed error
    },
  );
};

// Handle session expiration errors
const handleSessionExpiration = (error) => {
  const parsedError = error?.response?.data?.error;
  if (parsedError?.code === SERVER_ERROR_CODES.sessionExpired) {
    store.dispatch(sessionExpired(true));
  } else {
    Toast.error(error.response.data.error.text);
  }
};

// Set up axios request interceptor
export const setupRequestInterceptor = () => {
  axios.interceptors.request.use(
    (config) => {
      config.params = appendCommonParams(config.method, config.params);
      config.data = appendCommonData(config.method, config.data);

      const requestData = config.method === "get" ? config.params : config.data;
      config.headers = generateHeaders(
        config.method,
        requestData,
        config.isMultipart,
      );

      Logger.describeRequest(config);

      if (config.method === "get") {
        config.params = convertParamsToBase64(config.params);
      }

      return config;
    },
    (error) => Promise.reject(error),
  );
};

// Append common parameters to request params or data
const appendCommonParams = (method, params) => {
  if (method === "get") {
    return {
      ...params,
    };
  }
  return params;
};

const appendCommonData = (method, data = {}) => {
  if (method !== "get") {
    return {
      ...data,
    };
  }
  return data;
};

const getDeviceId = () => deviceId();
const getDeviceName = () => deviceName();

// Convert parameters to Base64 for GET requests
const convertParamsToBase64 = (params) => {
  const base64String = Base64.stringify(Utf8.parse(JSON.stringify(params)));
  return { data: base64String };
};

// Generate headers for requests
const generateHeaders = (method, data, isMultipart) => {
  return isMultipart
    ? generateMultipartHeaders(method)
    : generateJsonHeaders(method, data);
};

// Generate headers for multipart/form-data requests
const generateMultipartHeaders = (method) => {
  const data = generateCommonHeadersData();
  const { iso8601Date, rfc2822Date } = getDate();
  const contentMd5 = getContentMD5(data);

  return {
    "Content-Type": "multipart/form-data",
    "Content-MD5": contentMd5,
    "platform-origin": "portal",
    content: Base64.stringify(Utf8.parse(JSON.stringify(data))),
    "Auth-Date": rfc2822Date,
    sessionToken: loadState(LOCAL_STORAGE_KEYS.sessionId) || "",
    "device-id": getDeviceId,
    "device-name": getDeviceName,
  };
};

// Generate headers for application/json requests
const generateJsonHeaders = (method, data) => {
  const { iso8601Date, rfc2822Date } = getDate();
  const contentMd5 = getContentMD5(data);
  const sessionId = loadState(LOCAL_STORAGE_KEYS.sessionId) || "";

  return {
    "Content-Type": "application/json",
    "Content-MD5": contentMd5,
    "platform-origin": "portal",
    "Auth-Date": rfc2822Date,
    Authorization: generateAuthorizationHeader(
      method.toUpperCase(),
      contentMd5,
      "application/json",
      iso8601Date,
    ),
    ...(sessionId && { sessionToken: sessionId }),

    "device-id": getDeviceId,
    "device-name": getDeviceName,
  };
};

// Generate common data for headers
const generateCommonHeadersData = () => ({
  accessKey: ACCESS_KEY_ID,
});

// Generate authorization header
const generateAuthorizationHeader = (
  method,
  contentMd5,
  contentType,
  iso8601Date,
) => {
  return getAuthorization({
    method,
    contentMd5,
    contentType,
    date: iso8601Date,
    hashSignKey: HASH_SIGN_KEY,
    accessKeyId: ACCESS_KEY_ID,
    secretAccesskey: SECRET_ACCESS_KEY,
  });
};
