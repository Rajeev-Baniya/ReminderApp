import React, { useEffect } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import { useGlobalContext } from "../context";
import axios from "../axios";
const EditUserProfile = () => {
  const {
    modalOpen,
    isModalOpen,
    showErrors,
    setShowErrors,
    editUserProfile,
    setEditUserProfile,
  } = useGlobalContext();
  const { name, phone, password, confirm_password } = editUserProfile;
  const onChange = (e) =>
    setEditUserProfile({ ...editUserProfile, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const user = {
      name,
      phone,
      password,
      confirm_password,
    };
    try {
      const myToken = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${myToken}`,
        },
      };
      const body = JSON.stringify(user);
      const res = await axios.put(
        "http://localhost:5000/users/update",
        body,
        config
      );
      //   const res = await axios.put("http://localhost:5000/users/update");
      if (res.data.status === "success") {
        isModalOpen(false);
        console.log(modalOpen);
        console.log(res.data);
        setEditUserProfile([]);
      } else {
        console.log(res.data);
        const values = res.data.data;
        const newValues = Object.values(values);
        setShowErrors(newValues);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowErrors([]);
    }, 5000);
    return () => {
      clearTimeout(timeout);
    };
  }, [showErrors]);
  const CloseModal = () => {
    isModalOpen(false);
    setEditUserProfile([]);
  };
  return (
    <>
      <Button variant="primary" onClick={() => isModalOpen(true)}>
        Edit User Profile
      </Button>
      <Modal show={modalOpen} onHide={() => CloseModal()}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showErrors.map((item, index) => {
            return (
              <p key={index} className="error">
                {item}
              </p>
            );
          })}
          <form onSubmit={(e) => onSubmit(e)} className="mx-auto">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                placeholder="Name"
                autoComplete="off"
                onChange={(e) => onChange(e)}
                value={name}
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="number"
                className="form-control"
                name="phone"
                placeholder="Phone No."
                autoComplete="off"
                onChange={(e) => onChange(e)}
                value={phone}
              />
            </div>

            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder="Password"
                autoComplete="off"
                value={password}
                onChange={(e) => onChange(e)}
              />
            </div>

            <div className="form-group">
              <label>Confirm Password:</label>
              <input
                type="password"
                className="form-control"
                name="confirm_password"
                placeholder="Password"
                autoComplete="off"
                value={confirm_password}
                onChange={(e) => onChange(e)}
              />
            </div>

            <Button type="submit" variant="primary">
              Save changes
            </Button>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => CloseModal()}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditUserProfile;
