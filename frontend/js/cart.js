// /frontend/js/cart.js (전체 교체)

document.addEventListener("DOMContentLoaded", () => {
    loadCartItems();
});

const formatKRW = (n) => new Intl.NumberFormat("ko-KR").format(n);

// [핵심] API를 호출하여 장바구니 목록을 불러오고 화면에 렌더링하는 메인 함수
async function loadCartItems() {
    const container = document.getElementById("cart-items-container");
    const loadingIndicator = document.getElementById("loading-indicator");
    const emptyMessage = document.getElementById("empty-cart-message");
    const orderSummarySection = document.querySelector('.bg-white.rounded-lg.p-6.my-3'); // 주문정보 섹션
    const orderButton = document.getElementById("order-checkout-button"); // 주문하기 버튼
    const token = localStorage.getItem("token");

    if (!token) {
        alert("로그인이 필요합니다.");
        return (window.location.href = "/frontend/pages/login&signup/login.html");
    }

    try {
        const response = await fetch("http://localhost:5000/api/cart", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("장바구니 정보를 불러오는 데 실패했습니다.");
        
        const items = await response.json();
        loadingIndicator.style.display = 'none';

        if (items.length === 0) {
            emptyMessage.classList.remove("hidden");
            container.innerHTML = ''; // 컨테이너 비우기
            if(orderSummarySection) orderSummarySection.classList.add('hidden'); // 주문정보 숨기기
            if(orderButton) orderButton.classList.add('hidden'); // 주문버튼 숨기기
        } else {
            container.innerHTML = items.map(item => createItemHTML(item)).join("");
            attachEventListeners(); // 동적으로 생성된 요소들에 이벤트 리스너 부착
            updateOrderSummary();
        }
    } catch (error) {
        console.error("장바구니 로딩 오류:", error);
        loadingIndicator.innerHTML = `<p class="text-red-500">${error.message}</p>`;
    }
}

// 개별 장바구니 아이템 HTML 생성 함수
function createItemHTML(item) {
    const itemTotalPrice = item.price * item.quantity;
    const isNewUrl = item.imageUrl && item.imageUrl.startsWith('/uploads');
    const finalImageUrl = isNewUrl ? `http://localhost:5000${item.imageUrl}` : item.imageUrl;

    return `
    <div class="bg-white rounded-lg p-6 mb-3 shadow-sm" 
         data-cart-item-id="${item.cart_item_id}" 
         data-product-id="${item.product_id}" 
         data-price="${item.price}"
         data-quantity="${item.quantity}">
        <div class="flex justify-between items-center mb-4">
            <input type="checkbox" class="cart-item-checkbox w-5 h-5" />
            <button class="delete-btn px-6 py-2 border border-gray-300 rounded-full text-sm hover:bg-gray-50 transition">삭제</button>
        </div>
        <div class="flex gap-4 items-start mb-4">
            <img src="${finalImageUrl}" alt="${item.name}" class="w-24 h-24 bg-gray-200 rounded object-cover flex-shrink-0">
            <div class="flex-1">
                <p class="text-base font-bold mb-1">${item.name}</p>
                <p class="text-sm text-gray-500 mb-1">${item.brand}</p>
                <p class="text-sm text-gray-900 item-option">수량: ${item.quantity}개</p>
            </div>
        </div>
        <div class="pt-4 border-t border-gray-200">
            <div class="flex justify-between text-base mb-2">
                <span class="text-gray-600">상품금액</span>
                <span class="font-bold item-total-price">${formatKRW(itemTotalPrice)}원</span>
            </div>
            <div class="flex justify-between text-base mb-4">
                <span class="text-gray-600">배송비</span>
                <span class="font-bold">무료</span>
            </div>
            <div class="grid grid-cols-2 gap-2">
                <button class="option-change-btn px-4 py-3 border border-gray-300 rounded text-sm hover:bg-gray-50 transition">옵션 변경</button>
                <button class="quick-order-btn px-4 py-3 bg-gray-900 text-white rounded text-sm hover:bg-gray-700 transition">바로 주문</button>
            </div>
        </div>
    </div>
    `;
}

// 이벤트 리스너들을 부착하는 함수
function attachEventListeners() {
    const selectAllCheckbox = document.getElementById("select-all");
    const itemCheckboxes = document.querySelectorAll(".cart-item-checkbox");
    const selectDeleteBtn = document.getElementById("select-delete-btn");

    selectAllCheckbox.addEventListener("change", function() {
        itemCheckboxes.forEach(checkbox => { checkbox.checked = this.checked; });
        updateOrderSummary();
    });

    itemCheckboxes.forEach(checkbox => {
        checkbox.addEventListener("change", () => {
            selectAllCheckbox.checked = Array.from(itemCheckboxes).every(cb => cb.checked);
            updateOrderSummary();
        });
    });

    selectDeleteBtn.addEventListener("click", () => {
        const checkedItems = Array.from(itemCheckboxes).filter(cb => cb.checked);
        if (checkedItems.length === 0) return alert("삭제할 상품을 선택해주세요.");
        
        if (confirm(`선택한 ${checkedItems.length}개 상품을 삭제하시겠습니까?`)) {
            const promises = checkedItems.map(checkbox => {
                const cartItem = checkbox.closest('[data-cart-item-id]');
                const cartItemId = cartItem.dataset.cartItemId;
                return removeItemAPI(cartItemId); // 각 아이템에 대해 삭제 API 호출
            });

            Promise.all(promises).then(results => {
                const isAllSuccess = results.every(res => res);
                if(isAllSuccess) {
                    alert("선택한 상품이 삭제되었습니다.");
                    loadCartItems(); // 모든 삭제가 성공한 후 목록 새로고침
                } else {
                    alert("일부 상품 삭제에 실패했습니다. 페이지를 새로고침합니다.");
                    window.location.reload();
                }
            });
        }
    });
    
    // ✅ [수정] 개별 삭제 버튼 이벤트 리스너
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener("click", async function() { // async 추가
            const cartItem = this.closest('[data-cart-item-id]');
            const cartItemId = cartItem.dataset.cartItemId;

            if (confirm("이 상품을 장바구니에서 삭제하시겠습니까?")) {
                const success = await removeItemAPI(cartItemId); // API 호출을 기다림
                if (success) {
                    alert("상품이 삭제되었습니다.");
                    cartItem.remove(); // API 성공 시 화면에서 바로 제거
                    updateOrderSummary(); // 주문 요약 정보 업데이트
                    
                    // 만약 남은 아이템이 없으면 "장바구니 비었음" 메시지 표시
                    if (document.querySelectorAll('[data-cart-item-id]').length === 0) {
                        document.getElementById('empty-cart-message').classList.remove('hidden');
                    }
                } else {
                    alert("상품 삭제에 실패했습니다.");
                }
            }
        });
    });

    attachModalEvents();
}

