import bcrypt from "bcryptjs/dist/bcrypt.js";
import User from "../models/user.js";
import Admin from "../models/admin.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  const error = {};
  if (!username) error.username = "Username required";
  if (!password) error.password = "Password required";
  if (Object.keys(error).length)
    return res.render("login-user", {
      error,
    });
  const user = await User.findOne({ username });
  if (!user)
    return res.render("login-user", {
      error: {
        username: "Username doesn't exist",
      },
    });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res.render("login-user", {
      error: {
        password: "wrong credentials",
      },
    });
  const token = jwt.sign(
    {
      username,
      id: user._id,
      type: "user",
    },
    process.env.SECRET,
  );
  res.cookie('token', token);
  res.redirect("/form");
};

export const loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  const error = {};
  if (!username) error.username = "Username required";
  if (!password) error.password = "Password required";
  if (Object.keys(error).length)
    return res.render("login-admin", {
      error,
    });
  const user = await Admin.findOne({ username });
  if (!user)
    return res.render("login-admin", {
      error: {
        username: "Username doesn't exist",
      },
    });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res.render("login-admin", {
      error: {
        password: "wrong credentials",
      },
    });
  const token = jwt.sign(
    {
      username,
      id: user._id,
      type: "admin",
    },
    process.env.SECRET,
  );
  res.cookie('token', token);
  res.redirect("/admin");
};
