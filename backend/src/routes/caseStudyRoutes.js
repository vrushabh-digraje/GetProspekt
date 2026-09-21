import express from "express";
import {
  getCaseStudies,
  getCaseStudyBySlug,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
} from "../controllers/caseStudyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getCaseStudies);
router.get("/:slug", getCaseStudyBySlug);
router.post("/", protect, createCaseStudy);
router.put("/:id", protect, updateCaseStudy);
router.delete("/:id", protect, deleteCaseStudy);

export default router;
