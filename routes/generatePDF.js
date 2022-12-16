import { Router } from "express";
import protectedRoute from "../jwt.js";
import { pdfController } from "../controllers/pdfContorller.js";

const router = Router();

router.post("/pdf-download", protectedRoute, pdfController);

export default router;
