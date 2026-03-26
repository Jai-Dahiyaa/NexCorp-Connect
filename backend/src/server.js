import dotenv from "dotenv";
import "./db/db.js";
import "./config/redis.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { swaggerUi, swaggerSpec } from "./config/swagger.js";
import { errorHandler } from "./middleware/error.middleware.js";
import Routes from "./routes/index.js";
import cookieParser from "cookie-parser";
import { connectCloudinary } from "./config/cloudinary.js";
import { limiter } from "./middleware/rateLimit.middleware.js";
import {  testConnection } from "./db/vectordb.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(cookieParser());
Routes(app);
app.use(errorHandler);
app.use(limiter);

connectCloudinary();
testConnection();
// insertDummyRecord();

app.get("/", (req, res) => {
  res.send("<h1>Server is running</h1>");
});

export default app;
