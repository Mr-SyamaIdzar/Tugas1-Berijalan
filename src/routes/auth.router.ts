import { Router } from "express";
import {
  CLogin,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from "../controllers/auth.controller";
import { validateBody, validateParams } from "../middlewares/global.middleware";
import {
  createAdminSchema,
  updateAdminSchema,
  idParamsSchema,
} from "../schemas/auth.schema";

const router = Router();
console.log("Auth router initialized");

router.post("/login", CLogin);

// Create Admin
router.post("/create", validateBody(createAdminSchema), createAdmin);

// Update Admin
router.put(
  "/:id",
  validateParams(idParamsSchema),
  validateBody(updateAdminSchema),
  updateAdmin
);

// Delete Admin
router.delete("/:id", validateParams(idParamsSchema), deleteAdmin);

console.log("✅ Auth router loaded");

router.get("/ping", (req, res) => {
  console.log("🔥 /ping hit");
  res.status(200).json({ message: "pong" });
});

export default router;
