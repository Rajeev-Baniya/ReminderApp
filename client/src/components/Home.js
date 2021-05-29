import React, { useEffect } from "react";
import { Card, CardColumns } from "react-bootstrap";
import { useGlobalContext } from "../context";
import axios from "axios";
import Edited from "../components/Edited";

const Home = () => {
  const { homeData, setHomeData, deleted, setDeleted, modalOpen, loggedIn } =
    useGlobalContext();
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/reminder/my_reminder/today", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.status === "success") {
          // console.log(response.data);
          setHomeData(response.data.data.reminders);
        }
      })
      .catch((err) => {
        console.error(err);
      });
    return () => setDeleted(false);
  }, [deleted, modalOpen, loggedIn]);
  if (homeData.length < 1) {
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
      console.log(res.data);

      if (res.data.status === "success") {
        console.log("sucessfully deleted");
        setDeleted(true);
        console.log(deleted);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container-fluid">
      <CardColumns>
        {homeData.map((item, index) => {
          return (
            <Card className="mt-3">
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

export default Home;
