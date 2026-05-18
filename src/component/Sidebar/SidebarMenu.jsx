import React, { useMemo } from "react";
import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { authRoutes } from "../Layout/AuthRoutes";
import { loadState } from "../../utils/Utils";
import { LOCAL_STORAGE_KEYS } from "../../variables/constants";

const SidebarContent = ({ 
  onClick,
  sideBarMenuColor
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const userPermissions = useMemo(() => 
    loadState(LOCAL_STORAGE_KEYS.initPermissions) || [], 
  []);

  const handleMenuItemClick = (path) => {
    navigate(path);
    if (onClick) onClick();
  };

  /**
   * Helper to check access and format the object for Ant Design 'items'
   */
  const getMenuItems = (routes) => {
    return routes
      .filter((route) => {
        // 1. Basic visibility check
        if (!route.label || !route.icon) return false;
        // 2. Permission check
        if (route.permission && !userPermissions.includes(route.permission)) return false;
        return true;
      })
      .map((route) => {
        const { path, label, icon, nested, key } = route;

        // If there are nested routes, recurse
        if (nested) {
          const children = getMenuItems(nested);
          // If no children are accessible, don't return the parent
          if (children.length === 0) return null;

          return {
            key: key || path,
            label,
            icon,
            children,
          };
        }

        // Standard menu item
        return {
          key: path,
          label,
          icon,
          onClick: () => handleMenuItemClick(path),
          className: location.pathname === path ? "custom-selected-item" : "",
        };
      })
      .filter(Boolean); // Remove null entries from filtered permissions
  };

  // Memoize the items to prevent unnecessary re-renders
  const menuItems = useMemo(() => getMenuItems(authRoutes), [authRoutes, userPermissions, location.pathname]);

  return (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      items={menuItems}
      className={sideBarMenuColor}
    />
  );
};

export default SidebarContent;