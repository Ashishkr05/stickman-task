import { Router } from "express";
import protectedRoute from "../jwt.js";
import { formController } from "../controllers/formController.js";

const router = Router();

router.get("/form", protectedRoute, (req, res) => {
  if (req.auth?.type !== "user") {
    return res.redirect("/login-user");
  }
  res.render("form", {
    username: req.auth.username,
    status: null,
  });
});

router.post("/form", protectedRoute, formController);

export default router;
