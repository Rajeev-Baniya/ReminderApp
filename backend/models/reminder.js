const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./users");

const reminderSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
  },
});

const Reminder = mongoose.model("Reminder", reminderSchema);

module.exports = Reminder;
