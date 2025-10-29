const $ = (id) => document.getElementById(id);
const fmtKRW = (n) =>
  typeof n === "number"
    ? new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: "KRW",
        maximumFractionDigits: 0,
      }).format(n)
    : n || "";

const params = new URLSearchParams(location.search);
const productId = params.get("id");

const el = {
  loading: $("loading"),
  error: $("error"),
  product: $("product"),
  name: $("name"),
  price: $("price"),
  sku: $("sku"),
  desc: $("description"),
  mainImage: $("mainImage"),
  thumbs: $("thumbs"),
  tags: $("tags"),
  wishToggle: $("wishToggle"),
};

// MockData에서 제품 찾기 (mockData.js 기반)
function findInMocks(id) {
  const M = window.MockData || {};
  const pools = Object.entries({
    bag: M.productBag,
    accessory: M.productAccessory,
    beauty: M.productBeauty,
    top: M.productTop,
    bottoms: M.productBottoms,
    shoes: M.productShoes,
  }).filter(([, pool]) => !!pool);

  for (const [cat, pool] of pools) {
    if (pool[id]) return { data: pool[id], category: cat };
  }
  return null;
}

// 제품 로딩 (API 호출 방식으로 변경)
async function loadProduct(id) {
  if (!id) throw new Error("상품 ID가 없습니다.");

  try {
    const res = await fetch(`http://localhost:5000/api/products/${encodeURIComponent(id)}`);

    if (!res.ok) {
      throw new Error(`상품 정보를 불러오지 못했습니다. (HTTP ${res.status})`);
    }

    const productData = await res.json();

    // API 응답 구조에 맞게 wrapper 객체로 감싸서 반환
    return { data: productData, category: productData.category };

  } catch (err) {
    console.error(err);
    // 에러 발생 시 표시할 기본 데이터
    return {
      data: { id, name: "상품 정보 없음", price: 0, description: "오류가 발생했습니다." },
      category: "bag"
    };
  }
}

// 위시리스트 로직
const WISHLIST_KEY = "wishlistIds";
const WISHLIST_ITEMS_KEY = "wishlistItems";

function getWishlistSet() {
  try {
    const arr = JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function saveWishlistSet(set) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify([...set]));
}

function getWishlistItems() {
  try {
    const items = JSON.parse(localStorage.getItem(WISHLIST_ITEMS_KEY) || "[]");
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function saveWishlistItems(items) {
  localStorage.setItem(WISHLIST_ITEMS_KEY, JSON.stringify(items));
}

function applyHeartUI(isOn) {
  if (!el.wishToggle) return;
  const svg = el.wishToggle.querySelector("svg");
  if (!svg) return;
  svg.setAttribute("fill", isOn ? "currentColor" : "none");
  el.wishToggle.setAttribute("aria-pressed", String(isOn));
}

function initWishlistToggle(productId, productData) {
  if (!el.wishToggle) return;
  if (window.lucide?.createIcons) window.lucide.createIcons({});
  
  const set = getWishlistSet();
  let isOn = set.has(productId);
  applyHeartUI(isOn);
  
  el.wishToggle.onclick = () => {
    isOn = !isOn;
    
    if (isOn) {
      // 위시리스트에 추가
      set.add(productId);
      
      // 상품 상세 정보도 저장
      const wishlistItems = getWishlistItems();
      const existingIndex = wishlistItems.findIndex(item => item.id === productId);
      
      if (existingIndex === -1) {
        wishlistItems.push({
          id: productData.id,
          name: productData.name,
          price: productData.price,
          sku: productData.sku,
          brand: productData.brand,
          category: productData.category,
          image: productData.images?.[0] || "",
          addedAt: new Date().toISOString()
        });
        saveWishlistItems(wishlistItems);
      }
      
      alert("위시리스트에 추가되었습니다.");
    } else {
      // 위시리스트에서 제거
      set.delete(productId);
      
      const wishlistItems = getWishlistItems();
      const filteredItems = wishlistItems.filter(item => item.id !== productId);
      saveWishlistItems(filteredItems);
      
      alert("위시리스트에서 제거되었습니다.");
    }
    
    saveWishlistSet(set);
    applyHeartUI(isOn);
  };
}

// 상세 페이지 렌더링
function renderProduct(wrapper) {
  const data = wrapper.data;
  
  el.name.textContent = data.name ?? "상품명";
  el.price.textContent = fmtKRW(data.price);
  el.sku.textContent = data.sku ? `SKU: ${data.sku}` : "";
  el.desc.textContent = data.description ?? "";

  // --- 🔽 프론트, 백엔드 서버를 나누어 이미지 경로 처리 🔽 ---
  // 1. DB에 저장된 imageUrl이 '/uploads/'로 시작하는 새로운 경로인지 확인합니다.
  const isNewUrl = data.imageUrl && data.imageUrl.startsWith('/uploads');
  // 2. 새로운 경로이면 백엔드 주소를 앞에 붙여주고, 아니면 기존 경로를 그대로 사용합니다.
  const finalImageUrl = isNewUrl ? `http://localhost:5000${data.imageUrl}` : data.imageUrl;

  // 3. 최종적으로 만들어진 이미지 URL을 사용합니다.
  const imageUrl = finalImageUrl || "/frontend/public/placeholder.png"; // 이미지가 없을 경우를 대비한 기본값

  el.mainImage.src = imageUrl;
  
  // 썸네일도 메인 이미지와 동일하게 설정
  el.thumbs.innerHTML = "";
  const btn = document.createElement("button");
  btn.className = "relative aspect-square bg-neutral-100 rounded-md overflow-hidden border border-black";
  btn.innerHTML = `<img src="${imageUrl}" alt="thumb 1" class="absolute inset-0 w-full h-full object-contain" />`;
  el.thumbs.appendChild(btn);
  // --- 🔼 이미지 처리 로직 수정 끝 🔼 ---

  el.tags.innerHTML = "";
  if (Array.isArray(data.tags)) {
    data.tags.forEach((t) => {
      const chip = document.createElement("span");
      chip.className = "text-[11px] px-2 py-1 rounded-full bg-slate-100 text-slate-600";
      chip.textContent = t;
      el.tags.appendChild(chip);
    });
  }

  initWishlistToggle(data.id, data);
}

// 장바구니에 상품 추가
function addToCart(product, showAlert = true) {
  const CART_KEY = "cartItems";
  
  try {
    // 기존 장바구니 가져오기
    const cartItems = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    
    // 이미 장바구니에 있는지 확인
    const existingIndex = cartItems.findIndex(item => item.id === product.id);
    
    if (existingIndex >= 0) {
      // 이미 있으면 수량 증가
      cartItems[existingIndex].quantity = (cartItems[existingIndex].quantity || 1) + 1;
      if (showAlert) alert("장바구니에 해당 상품의 수량이 증가되었습니다.");
    } else {
      // 없으면 새로 추가
      cartItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        sku: product.sku,
        brand: product.brand,
        category: product.category,
        image: product.images?.[0] || "",
        quantity: 1,
        addedAt: new Date().toISOString()
      });
      if (showAlert) alert("장바구니에 상품이 추가되었습니다.");
    }
    
    // 로컬스토리지에 저장
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
    
  } catch (err) {
    console.error("장바구니 추가 오류:", err);
    if (showAlert) alert("장바구니 추가에 실패했습니다.");
  }
}

