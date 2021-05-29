import React, { useEffect } from "react";
import axios from "../axios";
//import axios from "axios";
import { useGlobalContext } from "../context";
import { Card, Button } from "react-bootstrap";
import EditUserProfile from "./EditUserProfile";

const UserProfile = () => {
  const { userProfile, setUserProfile, modalOpen } = useGlobalContext();
  useEffect(() => {
    axios
      .get("users/currentUser")
      .then((response) => {
        if (response.data.status === "success") {
          setUserProfile(response.data.data.user);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [modalOpen]);
  return (
    <div className="container">
      <Card className="text-center mt-3">
        <Card.Header>User Profile</Card.Header>
        <Card.Body>
          <Card.Title>Username: {userProfile.name}</Card.Title>
          <Card.Title>Email: {userProfile.email}</Card.Title>
          <Card.Title>Phone: {userProfile.phone}</Card.Title>
        </Card.Body>
        <EditUserProfile />
      </Card>
    </div>
  );
};

export default UserProfile;
