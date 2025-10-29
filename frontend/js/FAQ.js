// faq.js — FAQ 목록 + 토글 기능

document.addEventListener("DOMContentLoaded", () => {
  const faqData = [
    {
      q: "배송은 얼마나 걸리나요?",
      a: "일반 상품은 결제 후 2~3일 내 배송됩니다.<br>지역 및 택배사 사정에 따라 1~2일 정도 지연될 수 있습니다."
    },
    {
      q: "교환/반품은 어떻게 하나요?",
      a: "상품 수령 후 7일 이내 고객센터로 문의해 주시면 절차를 안내드립니다.<br>단, 사용 흔적이 있거나 훼손된 상품은 교환/반품이 불가합니다."
    },
    {
      q: "비회원도 주문이 가능한가요?",
      a: "네, 비회원도 주문이 가능합니다.<br>단, 주문 내역 확인을 위해 이메일 주소가 필요합니다."
    },
    {
      q: "결제 수단에는 어떤 것이 있나요?",
      a: "신용카드, 체크카드, 실시간 계좌이체, 간편결제(네이버페이, 카카오페이)를 지원합니다."
    },
  ];

  const $faqList = document.getElementById("faq-list");

  // FAQ 렌더링
  faqData.forEach(({ q, a }) => {
    const item = document.createElement("div");
    item.className = "faq-item border border-gray-200 rounded-xl p-5 cursor-pointer hover:bg-gray-50 transition";

    item.innerHTML = `
      <div class="faq-question flex justify-between items-center font-semibold">
        <span>${q}</span>
        <i data-lucide="chevron-down" class="icon transition-transform duration-300"></i>
      </div>
      <div class="faq-answer hidden mt-3 text-gray-600 leading-relaxed">${a}</div>
    `;

    $faqList.appendChild(item);
  });

  // 토글 기능
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    const icon = item.querySelector(".icon");

    question.addEventListener("click", () => {
      const isOpen = !answer.classList.contains("hidden");

      // 모든 FAQ 닫기
      faqItems.forEach((el) => {
        el.querySelector(".faq-answer").classList.add("hidden");
        el.querySelector(".icon").classList.remove("rotate-180");
      });

      // 클릭한 항목만 열기
      if (!isOpen) {
        answer.classList.remove("hidden");
        icon.classList.add("rotate-180");
      }
    });
  });

  // 아이콘 렌더링
  if (window.lucide) lucide.createIcons();
});
