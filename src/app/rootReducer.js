import { combineReducers } from "redux";
import appReducer from "../services/appSlice";

const reducer = combineReducers({
    app: appReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "/logout") {
    state = undefined;
  }
  return reducer(state, action);
};

export default rootReducer;