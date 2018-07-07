import React from "react";
import { Route, Switch } from "react-router-dom";
import ForgotPasswordController from "../Auth/ForgotPasswordController";
import ResetPasswordController from "../Auth/ResetPasswordController";
import SignInController from "../Auth/SignInController";
import SignUpController from "../Auth/SignUpController";
import VerifyEmailController from "../Auth/VerifyEmailController";
import Contact from "../Contact";
import Health from "../Health";
import Home from "../Home";
import NotFound from "../NotFound";
import WithAuth from "../Wrapper/WithAuth";
import AuthRoutes from "./AuthRoutes";
import NoteRoutes from "./NoteRoutes";

export default () => (
  <Switch>
    <Route exact={true} path="/" component={Home} />
    <Route exact={true} path="/health" component={Health} />
    <Route exact={true} path="/contact" component={Contact} />
    <Route
      exact={true}
      path="/sign-in"
      component={WithAuth(SignInController, false, "/", "/sign-in")}
    />
    <Route
      exact={true}
      path="/sign-up"
      component={WithAuth(SignUpController, false, "/", "/sign-up")}
    />
    <Route
      exact={true}
      path="/forgot-password"
      component={WithAuth(
        ForgotPasswordController,
        false,
        "/",
        "/forgot-password"
      )}
    />
    <Route
      exact={true}
      path="/verify-email/:verificationToken"
      component={VerifyEmailController}
    />
    <Route
      exact={true}
      path="/verify-email"
      component={VerifyEmailController}
    />
    <Route
      exact={true}
      path="/reset-password/:verificationToken"
      component={WithAuth(
        ResetPasswordController,
        false,
        "/",
        "/reset-password"
      )}
    />
    <Route
      exact={true}
      path="/reset-password"
      component={WithAuth(
        ResetPasswordController,
        false,
        "/",
        "/reset-password"
      )}
    />

    <Route path="/auth" component={WithAuth(AuthRoutes, true, "/", "/auth")} />
    <Route path="/note" component={NoteRoutes} />
    <Route component={NotFound} />
  </Switch>
);
