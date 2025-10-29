import * as buyerService from "../buyer/buyer.service.js";
import * as sellerService from "../seller/seller.service.js";
import db from "../../config/db.js";
import bcrypt from "bcryptjs";

// 통합 회원가입 (buyer/seller 구분)
export const register = async (req, res) => {
  try {
    const { userType, username, password, name, email, phone, company_name, business_reg_no } = req.body;

    // userType 검증
    if (!userType || (userType !== 'buyer' && userType !== 'seller')) {
      return res.status(400).json({ message: "userType은 'buyer' 또는 'seller'여야 합니다." });
    }

    let result;
    if (userType === 'buyer') {
      // 구매자 회원가입
      result = await buyerService.registerBuyer(username, password, name, email, phone);
      return res.status(201).json({ 
        message: "회원가입 성공", 
        userType: 'buyer',
        user: result 
      });
    } else {
      // 판매자 회원가입
      if (!company_name || !business_reg_no) {
        return res.status(400).json({ message: "판매자는 company_name과 business_reg_no가 필요합니다." });
      }
      result = await sellerService.registerSeller(username, password, name, email, phone, company_name, business_reg_no);
      return res.status(201).json({ 
        message: "회원가입 성공", 
        userType: 'seller',
        user: result 
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 비밀번호 변경 (buyer/seller 공통)
export const changePassword = async (req, res) => {
  try {
    const userType = req.userType;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "oldPassword와 newPassword가 필요합니다." });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: "비밀번호는 최소 8자 이상이어야 합니다." });
    }

    if (userType === "buyer") {
      const buyerId = req.user.buyer_id;
      await buyerService.changePassword(buyerId, oldPassword, newPassword);
      return res.status(200).json({ message: "비밀번호가 변경되었습니다." });
    } else if (userType === "seller") {
      const sellerId = req.user.seller_id;
      await sellerService.changePassword(sellerId, oldPassword, newPassword);
      return res.status(200).json({ message: "비밀번호가 변경되었습니다." });
    } else {
      return res.status(400).json({ message: "지원하지 않는 사용자 유형입니다." });
    }
  } catch (err) {
    const msg = err?.message || "서버 오류가 발생했습니다.";
    if (msg.includes("기존 비밀번호")) {
      return res.status(400).json({ message: msg });
    }
    console.error("비밀번호 변경 오류:", err);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

// 프로필 단건 조회 (buyer/seller 공통)
export const getProfile = async (req, res) => {
  try {
    const userType = req.userType;
    if (userType === "buyer") {
      const buyerId = req.user.buyer_id;
      const profile = await buyerService.getProfile(buyerId);
      return res.status(200).json(profile);
    } else if (userType === "seller") {
      const sellerId = req.user.seller_id;
      const profile = await sellerService.getProfile(sellerId);
      return res.status(200).json(profile);
    } else {
      return res.status(400).json({ message: "지원하지 않는 사용자 유형입니다." });
    }
  } catch (err) {
    console.error("프로필 조회 오류:", err);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

// 프로필 수정 (buyer/seller 공통)
export const updateProfile = async (req, res) => {
  try {
    const userType = req.userType;
    const { name, email, phone, introduction, username } = req.body;

    if (userType === "buyer") {
      const buyerId = req.user.buyer_id;
      const current = await buyerService.getProfile(buyerId);
      const updated = await buyerService.updateProfile(
        buyerId,
        name ?? current.name,
        email ?? current.email,
        phone ?? current.phone,
        username ?? undefined
      );
      return res.status(200).json(updated);
    } else if (userType === "seller") {
      const sellerId = req.user.seller_id;
      const current = await sellerService.getProfile(sellerId);
      const updated = await sellerService.updateProfile(
        sellerId,
        name ?? current.name,
        email ?? current.email,
        phone ?? current.phone,
        introduction ?? current.introduction ?? null,
        username ?? undefined
      );
      return res.status(200).json(updated);
    } else {
      return res.status(400).json({ message: "지원하지 않는 사용자 유형입니다." });
    }
  } catch (err) {
    console.error("프로필 수정 오류:", err);
    if (err && (err.code === 'ER_DUP_ENTRY' || (err.message && err.message.includes('Duplicate')))) {
      return res.status(409).json({ message: "이미 사용 중인 아이디 또는 이메일입니다." });
    }
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

// 통합 로그인 (buyer/seller 자동 구분)
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "아이디와 비밀번호를 입력해주세요." });
    }

    // 먼저 buyer로 시도
    try {
      const buyerResult = await buyerService.loginBuyer(username, password);
      return res.status(200).json({ 
        message: "로그인 성공", 
        token: buyerResult.token,
        userType: 'buyer',
        username: buyerResult.username,
        name: buyerResult.name
      });
    } catch (buyerErr) {
      // buyer 로그인 실패 시 seller로 시도
      try {
        const sellerResult = await sellerService.loginSeller(username, password);
        return res.status(200).json({ 
          message: "로그인 성공", 
          token: sellerResult.token,
          userType: 'seller',
          username: sellerResult.username,
          name: sellerResult.name
        });
      } catch (sellerErr) {
        // 둘 다 실패
        return res.status(400).json({ message: "아이디 또는 비밀번호가 올바르지 않습니다." });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

// 마이페이지 요약 정보 조회
export const getMypageSummary = async (req, res) => {
  try {
    const userId = req.user.buyer_id || req.user.seller_id;
    const userType = req.userType;

    if (userType === 'buyer') {
      // 구매자 마이페이지 정보
      const [orders] = await db.query(
        "SELECT status, COUNT(*) as count FROM `orders` WHERE buyer_id = ? GROUP BY status",
        [userId]
      );

      const orderCounts = {
        '결제완료': 0,
        '상품 준비중': 0,
        '배송중': 0,
        '배송완료': 0
      };

      orders.forEach(row => {
        if (row.status === 'paid') orderCounts['결제완료'] = row.count;
        if (row.status === 'pending') orderCounts['상품 준비중'] = row.count;
        if (row.status === 'shipped') orderCounts['배송중'] = row.count;
        if (row.status === 'delivered') orderCounts['배송완료'] = row.count;
      });

      const [coupons] = await db.query(
        "SELECT COUNT(*) as count FROM buyer_coupons WHERE buyer_id = ? AND is_used = FALSE",
        [userId]
      );

      const [reviews] = await db.query(
        "SELECT COUNT(*) as count FROM reviews WHERE buyer_id = ?",
        [userId]
      );

      const [wishlist] = await db.query(
        `SELECT p.product_id, p.name, p.price, p.imageUrl 
         FROM wishlists bw 
         JOIN products p ON bw.product_id = p.product_id 
         WHERE bw.buyer_id = ? 
         LIMIT 10`,
        [userId]
      );

      const wishlistItems = wishlist.map(item => ({
        productId: item.product_id,
        name: item.name,
        price: item.price,
        thumbnailUrl: item.imageUrl || null
      }));

      // 최신 사용자 정보 조회 (토큰 값이 아니라 DB 값 사용)
      const buyerProfile = await buyerService.getProfile(userId);

      res.status(200).json({
        user: {
          username: buyerProfile.username,
          name: buyerProfile.name,
          email: buyerProfile.email
        },
        stats: {
          orderCounts,
          couponCount: coupons[0].count,
          points: buyerProfile.points || 0,
          reviewCount: reviews[0].count
        },
        wishlist: wishlistItems
      });

    } else {
      // 판매자 마이페이지 정보 (간단한 버전)
      const sellerProfile = await sellerService.getProfile(userId);
      res.status(200).json({
        user: {
          username: sellerProfile.username,
          name: sellerProfile.name,
          email: sellerProfile.email,
          company_name: sellerProfile.company_name
        },
        stats: {
          orderCounts: {
            '결제완료': 0,
            '상품 준비중': 0,
            '배송중': 0,
            '배송완료': 0
          },
          couponCount: 0,
          points: 0,
          reviewCount: 0
        },
        wishlist: []
      });
    }
  } catch (err) {
    console.error('마이페이지 조회 오류:', err);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

// 계정 탈퇴 (buyer/seller 공통)
export const deleteAccount = async (req, res) => {
  try {
    const userType = req.userType;
    const { password } = req.body;

    console.log("계정 탈퇴 요청:", { userType, hasPassword: !!password });

    if (!password) {
      return res.status(400).json({ message: "비밀번호를 입력해주세요." });
    }

    if (userType === "buyer") {
      const buyerId = req.user.buyer_id;
      console.log("구매자 탈퇴 시도:", buyerId);
      
      // 비밀번호 확인
      const [buyers] = await db.query("SELECT password FROM buyer WHERE buyer_id = ?", [buyerId]);
      if (buyers.length === 0) {
        return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      }
      
      const isPasswordValid = await bcrypt.compare(password, buyers[0].password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
      }

      // 구매자 삭제 (관련 데이터는 ON DELETE CASCADE/SET NULL로 자동 처리)
      // support_board의 buyer_id는 SET NULL로 처리됨
      await db.query("DELETE FROM buyer WHERE buyer_id = ?", [buyerId]);
      console.log("구매자 삭제 완료:", buyerId);
      return res.status(200).json({ message: "계정이 탈퇴되었습니다." });

    } else if (userType === "seller") {
      const sellerId = req.user.seller_id;
      console.log("판매자 탈퇴 시도:", sellerId);
      
      // 비밀번호 확인
      const [sellers] = await db.query("SELECT password FROM seller WHERE seller_id = ?", [sellerId]);
      if (sellers.length === 0) {
        return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      }
      
      const isPasswordValid = await bcrypt.compare(password, sellers[0].password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
      }

      // 판매자 삭제
      await db.query("DELETE FROM seller WHERE seller_id = ?", [sellerId]);
      console.log("판매자 삭제 완료:", sellerId);
      return res.status(200).json({ message: "계정이 탈퇴되었습니다." });

    } else {
      return res.status(400).json({ message: "지원하지 않는 사용자 유형입니다." });
    }
  } catch (err) {
    console.error("계정 탈퇴 오류 상세:", err);
    res.status(500).json({ message: err.message || "서버 오류가 발생했습니다." });
  }
};