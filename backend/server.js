const express = require("express");
require("dotenv").config();

const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

require("./database/mongoose");
const userRouter = require("./routes/users");
const reminderRouter = require("./routes/reminder");

app.use(express.json());
app.use(cors());
app.use("/users", userRouter);
app.use("/reminder", reminderRouter);

app.get("/", (req, res) => {
  res.send("Hello from main router");
});

app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});
