//models/Colors.js
import mongoose from "mongoose";

const colorSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, 
  createdAt: { type: Date, default: Date.now },
});

const Color = mongoose.model("Color", colorSchema);
export default Color;


 //hex: { type: String }, 