import { Divider } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import StepsComponent from "../Steps/StepsComponent";
import NightAuditBreadcrumbs from "../Steps/NightAuditBreadcrumbs";
import NightAuditTopBar from "../../pages/NightAudit/NightAuditTopBar";

const Breadcrumbs = () => {
  const location = useLocation();
  const [update, setUpdate] = useState(0);
  const [nightAuditStep, setNightAuditStep] = useState(0);
  const [nightAuditStarted, setNightAuditStarted] = useState(false);

  const nightAuditSteps = [
    "Pre Audit Check",
    "Check Booking",
    "Room Charge",
    "Unsettled Folios",
    "Night Audit Posting",
    "Create New Day",
  ];

  useEffect(() => {
    const handleUpdate = (event) => {
      setUpdate((prev) => prev + 1);

      if (event.detail?.stepValue !== undefined) {
        setNightAuditStep(event.detail.stepValue);
      }

      if (event.detail?.nightAuditStarted !== undefined) {
        setNightAuditStarted(event.detail.nightAuditStarted);
      }
    };

    window.addEventListener(
      "breadcrumb_updated",
      handleUpdate
    );

    return () => {
      window.removeEventListener(
        "breadcrumb_updated",
        handleUpdate
      );
    };
  }, []);

  // Custom Night Audit Breadcrumb
  if (location.pathname === "/night-audit" && nightAuditStarted) {
    return (
      <NightAuditTopBar nightAuditStep={nightAuditStep} nightAuditSteps={nightAuditSteps} />
    );
  }


  // useEffect(() => {
  //   const handleUpdate = () => setUpdate((prev) => prev + 1);
  //   window.addEventListener("breadcrumb_updated", handleUpdate);
  //   return () => window.removeEventListener("breadcrumb_updated", handleUpdate);
  // }, []);

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
