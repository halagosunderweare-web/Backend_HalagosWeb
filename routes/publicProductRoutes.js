// routes/publicProductRoutes.js
import express from "express";
import * as productController from "../controller/productController.js";

const router = express.Router();

// Rutas públicas
router.get("/", productController.getAllProductsController);
router.get("/name/:name", productController.getProductByNameController);

export default router;