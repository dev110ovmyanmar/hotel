import React from "react";
import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { authRoutes } from "../Layout/AuthRoutes";
import { loadState } from "../../utils/Utils";
import { LOCAL_STORAGE_KEYS, ADMIN } from "../../variables/constants";

const { SubMenu } = Menu;

const SidebarContent = ({ onClick }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleMenuItemClick = (path) => {
    navigate(path);
    onClick();
  };

  const renderMenuItem = ({ path, label, icon, hasLineBreak }) => (
    <React.Fragment key={path}>
      {hasLineBreak && <div key={path} />}
      <Menu.Item
        key={path}
        icon={icon}
        className={"/"+location.pathname.split("/")[1] === path ? "custom-selected-item" : ""}
        onClick={() => handleMenuItemClick(path)}
      >
        {label}
      </Menu.Item>
    </React.Fragment>
  );

  const renderSubMenu = ({ key, label, icon, nested }) => (
    <SubMenu key={key} icon={icon} title={label}>
      {nested.map((subRoute) => (
        <Menu.Item
          key={subRoute.path}
          className={"/"+location.pathname.split("/")[1] === subRoute.path ? "custom-selected-item" : ""}
          icon={subRoute.icon}
          onClick={() => handleMenuItemClick(subRoute.path)}
        >
          {subRoute.label}
        </Menu.Item>
      ))}
    </SubMenu>
  );

  return (
    <Menu mode="inline" defaultSelectedKeys={[location.pathname]}>
      {authRoutes
        .filter(({ label, icon }) => label && icon)
        .map(({ key, path, label, icon, nested, hasLineBreak, isPrivate }) => {
          if (isPrivate && loadState(LOCAL_STORAGE_KEYS.adminRole) === ADMIN) {
            return null;
          }
          return nested
            ? renderSubMenu({ key, label, icon, nested })
            : renderMenuItem({ path, label, icon, hasLineBreak });
        })}
    </Menu>
  );
};

export default SidebarContent;
