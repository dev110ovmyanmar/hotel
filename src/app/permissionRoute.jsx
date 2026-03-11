import { Navigate } from "react-router-dom";
import { loadState } from "../utils/Utils";
import { LOCAL_STORAGE_KEYS } from "../variables/constants";

const PermissionRoute = ({ children, permission }) => {

  const permissions = loadState(LOCAL_STORAGE_KEYS.initPermissions) || [];

  if (!permission) {
    return children;
  }

  if (permissions.includes(permission)) {
    return children;
  }

  return <Navigate to="/dashboard" replace />;
};

export default PermissionRoute;