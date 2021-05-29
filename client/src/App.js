import React from "react";
import NavbarC from "./components/NavbarC";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./pages/BeforeLogin/Login";
import Register from "./pages/BeforeLogin/Register";
import Error from "./pages/Error";
import Home from "../src/components/Home";
import AllReminders from "./pages/AfterLogin/AllReminders";
import CreateReminder from "./pages/AfterLogin/CreateReminder";
import UserProfile from "./components/UserProfile";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <NavbarC />
      <Switch>
        <Route exact path="/">
          <Login />
        </Route>
        <Route exact path="/register">
          <Register />
        </Route>
        <Route path="/home">
          <Home />
        </Route>
        <Route exact path="/all_reminders">
          <AllReminders />
        </Route>
        <Route exact path="/create_reminder">
          <CreateReminder />
        </Route>
        <Route exact path="/user_profile">
          <UserProfile />
        </Route>
        <Route path="*">
          <Error />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
