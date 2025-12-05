import Product from "../models/Product.js";

// Crear producto
export async function createProduct(data) {
  return await Product.create(data);
}

// Obtener todos los nombres de colores y categorías
export async function getAllProducts() {
  return await Product.find()
    .populate("colors")
    .populate("categories");
}

// Buscar por nombre
export async function getProductByName(name) {
  return await Product.findOne({ name })
    .populate("colors")
    .populate("categories");
}

// Actualizar producto
export async function updateProduct(id, data) {
  return await Product.findByIdAndUpdate(id, data, { new: true })
    .populate("colors")
    .populate("categories");
}

// Eliminar
export async function deleteProduct(id) {
  return await Product.findByIdAndDelete(id);
}
