import express from "express";
import { updateOrderStatus } from "./order.controller.js";
import { verifySellerToken } from "../../middleware/sellerAuth.js";

const router = express.Router();

router.put("/:id/status", verifySellerToken, updateOrderStatus);

export default router;
