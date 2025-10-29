// /frontend/js/mypage/profile.js

const API_BASE = "http://localhost:5000"; // 백엔드 서버 주소
function getToken() {
  return localStorage.getItem("token") || "";
}

// 뒤로가기
window.goBack = function () {
  window.history.back();
};

// 홈으로
window.goHome = function () {
  window.location.href = "../../pages/main.html";
};

// 비밀번호 변경
window.changePassword = function () {
  window.location.href = "../../pages/mypage/password.html";
};

// 회원 탈퇴
window.deleteAccount = async function () {
  if (
    confirm(
      "정말로 회원 탈퇴하시겠습니까?\n\n탈퇴 시 모든 정보가 삭제되며 복구할 수 없습니다."
    )
  ) {
    const password = prompt('계정 탈퇴를 위해 비밀번호를 입력해주세요:');
    
    if (password) {
      if (password.length > 0) {
        try {
          const res = await fetch(`${API_BASE}/api/users/account`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({ password })
          });
          
          if (!res.ok) {
            const data = await res.json().catch(() => ({ message: '계정 탈퇴에 실패했습니다.' }));
            alert(data.message || '계정 탈퇴에 실패했습니다.');
            return;
          }
          
          const data = await res.json();
          
          alert('계정 탈퇴가 완료되었습니다.\n그동안 이용해 주셔서 감사합니다.');
          
          // 로컬 스토리지 정리
          localStorage.removeItem('token');
          localStorage.removeItem('userType');
          localStorage.removeItem('username');
          
          // 로그인 페이지로 이동
          window.location.href = '../../pages/login&signup/login.html';
        } catch (err) {
          console.error('계정 탈퇴 오류:', err);
          alert('계정 탈퇴 중 오류가 발생했습니다. 서버가 실행 중인지 확인해주세요.');
        }
      } else {
        alert('비밀번호를 입력해주세요.');
      }
    }
  }
};

// 📌 프로필 불러오기
async function loadProfile() {
  try {
    const res = await fetch(`${API_BASE}/api/users/profile`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error("프로필 조회 실패");
    const user = await res.json();

    // HTML 요소 채워넣기
    const nameView = document.querySelector("#name-section .profile-value");
    const nameInput = document.querySelector("#name-section input");
    if (nameView) nameView.textContent = user.name || "-";
    if (nameInput) nameInput.value = user.name || "";

    const phoneView = document.querySelector("#contact-section .profile-value");
    const phoneInput = document.querySelector("#contact-section input");
    if (phoneView) phoneView.textContent = user.phone || "-";
    if (phoneInput) phoneInput.value = user.phone || "";

    const usernameView = document.querySelector("#id-section .profile-value");
    const usernameInput = document.querySelector("#id-section input");
    if (usernameView) usernameView.textContent = user.username || "-";
    if (usernameInput) usernameInput.value = user.username || "";

    const emailView = document.querySelector("#email-section .profile-value");
    const emailInput = document.querySelector("#email-section input");
    if (emailView) emailView.textContent = user.email || "이메일 미등록";
    if (emailInput) emailInput.value = user.email || "";
  } catch (err) {
    console.error(err);
    alert("로그인 정보가 만료되었거나 잘못되었습니다.");
    window.location.href = "../../pages/login&signup/login.html";
  }
}

// 📌 이메일 수정 저장
async function saveEmail(newEmail) {
  const res = await fetch(`${API_BASE}/api/users/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ email: newEmail }),
  });
  if (res.status === 409) {
    throw new Error("이미 사용 중인 이메일입니다.");
  }
  if (!res.ok) throw new Error("이메일 수정 실패");
  return res.json();
}

// 📌 공통 프로필 저장 (여러 필드)
async function saveProfile(payload) {
  const res = await fetch(`${API_BASE}/api/users/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });
  if (res.status === 409) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "이미 사용 중인 아이디 또는 이메일입니다.");
  }
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || "프로필 수정 실패");
  }
  return res.json();
}

