import express from "express";
import { updateSellerProfile } from "./seller.controller.js";
import { verifySellerToken } from "../../middleware/sellerAuth.js";

const router = express.Router();

router.put("/profile", verifySellerToken, updateSellerProfile);

export default router;