// 더미 데이터 (나중에 fetch로 교체 가능)
const dummyNotices = [
  { id: 1, title: "[공지] 시스템 점검 안내 (10/25)", author: "관리자", date: "2025-10-21", content: "10/25 시스템 점검이 예정되어 있습니다." },
  { id: 2, title: "[공지] 신규 판매자 등록 절차 변경 안내", author: "관리자", date: "2025-10-18", content: "판매자 등록 시 사업자등록증 업로드 필수로 변경되었습니다." },
];

const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));
const notice = dummyNotices.find((n) => n.id === id);

// 내용 렌더링
document.getElementById("notice-title").textContent = notice.title;
document.getElementById("notice-author").textContent = "작성자: " + notice.author;
document.getElementById("notice-date").textContent = "등록일: " + notice.date;
document.getElementById("notice-content").textContent = notice.content;

// 관리자만 수정 버튼 보이기
// 예시: 로그인 시 localStorage.setItem("user", JSON.stringify({ name: "관리자", role: "admin" }))
const user = JSON.parse(localStorage.getItem("user"));
const editBtn = document.getElementById("edit-btn");

if (user && user.role === "admin") {
  editBtn.classList.remove("hidden");
}