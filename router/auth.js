const express = require("express");
const router = express.Router();
const User = require("../model/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/authenticate");

router.get("/", (req, res) => {
  res.send(`Hello Home World 3010 router`);
});

// Using Async-Await

router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;

  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({ error: "Plz filled the data properly" });
  }

  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({ error: "Email already Exist" });
    } else if (password != cpassword) {
      return res.status(422).json({ error: "password dosenot match" });
    } else {
      const user = new User({ name, email, phone, work, password, cpassword });

      await user.save();
      res.status(201).json({ message: "user registered successfully" });
    }
  } catch (err) {
    console.log(error);
  }
});

// Login route
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Plz Filled the data" });
    }

    const userLogin = await User.findOne({ email: email });

    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);
      const token = await userLogin.generateAuthToken();

      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 600 * 1000),
        httpOnly: true,
      });

      if (!isMatch) {
        res.status(400).json({ error: "Invalid Crediential password" });
      } else {
        res.json({ message: "user Signin Successfully" });
      }
    } else {
      res.status(400).json({ error: "Invalid Crediential" });
    }
  } catch (err) {
    console.log(err);
  }
});

// About us route

router.get("/about", authenticate, (req, res) => {
  res.send(req.rootUser);
});

// Home Page

router.get("/getdata", authenticate, (req, res) => {
  res.send(req.rootUser);
});
// Logout route

router.get("/logout", (req, res) => {
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("User Logout");
});

module.exports = router;

//Using Promises

// router.post("/register", (req, res) => {
//   const { name, email, phone, work, password, cpassword } = req.body;

//   if (!name || !email || !phone || !work || !password || !cpassword) {
//     return res.status(422).json({ error: "Plz filled the data properly" });
//   }

//   User.findOne({ email: email })
//     .then((UserExist) => {
//       if (UserExist) {
//         return res.status(422).json({ error: "User Already Exist" });
//       }
//       const user = new User({ name, email, phone, work, password, cpassword });

//       user
//         .save()
//         .then(() => {
//           res.status(201).json({ message: "User registered successfully" });
//         })
//         .catch((err) => res.status(500))
//         .json({ error: "Feild to registered" });
//     })
//     .catch((err) => {
//       console.log(error);
//     });
// });
