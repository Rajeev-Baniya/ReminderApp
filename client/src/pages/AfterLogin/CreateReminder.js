import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGlobalContext } from "../../context";
import { Redirect } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

const CreateReminder = () => {
  const { showErrors, setShowErrors, postReminder, setPostReminder } =
    useGlobalContext();
  const [redirect, setRedirect] = useState(false);
  const { title, description, date } = postReminder;
  const onChange = (e) => {
    setPostReminder({ ...postReminder, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const newReminder = {
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
      const body = JSON.stringify(newReminder);
      const res = await axios.post(
        "http://localhost:5000/reminder/create",
        body,
        config
      );
      console.log(res.data);
      if (res.data.status === "success") {
        console.log(res.data);
        setPostReminder([]);
        setRedirect(true);
      } else {
        const values = res.data.data;
        const newValue = Object.values(values);
        setShowErrors(newValue);
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
    <div className="container">
      <form onSubmit={(e) => onSubmit(e)} className="mx-auto">
        <h3 className="loginh">Create Reminder</h3>
        {showErrors.map((item, index) => {
          return (
            <p key={index} className="error">
              {item}
            </p>
          );
        })}

        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            className="form-control"
            onChange={(e) => onChange(e)}
            value={title}
            name="title"
            placeholder="Title"
            autoComplete="off"
            required
          />
          <label>Description:</label>
          <input
            type="text"
            className="form-control"
            name="description"
            placeholder="Description"
            onChange={(e) => onChange(e)}
            value={description}
            autoComplete="off"
            required
          />
          <label>Date:</label>
          <br />
          <input
            type="date"
            className="form-control"
            name="date"
            placeholder="Date"
            autoComplete="off"
            onChange={(e) => onChange(e)}
            value={date}
            required
          />

          {/* <DatePicker
            onChange={(date) => setPostReminder({ ...postReminder, date })}
            value={date}
            className="form-control"
            name="date"
            selected={date}
            showTimeSelect="true"
          />
          <br /> */}

          <input type="submit" className="btn btn-primary" />
        </div>
      </form>
      {redirect ? <Redirect to="/home" /> : null}
    </div>
  );
};

export default CreateReminder;
