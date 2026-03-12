
import { useSelector } from "react-redux";
import { authSelector } from "../services/authSlice";

const usePermission = () => {
  const permissions = useSelector(authSelector);

  const hasPermission = (permission) => {
    if (!permission) return true;
    return permissions.includes(permission);
  };

  return { hasPermission };
};

export default usePermission;