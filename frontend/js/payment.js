// payment.js (SAFE FETCH + ABSOLUTE API BASE)
document.addEventListener("DOMContentLoaded", async () => {
  // ★ 항상 백엔드(5000)로 보내도록 절대경로 사용
  const API_BASE = "http://localhost:5000";

  // 공통: 안전한 JSON 파싱 fetch
  async function safeFetchJSON(url, options = {}) {
    const res = await fetch(url, options);
    const contentType = res.headers.get("content-type") || "";
    const raw = await res.text(); // 먼저 text로 수신
    let data = null;
    if (raw) {
      // content-type이 이상해도 JSON 시도
      try { data = JSON.parse(raw); } catch (_) { /* JSON 아님 */ }
    }
    return { res, data, raw, contentType };
  }

  // 뒤로가기 버튼
  const backButton = document.querySelector('button[onclick="history.back()"]');
  if (backButton) {
    backButton.onclick = (e) => {
      e.preventDefault();
      window.location.href = '../cart/cart.html';
    };
  }

  // 구매자 프로필 정보 로드 및 업데이트
  let buyerProfile = null;
  async function loadBuyerProfile() {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const { res, data } = await safeFetchJSON(`${API_BASE}/api/buyer/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok && data) {
          buyerProfile = data;
          console.log("구매자 프로필:", buyerProfile);

          // DOM이 준비될 때까지 대기
          setTimeout(() => {
            // 배송지 정보에 구매자 이름과 연락처 표시
            // "배송 주소" 섹션 찾기 - h3 제목으로 식별
            const sections = document.querySelectorAll('section.bg-white.rounded-lg.shadow-sm.p-6.mb-4');
            let shippingSection = null;
            for (let section of sections) {
              const h3 = section.querySelector('h3');
              if (h3 && h3.textContent.includes('배송 주소')) {
                shippingSection = section;
                break;
              }
            }
            
            if (shippingSection) {
              const shippingFlexDivs = shippingSection.querySelectorAll('div.flex');
              
              // 받는 분: 첫 번째 div.flex의 두 번째 span
              if (shippingFlexDivs.length > 0) {
                const nameSpan = shippingFlexDivs[0].querySelector('span.text-gray-900');
                if (nameSpan) {
                  console.log("받는 분 업데이트:", buyerProfile.name);
                  nameSpan.textContent = buyerProfile.name || '홍길동';
                }
              }
              
              // 연락처: 두 번째 div.flex의 두 번째 span
              if (shippingFlexDivs.length > 1) {
                const phoneSpan = shippingFlexDivs[1].querySelector('span.text-gray-900');
                if (phoneSpan) {
                  console.log("연락처 업데이트:", buyerProfile.phone);
                  const phone = buyerProfile.phone || '010-1234-5678';
                  phoneSpan.textContent = phone;
                }
              }
            }
          }, 100);
        } else {
          console.warn("구매자 프로필 응답이 비정상:", res.status, data);
        }
      }
    } catch (error) {
      console.error("구매자 정보 로드 실패:", error);
    }
  }
  
  // 구매자 프로필 로드
  loadBuyerProfile();

  // 상품 정보 로드 (localStorage에서)
  const cartItems = []; // 기존 장바구니는 사용하지 않음
  const urlParams = new URLSearchParams(location.search);
  const buyNowProductId = urlParams.get("productId");
  
  let currentProducts = [];
  
  if (buyNowProductId) {
    // "바로 구매"로 온 경우 - localStorage에서 buyNowProduct 가져오기
    const buyNowProducts = JSON.parse(localStorage.getItem("buyNowProduct") || "[]");
    const buyNowProduct = buyNowProducts.find(item => String(item.id) === String(buyNowProductId));
    if (buyNowProduct) {
      // 바로 구매 상품의 수량을 그대로 유지
      buyNowProduct.quantity = buyNowProduct.quantity || 1;
      currentProducts = [buyNowProduct];
    } else {
      // 장바구니에 없으면 localStorage에서 찾기
      const storedProduct = JSON.parse(localStorage.getItem("buyNowProduct") || "[]");
      if (Array.isArray(storedProduct) && storedProduct.length > 0) {
        currentProducts = storedProduct;
      }
    }
  } else {
    // 일반 장바구니에서 온 경우
    currentProducts = cartItems;
  }

  console.log("로드된 상품:", currentProducts);
  
  // 상품 정보 표시
  if (currentProducts.length > 0) {
    updateProductDisplay(currentProducts);
    updateProductCount(currentProducts.length);
    
    // 상품 정보가 로드된 후 초기 결제금액 계산
    setTimeout(() => {
      updatePaymentAmount();
    }, 100);
  } else {
    console.warn("상품 정보가 없습니다.");
  }

  function formatPrice(price) {
    if (typeof price !== 'number') {
      price = parseFloat(price) || 0;
    }
    return price.toLocaleString('ko-KR') + '원';
  }

  function updateProductDisplay(products) {
    const productInfoContainer = document.querySelector('.flex.gap-4.mb-6.pl-4');
    if (!productInfoContainer) return;

    // 첫 번째 상품만 표시 (간단하게)
    const product = products[0];
    console.log("표시할 상품:", product);
    
    // 가격 포맷팅
    const price = parseFloat(product.price) || 0;
    const quantity = parseInt(product.quantity) || 1;
    const totalPrice = price * quantity;
    
    // 상품 설명에서 HTML 태그 제거
    let description = product.description || '';
    description = description.replace(/<[^>]*>?/gm, ''); // HTML 태그 제거
    
    productInfoContainer.innerHTML = `
      <div class="w-20 h-20 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
        <img src="${product.image || product.imageUrl || '/frontend/public/bags/LOUISVUITTON_bag1.jpg'}" alt="${product.name}" class="w-full h-full object-cover" />
      </div>
      <div class="flex-1">
        <p class="text-sm font-bold mb-1">${product.name || '상품명'}</p>
        ${product.sku ? `<p class="text-xs text-gray-500 mb-1">${product.sku}</p>` : ''}
        ${description ? `<p class="text-xs text-gray-600 mb-1">${description.substring(0, 30)}${description.length > 30 ? '...' : ''}</p>` : ''}
        <p class="text-xs text-gray-900">수량: ${quantity}개</p>
      </div>
      <div class="text-right">
        <p class="text-sm">${formatPrice(price)}</p>
        <p class="font-bold">${formatPrice(totalPrice)}</p>
      </div>
    `;
  }

  // 상품 개수 업데이트
  function updateProductCount(count) {
    const countBtn = document.querySelector('.text-sm.text-gray-500');
    if (countBtn) countBtn.textContent = `총 ${count}건`;
  }

  // === 우편번호 검색 (다음 우편번호 API) ===
  const zipcodeSearchBtn = document.getElementById("zipcode-search-btn");
  if (zipcodeSearchBtn) {
    zipcodeSearchBtn.addEventListener("click", () => {
      new daum.Postcode({
        oncomplete: function(data) {
          document.getElementById("zipcode").value = data.zonecode;

          let addr = (data.userSelectedType === 'R') ? data.roadAddress : data.jibunAddress;
          if (data.buildingName) addr += ` (${data.buildingName})`;

          document.getElementById("address1").value = addr;
          document.getElementById("address2").focus();
        }
      }).open();
    });
  }

  // === 쿠폰 모달 ===
  const couponModal = document.getElementById("coupon-modal");
  const couponOpenBtn = document.getElementById("coupon-open-btn");
  const couponModalBackBtn = document.getElementById("coupon-modal-back-btn");
  const couponApplyBtn = document.getElementById("coupon-apply-btn");
  const selectedCouponText = document.getElementById("selected-coupon-text");

  if (couponOpenBtn) {
    couponOpenBtn.addEventListener("click", () => {
      couponModal.classList.remove("hidden");
    });
  }
  if (couponModalBackBtn) {
    couponModalBackBtn.addEventListener("click", () => {
      couponModal.classList.add("hidden");
    });
  }
  if (couponApplyBtn) {
    couponApplyBtn.addEventListener("click", () => {
      const selected = document.querySelector('input[name="coupon"]:checked');
      if (!selected) return;

      if (selected.value === "none") {
        selectedCouponText.textContent = "사용할 쿠폰을 선택해주세요";
        selectedCouponText.classList.remove("text-red-500", "font-medium");
        selectedCouponText.classList.add("text-gray-500");
      } else {
        const couponAmount = Number(selected.value) || 0;
        selectedCouponText.textContent = `${couponAmount.toLocaleString()}원 할인 쿠폰`;
        selectedCouponText.classList.remove("text-gray-500");
        selectedCouponText.classList.add("text-red-500", "font-medium");
      }
      couponModal.classList.add("hidden");
      updatePaymentAmount();
    });
  }
  couponModal?.addEventListener("click", (e) => {
    if (e.target === couponModal) couponModal.classList.add("hidden");
  });

  // === 배송 메시지 모달 ===
  const deliveryModal = document.getElementById("delivery-modal");
  const deliveryMsgBtn = document.getElementById("delivery-msg-btn");
  const modalBackBtn = document.getElementById("modal-back-btn");
  const modalApplyBtn = document.getElementById("modal-apply-btn");

  if (deliveryMsgBtn) {
    deliveryMsgBtn.addEventListener("click", () => {
      deliveryModal.classList.remove("hidden");
    });
  }
  if (modalBackBtn) {
    modalBackBtn.addEventListener("click", () => {
      deliveryModal.classList.add("hidden");
    });
  }
  if (modalApplyBtn) {
    modalApplyBtn.addEventListener("click", () => {
      const selected = document.querySelector('input[name="delivery-request"]:checked');
      if (!selected) return;

      const label = selected.parentElement.querySelector('span')?.textContent || "";
      if (selected.value === "custom") {
        const customMsg = prompt("배송 요청사항을 입력하세요:");
        if (customMsg) {
          deliveryMsgBtn.textContent = customMsg;
          deliveryMsgBtn.classList.add("text-left");
        }
      } else if (selected.value === "default") {
        deliveryMsgBtn.textContent = "배송 메세지";
        deliveryMsgBtn.classList.remove("text-left");
      } else {
        deliveryMsgBtn.textContent = label;
        deliveryMsgBtn.classList.add("text-left");
      }
      deliveryModal.classList.add("hidden");
    });
  }
  deliveryModal?.addEventListener("click", (e) => {
    if (e.target === deliveryModal) deliveryModal.classList.add("hidden");
  });

  // === 포인트 ===
  const pointInput = document.querySelector('input[placeholder="포인트"]');
  const maxPointBtn = document.getElementById("max-point-btn");

  if (maxPointBtn) {
    maxPointBtn.addEventListener("click", () => {
      const maxPoints = 10000; // TODO: 보유 포인트 API로 대체
      if (pointInput) pointInput.value = maxPoints.toLocaleString();
      alert(`${maxPoints.toLocaleString()}P를 사용합니다.`);
      updatePaymentAmount();
    });
  }
  if (pointInput) {
    pointInput.addEventListener("input", (e) => {
      const value = e.target.value.replace(/[^0-9]/g, '');
      e.target.value = value ? Number(value).toLocaleString() : '';
    });
    pointInput.addEventListener("blur", () => {
      updatePaymentAmount();
    });
  }

  // === 결제금액 재계산 ===
  function updatePaymentAmount() {
    console.log("현재 상품 목록:", currentProducts);
    // 실제 데이터로 치환
    const productPrice = currentProducts.length > 0 
      ? currentProducts.reduce((sum, p) => sum + (Number(p.price) * (p.quantity || 1)), 0)
      : 0;
    console.log("상품가격:", productPrice);
    const deliveryFee = 5000;    // 배송비

    // 쿠폰 할인
    const selectedCoupon = document.querySelector('input[name="coupon"]:checked');
    const couponDiscount = selectedCoupon && selectedCoupon.value !== "none" ? Number(selectedCoupon.value) : 0;

    // 포인트 사용
    const pointValue = pointInput ? pointInput.value.replace(/,/g, '') : '0';
    const pointDiscount = pointValue ? Number(pointValue) : 0;

    // 최종 결제금액 (0원 이하 방지)
    const finalAmount = Math.max(0, productPrice + deliveryFee - couponDiscount - pointDiscount);

    // 결제 버튼
    const payBtn = document.getElementById("payment-btn");
    if (payBtn) payBtn.textContent = `${finalAmount.toLocaleString()}원 결제하기`;

    // ── 요약 라벨 기반 안전 갱신 (순서 변동에도 정확히 들어감) ──
    function setSummaryValue(labelText, valueText) {
      const rows = document.querySelectorAll(".space-y-2.text-sm.mb-4.pl-4 .flex.justify-between");
      for (const row of rows) {
        const labelEl = row.querySelector("span:first-child");
        const valueEl = row.querySelector(".font-medium");
        if (!labelEl || !valueEl) continue;
        const txt = labelEl.textContent.replace(/\s/g, "");
        if (txt.includes(labelText)) {
          valueEl.textContent = valueText;
          break;
        }
      }
    }

    const productText  = `${productPrice.toLocaleString()}원`;
    const shipText     = `${deliveryFee.toLocaleString()}원`;
    const discountText = couponDiscount > 0 ? `-${couponDiscount.toLocaleString()}원` : "-";
    const pointText    = pointDiscount > 0 ? `-${pointDiscount.toLocaleString()}원` : "-";

    setSummaryValue("상품가", productText);
    setSummaryValue("배송비", shipText);
    setSummaryValue("할인", discountText);     // ← 쿠폰 할인은 '할인' 라인
    setSummaryValue("포인트", pointText);       // ← 포인트는 '포인트' 라인

    // 중간 결제금액 (상품 및 과표 섹션 내) - "주문 상품 및 과표" 섹션
    const sections = document.querySelectorAll('section.bg-white.rounded-lg.shadow-sm.p-6.mb-4');
    for (let section of sections) {
      const h3 = section.querySelector('h3');
      if (h3 && h3.textContent.includes('주문 상품')) {
        const midPaymentSpan = section.querySelector('.border-t.border-gray-200.pt-4.flex.justify-between.font-bold.text-base.pl-4 span:last-child');
        if (midPaymentSpan) {
          // 결제금액 = 상품가 (배송비 제외)
          midPaymentSpan.textContent = `${productPrice.toLocaleString()}원`;
          break;
        }
      }
    }

    // 총 결제금액 (아래 굵은 영역)
    const totalSpan = document.querySelector(
      ".border-t.border-gray-200.pt-4.flex.justify-between.font-bold.text-lg span:last-child"
    );
    if (totalSpan) totalSpan.textContent = `${finalAmount.toLocaleString()}원`;
  }

  // === 결제하기 버튼 ===
  const paymentBtn = document.getElementById("payment-btn");
  if (paymentBtn) {
    function collectSelectedItemsFromProducts() {
      // currentProducts 배열을 사용하여 주문 항목 생성
      return currentProducts.map(product => ({
        product_id: Number(product.id ?? product.product_id),
        quantity: Number(product.quantity || 1),
        unit_price: Number(product.price)
      }));
    }

    paymentBtn.addEventListener("click", async () => {
      const zipcode = document.getElementById("zipcode")?.value;
      const address1 = document.getElementById("address1")?.value;
      const address2 = document.getElementById("address2")?.value || "";

      if (!zipcode || !address1) {
        alert("배송 주소를 입력해주세요.");
        document.getElementById("zipcode-search-btn")?.focus();
        return;
      }
      if (!address2.trim()) {
        const ok = confirm("상세 주소가 비어 있습니다. 계속 진행하시겠습니까?");
        if (!ok) {
          document.getElementById("address2")?.focus();
          return;
        }
      }

      const methodEl = document.querySelector('input[name="payment-method"]:checked');
      const methodText = methodEl ? methodEl.nextElementSibling?.textContent || "" : "선택 안 됨";
      const finalAmountText = paymentBtn.textContent.replace('원 결제하기', '원').trim();

      if (!confirm(`${methodText}로 ${finalAmountText}을 결제하시겠습니까?`)) return;

      const token = localStorage.getItem("token");
      const userType = localStorage.getItem("userType");
      if (!token || userType !== "buyer") {
        alert("로그인이 필요합니다. (구매자 계정으로 로그인)\n로그인 후 다시 시도해주세요.");
        return;
      }

      const selectedCoupon = document.querySelector('input[name="coupon"]:checked');
      const buyerCouponId = selectedCoupon && selectedCoupon.dataset.buyerCouponId
        ? Number(selectedCoupon.dataset.buyerCouponId) : null;
      const pointValue = pointInput ? Number((pointInput.value || '0').replace(/,/g, '')) : 0;

      const items = collectSelectedItemsFromProducts();
      console.log("주문할 상품들:", items);
      
      if (!items.length || items.some(it => !Number.isFinite(it.product_id))) {
        alert("주문 항목을 찾을 수 없습니다. 상품 목록을 확인해주세요.");
        return;
      }

      // 임시 주소 ID (추후 배송지 관리 연동 시 교체)
      const addressId = 1;

      const body = {
        order_name: "주문결제",
        items,
        use_points: pointValue,
        buyer_coupon_id: buyerCouponId,
        payment_method: methodEl?.value || "card",
        address_id: addressId
      };

      try {
        console.log("결제 요청:", body);
        const response = await fetch(`${API_BASE}/api/orders/checkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(body)
        });

        console.log("응답 상태:", response.status);
        console.log("RAW 응답:", await response.text());

        // JSON이 아니거나 비었을 때 대비
        if (!response.ok) {
          const msg = (await response.json())?.message || await response.text() || `HTTP ${response.status}`;
          alert(`결제 실패: ${msg}`);
          return;
        }

        const data = await response.json();
        if (!data || !data.ok) {
          const msg = data?.message || await response.text() || "결제 실패";
          alert(msg);
          return;
        }

        alert("결제가 완료되었습니다!");
        location.href = data.redirect || "/frontend/pages/mypage/orderlist.html";

      } catch (e) {
        console.error("결제 오류:", e);
        alert("결제 요청 중 오류가 발생했습니다: " + e.message);
      }
    });
  }
});