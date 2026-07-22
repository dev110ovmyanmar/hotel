import React, { useMemo, useState } from "react";
import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { authRoutes } from "../Layout/AuthRoutes";
import usePermission from "../../hooks/usePermission";
import { useSelector } from "react-redux";
import LeavePageModal from "../../pages/Reservation/LeavePageModal";
import { createReservationSelector } from "../../services/createReservationSlice";

const SidebarContent = ({
  onClick,
  sideBarMenuColor,
  isCollapsed
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { hasPermission, permissions: userPermissions } = usePermission();

  const { hasUnsavedForm , isSubmitted} = useSelector(createReservationSelector);

  const [leavePageModalOpen, setLeavePageModalOpen] = useState(false);
  const [pendingPath, setPendingPath] = useState(null);

  const handleMenuItemClick = (path) => {
    if (hasUnsavedForm && !isSubmitted) {
      setLeavePageModalOpen(true);
      setPendingPath(path);
      return
    }
    else {
      navigate(path);
      if (onClick) onClick();
    }
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
        if (route.permission && !hasPermission(route.permission)) return false;
        return true;
      })
      .map((route) => {
        const { path, label, icon, nested, key, id } = route;

        // If there are nested routes, recurse
        if (nested) {
          const children = getMenuItems(nested);
          // If no children are accessible, don't return the parent
          if (children.length === 0) return null;

          return {
            key: id || path,
            id,
            label,
            icon,
            children,
          };
        }

        // Standard menu item
        return {
          key: id || path,
          id,
          label,
          icon,
          onClick: () => handleMenuItemClick(path),
          className: location.pathname === path ? "custom-selected-item" : location.pathname === id ? "custom-selected-nested-item" : "",
        };
      })
      .filter(Boolean); // Remove null entries from filtered permissions
  };

  // Memoize the items to prevent unnecessary re-renders
  const menuItems = useMemo(() => getMenuItems(authRoutes), [authRoutes, userPermissions, location.pathname, hasUnsavedForm, isSubmitted]);

  const findParentKey = (items, pathname, parentKey = null) => {
    for (const item of items) {

      // Match by id
      if (item.id && pathname.startsWith(item.id)) {
        return parentKey || item.key;
      }

      if (item.children) {
        const found = findParentKey(
          item.children,
          pathname,
          item.key
        );

        if (found) {
          return found;
        }
      }
    }

    return null;
  };

  const selectedKey = isCollapsed
    ? findParentKey(menuItems, location.pathname)
    : location.pathname.includes("/reservations")
      ? "/reservations"
      : location.pathname;

  return (
    <>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        className={`
        ${sideBarMenuColor}
        ${isCollapsed ? "collapsed-menu" : "expanded-menu"}
      `}
      />

      <LeavePageModal
        leavePageModalOpen={leavePageModalOpen}
        setLeavePageModalOpen={setLeavePageModalOpen}
        pendingPath={pendingPath}
      />
    </>
  );
};

export default SidebarContent;