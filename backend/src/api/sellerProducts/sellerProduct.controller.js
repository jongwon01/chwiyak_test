// /backend/src/api/sellerProducts/sellerProduct.controller.js

import * as service from './sellerProduct.service.js';

export const createProduct = async (req, res) => {
    try {
        const sellerId = req.seller_id; // verifySellerToken 미들웨어에서 제공
        const productInfo = req.body;
        const mainImage = req.file; // multer가 처리한 파일

        if (!mainImage) {
            return res.status(400).json({ message: "메인 이미지는 필수입니다." });
        }
        
        const newProduct = await service.registerProduct(sellerId, productInfo, mainImage);
        res.status(201).json({ message: "상품 등록 성공", product: newProduct });

    } catch (err) {
        console.error("상품 등록 오류:", err);
        res.status(500).json({ message: err.message });
    }
};