// /frontend/js/main.js

// --- 로그인 상태에 따른 네비게이션 바 로드 ---
document.addEventListener("DOMContentLoaded", () => {
  const navDiv = document.querySelector("#navigation");
  if (navDiv && navDiv.dataset.src) {
    fetch(navDiv.dataset.src)
      .then((res) => res.text())
      .then((html) => {
        navDiv.innerHTML = html; // 1. 내비게이션 HTML 삽입

        // --- 로그인 상태 체크 및 메뉴 변경 로직 ---
        const navUtil = document.getElementById('nav-util');
        if (navUtil) {
            const token = localStorage.getItem('token');
            const userType = localStorage.getItem('userType');

            if (token) {
                // 로그인 상태일 때 메뉴
                let myPageLink = '/frontend/pages/mypage/mypage.html';
                if (userType === 'seller') {
                    myPageLink = '/frontend/pages/seller/seller.html';
                }

                navUtil.innerHTML = `
                    <a href="/frontend/pages/notice/notice.html">공지사항</a>
                    <a href="/frontend/pages/supportBoard/supportBoard.html">문의사항</a>
                    <a href="/frontend/pages/FAQ/FAQ.html">FAQ</a>
                    <a href="${myPageLink}">마이페이지</a>
                    <a href="#" id="logout-btn">로그아웃</a>
                `;

                // 로그아웃 버튼 기능 추가
                const logoutBtn = document.getElementById('logout-btn');
                if (logoutBtn) {
                    logoutBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        if (confirm('로그아웃하시겠습니까?')) {
                            localStorage.removeItem('token');
                            localStorage.removeItem('userType');
                            localStorage.removeItem('username');
                            alert('로그아웃되었습니다.');
                            window.location.href = '/frontend/pages/main.html';
                        }
                    });
                }
            }
        }
        // --- 로직 추가 끝 ---

        // lucide 아이콘 다시 렌더링
        if (window.lucide) {
          lucide.createIcons();
        }
      })
      .catch((err) => console.error("네비게이션 로드 실패:", err));
  }
  // --- 🔼 수정 끝 🔼 ---

  // 메인 페이지 슬라이드
  const slides = document.querySelectorAll("#slider .fade");
  const indicator = document.getElementById("slideIndicator");
  if (slides.length && indicator) {
    let current = 0;
    const showSlide = (n) => {
      slides.forEach((slide, i) => {
        slide.classList.remove("active");
        if (i === n) slide.classList.add("active");
      });
      indicator.textContent = `${n + 1} / ${slides.length}`;
    };
    const nextSlide = () => {
      current = (current + 1) % slides.length;
      showSlide(current);
    };
    const prevSlide = () => {
      current = (current - 1 + slides.length) % slides.length;
      showSlide(current);
    };

    // 전역으로 버튼에서 접근 가능하게 등록
    window.nextSlide = nextSlide;
    window.prevSlide = prevSlide;
    setInterval(nextSlide, 5000);
  }

  // 회원가입 페이지
  const step1 = document.getElementById("step1");
  const step2 = document.getElementById("step2");
  const step3 = document.getElementById("step3");
  const formContainer = document.getElementById("formContainer");
  const form1 = document.getElementById("form1");
  const form2 = document.getElementById("form2");
  const sellerFields = document.getElementById("seller-fields");

  if (step1 && step2 && step3) {
    // 유형 선택
    window.selectType = function (type) {
      if (!sellerFields) return;
      if (type === "seller") {
        sellerFields.classList.remove("hidden");
        setTimeout(() => sellerFields.classList.add("opacity-100"), 50);
        document.getElementById("seller").checked = true;
      } else {
        sellerFields.classList.remove("opacity-100");
        setTimeout(() => sellerFields.classList.add("hidden"), 300);
        document.getElementById("buyer").checked = true;
      }
    };

    // 단계 전환 함수
    function goToStep(num) {
      [step1, step2, step3].forEach((s) => s.classList.add("hidden"));
      document.getElementById(`step${num}`).classList.remove("hidden");
    }

    window.goToStep = goToStep;

    // 뒤로가기 버튼
    window.goBack = function () {
      if (!step1.classList.contains("hidden")) {
        window.location.href = "login.html";
      } else if (!step2.classList.contains("hidden")) {
        // step2 → step1 슬라이드 복귀
        step2.classList.add(
          "transition-all",
          "duration-700",
          "opacity-0",
          "translate-x-full"
        );
        setTimeout(() => {
          step2.classList.add("hidden");
          step2.classList.remove("opacity-0", "translate-x-full");
          step1.classList.remove("hidden");
          step1.classList.add("opacity-0", "translate-x-[-50%]");
          setTimeout(() => {
            step1.classList.remove("opacity-0", "translate-x-[-50%]");
          }, 50);
        }, 500);
      } else if (!step3.classList.contains("hidden")) {
        goToStep(2);
      }
    };

    // step1 검증
    window.validateStep1 = function () {
      const buyer = document.getElementById("buyer");
      const seller = document.getElementById("seller");
      let isValid = true;

      if (!buyer.checked && !seller.checked) {
        alert("회원 유형을 선택해주세요.");
        return;
      }

      if (seller.checked) {
        const businessNumber = document.getElementById("businessNumber");
        const shopName = document.getElementById("shopName");
        const businessWarning = businessNumber.nextElementSibling;
        const shopWarning = shopName.nextElementSibling;

        if (!businessNumber.value.trim()) {
          businessWarning.classList.remove("hidden");
          isValid = false;
        } else {
          businessWarning.classList.add("hidden");
        }

        if (!shopName.value.trim()) {
          shopWarning.classList.remove("hidden");
          isValid = false;
        } else {
          shopWarning.classList.add("hidden");
        }
      }

      if (isValid) {
        step1.classList.add(
          "transition-all",
          "duration-700",
          "opacity-0",
          "translate-x-[-50%]"
        );
        setTimeout(() => {
          step1.classList.add("hidden");
          step1.classList.remove("opacity-0", "translate-x-[-50%]");
          step2.classList.remove("hidden");
          step2.classList.add("translate-x-full", "opacity-0");
          setTimeout(() => {
            step2.classList.remove("translate-x-full", "opacity-0");
          }, 50);
        }, 500);
      }
    };

    // 입력 페이지 전환 (form1 <-> form2)
    window.nextFormPage = function () {
      formContainer.style.transform = "translateX(-50%)";
      form1.style.opacity = "0";
      form2.style.opacity = "1";
    };

    window.prevFormPage = function () {
      formContainer.style.transform = "translateX(0)";
      form1.style.opacity = "1";
      form2.style.opacity = "0";
    };

    // 최종 검증
    window.validateForm = async function () {
      const fields = [
        "username",
        "password",
        "passwordConfirm",
        "name",
        "phone",
        "email",
      ];
      let isValid = true;

      fields.forEach((id) => {
        const input = document.getElementById(id);
        if (!input) return;
        const warning = input.nextElementSibling;
        if (!input.value.trim()) {
          warning.classList.remove("hidden");
          isValid = false;
        } else {
          warning.classList.add("hidden");
        }
      });

      const pw = document.getElementById("password").value;
      const pw2 = document.getElementById("passwordConfirm").value;
      if (pw && pw2 && pw !== pw2) {
        alert("비밀번호가 일치하지 않습니다.");
        isValid = false;
      }

      if (isValid) {
        // --- 🔽 API 호출을 위해 추가된 부분 🔽 ---
        
        // 1. 폼 데이터 수집
        const userTypeRadio = document.querySelector('input[name="type"]:checked');
        const formData = {
            userType: userTypeRadio.value, // 'buyer' 또는 'seller'
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
        };

        // 판매자일 경우, 판매자 정보 추가
        if (formData.userType === 'seller') {
            formData.company_name = document.getElementById('shopName').value;
            formData.business_reg_no = document.getElementById('businessNumber').value;
        }

        // 2. fetch를 사용하여 백엔드에 데이터 전송
        try {
            const response = await fetch('http://localhost:5000/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) { // HTTP 상태 코드가 200-299일 경우
                alert(result.message); // "회원가입 성공" 메시지 표시
                goToStep(3); // 가입 완료 화면으로 이동
            } else { // 서버에서 에러를 보냈을 경우
                alert(`오류: ${result.message}`);
            }
        } catch (error) {
            console.error('회원가입 요청 실패:', error);
            alert('서버와 통신 중 오류가 발생했습니다. 백엔드 서버가 켜져 있는지 확인해주세요.');
        }
        // --- 🔼 API 호출 코드 끝 🔼 ---
        
      } // if (isValid) 끝
    };
  }

  // 아이디 찾기 페이지
  if (document.getElementById("findIdForm")) {
    window.sendIdEmail = function () {
      const name = document.getElementById("name");
      const email = document.getElementById("email");
      const successMsg = document.getElementById("successMsg");
      let isValid = true;

      if (!name.value.trim()) {
        name.nextElementSibling.classList.remove("hidden");
        isValid = false;
      } else name.nextElementSibling.classList.add("hidden");

      if (!email.value.trim()) {
        email.nextElementSibling.classList.remove("hidden");
        isValid = false;
      } else email.nextElementSibling.classList.add("hidden");

      if (!isValid) return;
      successMsg.classList.remove("hidden");
    };
  }

  // 비밀번호 찾기 페이지
  if (document.getElementById("findPwForm")) {
    window.sendPwEmail = function () {
      const name = document.getElementById("name");
      const username = document.getElementById("username");
      const email = document.getElementById("email");
      const successMsg = document.getElementById("successMsg");
      let isValid = true;

      [name, username, email].forEach((input) => {
        const warning = input.nextElementSibling;
        if (!input.value.trim()) {
          warning.classList.remove("hidden");
          isValid = false;
        } else {
          warning.classList.add("hidden");
        }
      });

      if (!isValid) return;
      successMsg.classList.remove("hidden");
    };
  }


  // ✅ mockData.js 기반 신상 인기 섹션 (Fisher–Yates 완전 랜덤 5개)
  const trendingGrid = document.getElementById("trendingGrid");
  if (trendingGrid && window.MockData) {
    const M = window.MockData;
    const BRANDS = M.BRANDS || [];

    // 모든 상품 통합
    const allProducts = [
      ...Object.values(M.productTop || {}),
      ...Object.values(M.productBag || {}),
      ...Object.values(M.productBeauty || {}),
      ...Object.values(M.productBottoms || {}),
      ...Object.values(M.productShoes || {}),
      ...Object.values(M.productAccessory || {}),
    ];

    // ✅ 완전 랜덤 섞기 (Fisher–Yates)
    const shuffled = [...allProducts];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const randomFive = shuffled.slice(0, 5);

    trendingGrid.innerHTML = randomFive
      .map((p) => {
        const brand = p.brand || "LOUISVUITTON";
        const category = p.category || "bag";
        const imgSrc =
          (Array.isArray(p.images) && p.images[BRANDS.indexOf(brand)]) ||
          `/frontend/public/${category}s/${brand}_${category}1.jpg`;

        return `
          <a href="/frontend/pages/category/product.html?id=${p.id}">
            <div class="flex flex-col items-center">
              <div class="w-40 h-70 bg-white rounded-md mb-2 hover-zoom items-center justify-center overflow-hidden">
                <img src="${imgSrc}" alt="${p.name}" class="object-contain"/>
              </div>
              <p class="text-sm font-semibold">${p.name}</p>
              <p class="text-sm">${new Intl.NumberFormat("ko-KR").format(p.price)} 원</p>
            </div>
          </a>`;
      })
      .join("");
  } // 👈 trendingGrid를 확인하는 if문이 여기서 완전히 끝납니다.

  // --- 🔽 [올바른 위치] 로그인 기능 🔽 ---
  const loginForm = document.getElementById('login-form');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // 폼 자동 제출(새로고침) 방지

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      if (!username || !password) {
          alert('아이디와 비밀번호를 모두 입력해주세요.');
          return;
      }

      try {
          const response = await fetch('http://localhost:5000/api/users/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ username, password }),
          });

          const result = await response.json();

          if (response.ok) {
              alert(result.message); // "로그인 성공" 메시지

              // [중요] 발급받은 토큰을 브라우저 저장소(localStorage)에 저장합니다.
              localStorage.setItem('token', result.token);
              localStorage.setItem('userType', result.userType);
              localStorage.setItem('username', result.username);

              // 로그인 성공 후 메인 페이지로 이동
              window.location.href = '/frontend/pages/main.html'; // 상대 경로 수정
          } else {
              alert(`로그인 실패: ${result.message}`);
          }
      } catch (error) {
          console.error('로그인 요청 실패:', error);
          alert('서버와 통신 중 오류가 발생했습니다. 백엔드 서버가 켜져 있는지 확인해주세요.');
      }
    });
  }
  // --- 🔼 로그인 기능 코드 끝 🔼 ---
});