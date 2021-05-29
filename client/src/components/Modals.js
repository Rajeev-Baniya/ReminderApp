import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { useGlobalContext } from "../context";
import axios from "axios";

const Modals = ({ idd, titlee, datee, descriptionn }) => {
  const { modalOpen, isModalOpen, showErrors, setShowErrors } =
    useGlobalContext();

  const [editData, setEditData] = useState({
    title: titlee,
    description: descriptionn,
    date: datee.substring(0, 10),
  });
  const { title, description, date } = editData;

  const onChange = (e) =>
    setEditData({ ...editData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    const user = {
      title,
      description,
      date,
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
        `http://localhost:5000/reminder/update/${idd}`,
        body,
        config
      );

      if (res.data.status === "success") {
        console.log(res.data);
        isModalOpen(false);
        console.log(modalOpen);
      } else {
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

  return (
    <>
      <Modal show={modalOpen} onHide={() => isModalOpen(false)} id={idd}>
        <Modal.Header closeButton>
          <Modal.Title>Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={(e) => onSubmit(e)} className="mx-auto">
            {showErrors.map((item, index) => {
              return (
                <p key={index} className="error">
                  {item}
                </p>
              );
            })}
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                className="form-control"
                name="title"
                placeholder="Title"
                autoComplete="off"
                onChange={(e) => onChange(e)}
                value={title}
              />
            </div>

            <div className="form-group">
              <label>Description:</label>
              <input
                type="text"
                className="form-control"
                name="description"
                placeholder="Description"
                autoComplete="off"
                onChange={(e) => onChange(e)}
                value={description}
              />
            </div>

            <div className="form-group">
              <label>Date:</label>
              <input
                type="Date"
                className="form-control"
                name="Date"
                placeholder="Date"
                autoComplete="off"
                value={date}
                onChange={(e) => onChange(e)}
              />
            </div>

            <Button type="submit" variant="primary">
              Save changes
            </Button>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => isModalOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Modals;
