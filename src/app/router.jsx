import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Loader from "../component/Loader/Loader";
import ErrorBoundary from "./ErrorBoundary";
import { ToastContainer } from "react-toastify";
import { loadState } from "../utils/Utils";
import { LOCAL_STORAGE_KEYS } from "../variables/constants";


const AuthLayout = lazy(() => import("../component/Layout/AuthLayout.jsx"));
// const SignInLazy = lazy(() => import("../pages/SignIn/SignIn"));
// const TermsPolicy = lazy(() => import("../pages/TermsAndPolicy/TermsAndPolicy"));
// const ContactUs = lazy(() => import("../pages/ContactUs/ContactUs"));
// const Welcome = lazy(() => import("../pages/Home/Home"));

// Protected Route
const ProtectedRoute = ({ redirectPath = "/dashboard" }) => {

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
      <Suspense fallback={<div className="w-full h-screen grid items-center" ><Loader /></div>}>
        <Router>
          <Switch>
            {/* <Route path="/" element={<Welcome />} /> */}
            {/* <Route path="/" element={<SignInLazy/>}/> */}
            {/* <Route path="/dashboard/signin" element={<SignInLazy />} />   */}
            {/* <Route path="/terms-policy" element={<TermsPolicy />} /> */}
            {/* <Route path="/contact-us" element={<ContactUs />} /> */}

            {/* <Route element={<ProtectedRoute />}> */}
              <Route path="/*" element={<AuthLayout />} />
            {/* </Route> */}
          </Switch>
          <ToastContainer />
        </Router>
      </Suspense>
    </ErrorBoundary>
  );
}