document.addEventListener("DOMContentLoaded", () => {
  if (!getToken()) {
    alert("로그인이 필요합니다.");
    window.location.href = "../../pages/login&signup/login.html";
    return;
  }

  // 로그인한 정보 불러오기
  loadProfile();

  // 공통 섹션 토글/저장 핸들러
  function setupEditableSection(sectionId, field, validate) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    const editBtn = section.querySelector(".edit-btn");
    const cancelBtn = section.querySelector(".cancel-btn");
    const saveBtn = section.querySelector(".save-btn");
    const viewMode = section.querySelector(".view-mode");
    const editMode = section.querySelector(".edit-mode");
    const profileValue = section.querySelector(".profile-value");
    const input = section.querySelector("input");

    if (editBtn)
      editBtn.addEventListener("click", () => {
        if (!viewMode || !editMode || !input || !profileValue) return;
        viewMode.classList.add("hidden");
        editMode.classList.remove("hidden");
        input.value = profileValue.textContent.trim();
      });

    if (cancelBtn)
      cancelBtn.addEventListener("click", () => {
        if (!viewMode || !editMode || !input || !profileValue) return;
        editMode.classList.add("hidden");
        viewMode.classList.remove("hidden");
        input.value = profileValue.textContent.trim();
      });

    if (saveBtn)
      saveBtn.addEventListener("click", async () => {
        if (!input || !profileValue || !viewMode || !editMode) return;
        const val = input.value.trim();
        if (validate && !validate(val)) return;
        try {
          await saveProfile({ [field]: val });
          profileValue.textContent = val;
          editMode.classList.add("hidden");
          viewMode.classList.remove("hidden");
          alert("변경되었습니다.");
          // 아이디 변경 시 로컬 스토리지도 반영 (다른 화면에서 참조할 수 있음)
          if (field === "username") {
            localStorage.setItem("username", val);
          }
          // 변경 후 마이페이지로 이동하여 반영 확인 (이메일과 동일한 UX)
          window.location.href = "../../pages/mypage/mypage.html";
        } catch (err) {
          console.error(err);
          alert(err?.message || "변경 실패. 다시 시도해주세요.");
        }
      });
  }

  // 섹션별 설정
  setupEditableSection("name-section", "name", (v) => {
    if (!v) {
      alert("성명을 입력해주세요.");
      return false;
    }
    return true;
  });

  setupEditableSection("contact-section", "phone", (v) => {
    if (!v) {
      alert("연락처를 입력해주세요.");
      return false;
    }
    const phonePattern = /^\d{2,3}-?\d{3,4}-?\d{4}$/;
    if (!phonePattern.test(v)) {
      alert("올바른 연락처 형식을 입력해주세요.");
      return false;
    }
    return true;
  });

  setupEditableSection("id-section", "username", (v) => {
    if (!v) {
      alert("아이디를 입력해주세요.");
      return false;
    }
    // 간단한 아이디 유효성 검증 (영문/숫자/언더스코어 4~20자)
    const idPattern = /^[a-zA-Z0-9_]{4,20}$/;
    if (!idPattern.test(v)) {
      alert("아이디는 영문/숫자/_(언더바) 4~20자여야 합니다.");
      return false;
    }
    return true;
  });

  const emailSection = document.getElementById("email-section");
  if (emailSection) {
    const editBtn = emailSection.querySelector(".edit-btn");
    const cancelBtn = emailSection.querySelector(".cancel-btn");
    const saveBtn = emailSection.querySelector(".save-btn");
    const viewMode = emailSection.querySelector(".view-mode");
    const editMode = emailSection.querySelector(".edit-mode");
    const profileValue = emailSection.querySelector(".profile-value");
    const input = emailSection.querySelector("input");

    // 변경 버튼
    editBtn.addEventListener("click", () => {
      viewMode.classList.add("hidden");
      editMode.classList.remove("hidden");
      input.value = profileValue.textContent.trim();
    });

    // 취소 버튼
    cancelBtn.addEventListener("click", () => {
      editMode.classList.add("hidden");
      viewMode.classList.remove("hidden");
      input.value = profileValue.textContent.trim();
    });

    // 저장 버튼
    saveBtn.addEventListener("click", async () => {
      const val = input.value.trim();
      if (!val) return alert("이메일을 입력해주세요.");
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!pattern.test(val)) return alert("올바른 이메일 형식을 입력해주세요.");

      try {
        await saveEmail(val);
        profileValue.textContent = val;
        editMode.classList.add("hidden");
        viewMode.classList.remove("hidden");
        alert("이메일이 변경되었습니다.");

        // 저장 후 마이페이지로 이동 (연동된 정보 확인)
        window.location.href = "../../pages/mypage/mypage.html";
      } catch (err) {
        console.error(err);
        alert("이메일 변경 실패. 다시 시도해주세요.");
      }
    });
  }
});
