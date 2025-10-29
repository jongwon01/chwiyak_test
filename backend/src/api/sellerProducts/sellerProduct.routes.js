// /backend/src/api/sellerProducts/sellerProduct.routes.js

import express from "express";
import multer from "multer";
import { verifySellerToken } from "../../middleware/sellerAuth.js";
import { createProduct } from "./sellerProduct.controller.js";

const router = express.Router();
// 파일을 서버의 임시 폴더('uploads/')에 저장하도록 multer 설정
const upload = multer({ dest: 'uploads/' });

// POST /api/seller/products : 상품 등록 API
router.post("/", verifySellerToken, upload.single('mainImage'), createProduct);

export default router;