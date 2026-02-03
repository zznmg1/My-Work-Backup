/**
 * LandingCraft - 랜딩페이지 생성기 스크립트
 * 가격표 월/연간 토글 및 기타 인터랙션 처리
 */

document.addEventListener('DOMContentLoaded', function () {
    // 가격표 토글 기능
    initPricingToggle();

    // 스크롤 효과
    initScrollEffects();

    // 스무스 스크롤
    initSmoothScroll();
});

/**
 * 가격표 월간/연간 토글 초기화
 */
function initPricingToggle() {
    const toggle = document.getElementById('billingToggle');
    const toggleLabels = document.querySelectorAll('.toggle-label');
    const amounts = document.querySelectorAll('.amount');

    if (!toggle) return;

    // 초기 상태 설정
    updatePrices(false);
    updateLabels(false);

    toggle.addEventListener('change', function () {
        const isYearly = this.checked;
        updatePrices(isYearly);
        updateLabels(isYearly);
    });

    // 가격 업데이트 함수
    function updatePrices(isYearly) {
        amounts.forEach(amount => {
            const monthly = parseInt(amount.dataset.monthly);
            const yearly = parseInt(amount.dataset.yearly);
            const newPrice = isYearly ? yearly : monthly;

            // 숫자 애니메이션 효과
            animateNumber(amount, newPrice);
        });
    }

    // 라벨 활성화 상태 업데이트
    function updateLabels(isYearly) {
        toggleLabels.forEach(label => {
            const period = label.dataset.period;
            if ((period === 'yearly' && isYearly) || (period === 'monthly' && !isYearly)) {
                label.classList.add('active');
            } else {
                label.classList.remove('active');
            }
        });
    }
}

/**
 * 숫자 애니메이션 효과
 */
function animateNumber(element, targetValue) {
    const duration = 300;
    const startValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // easeOutQuad 이징 함수
        const eased = 1 - (1 - progress) * (1 - progress);
        const currentValue = Math.floor(startValue + (targetValue - startValue) * eased);

        element.textContent = currentValue.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

/**
 * 스크롤 효과 초기화
 */
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    });

    // 요소 페이드인 효과
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // 애니메이션 대상 요소들
    const animateElements = document.querySelectorAll('.feature-card, .pricing-card, .template-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // visible 클래스 스타일
    const style = document.createElement('style');
    style.textContent = `
        .feature-card.visible, .pricing-card.visible, .template-card.visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        .pricing-card.popular.visible {
            transform: scale(1.05) !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * 스무스 스크롤 초기화
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}
