import { loadState } from "../utils/Utils";
import { LOCAL_STORAGE_KEYS } from "../variables/constants";
import { authSelector } from "../services/authSlice";
import React from "react";
import { useSelector } from "react-redux";

const usePermission = () => {
  // const permissions = loadState(LOCAL_STORAGE_KEYS.initPermissions) || [];
  const { permissions } = useSelector(authSelector);

  const hasPermission = (permission) => {
    if (!permission) return true; // No permission required, allow by default

    if (Array.isArray(permission)) {
      // If any of the permissions match, allow
      return permission.some((p) => permissions?.includes(p));
    }

    return permissions?.includes(permission);
  };

  return { hasPermission, permissions };
};

export default usePermission;