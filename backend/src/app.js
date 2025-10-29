// /backend/src/app.js 
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

// ====== 라우터 임포트 ======
// 새로운 구조의 모든 라우터를 불러옵니다.
import userRoutes from "./api/users/user.routes.js";
import adminRoutes from "./api/admin/admin.routes.js";
import productRoutes from "./api/products/product.routes.js";
import buyerWishlistRoutes from "./api/buyerWishlist/buyerWishlist.routes.js";
import buyerCartRoutes from "./api/buyerCart/buyerCart.routes.js";
import sellerProductRoutes from "./api/sellerProducts/sellerProduct.routes.js";
import supportRoutes from "./api/support/support.routes.js";
import reviewRoutes from "./api/reviews/review.routes.js";
import buyerCouponsRoutes from "./api/buyerCoupons/buyerCoupons.routes.js";
import buyerPointsRoutes from "./api/buyerPoints/buyerPoints.routes.js"; // ✅ 추가
import buyerRoutes from "./api/buyer/buyer.routes.js";
import buyerOrdersRoutes from "./api/buyerOrders/buyerOrders.routes.js";
// (만약 다른 라우터 파일이 더 있다면 여기에 추가합니다)

const app = express();
app.use(cors());
app.use(express.json());

// ✅ 백엔드의 public/images 폴더를 '/uploads' 경로로 접근 가능하게 설정
app.use('/uploads', express.static('public/images'));

// ====== 라우터 연결 ======
// 각 API 경로를 해당 라우터에 연결합니다.
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);              // 상품 페이지
app.use("/api/wishlist", buyerWishlistRoutes);        // 위시리스트
app.use("/api/cart", buyerCartRoutes);                // 장바구니
app.use("/api/sellerProducts", sellerProductRoutes);  // 판매자 상품
app.use("/api/supportBoard", supportRoutes);
app.use("/api/coupons", buyerCouponsRoutes);  // ← 하나만!
app.use("/api/buyer-points", buyerPointsRoutes);
app.use("/api/reviews", reviewRoutes);                // 리뷰
app.use("/api/buyer", buyerRoutes);                   // 구매자 프로필
app.use("/api/orders", buyerOrdersRoutes);            // 주문 관련
// 헬스 체크
app.get("/health", (req, res) => {
  res.send("🧩 E-Commerce API Server is running successfully 🚀");
});

// ====== 서버 실행 ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});