import db from "../../config/db.js";

// 상품별 리뷰 목록 조회
export const getReviewsByProduct = async (productId) => {
  const [rows] = await db.query(
    `SELECT r.review_id, r.buyer_id, b.username AS buyer_name, r.rating, r.content,
            r.image_urls, r.seller_comment, r.created_at, r.updated_at
     FROM reviews r
     JOIN buyer b ON r.buyer_id = b.buyer_id
     WHERE r.product_id = ?
     ORDER BY r.created_at DESC`,
    [productId]
  );
  return rows;
};

// 리뷰 등록
export const createReview = async (productId, buyerId, rating, content, imageUrls) => {
  const [result] = await db.query(
    "INSERT INTO reviews (product_id, buyer_id, rating, content, image_urls) VALUES (?, ?, ?, ?, ?)",
    [productId, buyerId, rating, content, JSON.stringify(imageUrls || [])]
  );
  return result.insertId;
};

// 리뷰 수정
export const updateReview = async (reviewId, buyerId, rating, content, imageUrls) => {
  const [result] = await db.query(
    "UPDATE reviews SET rating=?, content=?, image_urls=?, updated_at=NOW() WHERE review_id=? AND buyer_id=?",
    [rating, content, JSON.stringify(imageUrls || []), reviewId, buyerId]
  );
  return result.affectedRows > 0;
};

// 리뷰 삭제
export const deleteReview = async (reviewId, buyerId) => {
  const [result] = await db.query(
    "DELETE FROM reviews WHERE review_id=? AND buyer_id=?",
    [reviewId, buyerId]
  );
  return result.affectedRows > 0;
};

// 판매자 답변 등록
export const updateSellerComment = async (reviewId, sellerId, comment) => {
  const [result] = await db.query(
    "UPDATE reviews SET seller_comment=?, commented_at=NOW() WHERE review_id=?",
    [comment, reviewId]
  );
  return result.affectedRows > 0;
};

// 단일 리뷰 조회 (본인 검증용)
export const getReviewById = async (reviewId) => {
  const [rows] = await db.query("SELECT * FROM reviews WHERE review_id = ?", [reviewId]);
  return rows[0];
};