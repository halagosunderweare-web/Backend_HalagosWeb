// routes/colorRoutes.js
import express from "express";
import * as colorController from "../controller/colorController.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateToken, requireAdmin);

router.post("/", colorController.createColorController);
router.get("/", colorController.getAllColorsController);
router.put("/:id", colorController.updateColorController);
router.delete("/:id", colorController.deleteColorController);

export default router;
