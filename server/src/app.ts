import express, { ErrorRequestHandler } from "express";
import createHttpError from "http-errors";
import exampleRoute from "./routes/exampleRoutes";
import userRoute from "./routes/userRoutes";
import mongoose from "mongoose";
import { DB, PORT } from "./config";
import { errorHandler } from "./middleware/errorHanlder";
import passport from "passport";
import kPassport from "./middleware/passport";
import cookieParser from "cookie-parser";
import cors from "cors";
import healthCheckRoutes from './routes/healthCheckRoutes';
const app = express();

app.use(
  cors({ origin: [process.env.FRONTEND_URL as string], credentials: true })
);
app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());
kPassport(passport);

// Health check should be before the 404 handler
app.use('/api/health', healthCheckRoutes); // Mount the health check routes

app.use("/", exampleRoute);
app.use("/user", userRoute);

// 404 handler should be at the end
app.use(() => {
  throw createHttpError(404, "Route not found");
});

app.use(errorHandler);

mongoose
  .connect(DB)
  .then(() => {
    console.log("Connected to db");
    app.listen(PORT, () => {
      console.log(`Listening On PORT ${PORT}`);
    });
  })
  .catch(() => {
    throw createHttpError(501, "Unable to connect database");
  });
