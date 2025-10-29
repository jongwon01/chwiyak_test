import { verifyJWTToken } from "../../utils/jwt.js";

// JWT 토큰 검증 미들웨어 (buyer 또는 seller 자동 확인)
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "인증 토큰이 필요합니다." });
    }

    const token = authHeader.split(' ')[1];

    // JWT 토큰 검증
    const result = verifyJWTToken(token);
    
    if (!result.valid) {
      return res.status(401).json({ message: result.message });
    }

    // 토큰에서 사용자 정보 추출
    req.user = {
      buyer_id: result.decoded.buyer_id || result.decoded.id,
      seller_id: result.decoded.seller_id || result.decoded.id,
      admin_id: result.decoded.admin_id || result.decoded.id,
      username: result.decoded.username,
      name: result.decoded.name,
      email: result.decoded.email,
      points: result.decoded.points || 0,
      company_name: result.decoded.company_name,
      userType: result.decoded.userType
    };
    
    req.userType = result.decoded.userType; // 'buyer', 'seller', 'admin'
    
    next();
  } catch (err) {
    console.error('토큰 검증 오류:', err);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};