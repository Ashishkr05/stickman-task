import bcrypt from "bcryptjs/dist/bcrypt.js";
import Admin from "../models/admin.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

export const registerUser = async (req, res) => {
  const { username, password, confirmPassword } = req.body;
  const error = {};
  if (!username) error.username = "Username required";
  if (!password) error.password = "Password required";
  if (!confirmPassword) error.confirmPassword = "Password required";
  if (password !== confirmPassword)
    error.password = error.confirmPassword = "Passwords must match";
  if (Object.keys(error).length)
    return res.render("register-user", {
      error,
    });
  const user = await User.findOne({ username });
  if (user)
    return res.render("register-user", {
      error: {
        username: "Username exists",
      },
    });

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const newUser = new User({ username, password: hash });
  await newUser.save();
  const token = jwt.sign(
    {
      username,
      id: newUser._id,
      type: "user",
    },
    process.env.SECRET
  );
  res.cookie("token", token);
  res.redirect("/form");
};

export const registerAdmin = async (req, res) => {
  const { username, password, confirmPassword } = req.body;
  const error = {};
  if (!username) error.username = "Username required";
  if (!password) error.password = "Password required";
  if (!confirmPassword) error.confirmPassword = "Password required";
  if (password !== confirmPassword)
    error.password = error.confirmPassword = "Passwords must match";
  if (Object.keys(error).length)
    return res.render("register-admin", {
      error,
    });
  const admin = await Admin.findOne({ username });
  if (admin)
    return res.render("register-admin", {
      error: {
        username: "Username exists",
      },
    });

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const newAdmin = new Admin({ username, password: hash });
  await newAdmin.save();
  const token = jwt.sign(
    {
      username,
      id: newAdmin._id,
      type: "admin",
    },
    process.env.SECRET,
  );
  res.cookie("token", token);
  res.redirect("/admin");
};
