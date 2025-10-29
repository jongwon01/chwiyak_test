import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/jwt.js";
import * as sellerModel from "./seller.model.js";
import db from "../../config/db.js";

// 판매자 회원가입
export const registerSeller = async (username, password, name, email, phone, company_name, business_reg_no) => {
  const existing = await sellerModel.findSellerByUsername(username);
  if (existing) throw new Error("이미 존재하는 아이디입니다.");

  const hashed = await bcrypt.hash(password, 10);
  const id = await sellerModel.createSeller(username, hashed, name, email, phone, company_name, business_reg_no);
  return await sellerModel.getSellerProfile(id);
};

export const changePassword = async (sellerId, oldPw, newPw) => {
  const seller = await sellerModel.getSellerProfile(sellerId);
  if (!seller) throw new Error("판매자 정보를 찾을 수 없습니다.");

  // seller_id로 사용자 정보 가져오기 (비밀번호 포함)
  const [rows] = await db.query("SELECT * FROM seller WHERE seller_id = ?", [sellerId]);
  const existing = rows[0];
  if (!existing) throw new Error("판매자 정보를 찾을 수 없습니다.");

  const isMatch = await bcrypt.compare(oldPw, existing.password);
  if (!isMatch) throw new Error("기존 비밀번호가 일치하지 않습니다.");

  const hashed = await bcrypt.hash(newPw, 10);
  await sellerModel.updatePassword(sellerId, hashed);
  return true;
};

export const loginSeller = async (username, password) => {
  const seller = await sellerModel.findSellerByUsername(username);
  if (!seller) throw new Error("존재하지 않는 판매자입니다.");

  const isMatch = await bcrypt.compare(password, seller.password);
  if (!isMatch) throw new Error("비밀번호가 올바르지 않습니다.");

  // JWT 토큰 생성 (DB에 저장하지 않음 - stateless)
  const token = generateToken(seller, 'seller');

  return {
    id: seller.seller_id,
    username: seller.username,
    name: seller.name,
    email: seller.email,
    token,
  };
};

export const verifyToken = async (token) => {
  // JWT 검증은 미들웨어에서 처리 (여기서는 사용하지 않음)
  // UUID 방식에서 JWT로 변경했으므로 이 함수는 호환성을 위해 남겨둠
  const seller = await sellerModel.findSellerByToken(token);
  if (!seller) throw new Error("유효하지 않은 토큰입니다.");
  return seller;
};

export const logoutSeller = async (sellerId) => {
  // JWT는 stateless이므로 DB에서 토큰을 삭제할 필요 없음
  // 클라이언트에서 토큰을 삭제하면 됨
  return true;
};

export const getProfile = async (sellerId) => {
  const seller = await sellerModel.getSellerProfile(sellerId);
  if (!seller) throw new Error("판매자 정보를 찾을 수 없습니다.");
  return seller;
};

export const updateProfile = async (sellerId, name, email, phone, introduction, username) => {
  let success;
  if (username) {
    success = await sellerModel.updateSellerProfileAll(sellerId, username, name, email, phone, introduction);
  } else {
    success = await sellerModel.updateSellerProfile(sellerId, name, email, phone, introduction);
  }
  if (!success) throw new Error("프로필 수정에 실패했습니다.");
  return await sellerModel.getSellerProfile(sellerId);
};