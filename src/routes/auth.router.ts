import { Router } from "express";
import {
  CLogin,
  CCreateAdmin,
  CUpdateAdmin,
  CDeleteAdmin,
  CGetAllAdmins
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

router.post("/create", validateBody(createAdminSchema), CCreateAdmin);

router.put(
  "/:id",
  validateParams(idParamsSchema),
  validateBody(updateAdminSchema),
  CUpdateAdmin
);

router.delete("/:id", validateParams(idParamsSchema), CDeleteAdmin);

router.get("/", CGetAllAdmins);

router.get("/ping", (req, res) => {
  console.log("🔥 /ping hit");
  res.status(200).json({ message: "pong" });
});


export default router;