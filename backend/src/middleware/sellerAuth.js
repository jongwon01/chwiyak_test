import { verifyJWTToken } from "../utils/jwt.js";

// 판매자 토큰 검증 (JWT 방식)
export const verifySellerToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "판매자 토큰이 없습니다." });

    // JWT 토큰 검증
    const result = verifyJWTToken(token);
    if (!result.valid) {
      return res.status(401).json({ message: result.message });
    }

    // 토큰에서 추출한 userType이 'seller'인지 확인
    if (result.decoded.userType !== 'seller') {
      return res.status(403).json({ message: "판매자 권한이 필요합니다." });
    }

    // 요청 객체에 판매자 정보 설정
    req.seller = result.decoded;
    req.seller_id = result.decoded.seller_id || result.decoded.id;
    
    next();
  } catch (err) {
    res.status(500).json({ message: "판매자 인증 오류", error: err.message });
  }
};