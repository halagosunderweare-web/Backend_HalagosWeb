// controller/productController.js
import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

/* Helper: parsea campos */
function normalizeField(field) {
  if (!field) return [];
  if (typeof field === "string") {
    try {
      return JSON.parse(field);
    } catch {
      return [field];
    }
  }
  if (Array.isArray(field)) return field;
  return [];
}

/* CREAR PRODUCTO */
export async function createProductController(req, res) {
  try {
    const { name, description, price } = req.body;
    const sizes = normalizeField(req.body.sizes);
    const colors = normalizeField(req.body.colors);
    const categories = normalizeField(req.body.categories);
    const images = req.files?.map((file) => file.path) || [];

    const product = await Product.create({
      name,
      description,
      price,
      sizes,
      colors,
      categories,
      images,
    });

    res.status(201).json({ message: "Producto creado correctamente", product });
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ message: "Error al crear producto", error });
  }
}

/* SUBIR IMAGEN INDIVIDUAL */
export async function uploadImageController(req, res) {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No se subió ninguna imagen" });

    res.status(200).json({ url: req.file.path });
  } catch (error) {
    console.error("Error al subir imagen:", error);
    res.status(500).json({ message: "Error al subir imagen", error });
  }
}

/* OBTENER TODOS LOS PRODUCTOS */
export async function getAllProductsController(req, res) {
  try {
    const products = await Product.find()
      .populate("colors")
      .populate("categories");
    res.json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ message: "Error al obtener productos", error });
  }
}

/* OBTENER PRODUCTO POR NOMBRE */
export async function getProductByNameController(req, res) {
  try {
    const { name } = req.params;
    const product = await Product.findOne({ name })
      .populate("colors")
      .populate("categories");

    if (!product)
      return res.status(404).json({ message: "Producto no encontrado" });

    res.json(product);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ message: "Error al obtener producto", error });
  }
}

/* ACTUALIZAR PRODUCTO */
export async function updateProductController(req, res) {
  try {
    const { name, description, price } = req.body;

    const sizes = normalizeField(req.body.sizes);
    const colors = normalizeField(req.body.colors);
    const categories = normalizeField(req.body.categories);

    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Producto no encontrado" });

    // Manejar imágenes eliminadas
    let updatedImages = [...product.images];
    if (req.body.deletedImages) {
      try {
        const deletedIds = JSON.parse(req.body.deletedImages); // Aquí deben venir public_ids

        // Filtrar imágenes que no se eliminarán
        updatedImages = updatedImages.filter(img => {
          const publicId = img.split('/').slice(-2).join('/').split('.')[0];
          return !deletedIds.includes(publicId);
        });

        // Eliminar imágenes de Cloudinary
        for (const publicId of deletedIds) {
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (err) {
            console.warn("No se pudo eliminar imagen de Cloudinary:", publicId);
          }
        }
      } catch (err) {
        console.error("Error al parsear deletedImages:", err);
      }
    }

    // Agregar nuevas imágenes si se subieron
    if (req.files && req.files.length > 0) {
      const uploaded = req.files.map(file => file.path);
      updatedImages = [...updatedImages, ...uploaded];
    }

    // Actualizar producto
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        sizes,
        colors,
        categories,
        images: updatedImages,
      },
      { new: true }
    ).populate("colors").populate("categories");

    res.json({
      message: "Producto actualizado correctamente",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ message: "Error al actualizar producto", error });
  }
}


/* ELIMINAR PRODUCTO */
export async function deleteProductController(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ message: "Error al eliminar producto", error });
  }
}

