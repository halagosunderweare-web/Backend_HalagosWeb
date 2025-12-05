//models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  // Nombre
  name: { type: String, required: true },

  // Descripcion
  description: { type: String, required: true },

  // Imagen
  images: {
    type: [String], // varias rutas
    required: true,
  },

  // Precio
  price: { type: Number, required: true },

  // Tallas fijas
  sizes: {
    type: [String],
    enum: ["S", "M", "G", "XG"],
    default: [],
  },

  // Colores 
  colors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Color" }],

  // Categorías 
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
