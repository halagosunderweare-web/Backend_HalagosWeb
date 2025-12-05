// routes/publicCategoryRoutes.js
import express from "express";
import * as categoryController from "../controller/categoryController.js";

const router = express.Router();

// Ruta pública para obtener todas las categorías
router.get("/", categoryController.getAllCategoriesController);

export default router;
