import React from "react";
import Modal from "react-modal";

const MyModal = (props) => {
  return (
    <div>
      <Modal
        isOpen={props.open}
        shouldCloseOnOverlayClick={false}
        style={{
          background: {
            backgroundSize: "cover",
          },
          overlay: {
            position: "fixed",
          },
          content: {
            color: "maroon",
          },
        }}
      >
        <h2>{props.csid}</h2>
        <h3>Delete the user data</h3>

        <form>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="text"
              className="form-control"
              name="email"
              required
              placeholder="Email"
              autoComplete="off"
            />
          </div>
          <br />
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              className="form-control"
              name="password"
              required
              placeholder="Password"
              autoComplete="off"
            />
          </div>
          <br />
          <div className="form-group">
            <input
              type="submit"
              className="btn btn-primary"
              value="Delete User"
            />
          </div>
          <br />
          <button onClick={() => props.fun(false)} className="btn btn-danger">
            Close
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default MyModal;
