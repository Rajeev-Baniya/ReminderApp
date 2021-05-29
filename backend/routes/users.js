const router = require("express").Router();

const handleValidationErrors = require("../middlewares/handleValidationErrors");

const { body, validationResult, param } = require("express-validator");

const auth = require("../middlewares/auth");

const User = require("../models/users");

//Testing
router.get("/", (req, res) => {
  res.send("calling from user router");
});

//Register
router.post(
  "/register",
  [
    body("name", "Name is required").exists().notEmpty(),
    body("email", "Email is required and it should be valid")
      .exists()
      .notEmpty()
      .isEmail()
      .custom(async (inputEmail, { req }) => {
        const user = await User.findOne({ email: inputEmail }).exec();
        if (user) {
          throw new Error("Email already exists. Please try another Email.");
        }
      }),
    body("confirm_password", "confirm_password is required")
      .exists()
      .notEmpty(),
    body(
      "password",
      "Password is required with length between 8 to 64 characters."
    )
      .exists()
      .notEmpty()
      .isLength({ min: 8, max: 64 })
      .custom(async (inputPassword, { req }) => {
        if (inputPassword !== req.body.confirm_password) {
          throw new Error("Passwords donot match");
        }
      }),
    body("phone", "Phone is required")
      .exists()
      .notEmpty()
      .isMobilePhone()
      .custom(async (inputPhone, { req }) => {
        if (!inputPhone) {
          throw new Error("Phone number is required");
        }
        const user = await User.findOne({ phone: inputPhone }).exec();
        if (user) {
          throw new Error(
            "Phone no. is already taken. Please try another number "
          );
        }
        if (!inputPhone.length == 10) {
          throw new Error("Phone number should contain 10 digits.");
        }
      }),
  ],
  handleValidationErrors(),
  async (req, res) => {
    try {
      const user = new User(req.body);
      await user.save();
      const token = await user.generateAuthToken();
      return res.json({
        status: "success",
        data: {
          user: user,
          token: token,
        },
      });
    } catch (error) {
      return res.json({
        status: "success",
        message: error.msg,
      });
    }
  }
);

//login
router.post(
  "/login",
  [
    body("email", "Email is required and should be valid")
      .exists()
      .notEmpty()
      .isEmail()
      .custom(async (inputEmail, { req }) => {
        if (!inputEmail) {
          throw new Error("Email is required");
        }
        req.currentEmail = await User.findOne({ email: inputEmail }).exec();
        if (!req.currentEmail) {
          throw new Error("Invalid Email");
        }
      }),
    body("password", "Password is required")
      .exists()
      .notEmpty()
      .custom(async (inputPassword, { req }) => {
        if (!inputPassword) {
          throw new Error("Password is required");
        }
        req.currentUser = await User.findByCredentials(
          req.body.email,
          inputPassword
        );

        req.token = await req.currentUser.generateAuthToken();
      }),
  ],
  handleValidationErrors(),
  async (req, res) => {
    try {
      return res.json({
        status: "success",
        data: {
          user: req.currentUser,
          token: req.token,
        },
      });
    } catch (error) {
      return res.json({
        status: "error",
        message: error.msg,
      });
    }
  }
);

//update user data
router.put(
  "/update",
  auth,
  [
    body("name").optional(),
    body("phone")
      .optional()
      .custom(async (inputPhone, { req }) => {
        const myPhone = await User.findOne({ phone: inputPhone }).exec();
        if (myPhone) {
          throw new Error("Phone number is taken. Please try another one");
        }
        if (
          inputPhone.toString().length !== 0 &&
          inputPhone.toString().length !== 10
        ) {
          throw new Error("Phone no. should contain 10 digits");
        }
      }),
    body("password")
      .optional()
      .custom(async (Pw, { req }) => {
        if (Pw !== req.body.confirm_password && Pw.length !== 0) {
          throw new Error("Passwords donot match");
        }
      }),
    body("confirm_password")
      .optional()
      .custom(async (conPw, { req }) => {
        if (req.body.password && !conPw) {
          throw new Error("You need to confirm your password");
        }
      }),
  ],
  handleValidationErrors(),
  async (req, res) => {
    try {
      const currentUser = await User.findById(req.user._id).exec();
      if (req.body.name) {
        currentUser.name = req.body.name;
      }
      if (req.body.phone) {
        currentUser.phone = req.body.phone;
      }
      if (req.body.password) {
        currentUser.password = req.body.password;
      }
      await currentUser.save();
      return res.json({
        status: "success",
        data: currentUser,
      });
    } catch (error) {
      return res.json({
        status: "error",
        message: error.stack,
      });
    }
  }
);

//get logged in user
router.get("/currentUser", auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id }).exec();
    return res.json({
      status: "success",
      data: {
        user: user,
      },
    });
  } catch (error) {
    return res.json({
      stauts: "error",
      message: error.stack,
    });
  }
});
//logout user
router.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.json({
      status: "success",
      data: {
        message: "User logged out successfully",
      },
    });
  } catch (error) {
    return res.json({
      status: "error",
      message: error.stack,
    });
  }
});

//logout of all devices
router.post("/logoutall", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    return res.json({
      status: "success",
      data: {
        message: "logged out of all devices",
      },
    });
  } catch (error) {
    return res.json({
      status: "error",
      message: error.stack,
    });
  }
});

module.exports = router;
