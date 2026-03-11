// import React from "react";
// import { Menu } from "antd";
// import { useNavigate, useLocation } from "react-router-dom";
// import { authRoutes } from "../Layout/AuthRoutes";
// import { loadState } from "../../utils/Utils";
// import { LOCAL_STORAGE_KEYS, ADMIN } from "../../variables/constants";

// const { SubMenu } = Menu;

// const SidebarContent = ({ onClick }) => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const handleMenuItemClick = (path) => {
//     navigate(path);
//     onClick();
//   };

//   const renderMenuItem = ({ path, label, icon, hasLineBreak }) => (
//     <React.Fragment key={path}>
//       {hasLineBreak && <div key={path} />}
//       <Menu.Item
//         key={path}
//         icon={icon}
//         className={"/"+location.pathname.split("/")[1] === path ? "custom-selected-item" : ""}
//         onClick={() => handleMenuItemClick(path)}
//       >
//         {label}
//       </Menu.Item>
//     </React.Fragment>
//   );

//   const renderSubMenu = ({ key, label, icon, nested }) => (
//     <SubMenu key={key} icon={icon} title={label}>
//       {nested.map((subRoute) => (
//         <Menu.Item
//           key={subRoute.path}
//           className={"/"+location.pathname.split("/")[1] === subRoute.path ? "custom-selected-item" : ""}
//           icon={subRoute.icon}
//           onClick={() => handleMenuItemClick(subRoute.path)}
//         >
//           {subRoute.label}
//         </Menu.Item>
//       ))}
//     </SubMenu>
//   );

//   return (
//     <Menu mode="inline" defaultSelectedKeys={[location.pathname]}>
//       {authRoutes
//         .filter(({ label, icon }) => label && icon)
//         .map(({ key, path, label, icon, nested, hasLineBreak, isPrivate }) => {
//           if (isPrivate && loadState(LOCAL_STORAGE_KEYS.adminRole) === ADMIN) {
//             return null;
//           }
//           return nested
//             ? renderSubMenu({ key, label, icon, nested })
//             : renderMenuItem({ path, label, icon, hasLineBreak });
//         })}
//     </Menu>
//   );
// };

// export default SidebarContent;


import React from "react";
import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { authRoutes } from "../Layout/AuthRoutes";
import { loadState } from "../../utils/Utils";
import { LOCAL_STORAGE_KEYS } from "../../variables/constants";

const { SubMenu } = Menu;

const SidebarContent = ({ onClick }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Load the permissions array from Local Storage
  const userPermissions = loadState(LOCAL_STORAGE_KEYS.initPermissions) || [];

  const handleMenuItemClick = (path) => {
    navigate(path);
    if (onClick) onClick();
  };

  /**
   * Helper function to check if a route should be visible
   */
  const canAccess = (route) => {
    // If no permission is required, allow access
    if (!route.permission) return true;
    // Check if user's permission list includes the required permission
    return userPermissions.includes(route.permission);
  };

  const renderMenuItem = ({ path, label, icon }) => (
    <Menu.Item
      key={path}
      icon={icon}
      className={location.pathname === path ? "custom-selected-item" : ""}
      onClick={() => handleMenuItemClick(path)}
    >
      {label}
    </Menu.Item>
  );

  const renderSubMenu = ({ key, label, icon, nested }) => {
    // Filter nested items based on permissions
    const visibleNested = nested.filter(sub => canAccess(sub));

    // If no children are accessible, don't show the parent SubMenu at all
    if (visibleNested.length === 0) return null;

    return (
      <SubMenu key={key} icon={icon} title={label}>
        {visibleNested.map((subRoute) => (
          <Menu.Item
            key={subRoute.path}
            className={location.pathname === subRoute.path ? "custom-selected-item" : ""}
            icon={subRoute.icon}
            onClick={() => handleMenuItemClick(subRoute.path)}
          >
            {subRoute.label}
          </Menu.Item>
        ))}
      </SubMenu>
    );
  };

  return (
    <Menu mode="inline" selectedKeys={[location.pathname]}>
      {authRoutes
        .filter(({ label, icon }) => label && icon) // Ensure item has label/icon
        .map((route) => {
          const { key, path, label, icon, nested } = route;

          // 2. Logic for nested menus
          if (nested) {
            return renderSubMenu({ key, label, icon, nested });
          }

          // 3. Logic for single menu items
          if (canAccess(route)) {
            return renderMenuItem({ path, label, icon });
          }

          return null;
        })}
    </Menu>
  );
};

export default SidebarContent;