import React from "react";
import { Redirect } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useGlobalContext } from "../context";
import axios from "axios";

const NavbarC = () => {
  const { loggedIn, IsLoggedIn } = useGlobalContext();
  const logout = async () => {
    try {
      const myToken = localStorage.getItem("token");
      console.log(myToken);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${myToken}`,
        },
      };
      const res = await axios.post(
        "http://localhost:5000/users/logoutall",
        null,
        config
      );
      console.log(res.data);
      if (res.data.status === "success") {
        console.log("res.data");
        localStorage.removeItem("token");
        localStorage.removeItem("myState");
        IsLoggedIn(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const afterLogin = () => {
    return (
      <>
        <LinkContainer to="/home">
          <Navbar.Brand>Reminder-App</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <LinkContainer to="/home">
              <Nav.Link className="padding">Today's Reminder</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/create_reminder">
              <Nav.Link className="padding">Create Reminder</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/all_reminders">
              <Nav.Link className="padding">My Reminders</Nav.Link>
            </LinkContainer>
          </Nav>
          <Nav>
            <LinkContainer to="/user_profile">
              <Nav.Link className="padding">User profile</Nav.Link>
            </LinkContainer>
            <Nav.Link onClick={() => logout()} className="padding">
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </>
    );
  };
  const beforeLogin = () => {
    return (
      <>
        <LinkContainer to="/">
          <Navbar.Brand>Reminder-App</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <LinkContainer to="/">
              <Nav.Link className="padding">Login</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/register">
              <Nav.Link className="padding">Register</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </>
    );
  };
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      {IsLoggedIn(localStorage.getItem("myState"))}
      {loggedIn ? afterLogin() : beforeLogin()}
      {loggedIn ? <Redirect to="/create_reminder" /> : <Redirect to="/" />}
    </Navbar>
  );
};

export default NavbarC;
