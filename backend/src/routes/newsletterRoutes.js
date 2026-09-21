import express from "express";
import {
  getNewsletters,
  createNewsletter,
  updateNewsletter,
  deleteNewsletter,
} from "../controllers/newsletterController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getNewsletters);
router.post("/", protect, createNewsletter);
router.put("/:id", protect, updateNewsletter);
router.delete("/:id", protect, deleteNewsletter);

export default router;
