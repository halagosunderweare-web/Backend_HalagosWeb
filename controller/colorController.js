import * as colorService from "../services/colorServices.js";

export const createColorController = async (req, res) => {
  try {
    const color = await colorService.createColor(req.body);
    res.status(201).json(color);
  } catch (error) {
    res.status(500).json({ message: "Error al crear color" });
  }
};

export const getAllColorsController = async (req, res) => {
  try {
    const colors = await colorService.getAllColors();
    res.json(colors);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener colores" });
  }
};

export const updateColorController = async (req, res) => {
  try {
    const updated = await colorService.updateColor(req.params.id, req.body);
    if (updated) res.json(updated);
    else res.status(404).json({ message: "Color no encontrado" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar color" });
  }
};

export const deleteColorController = async (req, res) => {
  try {
    const deleted = await colorService.deleteColor(req.params.id);
    if (deleted) res.json({ message: "Color eliminado" });
    else res.status(404).json({ message: "Color no encontrado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar color" });
  }
};