// 주문 요약 정보 업데이트 함수
function updateOrderSummary() {
    const itemCheckboxes = document.querySelectorAll(".cart-item-checkbox");
    const checkedItems = Array.from(itemCheckboxes).filter(cb => cb.checked);
    
    let totalPrice = 0;
    
    checkedItems.forEach(checkbox => {
        const cartItem = checkbox.closest('[data-cart-item-id]');
        totalPrice += parseInt(cartItem.dataset.price) * parseInt(cartItem.dataset.quantity);
    });
    
    document.getElementById('total-price').textContent = `${formatKRW(totalPrice)}원`;
    document.getElementById('total-delivery').textContent = '0원';
    document.getElementById('final-total').textContent = `${formatKRW(totalPrice)}원`;
    
    const orderButton = document.getElementById("order-checkout-button");
    orderButton.textContent = `${formatKRW(totalPrice)}원 • 총 ${checkedItems.length}건 주문하기`;
}

// 옵션 변경 모달 관련 이벤트 처리
function attachModalEvents() {
    const modal = document.getElementById("option-modal");
    if (!modal) return;
    
    const modalClose = document.getElementById("modal-close");
    const modalConfirm = document.getElementById("modal-confirm");
    let currentCartItemId = null;
    let currentQuantity = 1;

    document.querySelectorAll(".option-change-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            const cartItem = this.closest('[data-cart-item-id]');
            currentCartItemId = cartItem.dataset.cartItemId;
            currentQuantity = parseInt(cartItem.dataset.quantity);
            document.getElementById("qty-display").textContent = currentQuantity;
            modal.classList.remove("hidden");
        });
    });

    modalClose.addEventListener("click", () => modal.classList.add("hidden"));
    modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.add("hidden"); });
    
    document.getElementById("qty-minus").addEventListener("click", () => {
        if (currentQuantity > 1) {
            currentQuantity--;
            document.getElementById("qty-display").textContent = currentQuantity;
        }
    });

    document.getElementById("qty-plus").addEventListener("click", () => {
        currentQuantity++;
        document.getElementById("qty-display").textContent = currentQuantity;
    });

    modalConfirm.addEventListener("click", () => {
        updateQuantityAPI(currentCartItemId, currentQuantity);
        modal.classList.add("hidden");
    });
}

// [API 호출] 수량 변경
async function updateQuantityAPI(cartItemId, newQuantity) {
    if (newQuantity < 1) return;
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`http://localhost:5000/api/cart/${cartItemId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ quantity: newQuantity })
        });
        if (response.ok) {
            loadCartItems(); // 성공 시 장바구니 다시 로드
        } else {
            throw new Error("수량 변경에 실패했습니다.");
        }
    } catch (error) {
        alert(error.message);
    }
}

// ✅ [수정] API 호출 로직을 별도 함수로 분리
async function removeItemAPI(cartItemId) {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`http://localhost:5000/api/cart/${cartItemId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.ok; // 성공 여부(true/false)만 반환
    } catch (error) {
        console.error("API 삭제 오류:", error);
        return false;
    }
}