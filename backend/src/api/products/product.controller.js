import * as productService from "./product.service.js";

// 전체 / 카테고리별 / 브랜드별 조회
export const getProducts = async (req, res) => {
  try {
    const { category, brand, keyword } = req.query;
    const products = await productService.fetchProducts(category, brand, keyword);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 단일 상품 상세 조회
export const getProductDetail = async (req, res) => {
  try {
    console.log("🔍 [Product Detail] 요청된 ID:", req.params.id);
    console.log("🔍 [Product Detail] req.params 전체:", req.params);
    
    if (!req.params.id) {
      return res.status(400).json({ message: "상품 ID가 필요합니다." });
    }
    
    const product = await productService.fetchProductDetail(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    console.error("❌ [Product Detail] 에러:", err.message);
    res.status(404).json({ message: err.message });
  }
};
