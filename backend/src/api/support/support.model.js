import db from "../../config/db.js";

// 문의글 존재 확인
export const findSupportById = async (id) => {
  const [rows] = await db.query("SELECT * FROM support_board WHERE board_id = ?", [id]);
  return rows[0];
};

// 관리자 답변 등록 / 수정
export const updateAnswer = async (id, answer) => {
  const [result] = await db.query(
    "UPDATE support_board SET answer = ?, status = 'ANSWERED', updated_at = NOW() WHERE board_id = ?",
    [answer, id]
  );
  return result.affectedRows > 0;
};

// 전체 문의 목록 조회 (옵션)
export const getAllSupports = async () => {
  const [rows] = await db.query(
    "SELECT board_id, buyer_id, title, status, created_at, updated_at FROM support_board ORDER BY created_at DESC"
  );
  return rows;
};