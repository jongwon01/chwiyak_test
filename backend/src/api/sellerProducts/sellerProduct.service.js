// /backend/src/api/sellerProducts/sellerProduct.service.js

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import * as productModel from './sellerProduct.model.js';
import * as sellerModel from '../seller/seller.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 카테고리별 이미지 번호를 관리할 JSON 파일 경로
const COUNTER_FILE = path.join(__dirname, 'image_counter.json');

// 프론트엔드 카테고리 이름 -> 파일 경로용 이름 매핑
const categoryMap = {
    '상의': 'top', '하의': 'bottoms', '가방': 'bag',
    '신발': 'shoes', '악세사리': 'accessory', '뷰티': 'beauty'
};

// 다음 이미지 번호를 가져오는 함수
async function getNextImageNumber(category) {
    let counters = {};
    try {
        const data = await fs.readFile(COUNTER_FILE, 'utf-8');
        counters = JSON.parse(data);
    } catch (error) { // 파일이 없으면 초기화
        counters = { top: 4, bottoms: 4, bag: 4, shoes: 4, accessory: 4, beauty: 4 };
    }

    counters[category] = (counters[category] || 4) + 1;
    await fs.writeFile(COUNTER_FILE, JSON.stringify(counters, null, 2));
    return counters[category];
}

// 상품 등록 서비스 로직
export const registerProduct = async (sellerId, productInfo, mainImage) => {
    // 1. 판매자 정보에서 브랜드 이름(회사명) 가져오기
    const seller = await sellerModel.getSellerProfile(sellerId);
    if (!seller) throw new Error("판매자 정보를 찾을 수 없습니다.");
    
    // ✅ 'brandName' 변수명을 'brand'로 통일하고, 값이 없는 경우를 대비합니다.
    const brand = seller.company_name ? seller.company_name.toUpperCase() : 'UNKNOWN_BRAND';
    
    const fileCategory = productInfo.category;
    if (!fileCategory) throw new Error("유효하지 않은 카테고리입니다.");

    // 2. 다음 이미지 번호 생성
    const imageNumber = await getNextImageNumber(fileCategory);
    
    // 3. 파일 이름 및 최종 저장 경로 생성
    const fileExtension = path.extname(mainImage.originalname);
    // ✅ 'brandName' 대신 'brand' 변수를 사용하도록 수정
    const newFileName = `${brand}_${fileCategory}${imageNumber}${fileExtension}`;
    const publicPath = path.join(__dirname, `../../../public/images`);
    const finalFilePath = path.join(publicPath, newFileName);
    
    // 4. DB에 저장될 URL 경로 생성
    const imageUrlForDb = `/uploads/${newFileName}`;

    // 5. 백엔드 public 폴더에 파일 저장
    await fs.mkdir(publicPath, { recursive: true });
    await fs.rename(mainImage.path, finalFilePath);

    // 6. DB에 저장할 상품 데이터 준비
    const productData = {
        ...productInfo,
        seller_id: sellerId,
        brand: brand, // ✅ DB의 brand 컬럼에 brand 변수 값을 저장
        imageUrl: imageUrlForDb
    };

    const newProductId = await productModel.createProduct(productData);
    return { productId: newProductId, ...productData };
};