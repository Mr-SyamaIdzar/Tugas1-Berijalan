import { Router } from "express";
import {
  CClaimedQueue,
  CReleaseQueue,
  CCurrentQueue,
  CNextQueue,
  CSkipQueue,
  CResetQueue,
} from "../controllers/queue.controller";
import { MAuthValidate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/claim", CClaimedQueue);
router.post("/release", CReleaseQueue);
router.get("/current", CCurrentQueue);

router.post("/next/:counter_id", MAuthValidate, CNextQueue);
router.post("/skip/:counter_id", MAuthValidate, CSkipQueue);
router.post("/reset", MAuthValidate, CResetQueue);

export default router;
