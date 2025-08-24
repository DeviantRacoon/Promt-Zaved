import Router from "preact-router";

import Login from "./modules/auth";
import ForgotPassword from "./modules/auth/forgot/ForgotPassword";
import Register from "./modules/auth/create/Register";

import Prompt from "./modules/prompt";
import CreatePrompt from "./modules/prompt/Create";
import ConfigUser from "./modules/auth/create/ConfigUser";
import Setting from "./modules/prompt/Setting";

export function App() {

  return (
    <Router>
      <Login path="/" />
      <Register path="/register" />
      <ForgotPassword path="/forgot-password" />
      <Prompt path="/dashboard" />
      <ConfigUser path="/config-user" />
      <CreatePrompt path="/dashboard/create" />
      <CreatePrompt path="/dashboard/edit/:id" />
      <Setting path="/settings" />
    </Router>
  );
}
