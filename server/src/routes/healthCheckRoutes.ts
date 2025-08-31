// routes/healthCheckRoutes.ts
import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).send("Health check passed");
});

export default router;
