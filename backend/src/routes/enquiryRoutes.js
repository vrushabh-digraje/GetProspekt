import express from "express";
import {
  createEnquiry,
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
} from "../controllers/enquiryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createEnquiry); // Public (from Contact Us page)
router.get("/", protect, getEnquiries); // Protected (for Admin Dashboard)
router.patch("/:id", protect, updateEnquiryStatus);
router.delete("/:id", protect, deleteEnquiry);

export default router;
