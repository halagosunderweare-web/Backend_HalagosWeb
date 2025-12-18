// routes/contactRoutes.js
import express from "express";
import { createContactController } from "../controller/contactController.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Ruta pública para crear contacto con la empresa
router.post('/', createContactController);

// Las siguientes rutas requieren autenticación de admin
router.use(authenticateToken, requireAdmin);

export default router;
