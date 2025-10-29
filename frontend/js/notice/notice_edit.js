// (임시 데이터 — 나중에 실제 API로 교체 가능)
const dummyNotices = [
  {
    id: 1,
    title: "시스템 점검 안내",
    content: "10/25(금) 00:00~02:00 동안 서비스 점검이 진행됩니다.",
    image: "/frontend/public/notice1.png",
  },
  {
    id: 2,
    title: "판매자 등록 절차 변경",
    content: "판매자 등록 시 사업자등록증 업로드가 필수로 변경되었습니다.",
    image: "",
  },
];

// URL에서 id 추출
const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));

// DOM 요소
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const imageInput = document.getElementById("image");
const preview = document.getElementById("preview");
const status = document.getElementById("status");

// 기존 데이터 로드
function loadNoticeData() {
  // (나중엔 fetch(`/api/notice/${id}`) 으로 대체 가능)
  const notice = dummyNotices.find((n) => n.id === id);
  if (!notice) {
    status.textContent = "공지사항 정보를 불러올 수 없습니다.";
    status.classList.remove("hidden");
    return;
  }

  // 기존 값 세팅
  titleInput.value = notice.title;
  contentInput.value = notice.content;

  if (notice.image) {
    preview.src = notice.image;
    preview.classList.remove("hidden");
  }

  // 수정 버튼 문구 동적으로 변경
  document.getElementById("submit-btn").textContent = "수정 완료";
}

// 이미지 미리보기 (파일 변경 시)
imageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      preview.src = reader.result;
      preview.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  }
});

// 수정 완료 시
document.getElementById("notice-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const updated = {
    id,
    title: titleInput.value.trim(),
    content: contentInput.value.trim(),
  };

  if (!updated.title || !updated.content) {
    status.textContent = "제목과 내용을 모두 입력해주세요.";
    status.classList.remove("hidden");
    return;
  }

  // (나중에 여기에 PUT /api/notice/:id 로직 넣기)
  console.log("수정된 데이터:", updated);
  alert("공지사항이 수정되었습니다!");
  window.location.href = "../admin.html";
});

// 초기 실행
document.addEventListener("DOMContentLoaded", loadNoticeData);
