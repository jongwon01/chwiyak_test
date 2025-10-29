// 더미 데이터
const users = [
  { id: 1, name: "홍길동", email: "user1@example.com", role: "구매자", status: "활성" },
  { id: 2, name: "김철수", email: "user2@example.com", role: "판매자", status: "정지" },
];

const inquiries = [
  { id: 1, title: "상품 배송이 너무 늦어요", author: "user1", date: "2025-10-20", status: "대기중" },
  { id: 2, title: "환불 진행 상태 문의드립니다", author: "user2", date: "2025-10-19", status: "완료" },
];

const notices = [
  { id: 1, title: "[공지] 시스템 점검 안내 (10/25)", author: "관리자", date: "2025-10-21" },
  { id: 2, title: "[공지] 신규 판매자 등록 절차 변경 안내", author: "관리자", date: "2025-10-18" },
];

let faqs = [
  { id: 1, question: "배송은 얼마나 걸리나요?", answer: "일반 상품은 결제 후 2~3일 내 배송됩니다." },
  { id: 2, question: "교환/반품은 어떻게 하나요?", answer: "수령 후 7일 이내 고객센터로 문의해주세요." },
];

// 초기화
document.addEventListener("DOMContentLoaded", () => {
  const adminData = JSON.parse(localStorage.getItem("adminSession"));
  const nameEl = document.getElementById("admin-name");
  if (!adminData) return (window.location.href = "./admin_login.html");
  nameEl.textContent = `${adminData.username}님`;

  document.getElementById("logout-btn").addEventListener("click", () => {
    if (confirm("로그아웃하시겠습니까?")) {
      localStorage.removeItem("adminSession");
      window.location.href = "./login&signup/admin_login.html";
    }
  });

  renderAll();
  initTabs();
  initFAQModal();
});

// 렌더링
function renderAll() {
  renderUsers();
  renderInquiries();
  renderNotices();
  renderFAQs();
}

function renderUsers() {
  const tbody = document.getElementById("user-table-body");
  tbody.innerHTML = users
    .map(
      (u) => `
      <tr class="hover:bg-gray-50 transition">
        <td class="py-2 border-b">${u.id}</td>
        <td class="py-2 border-b">${u.name}</td>
        <td class="py-2 border-b">${u.email}</td>
        <td class="py-2 border-b">${u.role}</td>
        <td class="py-2 border-b ${u.status === "활성" ? "text-green-600" : "text-red-600"}">${u.status}</td>
        <td class="py-2 border-b">
          <button class="text-white bg-gray-600 hover:bg-gray-700 px-2 py-1 rounded text-xs">${
            u.status === "활성" ? "정지" : "해제"
          }</button>
        </td>
      </tr>`
    )
    .join("");
}

// 문의사항: 답변하기 클릭 시 상세보기 페이지로 이동
function renderInquiries() {
  const tbody = document.getElementById("inquiry-table-body");
  tbody.innerHTML = inquiries
    .map(
      (q) => `
      <tr class="hover:bg-gray-50 transition">
        <td class="py-2 border-b">${q.id}</td>
        <td class="py-2 border-b text-left px-4">${q.title}</td>
        <td class="py-2 border-b">${q.author}</td>
        <td class="py-2 border-b">${q.date}</td>
        <td class="py-2 border-b ${
          q.status === "완료" ? "text-green-600" : "text-yellow-600"
        }">${q.status}</td>
        <td class="py-2 border-b">
          <button 
            class="text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
            onclick="location.href='./supportBoard/supportBoardDetail.html?id=${q.id}'"
          >답변하기</button>
        </td>
      </tr>`
    )
    .join("");
}

// 공지사항: 수정 버튼 클릭 시 notice_edit.html로 이동
function renderNotices() {
  const tbody = document.getElementById("notice-table-body");
  tbody.innerHTML = notices
    .map(
      (n) => `
      <tr class="hover:bg-gray-50 transition">
        <td class="py-2 border-b">${n.id}</td>
        <td class="py-2 border-b text-left px-4">${n.title}</td>
        <td class="py-2 border-b">${n.author}</td>
        <td class="py-2 border-b">${n.date}</td>
        <td class="py-2 border-b">
          <button 
            onclick="location.href='./notice/notice_edit.html?id=${n.id}'"
            class="bg-gray-700 hover:bg-gray-800 text-white text-xs px-3 py-1 rounded"
          >수정</button>
          <button 
            class="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded"
          >삭제</button>
        </td>
      </tr>`
    )
    .join("");
}

