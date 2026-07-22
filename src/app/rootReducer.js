import { combineReducers } from "redux";
import appReducer from "../services/appSlice";
import adminProfileReducer from './../services/profileDetailsSlice';
import authReducer from "../services/authSlice";
import createReservationReducer from "../services/createReservationSlice";

const reducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  adminProfile: adminProfileReducer,
  createReservation: createReservationReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "/logout") {
    state = undefined;
  }
  return reducer(state, action);
};

export default rootReducer;