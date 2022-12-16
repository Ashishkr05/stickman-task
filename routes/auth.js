import { Router } from "express";
import {
  registerAdmin,
  registerUser,
} from "../controllers/registerController.js";
import { loginAdmin, loginUser } from "../controllers/loginController.js";

const router = Router();

router.get("/register-user", (req, res) => {
  res.render("register-user", {
    error: {},
  });
});

router.post("/register-user", registerUser);

router.get("/login-user", (req, res) => {
  res.render("login-user", {
    error: {},
  });
});

router.post("/login-user", loginUser);

router.get("/login-admin", (req, res) => {
  res.render("login-admin", { error: {} });
});

router.post("/login-admin", loginAdmin);

router.get("/register-admin", (req, res) => {
  res.render("register-admin", { error: {} });
});

router.post("/register-admin", registerAdmin);

export default router;
