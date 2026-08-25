// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is tapped
    navMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when tapping outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Image Slider Functionality
function changeSlide(button, direction) {
    const slider = button.closest('.product-image-slider');
    const slides = slider.querySelectorAll('.slide');
    const dots = slider.querySelectorAll('.dot');
    let currentSlide = 0;

    slides.forEach((slide, index) => {
        if (slide.classList.contains('active')) {
            currentSlide = index;
        }
    });

    moveToSlide(slides, dots, currentSlide + direction);
}

function currentSlide(dot, slideNumber) {
    const slider = dot.closest('.product-image-slider');
    const slides = slider.querySelectorAll('.slide');
    const dots = slider.querySelectorAll('.dot');

    moveToSlide(slides, dots, slideNumber - 1);
}

function moveToSlide(slides, dots, index) {
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;

    slides.forEach((slide) => slide.classList.remove('active'));
    dots.forEach((dotEl) => dotEl.classList.remove('active'));

    slides[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
}

// Touch swipe support for sliders (mobile)
function initTouchSwipe() {
    const sliders = document.querySelectorAll('.product-image-slider');

    sliders.forEach((slider) => {
        let startX = 0;
        let startY = 0;
        let isSwiping = false;

        slider.addEventListener(
            'touchstart',
            (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                isSwiping = true;
            },
            { passive: true }
        );

        slider.addEventListener(
            'touchmove',
            (e) => {
                // Cancel swipe detection if the user is scrolling vertically
                if (!isSwiping) return;
                if (Math.abs(e.touches[0].clientY - startY) > Math.abs(e.touches[0].clientX - startX)) {
                    isSwiping = false;
                }
            },
            { passive: true }
        );

        slider.addEventListener('touchend', (e) => {
            if (!isSwiping) return;
            isSwiping = false;

            const deltaX = e.changedTouches[0].clientX - startX;
            const minSwipeDistance = 40;
            if (Math.abs(deltaX) < minSwipeDistance) return;

            const nextBtn = slider.querySelector('.next-btn') || slider;
            changeSlide(nextBtn, deltaX < 0 ? 1 : -1);
        });
    });
}

// Auto-slide functionality
function initAutoSlide() {
    const sliders = document.querySelectorAll('.product-image-slider');

    sliders.forEach((slider) => {
        let autoSlideInterval = null;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducedMotion) return;

        const startAutoSlide = () => {
            stopAutoSlide();
            autoSlideInterval = setInterval(() => {
                if (document.hidden) return;
                const nextBtn = slider.querySelector('.next-btn') || slider;
                changeSlide(nextBtn, 1);
            }, 4000);
        };

        const stopAutoSlide = () => {
            if (autoSlideInterval) clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        };

        startAutoSlide();

        slider.addEventListener('mouseenter', stopAutoSlide);
        slider.addEventListener('mouseleave', startAutoSlide);

        slider.addEventListener('touchstart', stopAutoSlide, { passive: true });
        slider.addEventListener(
            'touchend',
            () => {
                setTimeout(startAutoSlide, 6000);
            },
            { passive: true }
        );
    });
}

document.addEventListener('DOMContentLoaded', function () {
    initAutoSlide();
    initTouchSwipe();
});
