import express from "express";
import {
  createInquiry,
  addAdminAnswer,
  getInquiryDetail,
  updateInquiry,
  deleteInquiry,
  getAllInquiries,      // ✅ 추가
} from "./support.controller.js";
import { requireAuth, requireAdmin } from "../../middleware/jwtAuth.js";

const router = express.Router();

// ✅ 문의 목록 조회 (누구나 가능)
router.get("/", getAllInquiries);   // ✅ 이 한 줄만 추가하면 됨

router.post("/", requireAuth, createInquiry);                // 작성
router.get("/:id", requireAuth, getInquiryDetail);          // 상세
router.put("/:id", requireAuth, updateInquiry);             // 수정
router.delete("/:id", requireAuth, deleteInquiry);          // 삭제
router.put("/:id/answer", requireAdmin, addAdminAnswer);    // 관리자 답변

export default router;