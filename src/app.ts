import express, { Application, NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import allRoutes from "./app/routes";
import cors from "cors";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
const app: Application = express();
export const prisma = new PrismaClient();

// Middleware setup
const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric", // Include seconds
    hour12: true,
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

// Middleware to log requests and responses
const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const method = req.method;
  const url = req.url;
  const query = JSON.stringify(req.query, null, 2); // Log query parameters
  const params = JSON.stringify(req.params, null, 2); // Log route parameters
  const body = JSON.stringify(req.body, null, 2); // Log request body
  const formattedDate = formatDate(new Date());

  console.log("------------------------");
  console.log(
    `Api :- \x1b[0m\x1b[34m${method}\x1b[0m \x1b[32m${url}\x1b[0m \x1b[36m[${formattedDate}]\x1b[0m`
  );
  console.log("Query:", query); // Log the query
  console.log("Params:", params); // Log the params
  console.log("Body:", body); // Log the body
  console.log("------------------------");

  next();
};

// Middleware setup
app.use(express.json());
app.use(requestLogger);
app.use(cors());
// Use routes
app.use("/api/v1", allRoutes);

// Use routes
app.use("/api", allRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello From Slot Sync Server");
});

app.use(globalErrorHandler);

// Handle 404 - Not Found
app.all("*", (req: Request, res: Response) => {
  res
    .status(404)
    .json({
      status: 404,
      success: false,
      message: `Route Is Not Found ${req.url}`,
    });
});

export default app;
