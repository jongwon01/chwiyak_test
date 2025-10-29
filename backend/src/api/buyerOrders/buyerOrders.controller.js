// src/api/buyerOrders/buyerOrders.controller.js
import * as service from "./buyerOrders.service.js";
import db from "../../config/db.js";
import { getPointBalance } from "../buyerPoints/buyerPoints.model.js";
import { getUserCouponById } from "../buyerCoupons/buyerCoupons.model.js";

export const getOrders = async (req, res) => {
  try {
    const buyerId = req?.buyer?.buyer_id;
    const status = req.query.status; // status 파라미터
    
    let orders;
    if (status) {
      // 상태별 주문 조회
      orders = await service.getBuyerOrdersByStatus(buyerId, status);
    } else {
      // 전체 주문 조회
      orders = await service.getBuyerOrders(buyerId);
    }
    
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 결제/체크아웃 처리: 주문 생성 + 포인트 차감 + 쿠폰 사용 (트랜잭션)
export const checkout = async (req, res) => {
  const buyerId = req?.buyer?.buyer_id || req?.buyer_id;
  if (!buyerId) return res.status(401).json({ message: "UNAUTHORIZED" });

  try {
    const {
      order_name,
      items, // [{ product_id, quantity, unit_price }]
      use_points = 0,
      buyer_coupon_id = null, // buyer_coupons.buyer_coupon_id
      payment_method,
      address_id,
    } = req.body || {};

    if (!order_name || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "INVALID_PAYLOAD" });
    }

    // 배송지 유효성 검사
    let finalAddressId = 0;
    
    // 주소 ID가 제공된 경우 해당 주소가 사용자의 주소인지 확인
    if (address_id) {
      const [address] = await db.query(
        'SELECT address_id FROM buyer_address WHERE address_id = ? AND buyer_id = ?',
        [address_id, buyerId]
      );
      
      if (address.length === 0) {
        return res.status(400).json({ message: 'INVALID_ADDRESS' });
      }
      finalAddressId = Number(address_id);
    } else {
      // 기본 배송지 조회
      const [defaultAddress] = await db.query(
        'SELECT address_id FROM buyer_address WHERE buyer_id = ? AND is_default = 1',
        [buyerId]
      );
      
      if (defaultAddress.length === 0) {
        return res.status(400).json({ 
          message: 'NO_DEFAULT_ADDRESS',
          detail: '기본 배송지가 등록되어 있지 않습니다. 배송지를 먼저 등록해주세요.'
        });
      }
      finalAddressId = defaultAddress[0].address_id;
    }

    // 금액 계산
    const itemsTotal = items.reduce((sum, it) => {
      const qty = Number(it?.quantity || 0);
      const price = Number(it?.unit_price || 0);
      if (qty <= 0 || price < 0) return sum;
      return sum + qty * price;
    }, 0);

    if (itemsTotal <= 0) {
      return res.status(400).json({ message: "INVALID_ITEMS_TOTAL" });
    }

    // ── 쿠폰 할인 계산 ──
    let couponDiscount = 0;
    let couponRow = null;
    if (buyer_coupon_id) {
      couponRow = await getUserCouponById(buyerId, buyer_coupon_id);
      if (!couponRow) return res.status(400).json({ message: "NOT_FOUND_COUPON" });
      if (couponRow.is_used) return res.status(400).json({ message: "ALREADY_USED_COUPON" });

      const minAmount = Number(couponRow.min_order_amount || 0);
      if (itemsTotal < minAmount) {
        return res.status(400).json({ message: "MIN_AMOUNT_NOT_MET" });
      }

      // DB enum: 'PERCENT' | 'FIXED' → 대소문자/동의어 모두 허용
      const dt = String(couponRow.discount_type || "").toUpperCase();

      if (dt === "FIXED" || dt === "FIX") {
        couponDiscount = Math.max(0, Number(couponRow.discount_value || 0));
      } else if (dt === "PERCENT" || dt === "PERCENTAGE") {
        const pct = Math.max(0, Math.min(100, Number(couponRow.discount_value || 0)));
        couponDiscount = Math.floor((itemsTotal * pct) / 100);
      }
      couponDiscount = Math.min(couponDiscount, itemsTotal);
    }

    const beforePoints = Math.max(0, itemsTotal - couponDiscount);

    // ── 포인트 한도 검증 ──
    const wantUsePoints = Math.max(0, Number(use_points || 0));
    const pointBalance = await getPointBalance(buyerId); // ※ buyerPoints.model.js는 points 테이블 기준이어야 함
    if (wantUsePoints > pointBalance) {
      return res.status(400).json({ message: "INSUFFICIENT_POINTS" });
    }
    const usePoints = Math.min(wantUsePoints, beforePoints);
    const finalTotal = Math.max(0, beforePoints - usePoints);

    // ── 트랜잭션 시작 ──
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // 주문 번호 생성 (YYYYMMDD-XXXXXX 형식)
      const today = new Date();
      const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
      const randomNum = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
      const orderNumber = `${dateStr}-${randomNum}`;
      
      // 주문 생성 (status: PAID)
      const [orderResult] = await conn.query(
        `INSERT INTO orders (buyer_id, address_id, order_name, total_price, status, created_at)
         VALUES (?, ?, ?, ?, 'PAID', NOW())`,
        [buyerId, finalAddressId, orderNumber, Number(finalTotal)]
      );
      const orderId = orderResult.insertId;

      // 주문 항목 저장
      for (const it of items) {
        const pid = Number(it?.product_id);
        const qty = Number(it?.quantity);
        const price = Number(it?.unit_price);
        if (!pid || qty <= 0 || price < 0) continue;
        await conn.query(
          `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
           VALUES (?, ?, ?, ?)`,
          [orderId, pid, qty, price]
        );
      }

      // ★ 포인트 차감 기록: buyer_point_history → points 테이블로 변경
      // points(buyer_id, amount, description, type, expires_at, created_at)
      if (usePoints > 0) {
        await conn.query(
          `INSERT INTO points (buyer_id, amount, description, type, created_at)
           VALUES (?, ?, '주문 사용', 'USE', NOW())`,
          [buyerId, -usePoints]
        );
      }

      // 쿠폰 사용 처리
      if (couponRow) {
        const [ret] = await conn.query(
          `UPDATE buyer_coupons
              SET is_used = TRUE, used_at = NOW()
            WHERE buyer_coupon_id = ? AND buyer_id = ? AND is_used = FALSE`,
          [buyer_coupon_id, buyerId]
        );
        if (!ret.affectedRows) {
          throw new Error("COUPON_ALREADY_USED_OR_DELETED");
        }
      }

      await conn.commit();

      return res.status(201).json({
        ok: true,
        order_id: orderId,
        redirect: "/frontend/pages/mypage/orderlist.html",
        paid_total: finalTotal,
        used_points: usePoints,
        coupon_discount: couponDiscount,
      });
    } catch (txErr) {
      await conn.rollback();
      console.error("결제 트랜잭션 오류:", txErr);
      return res.status(500).json({ message: txErr.message || "CHECKOUT_FAILED" });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("결제 오류:", err);
    return res.status(500).json({ message: err.message });
  }
};
