import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/jwt.js";
import {
  findAdminByUsername,
  updateAdminToken,
  findAdminByToken,
  clearAdminToken,
  getAdminProfile,
} from "./admin.model.js";

export const loginAdmin = async (username, password) => {
  const admin = await findAdminByUsername(username);
  if (!admin) throw new Error("존재하지 않는 관리자입니다.");

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) throw new Error("비밀번호가 올바르지 않습니다.");

  // JWT 토큰 생성 (DB에 저장하지 않음 - stateless)
  const token = generateToken(admin, 'admin');

  return {
    id: admin.admin_id,
    username: admin.username,
    name: admin.name,
    email: admin.email,
    token,
  };
};

export const verifyToken = async (token) => {
  const admin = await findAdminByToken(token);
  if (!admin) throw new Error("유효하지 않은 토큰입니다.");
  return admin;
};

export const logoutAdmin = async (adminId) => {
  // JWT는 stateless이므로 DB에서 토큰을 삭제할 필요 없음
  // 클라이언트에서 토큰을 삭제하면 됨
  return true;
};

export const getProfile = async (adminId) => {
  const admin = await getAdminProfile(adminId);
  if (!admin) throw new Error("관리자 정보를 찾을 수 없습니다.");
  return admin;
};