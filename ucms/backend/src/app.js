import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import corsOptions from "./config/cors.js";

import routes from "./routes/index.js";

import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger.js";

import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1", routes);

app.use(notFound);

app.use(errorHandler);

export default app;
