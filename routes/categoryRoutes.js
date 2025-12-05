// routes/categoryRoutes.js
import express from "express";
import * as categoryController from "../controller/categoryController.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateToken, requireAdmin);

router.post("/", categoryController.createCategoryController);
router.get("/", categoryController.getAllCategoriesController);
router.put("/:id", categoryController.updateCategoryController);
router.delete("/:id", categoryController.deleteCategoryController);

export default router;
