import express from "express";
import authRouter from "./routes/auth.js";
import formRouter from "./routes/form.js";
import adminRouter from "./routes/admin.js";
import pdfRouter from "./routes/generatePDF.js";
import cookieParser from "cookie-parser";
import path from "path";
import protectedRoute from "./jwt.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { config } from "dotenv";
import { connect } from "mongoose";

config();

const port = process.env.PORT || 1234;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = connect(process.env.DB_URI, { useNewUrlParser: true })
  .then(() => console.log(`Connected to DB`))
  .catch((err) => console.error(`Error connecting to database ${err}`));

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.get("/", protectedRoute, (req, res) => {
  if(req.auth?.type === 'admin') {
    return res.redirect("/admin");
  }
  return res.redirect("/form");
});
app.use(authRouter);
app.use(formRouter);
app.use(adminRouter);
app.use(pdfRouter);
app.use((err, req, res, next) => {
  if(err.name === "UnauthorizedError") {
    return res.redirect("/login-user");
  } else {
    next(err);
  }
})

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