// FAQ 테이블 (수정 + 삭제)
function renderFAQs() {
  const tbody = document.getElementById("faq-table-body");
  tbody.innerHTML = faqs
    .map(
      (f) => `
      <tr class="hover:bg-gray-50 transition">
        <td class="py-2 border-b">${f.id}</td>
        <td class="py-2 border-b text-left px-4">${f.question}</td>
        <td class="py-2 border-b text-left px-4">${f.answer}</td>
        <td class="py-2 border-b flex justify-center gap-2">
          <button class="bg-gray-700 hover:bg-gray-800 text-white text-xs px-3 py-1 rounded" onclick="openFAQModal(${f.id})">
            수정
          </button>
          <button class="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded" onclick="deleteFAQ(${f.id})">
            삭제
          </button>
        </td>
      </tr>`
    )
    .join("");
}

// 탭 전환
function initTabs() {
  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach((btn) =>
    btn.addEventListener("click", () => {
      const target = btn.dataset.target;
      document.querySelectorAll(".tab-section").forEach((s) => s.classList.add("hidden"));
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("bg-gray-700"));
      document.getElementById(`tab-${target}`).classList.remove("hidden");
      btn.classList.add("bg-gray-700");
    })
  );
  document.querySelector(".tab-btn[data-target='user']").click();
}

// FAQ 모달 (추가/수정/삭제)
let editingFAQId = null;

function initFAQModal() {
  const modal = document.getElementById("faq-modal");
  const openBtn = document.getElementById("add-faq-btn");
  const cancelBtn = document.getElementById("faq-cancel");
  const saveBtn = document.getElementById("faq-save");

  openBtn.addEventListener("click", () => openFAQModal());
  cancelBtn.addEventListener("click", closeFAQModal);
  saveBtn.addEventListener("click", saveFAQ);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeFAQModal();
  });
}

function openFAQModal(id = null) {
  const modal = document.getElementById("faq-modal");
  const title = document.getElementById("faq-modal-title");
  const qInput = document.getElementById("faq-question");
  const aInput = document.getElementById("faq-answer");

  if (id) {
    const target = faqs.find((f) => f.id === id);
    if (!target) return;
    editingFAQId = id;
    title.textContent = "FAQ 수정";
    qInput.value = target.question;
    aInput.value = target.answer;
  } else {
    editingFAQId = null;
    title.textContent = "FAQ 추가";
    qInput.value = "";
    aInput.value = "";
  }

  modal.classList.remove("hidden");
}

function closeFAQModal() {
  document.getElementById("faq-modal").classList.add("hidden");
}

function saveFAQ() {
  const q = document.getElementById("faq-question").value.trim();
  const a = document.getElementById("faq-answer").value.trim();
  if (!q || !a) return alert("질문과 답변을 모두 입력하세요.");

  if (editingFAQId) {
    const target = faqs.find((f) => f.id === editingFAQId);
    target.question = q;
    target.answer = a;
    alert("FAQ가 수정되었습니다.");
  } else {
    const newFAQ = {
      id: faqs.length ? Math.max(...faqs.map((f) => f.id)) + 1 : 1,
      question: q,
      answer: a,
    };
    faqs.push(newFAQ);
    alert("FAQ가 추가되었습니다.");
  }

  closeFAQModal();
  renderFAQs();
}

function deleteFAQ(id) {
  const target = faqs.find((f) => f.id === id);
  if (!target) return alert("FAQ를 찾을 수 없습니다.");
  if (confirm(`"${target.question}" FAQ를 삭제하시겠습니까?`)) {
    faqs = faqs.filter((f) => f.id !== id);
    renderFAQs();
    alert("FAQ가 삭제되었습니다.");
  }
}
