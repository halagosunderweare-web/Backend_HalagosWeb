import Color from "../models/Color.js";

// Crear color
export async function createColor(data) {
  return await Color.create(data);
}

// Obtener todos
export async function getAllColors() {
  return await Color.find();
}

// Actualizar
export async function updateColor(id, data) {
  return await Color.findByIdAndUpdate(id, data, { new: true });
}

// Eliminar
export async function deleteColor(id) {
  return await Color.findByIdAndDelete(id);
}
