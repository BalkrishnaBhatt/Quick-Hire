import "./assets/main.css";
import "./App.css";

import { Switch, Route, Redirect } from "react-router-dom";

import Login from "./pages/login";
import ForgotPassword from "./pages/forgotPassword";
import ResetPassword from "./pages/resetPassword";

import Dashboard from "./pages/dashboard";

function App() {
  return (
    <Switch>
      <Route path="/home" component={Dashboard} />
      <Route path="/reset-password" exact component={ResetPassword} />
      <Route path="/forgot-password" exact component={ForgotPassword} />
      <Route path="/login" exact component={Login} />
      <Redirect from="/" to="/login" />
    </Switch>
  );
}

export default App;
