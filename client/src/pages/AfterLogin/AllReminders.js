import React, { useEffect } from "react";
import axios from "../../axios";
import { useGlobalContext } from "../../context";
import { Card, CardColumns } from "react-bootstrap";
import Edited from "../../components/Edited";
//import MyModal from "../../components/MyModal";

const AllReminders = () => {
  const { allData, setAllData, modalOpen, deleted, setDeleted } =
    useGlobalContext();

  useEffect(() => {
    axios
      .get("reminder/my_reminder")
      .then((response) => {
        if (response.data.status === "success") {
          //console.log(response.data);
          setAllData(response.data.data.reminders);
        }
      })
      .catch((err) => {
        console.error(err);
      });
    return () => {
      setDeleted(false);
    };
  }, [deleted, modalOpen]);
  if (allData.length < 1) {
    return (
      <div className="container-fluid">
        <p className="error">There is no reminder for today</p>{" "}
      </div>
    );
  }

  const Delete = async ({ id }) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.delete(
        `http://localhost:5000/reminder/delete/${id}`,
        config
      );
      //console.log(res.data);
      if (res.data.status === "success") {
        console.log("sucessfully deleted");
        setDeleted(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container-fluid">
      <CardColumns>
        {allData.map((item, index) => {
          return (
            <Card className="mt-3" key={item._id}>
              <Card.Body>
                <Card.Title>{item.title}</Card.Title>
                <Card.Subtitle>
                  <small className="mb-2 text-muted">
                    {" "}
                    {item.date.substring(0, 10)}{" "}
                  </small>
                </Card.Subtitle>
                <Card.Text>{item.description}</Card.Text>
              </Card.Body>
              <Card.Footer>
                <Edited
                  id={item._id}
                  title={item.title}
                  description={item.description}
                  date={item.date}
                  myindex={index}
                />
                <button
                  className="btn btn-danger btn-sm edit"
                  onClick={() => Delete({ id: item._id })}
                >
                  Delete
                </button>
              </Card.Footer>
            </Card>
          );
        })}
      </CardColumns>
    </div>
  );
};

export default AllReminders;
