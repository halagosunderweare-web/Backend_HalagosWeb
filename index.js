// index.js  
import express from "express";
import cors from "cors";
import { connectDB } from "./data/config.js";
import contactRoutes from "./routes/contactRoutes.js"; 
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js"; 
import publicProductRoutes from "./routes/publicProductRoutes.js";
import publicCategoryRoutes from "./routes/publicCategoryRoutes.js";
import colorRoutes from "./routes/colorRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import metricsRoutes from "./routes/metrics.js";

const PORT = process.env.PORT || 5000; // 👈 Render necesita esto
const app = express();

app.options("*", cors());

app.use(cors({
  origin: ["https://halagos.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));


app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Conecta DB
connectDB();

// Rutas
app.use("/api/metrics", metricsRoutes);
app.use("/api/products/public", publicProductRoutes);
app.use("/api/categories/public", publicCategoryRoutes); 
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/products", productRoutes);
app.use("/api/colors", colorRoutes);
app.use("/api/categories", categoryRoutes);

// Ruta principal correcta
app.get('/', (req, res) => {
  return res.json({
    ok: true,
    message: "Backend Halagos funcionando "
  });
});

// Inicia servidor
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

