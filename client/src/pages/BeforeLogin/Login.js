import axios from "axios";
import React, { useEffect } from "react";

import { Link } from "react-router-dom";
import { useGlobalContext } from "../../context";
const Login = () => {
  const {
    loginData,
    setLoginData,
    showErrors,
    setShowErrors,
    loggedIn,
    IsLoggedIn,
    responseData,
    setResponseData,
  } = useGlobalContext();
  const { email, password } = loginData;
  const onChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      email,
      password,
    };
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = JSON.stringify(newUser);
      const res = await axios.post(
        "http://localhost:5000/users/login",
        body,
        config
      );
      if (res.data.status === "success") {
        localStorage.setItem("myState", true);
        //console.log(res.data);
        IsLoggedIn(localStorage.getItem("myState"));
        console.log(loggedIn);
        setResponseData(res.data);
        localStorage.setItem("token", res.data.data.token);
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
        <h3 className="loginh">Login</h3>
        {showErrors.map((item, index) => {
          return (
            <p key={index} className="error">
              {item}
            </p>
          );
        })}
        <div className="form-group">
          <label>Email:</label>
          <input
            type="text"
            className="form-control"
            name="email"
            required
            placeholder="Email"
            autoComplete="off"
            onChange={(e) => onChange(e)}
          />
          <label>Password:</label>
          <input
            type="password"
            className="form-control"
            name="password"
            placeholder="Password"
            autoComplete="off"
            onChange={(e) => onChange(e)}
            required
          />
          <input type="submit" className="btn btn-primary" value="Login" />
          <hr />
          <p>
            Not registered yet? <Link to="/register"> Register </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
