import { Divider } from "antd";
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();

  let currentLink = "";

  const crumbs = location.pathname
    .split("/")
    .filter((crumb) => crumb !== "")
    .map((crumb, index, array) => {
      currentLink += `/${crumb}`;

      const displayName = crumb
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      return (
        <span key={currentLink}>
          {index === 0 ? (
            <span style={{ color: "#555", margin: "10px" }}>
              {displayName}
            </span>
          ) : (
            <Link
              to={currentLink}
              style={{ color: "#555", textDecoration: "none", margin: "10px" }}
            >
              {displayName}
            </Link>
          )}

          {index < array.length - 1 && "/"}
        </span>
      );
    });

  return (
    <div className="breadcrumbs">
      {crumbs}
      <Divider className="custom-divider" />
    </div>
  );
};

export default Breadcrumbs;