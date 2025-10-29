// src/api/support/support.controller.js
import db from "../../config/db.js";

/* ============================================
   ✅ 1. 문의 상세 조회
   ============================================ */
export const getInquiryDetail = async (req, res) => {
  try {
    const boardId = req.params.id;

    const [rows] = await db.query(
      `SELECT sb.board_id, sb.title, sb.content, sb.status, sb.answer, sb.created_at,
              b.username AS buyer_name,
              s.username AS seller_name
       FROM support_board sb
       LEFT JOIN buyer b ON sb.buyer_id = b.buyer_id
       LEFT JOIN seller s ON sb.buyer_id = s.seller_id
       WHERE sb.board_id = ?`,
      [boardId]
    );

    if (!rows.length)
      return res.status(404).json({ message: "문의글을 찾을 수 없습니다." });

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("❌ 문의 상세 조회 오류:", err);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

/* ============================================
   ✅ 2. 문의 등록 (구매자 또는 판매자 로그인 허용)
   ============================================ */
export const createInquiry = async (req, res) => {
  try {
    console.log("🔍 req.user:", req.user);

    const buyerId = req.user?.buyer_id || null;
    const sellerId = req.user?.seller_id || null;
    const { title, content } = req.body;

    if (!buyerId && !sellerId)
      return res.status(401).json({ message: "로그인이 필요합니다." });

    if (!title || !content)
      return res.status(400).json({ message: "제목과 내용을 입력하세요." });

    const writerId = buyerId ?? sellerId;

    const [result] = await db.query(
      `INSERT INTO support_board (buyer_id, title, content, status)
       VALUES (?, ?, ?, 'OPEN')`,
      [writerId, title, content]
    );

    console.log(`✅ 문의 등록 완료: board_id=${result.insertId}`);

    res.status(201).json({
      message: "등록 완료",
      board_id: result.insertId,
    });
  } catch (err) {
    console.error("❌ 문의 등록 오류:", err);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

// ✅ 문의 목록 조회
// ✅ 문의 목록 조회
export const getAllInquiries = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        sb.board_id,
        sb.title,
        sb.status,
        sb.created_at,
        COALESCE(b.username, s.username) AS author_name
      FROM support_board sb
      LEFT JOIN buyer b ON sb.buyer_id = b.buyer_id
      LEFT JOIN seller s ON sb.buyer_id = s.seller_id
      ORDER BY sb.board_id DESC
    `);

    return res.status(200).json(rows);
  } catch (err) {
    console.error("❌ 문의 목록 조회 오류:", err);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};







/* ============================================
   ✅ 3. 관리자 답변 등록 (관리자 로그인 필요)
   ============================================ */
export const addAdminAnswer = async (req, res) => {
  try {
    const boardId = req.params.id;
    const { answer } = req.body;
    const adminId = req.user?.admin_id || req.user?.id;

    if (!adminId)
      return res.status(401).json({ message: "관리자 인증이 필요합니다." });

    if (!answer)
      return res.status(400).json({ message: "답변 내용을 입력하세요." });

    const [result] = await db.query(
      `UPDATE support_board
       SET answer = ?, status = 'ANSWERED', updated_at = NOW()
       WHERE board_id = ?`,
      [answer, boardId]
    );

    if (!result.affectedRows)
      return res.status(404).json({ message: "해당 문의를 찾을 수 없습니다." });

    console.log(`✅ 문의(${boardId}) 답변 등록 by 관리자(${adminId})`);

    res.status(200).json({ message: "답변 등록 완료", answer });
  } catch (err) {
    console.error("❌ 문의 답변 등록 오류:", err);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

function canEditOrDelete(user, row) {
  // 우리는 writer를 support_board.buyer_id 에 저장해왔음 (buyer 또는 seller 모두)
  const ownerId = row?.buyer_id;
  const isOwner =
    (user?.buyer_id && user.buyer_id === ownerId) ||
    (user?.seller_id && user.seller_id === ownerId);
  const isAdmin = !!(user?.role === "admin" || user?.admin_id);
  return isOwner || isAdmin;
}

// ✅ 문의 수정
export const updateInquiry = async (req, res) => {
  try {
    const boardId = req.params.id;
    const { title, content } = req.body;

    const [[row]] = await db.query(
      "SELECT buyer_id FROM support_board WHERE board_id = ?",
      [boardId]
    );
    if (!row) return res.status(404).json({ message: "문의글을 찾을 수 없습니다." });

    if (!canEditOrDelete(req.user, row))
      return res.status(403).json({ message: "권한이 없습니다." });

    await db.query(
      `UPDATE support_board
       SET title = ?, content = ?, updated_at = NOW()
       WHERE board_id = ?`,
      [title ?? "", content ?? "", boardId]
    );

    res.status(200).json({ message: "수정 완료", board_id: Number(boardId) });
  } catch (err) {
    console.error("❌ 문의 수정 오류:", err);
    res.status(500).json({ message: "서버 오류" });
  }
};

// ✅ 문의 삭제
export const deleteInquiry = async (req, res) => {
  try {
    const boardId = req.params.id;

    const [[row]] = await db.query(
      "SELECT buyer_id FROM support_board WHERE board_id = ?",
      [boardId]
    );
    if (!row) return res.status(404).json({ message: "문의글을 찾을 수 없습니다." });

    if (!canEditOrDelete(req.user, row))
      return res.status(403).json({ message: "권한이 없습니다." });

    await db.query("DELETE FROM support_board WHERE board_id = ?", [boardId]);
    // 204면 바디 없이 성공
    res.status(204).end();
  } catch (err) {
    console.error("❌ 문의 삭제 오류:", err);
    res.status(500).json({ message: "서버 오류" });
  }
};