import { combineReducers } from "redux";
import appReducer from "../services/appSlice";
import adminProfileReducer from './../services/profileDetailsSlice';

const reducer = combineReducers({
    app: appReducer,
    adminProfile: adminProfileReducer
});

const rootReducer = (state, action) => {
  if (action.type === "/logout") {
    state = undefined;
  }
  return reducer(state, action);
};

export default rootReducer;