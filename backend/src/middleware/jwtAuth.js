// src/middleware/jwtAuth.js
import jwt from "jsonwebtoken";

/**
 * JWT 서명 공통 함수
 * @param {Object} payload - JWT에 포함할 데이터
 * @param {string} [expiresIn="24h"] - 만료시간
 */
const sign = (payload, expiresIn = "24h") =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

/**
 * 🛍️ 구매자 토큰 발급
 */
export const issueBuyerToken = (buyer) =>
  sign({
    role: "buyer",
    buyer_id: buyer.buyer_id || buyer.id || buyer.buyerId || buyer.ID,
    username: buyer.username,
    name: buyer.name,
    email: buyer.email ?? null,
    points: buyer.points ?? 0,
  });

/**
 * 🏬 판매자 토큰 발급
 */
export const issueSellerToken = (seller) =>
  sign({
    role: "seller",
    seller_id: seller.seller_id || seller.id || seller.sellerId || seller.ID,
    username: seller.username,
    name: seller.name,
    email: seller.email ?? null,
    company_name: seller.company_name ?? null,
    business_reg_no: seller.business_reg_no ?? null,
  });

/**
 * 👑 관리자 토큰 발급
 */
export const issueAdminToken = (admin) =>
  sign({
    role: "admin",
    admin_id: admin.admin_id || admin.id || admin.adminId || admin.ID,
    username: admin.username,
    name: admin.name ?? null,
    email: admin.email ?? null,
  });

/**
 * 🔐 인증 미들웨어 (JWT 토큰 검증)
 */
export const requireAuth = (req, res, next) => {
  try {
    const h = req.headers.authorization || "";
    if (!h.startsWith("Bearer ")) {
      return res.status(401).json({ message: "인증 토큰이 필요합니다." });
    }

    const token = h.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 요청 객체에 사용자 정보 저장
    req.user = decoded;          // { role, *_id, username, ... }
    req.userType = decoded.role; // 'buyer' | 'seller' | 'admin'

    next();
  } catch (e) {
    if (e.name === "TokenExpiredError") {
      return res.status(401).json({ message: "토큰이 만료되었습니다." });
    }
    console.error("JWT 검증 오류:", e);
    return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
};

/**
 * 🧩 역할별 접근 제한 미들웨어
 * @param {string} role - 허용할 역할 ('buyer' | 'seller' | 'admin')
 */
const requireRole = (role) => (req, res, next) => {
  requireAuth(req, res, () => {
    if (req.user?.role !== role) {
      return res.status(403).json({ message: "권한이 없습니다." });
    }
    next();
  });
};



// ✅ 역할별 미들웨어 export
export const requireBuyer = requireRole("buyer");
export const requireSeller = requireRole("seller");
export const requireAdmin = requireRole("admin");