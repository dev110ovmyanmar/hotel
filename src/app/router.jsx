import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Loader from "../component/Loader/Loader.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";
import { ToastContainer } from "react-toastify";
import { loadState } from "../utils/Utils.js";
import { LOCAL_STORAGE_KEYS } from "../variables/constants.js";

const AuthLayout = lazy(() => import("../component/Layout/AuthLayout.jsx"));
const SignInLazy = lazy(
  () => import("../pages/Authentication/Signin/SigninPage.jsx"),
);

const ProtectedRoute = ({ redirectPath = "/signin" }) => {
  const storedValue = loadState(LOCAL_STORAGE_KEYS.sessionId) || "";

  if (storedValue) {
    return <Outlet />;
  } else {
    return <Navigate to={redirectPath} replace />;
  }
};

export default function Routes() {
  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="w-full h-screen grid items-center">
            <Loader />
          </div>
        }
      >
        <Router>
          <Switch>
            <Route path="/signin" element={<SignInLazy />} />
             <Route element={<ProtectedRoute />}>
            <Route path="/*" element={<AuthLayout />} />
            </Route>
          </Switch>
          <ToastContainer />
        </Router>
      </Suspense>
    </ErrorBoundary>
  );
}
