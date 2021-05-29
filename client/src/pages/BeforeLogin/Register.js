import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../../context";
import axios from "axios";

const Register = () => {
  const {
    registerData,
    setRegisterData,
    showErrors,
    setShowErrors,
    IsLoggedIn,
    responseData,
  } = useGlobalContext();
  const { name, email, phone, password, confirm_password } = registerData;

  const onChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      name,
      email,
      phone,
      password,
      confirm_password,
    };
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = JSON.stringify(newUser);
      const res = await axios.post(
        "http://localhost:5000/users/register",
        body,
        config
      );
      if (res.data.status === "success") {
        //console.log(res.data);
        IsLoggedIn(true);
        setRegisterData(res.data);
        console.log(responseData);
      } else {
        const values = res.data.data;
        const newValue = Object.values(values);
        setShowErrors(newValue);
      }
    } catch (error) {
      console.error(error.response.message);
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
        <h3 className="loginh">Register</h3>
        {showErrors.map((item, index) => {
          return (
            <p key={index} className="error">
              {item}
            </p>
          );
        })}

        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            className="form-control"
            onChange={(e) => onChange(e)}
            value={name}
            name="name"
            placeholder="Name"
            autoComplete="off"
            required
          />
          <label>Phone Number:</label>
          <input
            type="number"
            className="form-control"
            name="phone"
            placeholder="Phone Number"
            onChange={(e) => onChange(e)}
            value={phone}
            autoComplete="off"
            required
          />
          <label>Email:</label>
          <input
            type="text"
            className="form-control"
            name="email"
            placeholder="Email"
            autoComplete="off"
            onChange={(e) => onChange(e)}
            value={email}
            required
          />
          <label>Password:</label>
          <input
            type="password"
            className="form-control"
            name="password"
            placeholder="Password"
            autoComplete="off"
            onChange={(e) => onChange(e)}
            value={password}
            required
          />
          <label>Confirm_Password:</label>
          <input
            type="password"
            className="form-control"
            name="confirm_password"
            placeholder="Confirm_Password"
            autoComplete="off"
            onChange={(e) => onChange(e)}
            value={confirm_password}
            required
          />
          <input type="submit" className="btn btn-primary" />
          <hr />
          <p>
            Already have an account? <Link to="/"> Login </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
