import express from "express";
import { login, profile, logout } from "./admin.controller.js";
import { verifyAdminToken } from "../../middleware/adminAuth.js";

const router = express.Router();

router.post("/login", login);
router.get("/profile", verifyAdminToken, profile);
router.post("/logout", verifyAdminToken, logout);

export default router;