// 수량 조절 함수
function setupQuantityControls() {
  const quantityDisplay = $("quantity-display");
  const minusBtn = $("quantity-minus");
  const plusBtn = $("quantity-plus");
  
  if (!quantityDisplay || !minusBtn || !plusBtn) return;
  
  // 현재 수량 가져오기 (기본값 1)
  let currentQuantity = 1;
  
  // 수량 업데이트 함수
  function updateQuantity(newQuantity) {
    // 1 미만으로 내려가지 않도록 제한
    if (newQuantity < 1) return;
    
    currentQuantity = newQuantity;
    quantityDisplay.textContent = currentQuantity;
  }
  
  // 마이너스 버튼 클릭 시
  minusBtn.addEventListener("click", () => {
    updateQuantity(currentQuantity - 1);
  });
  
  // 플러스 버튼 클릭 시
  plusBtn.addEventListener("click", () => {
    updateQuantity(currentQuantity + 1);
  });
  
  // 초기 수량 설정
  updateQuantity(1);
}

// 실행
(async () => {
  try {
    const wrapper = await loadProduct(productId || "101");
    renderProduct(wrapper);
    el.loading.classList.add("hidden");
    el.product.classList.remove("hidden");
    
    // 수량 조절 기능 초기화
    setupQuantityControls();
    
    // 장바구니 담기 버튼
    const addToCartBtn = $("addToCart");
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", () => {
        // 현재 선택된 수량 가져오기
        const quantityElement = $("quantity-display");
        const quantity = quantityElement ? parseInt(quantityElement.textContent) || 1 : 1;
        
        // 수량을 포함한 상품 정보로 장바구니에 추가
        const productWithQuantity = { ...wrapper.data, quantity };
        addToCart(productWithQuantity);
      });
    }
    
    // 바로 구매 버튼
    const buyNowBtn = $("buyNow");
    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", () => {
        // 현재 선택된 수량 가져오기
        const quantityElement = $("quantity-display");
        const quantity = quantityElement ? parseInt(quantityElement.textContent) || 1 : 1;
        
        // "바로 구매"용 상품 정보 저장 (선택한 수량 포함)
        const buyNowProduct = {
          id: wrapper.data.id,
          name: wrapper.data.name,
          price: wrapper.data.price,
          sku: wrapper.data.sku,
          brand: wrapper.data.brand,
          category: wrapper.data.category,
          image: wrapper.data.images?.[0] || wrapper.data.imageUrl || "",
          imageUrl: wrapper.data.imageUrl || "",
          quantity: quantity
        };
        
        // "바로 구매"용 정보를 localStorage에 저장 (기존 데이터 덮어쓰기)
        localStorage.setItem("buyNowProduct", JSON.stringify([buyNowProduct]));
        
        // 결제 페이지로 이동 (상품 ID 전달)
        window.location.href = `/frontend/pages/payment/payment.html?productId=${wrapper.data.id}`;
      });
    }
  } catch (err) {
    console.error(err);
    el.loading.classList.add("hidden");
    el.error.textContent = err?.message || "오류가 발생했습니다.";
    el.error.classList.remove("hidden");
  }
})();