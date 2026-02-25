import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { createLogger } from "redux-logger";

const logger = createLogger({
  level: "log",
  collapsed: true,
});

export default configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: process.env.NODE_ENV !== "production",
});
