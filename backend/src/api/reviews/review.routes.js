import express from "express";
import { createReview, getProductReviews, getMyReviews, deleteReview, sellerComment } from "./review.controller.js";
import { verifySellerToken } from "../../middleware/sellerAuth.js";
import { verifyBuyerToken } from "../../middleware/buyerAuth.js";

const router = express.Router();

// 리뷰 생성 (구매자 인증 필요)
router.post("/", verifyBuyerToken, createReview);

// 내 리뷰 조회 (구매자 인증 필요)
router.get("/my", verifyBuyerToken, getMyReviews);

// 상품별 리뷰 조회
router.get("/product/:productId", getProductReviews);

// 리뷰 삭제 (구매자 인증 필요)
router.delete("/:id", verifyBuyerToken, deleteReview);

// 판매자 답변 등록 (판매자 인증 필요)
router.put("/:id/comment", verifySellerToken, sellerComment);

export default router;