import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import categoryRoute from "./routes/category.routes.js";
import productRoute from "./routes/product.routes.js";
import uploadRoute from "./routes/uploads.routes.js";
import cartRoute from "./routes/cart.routes.js";
import authRoute from "./routes/auth.routes.js";
import userRoute from "./routes/user.routes.js";

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';

import { errorHandler } from "./middleware/error.middleware.js";
dotenv.config();

connectDB();

const app = express();


const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/categories", categoryRoute);
app.use("/api/products", productRoute);
app.use("/api/uploads", uploadRoute);
app.use("/api/auth", authRoute);
app.use("/api/cart", cartRoute);
app.use("/api/user", userRoute)

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server running at: http:localhost:", PORT);
});
