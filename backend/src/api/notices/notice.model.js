import db from "../../config/db.js";

// 모든 공지 조회
export const getAllNotices = async () => {
  const [rows] = await db.query(
    "SELECT notice_id, title, content, created_at, admin_id FROM notice ORDER BY created_at DESC"
  );
  return rows;
};

// 단일 공지 조회
export const getNoticeById = async (id) => {
  const [rows] = await db.query("SELECT * FROM notice WHERE notice_id = ?", [id]);
  return rows[0];
};

// 공지 등록
export const createNotice = async (title, content, adminId) => {
  const [result] = await db.query(
    "INSERT INTO notice (title, content, admin_id) VALUES (?, ?, ?)",
    [title, content, adminId]
  );
  return result.insertId;
};

// 공지 수정
export const updateNotice = async (id, title, content) => {
  const [result] = await db.query(
    "UPDATE notice SET title = ?, content = ? WHERE notice_id = ?",
    [title, content, id]
  );
  return result.affectedRows > 0;
};

// 공지 삭제
export const deleteNotice = async (id) => {
  const [result] = await db.query("DELETE FROM notice WHERE notice_id = ?", [id]);
  return result.affectedRows > 0;
};
