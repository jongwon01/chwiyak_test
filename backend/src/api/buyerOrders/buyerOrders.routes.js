import express from "express";
import { verifyBuyerToken } from "../../middleware/buyerAuth.js";
import { getOrders, checkout } from "./buyerOrders.controller.js";

const router = express.Router();
router.get("/", verifyBuyerToken, getOrders);
router.post("/checkout", verifyBuyerToken, checkout);
export default router;
