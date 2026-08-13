import { Navigate } from "react-router-dom";
import { loadState } from "../utils/Utils";
import { LOCAL_STORAGE_KEYS } from "../variables/constants";
import { useSelector } from "react-redux";
import { authSelector } from "../services/authSlice";

const PermissionRoute = ({ children, permission, requiredRole }) => {
  const {permissions} = useSelector(authSelector)
  const roleCode = loadState(LOCAL_STORAGE_KEYS.loginAdminDetails)?.role?.code;

  // Role-based access check (e.g. Night Audit requires front_office only)
  if (requiredRole) {
    if (roleCode?.startsWith(requiredRole)) {
      return children;
    }
    return <Navigate to="/dashboard" replace />;
  }

  // Super admin has access to everything (only if no requiredRole)
  if (roleCode === "super_admin") {
    return children;
  }

  if (!permission) {
    return children;
  }

  if (permissions?.includes(permission)) {
    return children;
  }

  return <Navigate to="/dashboard" replace />;
};

export default PermissionRoute;