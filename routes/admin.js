import { Router } from "express";
import protectedRoute from "../jwt.js";
import { adminHomePageController } from "../controllers/adminController.js";

const router = Router();

router.get("/admin", protectedRoute, (req, res) => {
  if (req.auth?.type !== "admin") {
    return res.redirect("/login-admin");
  }
  return res.render("admin", {
    username: req.auth.username,
    left: 1000,
    right: 1010
  });
});

router.post("/admin", protectedRoute, adminHomePageController);

export default router;
