// /backend/src/api/sellerProducts/sellerProduct.model.js (전체 교체)

import db from "../../config/db.js";

// 새로운 상품을 DB에 추가
export const createProduct = async (productData) => {
  const { seller_id, name, brand, category, description, price, imageUrl } = productData;
  
  // --- 🔽 [추가] 디버깅을 위한 로그 🔽 ---
  console.log("--- DB INSERT 시도 데이터 ---");
  console.log({ seller_id, name, brand, category, description, price, imageUrl });
  console.log("--------------------------");

  try {
    const [result] = await db.query(
      `INSERT INTO products (seller_id, name, brand, category, description, price, imageUrl) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [seller_id, name, brand, category, description, price, imageUrl]
    );
    
    console.log("✅ DB INSERT 성공! 새로운 상품 ID:", result.insertId);
    return result.insertId;

  } catch (error) {
    // --- 🔽 [추가] DB 오류를 직접 출력하는 부분 🔽 ---
    console.error("❌❌❌ 데이터베이스 INSERT 실패! ❌❌❌");
    console.error(error); // DB가 보낸 실제 에러 객체를 출력합니다.
    
    // 에러를 상위로 다시 던져서 API가 정상적으로 실패 응답을 보내도록 합니다.
    throw new Error("데이터베이스에 상품을 추가하는 중 오류가 발생했습니다.");
  }
};