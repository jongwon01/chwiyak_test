import * as adminService from "./admin.service.js";

// 관리자 로그인
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await adminService.loginAdmin(username, password);
    res.status(200).json({ message: "로그인 성공", admin: result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 관리자 프로필 조회
export const profile = async (req, res) => {
  try {
    const admin = await adminService.getProfile(req.admin.admin_id);
    res.status(200).json(admin);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 관리자 로그아웃
export const logout = async (req, res) => {
  try {
    await adminService.logoutAdmin(req.admin.admin_id);
    res.status(200).json({ message: "로그아웃 완료" });
  } catch (err) {
    res.status(500).json({ message: "서버 오류" });
  }
};