import express from "express";
import { register, login, getMypageSummary, getProfile, updateProfile, changePassword, deleteAccount } from "./user.controller.js";
import { verifyToken } from "./user.middleware.js";

const router = express.Router();

// 통합 회원가입 (buyer/seller 구분)
router.post("/register", register);

// 통합 로그인 (buyer/seller 구분)
router.post("/login", login);

// 마이페이지 요약 정보
router.get("/mypage/summary", verifyToken, getMypageSummary);

// 프로필 조회/수정
router.get("/profile", verifyToken, getProfile);
router.patch("/profile", verifyToken, updateProfile);

// 비밀번호 변경
router.patch("/password", verifyToken, changePassword);

// 계정 탈퇴
router.delete("/account", verifyToken, deleteAccount);

export default router;
// ✅ 현재 로그인한 사용자 정보 조회 (삭제버튼 표시용)
router.get("/me", verifyToken, (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "인증 필요" });
    res.status(200).json(req.user);
  } catch (err) {
    console.error("❌ /me 오류:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});