import { Navigate } from "react-router-dom";
import { loadState } from "../utils/Utils";
import { LOCAL_STORAGE_KEYS } from "../variables/constants";
import { useSelector } from "react-redux";
import { authSelector } from "../services/authSlice";

const PermissionRoute = ({ children, permission }) => {
  const {permissions} = useSelector(authSelector)

  if (!permission) {
    return children;
  }

  if (permissions.includes(permission)) {
    return children;
  }

  return <Navigate to="/dashboard" replace />;
};

export default PermissionRoute;