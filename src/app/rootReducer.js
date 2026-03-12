import { combineReducers } from "redux";
import appReducer from "../services/appSlice";
import adminProfileReducer from './../services/profileDetailsSlice';
import categoryReducer from '../services/categorySlice';
import unitReducer from '../services/unitSlice';

const reducer = combineReducers({
    app: appReducer,
    adminProfile: adminProfileReducer,
    category: categoryReducer,
    unit: unitReducer
});

const rootReducer = (state, action) => {
  if (action.type === "/logout") {
    state = undefined;
  }
  return reducer(state, action);
};

export default rootReducer;