import { Divider } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import StepsComponent from "../Steps/StepsComponent";
import NightAuditTopBar from "../../pages/NightAudit/NightAuditTopBar";
import NightAuditTopBarBeforeLock from "../../pages/NightAudit/NightAuditTopBarBeforeLock";
import { getNightAuditData } from "../../variables/constants";

const Breadcrumbs = () => {
  const location = useLocation();

  const nightAuditData = getNightAuditData();
  
  const isLocked = nightAuditData?.isLocked;

  if (location.pathname.includes("/night-audit") && !isLocked) {
    return (
      <NightAuditTopBarBeforeLock />
    );
  }

  if (location.pathname.includes("/night-audit/") && isLocked) {
    return (
      <NightAuditTopBar />
    );
  }

  let currentLink = "";

  const crumbs = location.pathname
    .split("/")
    .filter((crumb) => crumb !== "")
    .map((crumb, index, array) => {
      currentLink += `/${crumb}`;

      let displayName = crumb
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      // Replace UUIDs with cached Reservation ID if available
      if (crumb.length >= 32) {
        const storedName = sessionStorage.getItem(`breadcrumb_${crumb}`);
        if (storedName) {
          displayName = storedName;
        }
      }

      return (
        <span key={currentLink}>
          {index === 0 || index === 1 || index === 2 || index === 3 ? (
            <span style={{ color: "#555", margin: "10px", disabled: "true" }} className="dark:!text-gray-200">
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

  return <div className="breadcrumbs">{crumbs}</div>;
};

export default Breadcrumbs;
