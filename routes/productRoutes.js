// routes/productRoutes.js
import express from "express";
import * as productController from "../controller/productController.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";
import upload, { uploadMultiple } from "../middleware/upload.js";

const router = express.Router();

// Todas las rutas requieren autenticación y admin
router.use(authenticateToken, requireAdmin);

// Crear producto con múltiples imágenes
router.post("/", uploadMultiple, productController.createProductController);

// Subir solo una imagen y devolver URL (opcional)
router.post("/upload", upload.single("image"), productController.uploadImageController);

// Obtener todos los productos
router.get("/", productController.getAllProductsController);

// Obtener producto por nombre
router.get("/name/:name", productController.getProductByNameController);

// Actualizar producto (permite subir 1 o más)
router.put("/:id", uploadMultiple, productController.updateProductController);

// Eliminar producto
router.delete("/:id", productController.deleteProductController);

export default router;
