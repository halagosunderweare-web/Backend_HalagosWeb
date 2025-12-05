import * as categoryService from "../services/categoryServices.js";

export const createCategoryController = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Error al crear categoría" });
  }
};

export const getAllCategoriesController = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener categorías" });
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const updated = await categoryService.updateCategory(req.params.id, req.body);
    if (updated) res.json(updated);
    else res.status(404).json({ message: "Categoría no encontrada" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar categoría" });
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const deleted = await categoryService.deleteCategory(req.params.id);
    if (deleted) res.json({ message: "Categoría eliminada" });
    else res.status(404).json({ message: "Categoría no encontrada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar categoría" });
  }
};
