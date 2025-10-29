// /frontend/js/category/category.js (전체 교체)

// [1] 공통 유틸 (동일)
const formatKRW = (n) => typeof n === "number" ? new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 }).format(n) : (n ?? "");
function detectCategory() { const qs = new URLSearchParams(location.search); const cat = qs.get("category_name"); return cat ? cat.toLowerCase() : "bag"; }
function setHeroImage(type) { const hero = document.getElementById("heroImg"); if (!hero) return; hero.src = type === "all" ? "/frontend/public/models/all_model.webp" : type === "brand" ? "/frontend/public/models/brand_model.webp" : `/frontend/public/models/${type}_model.webp`; }

// [2] 카드 템플릿 (동일)
function cardHTML({ href, imgSrc, name, price }) { return `<a href="${href}" class="relative block fade"><div class="relative aspect-[3/4] bg-neutral-100 overflow-hidden"><img src="${imgSrc}" alt="${name}" class="absolute inset-0 w-full h-full object-contain hover-zoom" loading="lazy" decoding="async"/><div class="absolute inset-x-0 bottom-0 z-10 p-3"><p class="text-sm text-white">${name}</p><p class="text-sm text-white/90">${formatKRW(price)}</p></div><div class="absolute inset-x-0 bottom-0 h-24 cap-grad"></div></div></a>`; }
function activateFade() { setTimeout(() => { document.querySelectorAll(".fade").forEach((el) => el.classList.add("active")); }, 100); }

// [3] 렌더링 로직 (API 호출 방식으로 변경)
async function renderCategory() {
    const type = detectCategory();
    const grid = document.getElementById("categoryGrid");
    setHeroImage(type);

    try {
        // API에서 상품 데이터 가져오기
        const response = await fetch(`http://localhost:5000/api/products?category=${type}`);
        if (!response.ok) throw new Error('데이터를 불러오지 못했습니다.');

        const products = await response.json();

        if (products.length === 0) {
            grid.innerHTML = `<p class="col-span-full text-center py-10">표시할 상품이 없습니다.</p>`;
            return;
        }

                const cards = products.map((p) => {
                // ✅ imageUrl이 '/uploads/'로 시작하는지 확인
                const isNewUrl = p.imageUrl && p.imageUrl.startsWith('/uploads');
                // ✅ 새로운 URL이면 백엔드 주소를 붙여주고, 아니면 그대로 사용
                const finalImageUrl = isNewUrl ? `http://localhost:5000${p.imageUrl}` : p.imageUrl;

                return cardHTML({
                    href: `/frontend/pages/category/product.html?id=${p.product_id}`,
                    imgSrc: finalImageUrl,
                    name: p.name,
                    price: p.price,
                });
            }).join("");

        grid.innerHTML = cards;
        activateFade();

    } catch (error) {
        console.error("Error fetching products:", error);
        grid.innerHTML = `<p class="col-span-full text-center py-10 text-red-500">상품을 불러오는 중 오류가 발생했습니다.</p>`;
    }
}

// [4] 실행 (동일)
document.addEventListener("DOMContentLoaded", renderCategory);