import React from "react";
//import { Button, Modal } from "react-bootstrap";
import { useGlobalContext } from "../context";
//import axios from "axios";
import Modals from "./Modals";
//import MyModal from "./MyModal";

const Edited = ({ id, title, description, date }) => {
  const { isModalOpen } = useGlobalContext();
  return (
    <>
      <button
        className="btn btn-primary btn-sm edit"
        onClick={() => {
          isModalOpen(true);
        }}
      >
        Edit
      </button>

      <Modals idd={id} titlee={title} descriptionn={description} datee={date} />
    </>
  );
};

export default Edited;
