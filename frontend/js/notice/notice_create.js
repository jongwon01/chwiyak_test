const imageInput = document.getElementById("image");
const preview = document.getElementById("preview");

imageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      preview.src = ev.target.result;
      preview.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  } else {
    preview.classList.add("hidden");
  }
});

document.getElementById("notice-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();

  if (!title || !content) {
    alert("제목과 내용을 입력해주세요.");
    return;
  }

  // 실제 서버 연결 시 FormData로 POST 요청
  alert("공지사항이 등록되었습니다!");
  window.location.href = "../admin.html";
});
