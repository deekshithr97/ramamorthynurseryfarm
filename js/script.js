const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

function closeNav() {
    if (!hamburger || !navMenu) return;
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
}

if (hamburger && navMenu) {
    hamburger.setAttribute('aria-expanded', 'false');

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navMenu.classList.toggle('active');
        hamburger.classList.toggle('active', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    navMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeNav);
    });

    document.addEventListener('click', (e) => {
        if (!navMenu.classList.contains('active')) return;
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            closeNav();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeNav();
    });
}

function getSliderIndex(slider) {
    let index = 0;
    slider.querySelectorAll('.slide').forEach((slide, i) => {
        if (slide.classList.contains('active')) index = i;
    });
    return index;
}

function setActiveSlide(slider, index) {
    const slides = slider.querySelectorAll('.slide');
    const dots = slider.querySelectorAll('.dot');
    if (slides.length === 0) return;

    const next = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => slide.classList.toggle('active', i === next));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === next));
}

function changeSlide(button, direction) {
    const slider = button.closest('.product-image-slider');
    if (!slider) return;
    setActiveSlide(slider, getSliderIndex(slider) + direction);
}

function currentSlide(dot, slideNumber) {
    const slider = dot.closest('.product-image-slider');
    if (!slider) return;
    setActiveSlide(slider, slideNumber - 1);
}

function initTouchSwipe() {
    document.querySelectorAll('.product-image-slider').forEach((slider) => {
        let startX = 0;
        let startY = 0;
        let tracking = false;

        slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            tracking = true;
        }, { passive: true });

        slider.addEventListener('touchmove', (e) => {
            if (!tracking) return;
            if (Math.abs(e.touches[0].clientY - startY) > Math.abs(e.touches[0].clientX - startX)) {
                tracking = false;
            }
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            if (!tracking) return;
            tracking = false;

            const deltaX = e.changedTouches[0].clientX - startX;
            if (Math.abs(deltaX) < 40) return;

            setActiveSlide(slider, getSliderIndex(slider) + (deltaX < 0 ? 1 : -1));
        }, { passive: true });
    });
}

function initAutoSlide() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.querySelectorAll('.product-image-slider').forEach((slider) => {
        let intervalId = null;

        const stop = () => {
            if (intervalId) clearInterval(intervalId);
            intervalId = null;
        };

        const start = () => {
            stop();
            intervalId = setInterval(() => {
                if (document.hidden) return;
                setActiveSlide(slider, getSliderIndex(slider) + 1);
            }, 4500);
        };

        start();

        slider.addEventListener('mouseenter', stop);
        slider.addEventListener('mouseleave', start);

        slider.addEventListener('touchstart', stop, { passive: true });
        slider.addEventListener('touchend', () => {
            setTimeout(start, 6000);
        }, { passive: true });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    initAutoSlide();
    initTouchSwipe();
});
