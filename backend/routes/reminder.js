const router = require("express").Router();
const handleValidationErrors = require("../middlewares/handleValidationErrors");
const auth = require("../middlewares/auth");
const Reminder = require("../models/reminder");
const User = require("../models/users");

const { body, param, validationResult } = require("express-validator");

//Testing
router.get("/", (req, res) => {
  res.send("Hello from the Reminder router");
});

//post or create reminder
router.post(
  "/create",
  auth,
  [
    body("title", "Title should contain 3 to 20 characters")
      .not()
      .isEmpty()
      .exists()
      .isLength({ min: 3, max: 20 }),
    body("description", "Description is required").not().isEmpty().exists(),
    body("date", "Date is required and should be valid")
      .exists()
      .not()
      .isEmpty(),
  ],
  handleValidationErrors(),
  async (req, res) => {
    try {
      const reminder = new Reminder({
        ...req.body,
        date: Date.parse(req.body.date),
        author: req.user._id,
      });
      await reminder.save();
      return res.json({
        status: "success",
        data: {
          reminder: reminder,
        },
      });
    } catch (error) {
      return res.json({
        status: "error",
        message: error.stack,
      });
    }
  }
);

//get all the reminder of User
router.get("/my_reminder", auth, async (req, res) => {
  try {
    const reminders = await Reminder.find({ author: req.user._id }).exec();
    return res.json({
      status: "success",
      data: {
        reminders: reminders,
      },
    });
  } catch (error) {
    return res.json({
      status: "error",
      message: error.stack,
    });
  }
});

//get all reminders of current day
router.get("/my_reminder/today", auth, async (req, res) => {
  try {
    const today = new Date().toISOString().substring(0, 10);
    //const user = await Reminder.find({ author: req.user._id }).exec();
    console.log(today);

    const reminder = await Reminder.find({
      date: today,
      author: req.user._id,
    }).exec();
    return res.json({
      status: "success",
      data: {
        reminders: reminder,
      },
    });
  } catch (error) {
    return res.json({
      status: "error",
      message: error.stack,
    });
  }
});

//Edit reminder by its ID
router.put(
  "/update/:_id",
  auth,
  [
    body("title", "Title should contain 3 to 64 characters")
      .optional()
      .isLength({ min: 3, max: 64 }),
    body("description").optional(),
    body("date").optional(),
    param("_id").custom(async (inputId, { req }) => {
      req.currentId = await Reminder.findOne({
        _id: inputId,
        author: req.user._id,
      }).exec();
      if (!req.currentId) {
        throw new Error("Invalid Id");
      }
    }),
  ],
  handleValidationErrors(),
  async (req, res) => {
    try {
      const updateReminder = await Reminder.findByIdAndUpdate(
        req.params._id,
        { ...req.body },
        { new: true, runValidators: true }
      );
      return res.json({
        status: "success",
        data: {
          reminder: updateReminder,
        },
      });
    } catch (error) {
      return res.json({
        status: "success",
        message: error.stack,
      });
    }
  }
);

//Delete reminder by its id
router.delete(
  "/delete/:_id",
  auth,
  [
    param("_id").custom(async (currentReminder, { req }) => {
      req.currentReminder = await Reminder.findById(currentReminder).exec();
      if (!req.currentReminder) {
        throw new Error("Invalid id");
      }
    }),
  ],
  handleValidationErrors(),
  async (req, res) => {
    try {
      const deleteReminder = await Reminder.findByIdAndDelete(
        req.params._id
      ).exec();
      return res.json({
        status: "success",
        data: {},
      });
    } catch (error) {
      return res.json({
        status: "error",
        return: error.stack,
      });
    }
  }
);

module.exports = router;
