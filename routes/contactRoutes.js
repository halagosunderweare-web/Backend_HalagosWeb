// routes/contactRoutes.js
import express from "express";
import { createContactController, getAllContactsController, getContactsByNameController, 
         updateContactController, deleteContactController } from "../controller/contactController.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Ruta pública para crear contacto con la empresa
router.post('/', createContactController);

// Las siguientes rutas requieren autenticación de admin
router.use(authenticateToken, requireAdmin);

// Obtener todos los contactos
router.get('/', getAllContactsController);

// Obtener contacto por nombre
router.get('/name/:name', getContactsByNameController);

// Actualizar contacto
router.put('/:id', updateContactController);

// Eliminar contacto
router.delete('/:id', deleteContactController);

export default router;