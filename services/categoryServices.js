import Category from "../models/Category.js";

// Crear categoría
export async function createCategory(data) {
  return await Category.create(data);
}

// Obtener todas
export async function getAllCategories() {
  return await Category.find();
}

// Actualizar
export async function updateCategory(id, data) {
  return await Category.findByIdAndUpdate(id, data, { new: true });
}

// Eliminar
export async function deleteCategory(id) {
  return await Category.findByIdAndDelete(id);
}
