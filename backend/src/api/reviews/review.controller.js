import db from "../../config/db.js";
import * as reviewService from "./review.service.js";

// 리뷰 생성
export const createReview = async (req, res) => {
  try {
    const { product_id, rating, content, image_urls } = req.body;
    const buyerId = req.buyer?.buyer_id; // 인증 미들웨어에서 설정됨
    
    if (!buyerId) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    if (!product_id || !rating || !content) {
      return res.status(400).json({ message: "상품ID, 평점, 내용은 필수입니다." });
    }

    const review = await reviewService.createNewReview(
      buyerId,
      product_id,
      rating,
      content,
      image_urls || []
    );

    res.status(201).json({
      message: "리뷰가 성공적으로 등록되었습니다.",
      review
    });
  } catch (err) {
    console.error("리뷰 생성 오류:", err);
    res.status(500).json({ message: err.message });
  }
};

// 상품별 리뷰 조회
export const getProductReviews = async (req, res) => {
  try {
    const productId = req.params.productId;
    const reviews = await reviewService.getProductReviews(productId);
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 구매자별 리뷰 조회 (내 리뷰)
export const getMyReviews = async (req, res) => {
  try {
    const buyerId = req.buyer?.buyer_id;
    
    if (!buyerId) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    const [reviews] = await db.query(
      `SELECT r.review_id, r.product_id, r.rating, r.content, r.image_urls, 
              r.seller_comment, r.created_at, r.updated_at,
              p.name AS product_name, p.brand, p.imageUrl AS product_image
       FROM reviews r
       JOIN products p ON r.product_id = p.product_id
       WHERE r.buyer_id = ?
       ORDER BY r.created_at DESC`,
      [buyerId]
    );

    res.status(200).json(reviews);
  } catch (err) {
    console.error("내 리뷰 조회 오류:", err);
    res.status(500).json({ message: err.message });
  }
};

// 리뷰 삭제
export const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const buyerId = req.buyer?.buyer_id;
    
    if (!buyerId) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    // 본인의 리뷰인지 확인 후 삭제
    const [result] = await db.query(
      "DELETE FROM reviews WHERE review_id = ? AND buyer_id = ?",
      [reviewId, buyerId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "리뷰를 찾을 수 없거나 삭제 권한이 없습니다." });
    }

    res.status(200).json({ message: "리뷰가 삭제되었습니다." });
  } catch (err) {
    console.error("리뷰 삭제 오류:", err);
    res.status(500).json({ message: err.message });
  }
};

// 판매자 답변 등록
export const sellerComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const reviewId = req.params.id;

    const [result] = await db.query(
      `UPDATE reviews
       SET seller_comment = ?, commented_at = NOW()
       WHERE review_id = ?`,
      [comment, reviewId]
    );

    if (!result.affectedRows)
      return res.status(404).json({ message: "리뷰를 찾을 수 없습니다." });

    res.status(200).json({ message: "판매자 답변 등록 완료", comment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};