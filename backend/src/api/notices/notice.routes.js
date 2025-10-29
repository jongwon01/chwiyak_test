import express from "express";
import {
  getNotices,
  getNotice,
  createNotice,
  updateNotice,
  deleteNotice,
} from "./notice.controller.js";
import { verifyAdminToken } from "../../middleware/adminAuth.js";

const router = express.Router();

// 공지 목록 / 상세 조회 (비로그인 사용자도 조회 가능)
router.get("/", getNotices);
router.get("/:id", getNotice);

// 등록/수정/삭제 (관리자만 가능)
router.post("/", verifyAdminToken, createNotice);
router.put("/:id", verifyAdminToken, updateNotice);
router.delete("/:id", verifyAdminToken, deleteNotice);

export default router;
