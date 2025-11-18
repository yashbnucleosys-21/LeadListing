import express from "express";
import * as leadController from "../controllers/leadController.js";

const router = express.Router();

router.post("/", leadController.createLead);          // POST /api/leads
router.get("/", leadController.getAllLeads);         // GET /api/leads
router.patch("/:id", leadController.updateLead);     // PATCH /api/leads/:id
router.put("/:id", leadController.updateLead);       // PUT /api/leads/:id
router.delete("/:id", leadController.deleteLead);    // DELETE /api/leads/:id

// NEW: Add follow-up history
router.post("/:id/history", leadController.addFollowUpHistory);

export default router;
